import React from "react";

interface StatCardProps {
    label: string;
    value: number;
    sub: string;
    color?: "aurora" | "lavande" | "coral" | "solar" | "default";
}

const VALUE_COLOR: Record<string, string> = {
    aurora: "text-aurora",
    lavande: "text-lavande",
    coral: "text-coral",
    solar: "text-solar",
    default: "text-white-soft",
};

const StatCard = ({ label, value, sub, color = "default" }: StatCardProps): React.JSX.Element => (
    <div className="rounded-xl border border-white/[0.05] bg-surface-2 px-[18px] py-4">
        <div className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-mist">
            {label}
        </div>
        <div className={`font-mono text-[1.7rem] font-medium leading-none ${VALUE_COLOR[color]}`}>
            {value}
        </div>
        <div className="mt-1 text-[0.7rem] text-mist">{sub}</div>
    </div>
);

export default StatCard;
