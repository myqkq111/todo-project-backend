import express from "express";
import connectDB from "./config/db.js";
import passport from "passport";
import usersRouter from "./routes/usersRouter.js";

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.use("/api/users", usersRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

export default app;
