import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? "production",
    // Actif dès que le DSN est défini
    enabled: !!process.env.SENTRY_DSN,
    sendDefaultPii: true,
    tracesSampleRate: 0.1,
});
