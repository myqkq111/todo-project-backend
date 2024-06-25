// 파일: index.js
import express from "express";
import connectDB from "./config/db.js";
import passport from "passport";
import jwtStrategy from "./config/passport.js";
import User from "./models/User.js";
import jwt from "jsonwebtoken"; // 추가: jsonwebtoken 패키지 임포트

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
passport.use(jwtStrategy);
app.use(passport.initialize());

// 아이디 중복확인 엔드포인트
app.get("/check-username/:username", async (req, res) => {
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
    res.status(500).json({ error: "Error checking username availability" });
  }
});

// 회원가입 엔드포인트
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// 비밀번호 재설정
app.post("/forgot-password", async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // 여기에서 비밀번호 재설정 이메일을 전송하거나 임시 비밀번호를 생성하여 전송하는 로직을 추가할 수 있습니다.
    // 임시 비밀번호를 생성하고 이메일로 전송하는 예시 코드:
    const temporaryPassword = generateTemporaryPassword(); // 임시 비밀번호 생성 함수 예시
    user.password = temporaryPassword;
    await user.save();
    res.status(200).json({ message: "Temporary password sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing request" });
  }
});

// 임시 비밀번호 생성로직(무작위 8자리 문자)
function generateTemporaryPassword() {
  const temporaryPassword = Math.random().toString(36).slice(-8); // 무작위 8자리 문자열 생성
  return temporaryPassword;
}

// 로그인 엔드포인트
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, "your_jwt_secret", { expiresIn: "1h" }); // 수정: JWT 토큰 생성

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// 로그아웃 엔드포인트
app.post("/logout", (req, res) => {
  req.logout(); // Passport.js를 사용하는 경우
  res.status(200).json({ message: "User logged out successfully" });
});

// 사용자 정보 수정 엔드포인트
app.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { newUsername, newPassword } = req.body;
      const user = req.user;

      if (newUsername) user.username = newUsername;
      if (newPassword) user.password = newPassword;

      await user.save();
      res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Update failed" });
    }
  }
);

// 사용자 탈퇴 엔드포인트
app.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      await User.findByIdAndDelete(user._id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Delete failed" });
    }
  }
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

export default app;
