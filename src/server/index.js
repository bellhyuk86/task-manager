const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const todosRouter = require('./routes/todos');
const { authRouter } = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors({
  origin: 'http://localhost:3000', // Next.js 프론트엔드 주소
  credentials: true  // 인증 관련 헤더 허용
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something broke!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 라우터 설정
app.use('/api/todos', todosRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
