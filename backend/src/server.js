import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import ErrorManager from "../src/middlewares/errorHandler.js";
import CustomError from "../src/utils/customError.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.Routes.js";
import adminRoutes from "./routes/admin.Routes.js";
import cors from "cors";
const app = express();
dotenv.config();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.all("*", (req, res, next) => {
  next(new CustomError(`${req.originalUrl} route not found`, 404));
});

//console.log("MongoDB URL:", process.env.MONGOOSE_URL);

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => console.log("connected to mongoose"))
  .catch((err) => console.error(err));

app.use(ErrorManager);
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
