import React, { useState, useRef, useEffect, useCallback } from "react";

interface VerificationEmailProps {
    email: string;
    onVerify: (code: string) => boolean;
    onConfirm: () => void;
}

const DIGIT_IDS = [0, 1, 2, 3, 4, 5] as const;
const RESEND_DELAY = 30;

const VerificationEmail = ({
    email,
    onVerify,
    onConfirm,
}: VerificationEmailProps): React.JSX.Element => {
    const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [resendTimer, setResendTimer] = useState(RESEND_DELAY);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        startResendTimer();
        setTimeout(() => inputRefs.current[0]?.focus(), 80);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [startResendTimer]);

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
        setError(false);
        if (index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
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
            setError(false);
            return;
        }
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
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
        setError(false);
        const focusIdx = Math.min(text.length, 5);
        inputRefs.current[focusIdx]?.focus();
    };

    const handleVerify = (): void => {
        if (!isComplete || loading) return;
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            if (onVerify(code)) {
                onConfirm();
            } else {
                setShake(true);
                setError(true);
                setTimeout(() => {
                    setShake(false);
                    setDigits(["", "", "", "", "", ""]);
                    inputRefs.current[0]?.focus();
                }, 500);
            }
        }, 1100);
    };

    const handleResend = (): void => {
        if (resendTimer > 0) return;
        setResendTimer(RESEND_DELAY);
        startResendTimer();
        setDigits(["", "", "", "", "", ""]);
        setError(false);
        inputRefs.current[0]?.focus();
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
                        <div className="verification-step-connector done" />
                        <div className="verification-step-item">
                            <div className="verification-step-circle active">2</div>
                            <span className="verification-step-label active-label">
                                Vérification
                            </span>
                        </div>
                        <div className="verification-step-connector" />
                        <div className="verification-step-item">
                            <div className="verification-step-circle pending">3</div>
                            <span className="verification-step-label dim">Confirmation</span>
                        </div>
                    </div>

                    {/* Titre */}
                    <h2 className="verification-title">Code de vérification</h2>
                    <p className="verification-subtitle">
                        Un code à 6 chiffres a été envoyé à votre adresse email.
                    </p>

                    {/* Email display */}
                    <div className="verification-email-display">
                        <div className="verification-email-left">
                            <div className="verification-email-dot" />
                            <span className="verification-email-addr">{email}</span>
                        </div>
                    </div>

                    {/* OTP label */}
                    <label className="verification-otp-label">Code de vérification</label>

                    {/* OTP digits */}
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
                                    className={`verification-otp-digit${digits[i] ? " filled" : ""}${error ? " error-state" : ""}${shake ? " shake" : ""}`}
                                    autoComplete="one-time-code"
                                />
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Error message */}
                    <div className={`verification-otp-error${error ? " show" : ""}`}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <circle cx="6.5" cy="6.5" r="6" stroke="#FF6B6B" strokeWidth="1.2" />
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

                    {/* Verify button */}
                    <button
                        type="button"
                        className={`verification-btn-main${loading ? " loading" : ""}`}
                        disabled={!isComplete || loading}
                        onClick={handleVerify}
                    >
                        Vérifier
                    </button>

                    {/* Resend section */}
                    <div className="verification-resend">
                        <span className="verification-resend-left">Pas reçu le code ?</span>
                        <div className="verification-resend-right">
                            <button
                                type="button"
                                className="verification-btn-resend"
                                disabled={resendTimer > 0}
                                onClick={handleResend}
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

                    {/* Demo hint */}
                    <div className="verification-demo-hint">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="6" stroke="#F5E642" strokeWidth="1.2" />
                            <line
                                x1="7"
                                y1="5"
                                x2="7"
                                y2="9"
                                stroke="#F5E642"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <circle cx="7" cy="3.5" r="0.7" fill="#F5E642" />
                        </svg>
                        Maquette — tapez <span className="verification-demo-code">1 2 3 4 5 6</span>{" "}
                        pour valider
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VerificationEmail;
