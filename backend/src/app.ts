import express, { Application } from "express";
import cors from "cors";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
import homeRouter from "./routes/home.routes";
import filmRouter from "./routes/film.routes";
import otpRouter from "./routes/otp.routes";
app.use("/", homeRouter);
app.use("/api/films", filmRouter);
app.use("/api/otp", otpRouter);

export default app;
