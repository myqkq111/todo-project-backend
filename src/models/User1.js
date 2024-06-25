// 유저 DB
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, //user이름
  password: { type: String, required: true }, //비밀번호
});

const User = mongoose.model("User", UserSchema);

export default User;
