import React, { useEffect, useRef, useState } from "react";

const DUR = 420;

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  :root { --fk-dur: ${DUR}ms; }

  /* ── Slot ── */
  .fk-slot {
    display: inline-block;
    position: relative;
    width: 0.68em;
    height: 1.02em;
    perspective: 700px;
    margin: 0 0.014em;
  }

  /* ── Card ── */
  .fk-card {
    position: absolute;
    inset: 0;
  }

  /* ── Half ── */
  .fk-h {
    position: absolute;
    inset: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.03em;
    backface-visibility: hidden;
  }

  /* Top half */
  .fk-h-t {
    clip-path: inset(0 0 50.2% 0);
    border-radius: 8px 8px 0 0;
    background: linear-gradient(
      180deg,
      rgba(10,18,42,0.95) 0%,
      rgba(6,12,30,0.98) 100%
    );
    color: #e8f6ff;
    text-shadow:
      0 0 12px rgba(78,255,206,0.9),
      0 0 30px rgba(78,255,206,0.4),
      0 0 60px rgba(78,255,206,0.15);
    border: 1px solid rgba(78,255,206,0.18);
    border-bottom: none;
    box-shadow:
      inset 0 1px 0 rgba(78,255,206,0.12),
      inset 1px 0 0 rgba(78,255,206,0.06),
      inset -1px 0 0 rgba(78,255,206,0.06);
  }

  /* Bottom half */
  .fk-h-b {
    clip-path: inset(50.2% 0 0 0);
    border-radius: 0 0 8px 8px;
    background: linear-gradient(
      180deg,
      rgba(4,10,24,0.98) 0%,
      rgba(8,16,36,0.95) 100%
    );
    color: rgba(200,240,255,0.85);
    text-shadow:
      0 0 10px rgba(78,255,206,0.6),
      0 0 24px rgba(78,255,206,0.25);
    border: 1px solid rgba(78,255,206,0.12);
    border-top: none;
    box-shadow:
      inset 0 -1px 0 rgba(78,255,206,0.08),
      inset 1px 0 0 rgba(78,255,206,0.04),
      inset -1px 0 0 rgba(78,255,206,0.04);
  }

  /* ── Z-layers ── */
  .fk-back { z-index: 1; }

  /* Front-top: old digit top — falls away */
  .fk-ft {
    z-index: 3;
    animation: fk-top var(--fk-dur) ease-in forwards;
  }

  /* Front-bottom: new digit bottom — rises in */
  .fk-fb {
    z-index: 2;
    animation: fk-bottom var(--fk-dur) ease-out forwards;
  }

  /* ── Scan line that sweeps during flip ── */
  .fk-scan {
    position: absolute;
    left: 0; right: 0;
    height: 3px;
    z-index: 25;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(78,255,206,0.9) 30%,
      rgba(180,255,240,1) 50%,
      rgba(78,255,206,0.9) 70%,
      transparent
    );
    box-shadow: 0 0 12px rgba(78,255,206,1), 0 0 30px rgba(78,255,206,0.6);
    animation: fk-scan var(--fk-dur) linear forwards;
  }

  /* ── Border glow pulse on flip ── */
  .fk-h-t.fk-ft,
  .fk-h-b.fk-fb {
    animation-name: fk-top, fk-border-glow;
    animation-duration: var(--fk-dur), var(--fk-dur);
    animation-timing-function: ease-in, ease-in-out;
    animation-fill-mode: forwards, forwards;
  }

  /* ── Keyframes ── */
  @keyframes fk-top {
    0%   { transform: rotateX(0deg); }
    100% { transform: rotateX(-90deg); }
  }
  @keyframes fk-bottom {
    0%   { transform: rotateX(90deg); }
    100% { transform: rotateX(0deg); }
  }
  @keyframes fk-scan {
    0%   { top: 0%; opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes fk-border-glow {
    0%   { border-color: rgba(78,255,206,0.15); }
    50%  { border-color: rgba(78,255,206,0.9); box-shadow: 0 0 20px rgba(78,255,206,0.5); }
    100% { border-color: rgba(78,255,206,0.15); }
  }

  /* ── Split line (hinge) ── */
  .fk-split {
    position: absolute;
    left: 0; right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 1px;
    z-index: 20;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(78,255,206,0.6) 20%,
      rgba(78,255,206,0.9) 50%,
      rgba(78,255,206,0.6) 80%,
      transparent
    );
    box-shadow: 0 0 8px rgba(78,255,206,0.6), 0 0 20px rgba(78,255,206,0.2);
  }

  /* ── Corner accent dots ── */
  .fk-corner {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(78,255,206,0.7);
    box-shadow: 0 0 6px rgba(78,255,206,0.9);
    z-index: 30;
    pointer-events: none;
  }

  /* ── Outer glow around full digit slot ── */
  .fk-outer-glow {
    position: absolute;
    inset: -2px;
    border-radius: 10px;
    pointer-events: none;
    box-shadow:
      0 0 0 1px rgba(78,255,206,0.12),
      0 0 20px rgba(78,255,206,0.08),
      0 8px 32px rgba(0,0,0,0.8);
    z-index: 0;
  }
`;

let injected = false;
const injectCSS = (): void => {
    if (injected) return;
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
};

// ─── FlipDigit ────────────────────────────────────────────────────────────────
const FlipDigit = ({ value }: { value: string }): React.JSX.Element => {
    const [curr, setCurr] = useState(value);
    const [prev, setPrev] = useState(value);
    const [flip, setFlip] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        injectCSS();
    }, []);

    useEffect(() => {
        if (value === curr) return;
        if (timer.current) clearTimeout(timer.current);
        setPrev(curr);
        setFlip(true);
        timer.current = setTimeout(() => {
            setCurr(value);
            setFlip(false);
        }, DUR);
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, [value, curr]);

    return (
        <div className="fk-slot">
            <div className="fk-outer-glow" />

            {/* Corner accents */}
            <div className="fk-corner" style={{ top: -1, left: -1 }} />
            <div className="fk-corner" style={{ top: -1, right: -1 }} />
            <div className="fk-corner" style={{ bottom: -1, left: -1 }} />
            <div className="fk-corner" style={{ bottom: -1, right: -1 }} />

            {/* Glowing split line */}
            <div className="fk-split" />

            {!flip ? (
                <div className="fk-card fk-back">
                    <div className="fk-h fk-h-t">
                        <span>{curr}</span>
                    </div>
                    <div className="fk-h fk-h-b">
                        <span>{curr}</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Scan line sweeping down */}
                    <div key={`scan-${curr}`} className="fk-scan" />

                    {/* back-top: new digit top */}
                    <div className="fk-card" style={{ zIndex: 1 }}>
                        <div className="fk-h fk-h-t">
                            <span>{curr}</span>
                        </div>
                    </div>
                    {/* back-bottom: old digit bottom */}
                    <div className="fk-card" style={{ zIndex: 1 }}>
                        <div className="fk-h fk-h-b">
                            <span>{prev}</span>
                        </div>
                    </div>
                    {/* front-top: old digit top — falls */}
                    <div className="fk-card">
                        <div className="fk-h fk-h-t fk-ft">
                            <span>{prev}</span>
                        </div>
                    </div>
                    {/* front-bottom: new digit bottom — rises */}
                    <div className="fk-card">
                        <div className="fk-h fk-h-b fk-fb">
                            <span>{curr}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// ─── Digit group ──────────────────────────────────────────────────────────────
const DigitGroup = ({ value, label }: { value: string; label: string }): React.JSX.Element => (
    <div className="flex flex-col items-center gap-3">
        <div
            style={{
                position: "relative",
                display: "inline-flex",
                gap: 4,
                padding: "10px 10px 12px",
                borderRadius: 14,
                background: "rgba(4,8,20,0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(78,255,206,0.1)",
                boxShadow: [
                    "0 0 0 1px rgba(78,255,206,0.06)",
                    "0 20px 60px rgba(0,0,0,0.9)",
                    "0 4px 16px rgba(0,0,0,0.6)",
                    "inset 0 1px 0 rgba(78,255,206,0.08)",
                ].join(","),
            }}
        >
            {/* Top edge glow line */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: "10%",
                    right: "10%",
                    height: 1,
                    background:
                        "linear-gradient(90deg, transparent, rgba(78,255,206,0.5), transparent)",
                    borderRadius: 1,
                }}
            />
            {value.split("").map((ch, i) => (
                <FlipDigit key={i} value={ch} />
            ))}
        </div>

        {/* Label with glow */}
        <span
            style={{
                fontFamily: "monospace",
                fontSize: "0.13em",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "rgba(78,255,206,0.4)",
                textShadow: "0 0 10px rgba(78,255,206,0.3)",
                userSelect: "none",
            }}
        >
            {label}
        </span>
    </div>
);

// ─── Separator ────────────────────────────────────────────────────────────────
const Sep = (): React.JSX.Element => (
    <div
        className="flex flex-col items-center gap-[0.2em] self-center mb-6"
        style={{ fontSize: "inherit" }}
    >
        {[0, 1].map((i) => (
            <div
                key={i}
                style={{
                    width: "0.1em",
                    height: "0.1em",
                    borderRadius: "50%",
                    background: "rgba(78,255,206,0.7)",
                    boxShadow: "0 0 8px rgba(78,255,206,1), 0 0 20px rgba(78,255,206,0.5)",
                }}
            />
        ))}
    </div>
);

// ─── FlipCountdown ────────────────────────────────────────────────────────────
interface Props {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    label: string;
}
const pad = (n: number): string => String(n).padStart(2, "0");

const FlipCountdown = ({ days, hours, minutes, seconds, label }: Props): React.JSX.Element => {
    const units = [
        { value: pad(days), label: "Jours" },
        { value: pad(hours), label: "Heures" },
        { value: pad(minutes), label: "Minutes" },
        { value: pad(seconds), label: "Secondes" },
    ];

    return (
        <div className="flex flex-col items-center gap-4">
            <p
                style={{
                    fontFamily: "monospace",
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.25em",
                    color: "rgba(78,255,206,0.45)",
                    textShadow: "0 0 12px rgba(78,255,206,0.3)",
                }}
            >
                {label}
            </p>
            <div
                className="flex items-center gap-3"
                style={{ fontSize: "clamp(2.4rem, 5.2vw, 4rem)" }}
            >
                {units.map((u, i) => (
                    <React.Fragment key={u.label}>
                        {i > 0 && <Sep />}
                        <DigitGroup value={u.value} label={u.label} />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default FlipCountdown;
