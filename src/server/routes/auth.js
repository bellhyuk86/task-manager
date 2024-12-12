const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Google 로그인
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.redirect(`/auth/success?token=${token}`);
  }
);

// Kakao 로그인
router.get('/kakao',
  passport.authenticate('kakao')
);

router.get('/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.redirect(`/auth/success?token=${token}`);
  }
);

// 로그아웃
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// 현재 사용자 정보 조회
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, nickname, profile_image, provider, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 사용자 정보 업데이트
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { nickname } = req.body;
    const result = await pool.query(
      'UPDATE users SET nickname = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, nickname, profile_image, provider, created_at, updated_at',
      [nickname, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

exports.authenticateToken = authenticateToken;
exports.authRouter = router;
