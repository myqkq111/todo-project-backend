import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, //일정명
  regDate: { type: Date, default: Date.now }, //등록일
  dueDate: { type: Date, required: true }, //마감일
  categori: { type: String, required: true }, //직장 또는 일상 0이면 직장, 1이면 일상
  completed: { type: Boolean, default: false }, //완료여부
  failedSchedule: { type: Boolean, default: false }, //시간이 지나도 완료하지 못한 실패한 일정여부
  isImportant: { type: Boolean, default: false }, //중요여부
  recurringEvent: { type: Boolean, default: false }, //주기적인 일
  recurringPeriod: { type: String, default: '0' }, //반복 기간
  userId: { type: mongoose.Types.ObjectId }, //등록한 userId
  memo: { type: String, default: '' }, //memo
});

const Todo = mongoose.model('Todo', TodoSchema);

export default Todo;
