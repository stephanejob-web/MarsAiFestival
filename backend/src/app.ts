import express, { Application } from "express";
import cors from "cors";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
import homeRouter from "./routes/home.routes";
import filmRouter from "./routes/film.routes";
app.use("/", homeRouter);
app.use("/api/films", filmRouter);

export default app;
