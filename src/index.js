// index.js

import express from 'express';
import connectDB from './config/db.js';
import filterRouter from './routes/filterRouter.js';
import router from './routes/todoRouter.js';
import userRouter from './routes/usersRouter.js'; // userRouter 임포트
import cors from 'cors';
import Schedule from './middleware/Schedule.js';
import recurringEventCron from './middleware/recurringEventCron.js';
import dotenv from 'dotenv';
import passport from './config/passport.js';

dotenv.config();
const app = express();

// Passport 초기화
app.use(passport.initialize());

connectDB();
app.use(express.json());

app.use('/api', cors());

// JWT 토큰 생성 함수
function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: '1y' }
  );
}

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Token received:', token);

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err);
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};

// CORS 설정 (테스트용, 실제 환경에서는 필요에 따라 변경)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, UPDATE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// 미들웨어 등록
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// passport.use(jwtStrategy);
app.use(passport.initialize());

// 스케줄링 미들웨어
Schedule(); // 미완료 일정 자동 등록
recurringEventCron(); // 주기적인 일정 자동 업데이트

// 라우터 등록
app.use('/api/filter', filterRouter);
app.use('/api/todos', router);
app.use('/api/users', userRouter); // userRouter 사용

// 서버 리스닝

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

export default app;
