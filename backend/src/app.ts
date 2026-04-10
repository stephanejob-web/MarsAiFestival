import * as Sentry from "@sentry/node";
import express, { Application } from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? "development",
    // N'envoie les erreurs qu'en production
    enabled: process.env.NODE_ENV === "production",
    // Capture les traces de performance (0.1 = 10% des requêtes)
    tracesSampleRate: 0.1,
});

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
import voteTagRouter from "./routes/voteTag.routes";
import programmeRouter from "./routes/programme.routes";
import juryShowcaseRouter from "./routes/jury_showcase.routes";
import cmsPublicRouter from "./routes/cms_public.routes";
import publicRouter from "./routes/phase_public.routes";
import pushRouter from "./routes/push.routes";

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
app.use("/api/vote-tags", voteTagRouter);
app.use("/api/programme", programmeRouter);
app.use("/api/jury-showcase", juryShowcaseRouter);
app.use("/api/cms", cmsPublicRouter);
app.use("/api/public", publicRouter);
app.use("/api/push", pushRouter);

// ── Sentry — gestionnaire d'erreurs (doit être après toutes les routes) ────────
Sentry.setupExpressErrorHandler(app);

export default app;
