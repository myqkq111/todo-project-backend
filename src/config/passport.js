// config/passport.js

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // 사용자 모델 경로에 맞게 설정
import config from './config.js'; // 환경변수 및 설정 파일

// LocalStrategy 정의
const localStrategy = new LocalStrategy(
  { usernameField: 'username' },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return done(null, false, {
          message: '아이디나 비밀번호가 잘못되었습니다.',
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

// JWT Strategy 정의
const jwtOptions = {
  secretOrKey: config.ACCESS_TOKEN_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);

    if (!user) {
      return done(null, false, {
        message: '인증 실패: 유저를 찾을 수 없습니다.',
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

// Passport에 전략 등록
passport.use(localStrategy);
passport.use(jwtStrategy);

export default passport;
