const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken } = require('./auth');

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// reorder 엔드포인트를 가장 먼저 정의
router.put('/reorder', async (req, res) => {
  const { items } = req.body;

  try {
    await pool.query('BEGIN');

    for (let i = 0; i < items.length; i++) {
      await pool.query(
        'UPDATE todos SET order_index = $1 WHERE id = $2',
        [i, parseInt(items[i].id)]
      );
    }

    await pool.query('COMMIT');

    const result = await pool.query(
      'SELECT * FROM todos ORDER BY order_index ASC'
    );

    res.json(result.rows);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 모든 할 일 목록 조회
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM todos ORDER BY order_index ASC NULLS LAST, created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 새로운 할 일 추가
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  try {
    const maxOrder = await pool.query(
      'SELECT COALESCE(MAX(order_index), -1) as max_order FROM todos'
    );
    const nextOrder = maxOrder.rows[0].max_order + 1;

    const result = await pool.query(
      'INSERT INTO todos (title, description, order_index) VALUES ($1, $2, $3) RETURNING *',
      [title, description, nextOrder]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 할 일 수정
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, is_completed } = req.body;
  try {
    const result = await pool.query(
      'UPDATE todos SET title = $1, description = $2, is_completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, description, is_completed, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 할 일 삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
