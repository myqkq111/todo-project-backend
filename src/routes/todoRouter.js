import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// GET all todos
router.get('/list', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id, completed:false });
    res.send(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET todos by category
router.get('/category/:category', async (req, res) => {
  try {
    const todos = await Todo.find({
      categori: req.params.category,
      userId: req.user._id,
      completed:false
    });
    res.send(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET a todo by id
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id,
      completed:false
    });
    if (!todo) {
      return res.status(404).send({ message: 'Todo not found' });
    }
    res.send(todo);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const todo = await Todo.find({
      dueDate: req.query.dueDate,
      userId: req.user._id,
      completed:false
    });
    if (!todo) {
      return res.status(404).send({ message: 'Todo not found' });
    }
    res.send(todo);
  } catch (err) {
    res.status(500).send(err);
  }
});

// CREATE a new todo
router.post('/new', async (req, res) => {
  try {
    const existingTodo = await Todo.findOne({
      title: req.body.title,
      userId: req.user._id,
    });
    if (existingTodo) {
      return res
        .status(400)
        .json({ message: '이미 같은 제목의 할일이 존재합니다.' });
    }

    const todo = new Todo({
      title: req.body.title,
      categori: req.body.categori,
      dueDate: req.body.dueDate,
      userId: req.user._id,
      // Additional fields can be added based on your schema
    });

    const newTodo = await todo.save();
    console.log('새로운 할일이 생성되었습니다:', newTodo);
    res.status(201).send(newTodo);
  } catch (err) {
    console.error('할일을 생성하는 중 오류 발생:', err);
    res.status(400).send(err);
  }
});

// UPDATE a todo by id
router.put('/update', async (req, res) => {
  try {
    const {
      body: {
        _id,
        userId,
        title,
        recurringEvent,
        memo,
        regDate,
        recurringPeriod,
        dueDate,
      },
    } = req;
    const rs = await Todo.findOne({ _id: _id, userId: req.user._id });

    let failedSchedule = rs.failedSchedule;
    if (failedSchedule && (recurringEvent || rs.dueDate !== dueDate)) {
      failedSchedule = false;
    }
    const todo = await Todo.findOneAndUpdate(
      { userId: req.user._id, _id: _id },
      {
        title: title,
        recurringEvent: recurringEvent,
        memo: memo,
        regDate: regDate,
        recurringPeriod: recurringPeriod,
        dueDate: dueDate,
        failedSchedule: failedSchedule,
        completed: false,
      },
      { returnOriginal: false }
    );
    if (!recurringEvent) {
      await Todo.updateMany(
        { userId: req.user._id },
        { $unset: { recurringPeriod: '', regDate: '' } }
      );
    }
    if (!todo) {
      return res.status(404).send({ message: 'Todo not found' });
    }
    res.send(todo);
  } catch (err) {
    res.status(400).send(err);
  }
});

// DELETE a todo by id
router.delete('/delete/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!todo) {
      return res.status(404).send({ message: 'Todo not found' });
    }
    res.send({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
