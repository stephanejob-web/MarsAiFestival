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
import assignmentRouter from "./routes/assignment.routes";
import adminRouter from "./routes/admin.routes";
import voteRouter from "./routes/vote.routes";
import commentRouter from "./routes/comment.routes";
import phaseRouter from "./routes/phase.routes";
import ticketRouter from "./routes/ticket.routes";

app.use("/", homeRouter);
app.use("/api/films", filmRouter);
app.use("/api/otp", otpRouter);
app.use("/api/auth", authRouter);
app.use("/api/assignments", assignmentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/votes", voteRouter);
app.use("/api/comments", commentRouter);
app.use("/api/phases", phaseRouter);
app.use("/api/tickets", ticketRouter);

export default app;
