import React from "react";

const TICKER_ITEMS = [
    "INTELLIGENCE ARTIFICIELLE",
    "CINÉMA",
    "MARSEILLE",
    "60 SECONDES",
    "120+ PAYS",
    "PREMIER FESTIVAL MONDIAL",
    "IA GÉNÉRATIVE",
    "INNOVATION",
];

const TickerContent = (): React.JSX.Element => (
    <>
        {TICKER_ITEMS.map((item) => (
            <React.Fragment key={item}>
                <span className="text-white/30">{item}</span>
                <span className="text-aurora/40 mx-4" aria-hidden="true">
                    &middot;
                </span>
            </React.Fragment>
        ))}
    </>
);

const TickerSection = (): React.JSX.Element => (
    <div
        className="py-3 border-y border-white/5 overflow-hidden whitespace-nowrap"
        style={{ background: "rgba(15, 21, 53, 0.5)" }}
        aria-hidden="true"
    >
        <div
            className="inline-flex font-mono text-xs uppercase tracking-[0.2em]"
            style={{ animation: "var(--animate-marquee-left)" }}
        >
            {/* Contenu dupliqué 2x pour scroll infini */}
            <span className="inline-flex items-center">
                <TickerContent />
            </span>
            <span className="inline-flex items-center">
                <TickerContent />
            </span>
        </div>
    </div>
);

export default TickerSection;
