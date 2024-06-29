import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

// GET all todos
router.get("/list", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.send(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET a todo by id
router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).send({ message: "Todo not found" });
    }
    res.send(todo);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const todo = await Todo.find({ dueDate: req.query.dueDate });
    if (!todo) {
      return res.status(404).send({ message: "Todo not found" });
    }
    res.send(todo);
  } catch (err) {
    res.status(500).send(err);
  }
});

// CREATE a new todo
router.post("/new", async (req, res) => {
  try {
    const existingTodo = await Todo.findOne({ title: req.body.title });
    if (existingTodo) {
      return res
        .status(400)
        .json({ message: "이미 같은 제목의 할일이 존재합니다." });
    }

    const todo = new Todo({
      title: req.body.title,
      contents: req.body.contents,
      categori: req.body.categori,
      dueDate: req.body.dueDate,
      userId: req.body.userId,
      // Additional fields can be added based on your schema
    });

    const newTodo = await todo.save();
    console.log("새로운 할일이 생성되었습니다:", newTodo);
    res.status(201).send(newTodo);
  } catch (err) {
    console.error("할일을 생성하는 중 오류 발생:", err);
    res.status(400).send(err);
  }
});

// UPDATE a todo by id
router.put("/update", async (req, res) => {
  try {
    const { body : { userId, title, recurringEvent, memo, regDate, recurringPeriod, dueDate}} = req;
    console.log(dueDate);
    const todo = await Todo.findOneAndUpdate(
      { userId: userId },
      {
        title: title, 
        recurringEvent : recurringEvent,
        memo : memo,
        regDate : regDate,
        recurringPeriod : recurringPeriod,
        dueDate : dueDate
      }
    );
    if (!todo) {
      return res.status(404).send({ message: "Todo not found" });
    }
    res.send(todo);
  } catch (err) {
    res.status(400).send(err);
  }
});

// DELETE a todo by id
router.delete("/delete/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).send({ message: "Todo not found" });
    }
    res.send({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
