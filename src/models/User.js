import mongoose from 'mongoose';
<<<<<<< HEAD
import bcrypt from 'bcryptjs';
=======
import bcrypt from 'bcrypt';
>>>>>>> cd1462aaf4faa65f3a0ad9000177a71c51144d9f

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
<<<<<<< HEAD
=======
// module.exports = User;

>>>>>>> cd1462aaf4faa65f3a0ad9000177a71c51144d9f
export default User;
