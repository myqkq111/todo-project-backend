import express from 'express';
import connectDB from './config/db.js';
import passport from 'passport';
import filterRouter from './routes/filterRouter.js';
import router from './routes/todoRouter.js';
import cors from 'cors';
import Schedule from './middleware/Schedule.js';
import jwtStrategy from './config/passport.js';
import User from './models/User.js';
import recurringEventCron from './middleware/recurringEventCron.js';
import jwt from 'jsonwebtoken'; // jsonwebtoken 패키지 임포트
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
connectDB();
app.use(express.json());

app.use(cors());

// JWT 토큰 생성 함수
function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
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

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
passport.use(jwtStrategy);
app.use(passport.initialize());

recurringEventCron(); // 주기적인 일정 자동 업데이트
Schedule(); // 미완료 일정 자동 등록

app.use('/api/filter', filterRouter);

// CORS 설정 (테스트용, 실제 환경에서는 필요에 따라 변경)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// 아이디 중복확인 엔드포인트
app.get('/check-username/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(200).json({ available: false }); // 이미 사용 중인 경우
    } else {
      res.status(200).json({ available: true }); // 사용 가능한 경우
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '이미 사용중인 아이디 입니다' });
  }
});

// 회원가입
app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: '필수 입력사항입니다' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: '이미 사용 중인 아이디입니다' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email });
    await user.save();
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: '회원가입 실패 재입력해주세요' });
  }
});

// 로그인 엔드포인트
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user);
      res.status(200).json({ token });
    } else {
      res
        .status(401)
        .json({ message: '유효하지 않은 아이디 또는 비밀번호입니다' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: '로그인 실패' });
  }
});

// 로그아웃 엔드포인트
app.post('/logout', (req, res) => {
  // 클라이언트에서 토큰을 삭제하거나 무효화하는 로직 추가
  res.status(200).json({ message: '성공적으로 로그아웃 되었습니다.' });
});

// 아이디 찾기 엔드포인트
app.post('/find-id', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
    }
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error('아이디 찾기 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 비밀번호 찾기 엔드포인트
app.post('/find-password', async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findOne({ username, email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 사용자가 직접 비밀번호를 설정하도록 유도하는 로직
    // 이메일로 비밀번호 재설정 링크를 보내는 대신, 사용자가 새로운 비밀번호를 설정하는 페이지로 이동하도록 유도할 수 있습니다.

    res.status(200).json({ message: '비밀번호 찾기 성공' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 사용자 정보 업데이트 엔드포인트
app.put(
  '/update',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { newUsername, newEmail, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id); // req.user를 통해 user를 찾기

    try {
      // 현재 비밀번호가 맞는지 확인
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: '현재 비밀번호가 올바르지 않습니다.' });
      }

      // 새로운 비밀번호 해싱 후 저장
      if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10); // 새로운 비밀번호 해싱
      }

      // 사용자 정보 업데이트
      user.username = newUsername || user.username;
      user.email = newEmail || user.email;

      await user.save();
      res.status(200).json({ message: '프로필이 수정되었습니다.' });
    } catch (err) {
      console.error('Error updating profile:', err);
      res
        .status(500)
        .json({ error: '프로필 업데이트 중 오류가 발생했습니다.' });
    }
  }
);

// 사용자 정보 조회 엔드포인트
app.get(
  '/user-info',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // 비밀번호 제외
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user info' });
    }
  }
);

// 회원 탈퇴 엔드포인트
app.delete('/delete', authenticateToken, async (req, res) => {
  try {
    console.log('Request received for user ID:', req.user.id);

    const deletedUser = await User.findByIdAndDelete(req.user.id);
    console.log('Deleted user:', deletedUser);

    if (!deletedUser) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User deleted successfully');

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.use('/api/todos', router);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

export default app;
