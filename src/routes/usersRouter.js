// userRouter.js

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/User.js';
import config from '../config/config.js';

const userRouter = express.Router();

// Refresh Token 생성
function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    config.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '30d', // Refresh Token 유효 기간 설정 (30일)
    }
  );
}

// 회원가입 엔드포인트
userRouter.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: '모든 필수 입력사항을 입력해주세요' });
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
    res.status(500).json({ error: '회원가입 실패' });
  }
});

// 사용자 이름 중복 체크 엔드포인트
userRouter.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (user) {
      // 이미 존재하는 경우
      return res.status(200).json({ exists: true });
    } else {
      // 존재하지 않는 경우
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking username:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 로그인 엔드포인트
userRouter.post('/login', async (req, res, next) => {
  try {
    passport.authenticate(
      'local',
      { session: false },
      async (err, user, info) => {
        if (err || !user) {
          return res.status(401).json({ error: info.message });
        }

        req.login(user, { session: false }, async (error) => {
          if (error) {
            console.error('로그인 중 오류 발생:', error);
            return next(error);
          }

          const token = jwt.sign(
            { id: user._id, username: user.username },
            config.ACCESS_TOKEN_SECRET,
            { expiresIn: '1y' }
          );

          console.log('Generated JWT Token:', token);
          return res.json({ token });
        });
      }
    )(req, res, next);
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    return next(error);
  }
});

// Access Token 재발급 엔드포인트 (Refresh Token 사용)
userRouter.post('/refresh-token', async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token not provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 새로운 Access Token 생성
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      config.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1h', // 새로운 Access Token 유효 기간 설정 (1시간)
      }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ error: '유효하지 않은 리프레시 토큰' });
  }
});

// 로그아웃 엔드포인트
userRouter.post(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // 클라이언트 측에서 Authorization 헤더에서 토큰을 가져옴
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      // 여기에 클라이언트 측 로직 추가: 토큰을 무효화하거나 삭제

      res.status(200).json({ message: '성공적으로 로그아웃 되었습니다.' });
    } catch (error) {
      console.error('로그아웃 오류:', error);
      res.status(500).json({ error: '로그아웃 중 오류가 발생했습니다.' });
    }
  }
);

// 사용자 정보 조회 엔드포인트
userRouter.get(
  '/user-info',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      res.status(500).json({ error: '서버 오류' });
    }
  }
);

// 사용자 정보 업데이트 엔드포인트
userRouter.put(
  '/update',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { newUsername, newEmail, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    try {
      if (!user) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ error: '현재 비밀번호가 올바르지 않습니다' });
      }

      if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10);
      }

      user.username = newUsername || user.username;
      user.email = newEmail || user.email;

      await user.save();
      res.status(200).json({ message: '프로필이 업데이트 되었습니다' });
    } catch (err) {
      console.error('프로필 업데이트 중 오류 발생:', err);
      res.status(500).json({ error: '프로필 업데이트 중 오류 발생' });
    }
  }
);

// 사용자 삭제 엔드포인트
userRouter.delete(
  '/delete',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.user.id);
      if (!deletedUser) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
      }
      res.status(200).json({ message: '계정이 성공적으로 삭제되었습니다' });
    } catch (err) {
      console.error('사용자 삭제 중 오류 발생:', err);
      res.status(500).json({ error: '사용자 삭제 중 오류 발생' });
    }
  }
);

export default userRouter;
