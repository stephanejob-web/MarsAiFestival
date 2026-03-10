import React from "react";
import type { DurationStatus } from "../types";

interface DurationResultProps {
    durationSec: number | null;
    status: DurationStatus | null;
}

const DurationResult = ({ durationSec, status }: DurationResultProps): React.JSX.Element | null => {
    if (durationSec === null || status === null) return null;

    const minutes = Math.floor(durationSec / 60);
    const seconds = Math.floor(durationSec % 60);
    const decimal = (durationSec % 1).toFixed(1).slice(2);
    const display = `${minutes}:${String(seconds).padStart(2, "0")}.${decimal}`;

    const config = {
        ok: {
            bg: "bg-aurora/7 border-aurora/20",
            icon: "✓",
            valueColor: "text-aurora",
            label: "Durée valide — 60 secondes pile ✓",
        },
        warn: {
            bg: "bg-solar/5 border-solar/20",
            icon: "⚠",
            valueColor: "text-solar",
            label: "Film trop court — durée exacte requise : 60 secondes",
        },
        err: {
            bg: "bg-coral/7 border-coral/20",
            icon: "✗",
            valueColor: "text-coral",
            label: "Film trop long — durée exacte requise : 60 secondes",
        },
    };

    const c = config[status];

    return (
        <div className={`flex items-center gap-3.5 rounded-[10px] px-4 py-3 mt-2.5 border ${c.bg}`}>
            <div className="text-xl shrink-0">{c.icon}</div>
            <div className="flex-1">
                <div className={`font-mono text-base font-medium ${c.valueColor}`}>{display}</div>
                <div className="text-xs text-mist mt-0.5">{c.label}</div>
            </div>
        </div>
    );
};

export default DurationResult;
