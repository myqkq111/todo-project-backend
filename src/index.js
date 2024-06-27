import express from "express";
import connectDB from "./config/db.js";
import passport from "passport";
import filterRouter from "./routes/filterRouter.js";
import cors from "cors";
import Schedule from "./middleware/Schedule.js";

const app = express();
connectDB();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

Schedule();

app.use("/api/filter", filterRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

export default app;
