import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as Sentry from "@sentry/react";
import "./index.css";
import "./i18n";
import App from "./App.tsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN as string,
    environment: import.meta.env.MODE,
    // Actif dès que le DSN est défini
    enabled: !!import.meta.env.VITE_SENTRY_DSN,
    // Capture les traces de performance (0.1 = 10% des requêtes)
    tracesSampleRate: 0.1,
    // Capture les replays lors d'une erreur (enregistre les actions de l'utilisateur)
    replaysOnErrorSampleRate: 1.0,
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={googleClientId}>
            <App />
        </GoogleOAuthProvider>
    </StrictMode>,
);
