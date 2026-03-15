import express, { Application } from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ── Documentation API (/api/docs) ─────────────────────────────────────────────
const swaggerDocument = YAML.load(path.join(__dirname, "openapi.yaml"));
app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        customSiteTitle: "marsAI Festival — API Docs",
        customCss: `
      .topbar { background: #0f111a; }
      .topbar-wrapper img { display: none; }
      .topbar-wrapper::before { content: "marsAI Festival 2026 — API"; color: #4effce; font-weight: 700; font-size: 1.1rem; }
    `,
    }),
);

// Routes
import homeRouter from "./routes/home.routes";
import filmRouter from "./routes/film.routes";
import otpRouter from "./routes/otp.routes";
import authRouter from "./routes/auth.routes";
import assignmentRouter from "./routes/assignment.routes";
import adminRouter from "./routes/admin.routes";
import voteRouter from "./routes/vote.routes";
import discussionRouter from "./routes/discussion.routes";
import commentRouter from "./routes/comment.routes";
import phaseRouter from "./routes/phase.routes";
import ticketRouter from "./routes/ticket.routes";
import vocalRouter from "./routes/vocal.routes";

app.use("/", homeRouter);
app.use("/api/films", filmRouter);
app.use("/api/otp", otpRouter);
app.use("/api/auth", authRouter);
app.use("/api/assignments", assignmentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/votes", voteRouter);
app.use("/api/discussion", discussionRouter);
app.use("/api/comments", commentRouter);
app.use("/api/phases", phaseRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/vocal", vocalRouter);

export default app;
