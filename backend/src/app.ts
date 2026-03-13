import express, { Application } from "express";
import cors from "cors";
import path from "path";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
import homeRouter from "./routes/home.routes";
import filmRouter from "./routes/film.routes";
import otpRouter from "./routes/otp.routes";
import authRouter from "./routes/auth.routes";
app.use("/", homeRouter);
app.use("/api/films", filmRouter);
app.use("/api/otp", otpRouter);
app.use("/api/auth", authRouter);

export default app;
