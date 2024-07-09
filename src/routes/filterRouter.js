import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// 중요일정 체크버튼
router.put('/isImportant', async (req, res) => {
  try {
    const {
      body: { userId, isImportant, title },
    } = req;

    const update = isImportant ? false : true;
    const todo = await Todo.findOneAndUpdate(
      { userId: req.user._id, title: title },
      {
        isImportant: update,
      },
      { returnOriginal: false }
    );
    return res.status(200).json(todo);
  } catch (err) {
    return res.status(500).send('Internal server error');
  }
});

// 중요일정 목록
router.get('/isImportant', async (req, res) => {
  try {
    const todos = await Todo.find({ isImportant: true, userId: req.user._id, completed:false });
    return res.status(200).json(todos);
  } catch (err) {
    return res.status(500).send('Internal server error');
  }
});

// 주기적인 일정 체크버튼
router.put('/recurringEvent', async (req, res) => {
  try {
    const {
      body: { userId, recurringEvent },
    } = req;

    const update = recurringEvent ? false : true;
    const todo = await Todo.findOneAndUpdate(
      { userId: req.user._id },
      {
        recurringEvent: update,
      }
    );
    return res.status(200).json(todo);
  } catch (err) {
    return res.status(500).send('Internal server error');
  }
});

// 주기적인 일정 목록
router.get('/recurringEvent', async (req, res) => {
  try {
    const todos = await Todo.find({
      recurringEvent: true,
      userId: req.user._id,
      completed:false
    });
    return res.status(200).json(todos);
  } catch (err) {
    return res.status(500).send('Internal server error');
  }
});

// 일정 완료 체크버튼
router.put('/completed', async (req, res) => {
  try {
    const {
      body: { userId, completed, title, isImportant },
    } = req;
    const update = completed ? false : true;
    const todo = await Todo.findOneAndUpdate(
      { userId: req.user._id, title: title },
      {
        completed: update,
      },
      { returnOriginal: false }
    );

    return res.status(200).json(todo);
  } catch (err) {
    return res.status(500).send('Internal server error');
  }
});

// 완료된 일정 목록
router.get('/completed', async (req, res) => {
  try {
    const todos = await Todo.find({ completed: true, userId: req.user._id });
    return res.status(200).json(todos);
  } catch (err) {
    return res.status(500).send('Internal server error');
  }
});

//시간이 지나도 완료하지 못한 일정
router.put('/failedSchedule', async (req, res) => {
  try {
    const {
      body: { userId },
    } = req;

    const todo = await Todo.findOneAndUpdate(
      { userId: req.user._id },
      {
        failedSchedule: update,
      }
    );
    return res.status(200).json(todo);
  } catch (err) {
    return res.status(500).send('Internal server error');
  }
});

//실패한 일정 목록
router.get('/failedSchedule', async (req, res) => {
  try {
    const todos = await Todo.find({
      failedSchedule: true,
      userId: req.user._id,
    });
    return res.status(200).json(todos);
  } catch (err) {
    return res.status(500).send('Internal server error');
  }
});

//검색 기능
router.get('/', async (req, res) => {
  try {
    const {
      query: { category, typing },
    } = req;
    let todos;
    if (category === 'all') {
      todos = await Todo.find({
        userId: req.user._id,
        title: { $regex: typing },
      });
    } else {
      let su;
      category === 'dailyLife' ? (su = 1) : (su = 0);
      todos = await Todo.find({
        userId: req.user._id,
        $and: [{ categori: su }, { title: { $regex: typing } }],
      });
    }
    return res.status(200).json(todos);
  } catch (err) {
    return res.status(500).send('Internal server error');
  }
});

export default router;
