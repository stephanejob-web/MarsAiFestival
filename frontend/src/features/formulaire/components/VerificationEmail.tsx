import React, { useState, useRef, useEffect, useCallback } from "react";

interface VerificationEmailProps {
    defaultEmail: string;
    onSendOtp: (email: string) => Promise<void>;
    onVerify: (email: string, code: string) => Promise<boolean>;
    onConfirm: (email: string) => Promise<void>;
}

const DIGIT_IDS = [0, 1, 2, 3, 4, 5] as const;
const RESEND_DELAY = 30;
const OTP_EXPIRE_SECONDS = 300; // 5 minutes

const VerificationEmail = ({
    defaultEmail,
    onSendOtp,
    onVerify,
    onConfirm,
}: VerificationEmailProps): React.JSX.Element => {
    /* ── Phase : "email" | "code" ── */
    const [phase, setPhase] = useState<"email" | "code">("email");
    const [email, setEmail] = useState(defaultEmail);
    const [emailError, setEmailError] = useState("");
    const [sending, setSending] = useState(false);

    /* ── Phase code ── */
    const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
    const [codeError, setCodeError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [resendTimer, setResendTimer] = useState(RESEND_DELAY);
    const [expireTimer, setExpireTimer] = useState(OTP_EXPIRE_SECONDS);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const expireRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const formatExpire = (seconds: number): string => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const startExpireTimer = useCallback((): void => {
        if (expireRef.current) clearInterval(expireRef.current);
        setExpireTimer(OTP_EXPIRE_SECONDS);
        expireRef.current = setInterval(() => {
            setExpireTimer((prev) => {
                if (prev <= 1) {
                    if (expireRef.current) clearInterval(expireRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const startResendTimer = useCallback((): void => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (expireRef.current) clearInterval(expireRef.current);
        };
    }, []);

    /* ── Phase 1 : envoi email ── */
    const handleSendCode = async (): Promise<void> => {
        const trimmed = email.trim();
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setEmailError("Adresse email invalide");
            return;
        }
        setEmailError("");
        setSending(true);
        try {
            await onSendOtp(trimmed);
            setPhase("code");
            startResendTimer();
            startExpireTimer();
            setTimeout(() => inputRefs.current[0]?.focus(), 80);
        } catch {
            setEmailError("Impossible d'envoyer le code. Vérifiez votre email.");
        } finally {
            setSending(false);
        }
    };

    /* ── Phase 2 : saisie code ── */
    const code = digits.join("");
    const isComplete = code.length === 6;

    const handleDigitChange = (index: number, value: string): void => {
        const raw = value.replace(/\D/g, "");
        if (!raw) {
            setDigits((prev) => {
                const next = [...prev];
                next[index] = "";
                return next;
            });
            return;
        }
        const char = raw[raw.length - 1];
        setDigits((prev) => {
            const next = [...prev];
            next[index] = char;
            return next;
        });
        setCodeError(false);
        if (index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Backspace") {
            e.preventDefault();
            if (digits[index]) {
                setDigits((prev) => {
                    const next = [...prev];
                    next[index] = "";
                    return next;
                });
            } else if (index > 0) {
                setDigits((prev) => {
                    const next = [...prev];
                    next[index - 1] = "";
                    return next;
                });
                inputRefs.current[index - 1]?.focus();
            }
            setCodeError(false);
            return;
        }
        if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
        if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!text) return;
        const newDigits = [...digits];
        text.split("").forEach((ch, i) => {
            newDigits[i] = ch;
        });
        setDigits(newDigits);
        setCodeError(false);
        inputRefs.current[Math.min(text.length, 5)]?.focus();
    };

    const [uploadError, setUploadError] = useState("");

    const handleVerify = async (): Promise<void> => {
        if (!isComplete || loading) return;
        setLoading(true);
        setUploadError("");
        const ok = await onVerify(email.trim(), code);
        if (ok) {
            try {
                await onConfirm(email.trim());
            } catch {
                setUploadError("Erreur lors de l'envoi du film. Réessayez.");
                setLoading(false);
            }
        } else {
            setLoading(false);
            setShake(true);
            setCodeError(true);
            setTimeout(() => {
                setShake(false);
                setDigits(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
            }, 500);
        }
    };

    const handleResend = async (): Promise<void> => {
        if (resendTimer > 0) return;
        try {
            await onSendOtp(email.trim());
            setResendTimer(RESEND_DELAY);
            startResendTimer();
            startExpireTimer();
            setDigits(["", "", "", "", "", ""]);
            setCodeError(false);
            inputRefs.current[0]?.focus();
        } catch {
            /* silently ignore */
        }
    };

    return (
        <div className="verification-layout">
            {/* ── PANNEAU GAUCHE ── */}
            <aside className="verification-left">
                <div className="verification-logo">
                    mars<span className="text-aurora">AI</span>
                </div>

                <div className="verification-hero">
                    <div className="verification-pretitle">
                        <span className="verification-pretitle-line" />
                        Dépôt de film
                    </div>
                    <h1 className="verification-big-title">
                        Votre minute
                        <br />
                        <span className="verification-grad">change tout.</span>
                    </h1>
                    <p className="verification-desc">
                        60 secondes pour raconter l&apos;avenir. Rejoignez les créateurs qui
                        explorent les frontières entre intelligence artificielle et narration
                        humaine.
                    </p>

                    <div className="verification-cards">
                        <div className="verification-card">
                            <div className="verification-card-icon vci-1">🎬</div>
                            <div className="verification-card-text">
                                <div className="verification-card-title">Film de 60 secondes</div>
                                <div className="verification-card-sub">
                                    MP4 · MOV · WebM — jusqu&apos;à 2 Go
                                </div>
                            </div>
                            <div className="verification-card-check">✓</div>
                        </div>
                        <div className="verification-card">
                            <div className="verification-card-icon vci-2">🤖</div>
                            <div className="verification-card-text">
                                <div className="verification-card-title">Outils IA documentés</div>
                                <div className="verification-card-sub">
                                    Image, son, hybridation — tous acceptés
                                </div>
                            </div>
                            <div className="verification-card-check">✓</div>
                        </div>
                        <div className="verification-card">
                            <div className="verification-card-icon vci-3">🌍</div>
                            <div className="verification-card-text">
                                <div className="verification-card-title">
                                    Gratuit &amp; international
                                </div>
                                <div className="verification-card-sub">
                                    Ouvert à tous, sous-titres FR requis
                                </div>
                            </div>
                            <div className="verification-card-check">✓</div>
                        </div>
                    </div>
                </div>

                <div className="verification-footer">
                    © 2026 marsAI · La Plateforme × Mobile Film Festival · Marseille
                </div>
            </aside>

            {/* ── PANNEAU DROIT ── */}
            <main className="verification-right">
                <a href="/" className="verification-back">
                    ← Retour au site
                </a>

                <div className="verification-form-box">
                    {/* Stepper */}
                    <div className="verification-steps">
                        <div className="verification-step-item">
                            <div className="verification-step-circle done">✓</div>
                            <span className="verification-step-label dim">Formulaire</span>
                        </div>
                        <div
                            className={`verification-step-connector${phase === "code" ? " done" : ""}`}
                        />
                        <div className="verification-step-item">
                            <div
                                className={`verification-step-circle${phase === "email" ? " active" : " done"}`}
                            >
                                {phase === "code" ? "✓" : "2"}
                            </div>
                            <span
                                className={`verification-step-label${phase === "email" ? " active-label" : " dim"}`}
                            >
                                Email
                            </span>
                        </div>
                        <div
                            className={`verification-step-connector${phase === "code" ? " done" : ""}`}
                        />
                        <div className="verification-step-item">
                            <div
                                className={`verification-step-circle${phase === "code" ? " active" : " pending"}`}
                            >
                                3
                            </div>
                            <span
                                className={`verification-step-label${phase === "code" ? " active-label" : " dim"}`}
                            >
                                Vérification
                            </span>
                        </div>
                    </div>

                    {phase === "email" ? (
                        <>
                            <h2 className="verification-title">Confirmez votre email</h2>
                            <p className="verification-subtitle">
                                Nous allons envoyer un code de vérification à votre adresse email.
                            </p>

                            <label className="verification-otp-label" htmlFor="otp-email">
                                Adresse email
                            </label>
                            <input
                                id="otp-email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError("");
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") void handleSendCode();
                                }}
                                className={`w-full rounded-xl border px-4 py-3 text-sm font-mono bg-white/5 text-white-soft outline-none transition-all mb-1 ${
                                    emailError
                                        ? "border-red-400/60 focus:border-red-400"
                                        : "border-white/15 focus:border-aurora/60"
                                }`}
                                placeholder="vous@domaine.com"
                                autoComplete="email"
                            />
                            {emailError && (
                                <p className="text-xs text-red-400 mb-3">{emailError}</p>
                            )}

                            <button
                                type="button"
                                className={`verification-btn-main mt-4${sending ? " loading" : ""}`}
                                disabled={sending || !email.trim()}
                                onClick={() => void handleSendCode()}
                            >
                                {sending ? "Envoi en cours…" : "Recevoir le code"}
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="verification-title">Code de vérification</h2>
                            <p className="verification-subtitle">
                                Un code à 6 chiffres a été envoyé à votre adresse email.
                            </p>

                            <div className="verification-email-display">
                                <div className="verification-email-left">
                                    <div className="verification-email-dot" />
                                    <span className="verification-email-addr">{email}</span>
                                </div>
                                <button
                                    type="button"
                                    className="text-xs text-aurora/70 hover:text-aurora underline"
                                    onClick={() => setPhase("email")}
                                >
                                    Modifier
                                </button>
                            </div>

                            <label className="verification-otp-label">Code de vérification</label>

                            <div className="verification-otp-wrap">
                                {DIGIT_IDS.map((i) => (
                                    <React.Fragment key={i}>
                                        {i === 3 && <span className="verification-otp-sep">—</span>}
                                        <input
                                            ref={(el) => {
                                                inputRefs.current[i] = el;
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digits[i]}
                                            onChange={(e) => handleDigitChange(i, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(i, e)}
                                            onPaste={i === 0 ? handlePaste : undefined}
                                            className={`verification-otp-digit${digits[i] ? " filled" : ""}${codeError ? " error-state" : ""}${shake ? " shake" : ""}`}
                                            autoComplete="one-time-code"
                                        />
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className={`verification-otp-error${codeError ? " show" : ""}`}>
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <circle
                                        cx="6.5"
                                        cy="6.5"
                                        r="6"
                                        stroke="#FF6B6B"
                                        strokeWidth="1.2"
                                    />
                                    <line
                                        x1="6.5"
                                        y1="3.5"
                                        x2="6.5"
                                        y2="7.5"
                                        stroke="#FF6B6B"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <circle cx="6.5" cy="9.5" r="0.7" fill="#FF6B6B" />
                                </svg>
                                Code incorrect. Réessayez.
                            </div>

                            {uploadError && (
                                <p className="text-xs text-red-400 mb-3">{uploadError}</p>
                            )}

                            <button
                                type="button"
                                className={`verification-btn-main${loading ? " loading" : ""}`}
                                disabled={!isComplete || loading || expireTimer === 0}
                                onClick={() => void handleVerify()}
                            >
                                {loading ? "Envoi du film…" : "Vérifier et soumettre"}
                            </button>

                            <div className="verification-resend">
                                <span className="verification-resend-left">Pas reçu le code ?</span>
                                <div className="verification-resend-right">
                                    <button
                                        type="button"
                                        className="verification-btn-resend"
                                        disabled={resendTimer > 0}
                                        onClick={() => void handleResend()}
                                    >
                                        Renvoyer
                                    </button>
                                    {resendTimer > 0 && (
                                        <span className="verification-resend-timer">
                                            0:{String(resendTimer).padStart(2, "0")}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {expireTimer > 0 ? (
                                <div className="verification-demo-hint">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <circle
                                            cx="7"
                                            cy="7"
                                            r="6"
                                            stroke={expireTimer <= 60 ? "#FF6B6B" : "#F5E642"}
                                            strokeWidth="1.2"
                                        />
                                        <line
                                            x1="7"
                                            y1="5"
                                            x2="7"
                                            y2="9"
                                            stroke={expireTimer <= 60 ? "#FF6B6B" : "#F5E642"}
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <circle
                                            cx="7"
                                            cy="3.5"
                                            r="0.7"
                                            fill={expireTimer <= 60 ? "#FF6B6B" : "#F5E642"}
                                        />
                                    </svg>
                                    <span>Code valide pendant</span>
                                    <span
                                        className={`verification-demo-code font-mono ${expireTimer <= 60 ? "text-coral" : ""}`}
                                    >
                                        {formatExpire(expireTimer)}
                                    </span>
                                </div>
                            ) : (
                                <div className="verification-demo-hint text-coral">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <circle
                                            cx="7"
                                            cy="7"
                                            r="6"
                                            stroke="#FF6B6B"
                                            strokeWidth="1.2"
                                        />
                                        <line
                                            x1="7"
                                            y1="3.5"
                                            x2="7"
                                            y2="7.5"
                                            stroke="#FF6B6B"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <circle cx="7" cy="9.5" r="0.7" fill="#FF6B6B" />
                                    </svg>
                                    Code expiré — cliquez sur &quot;Renvoyer&quot; pour en obtenir
                                    un nouveau
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default VerificationEmail;
