import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,              // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

//remove it in production
app.use(morgan("dev"));

app.use("/api/v1/", appRouter);

export default app;