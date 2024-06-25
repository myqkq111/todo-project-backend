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
