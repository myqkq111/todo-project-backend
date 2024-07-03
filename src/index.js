import express from 'express';
import connectDB from './config/db.js';
import passport from 'passport';
import filterRouter from './routes/filterRouter.js';
import todoRouter from './routes/todoRouter.js';
import cors from 'cors';
import Schedule from './middleware/Schedule.js';
import jwtStrategy from './config/passport.js';
import User from './models/User.js';
import recurringEventCron from './middleware/recurringEventCron.js';
import jwt from 'jsonwebtoken'; // jsonwebtoken 패키지 임포트
// import bcrypt from 'bcrypt';
// import dotenv from 'dotenv';

const app = express();
connectDB();
app.use(express.json());

app.use(cors());

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

Schedule(); // 미완료 일정 자동 등록
recurringEventCron(); // 주기적인 일정 자동 업데이트

app.use('/api/filter', filterRouter);

// CORS 설정 (테스트용, 실제 환경에서는 필요에 따라 변경)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
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

    const user = new User({ username, password, email });
    await user.save();
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: '회원가입 실패 재입력해주세요' });
  }
});

//로그인 엔드포인트
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user); // 토큰 생성 함수는 별도로 정의해야 합니다.
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

// 아이디찾기
app.post('/find-id', async (req, res) => {
  const { email } = req.body;
  try {
    // 여기에 아이디를 찾는 로직을 구현합니다.
    // 예: 데이터베이스에서 이메일로 사용자를 찾아서 아이디를 응답합니다.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
    }
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error('Error finding ID:', error);
    res.status(500).json({ error: 'Error finding ID' });
  }
});

app.put('/update', async (req, res) => {
  try {
    const { newUsername, newEmail, currentPassword, newPassword } = req.body;

    // 사용자 인증 확인 - 예시: req.user가 정의되어 있는지 확인
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 현재 비밀번호 검증
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    // 사용자 정보 업데이트
    if (newUsername) user.username = newUsername;
    if (newEmail) user.email = newEmail;
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10); // 비밀번호 해싱
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
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

// 비밀번호 재설정 엔드포인트
app.put('/reset-password/:token', async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    const token = req.params.token;

    // 여기서 토큰을 사용하여 사용자를 식별하고, 해당 사용자의 비밀번호를 새로운 비밀번호로 업데이트합니다.
    // 토큰은 예시로 사용한 것이므로, 실제 구현에서는 토큰을 해독하여 사용자 ID를 추출하는 등의 작업이 필요합니다.

    // 실제로는 토큰을 사용하여 사용자를 찾고, 비밀번호를 업데이트하는 절차를 보안적으로 안전하게 구현해야 합니다.

    const user = await User.findOne({ username }); // 예시로 아이디로 사용자를 찾습니다.
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 비밀번호 업데이트
    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ message: '비밀번호가 성공적으로 재설정되었습니다.' });
  } catch (error) {
    console.error('비밀번호 재설정 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 사용자 정보 조회 엔드포인트
app.get(
  '/user-info',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      res.status(200).json({ username: user.username, email: user.email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user info' });
    }
  }
);

// 회원탈퇴
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

app.use('/api/todos', todoRouter);

app.listen(3000, () => {
  console.log('Server running on port 3001');
});

export default app;
