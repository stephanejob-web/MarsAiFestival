import React from "react";
import type { StepDefinition } from "../types";
import { STEPS } from "../constants";

interface StepsNavProps {
    currentStep: number;
    maxUnlocked: number;
    onGoStep: (step: number) => void;
}

const StepsNav = ({ currentStep, maxUnlocked, onGoStep }: StepsNavProps): React.JSX.Element => {
    const getItemState = (stepNum: number): "done" | "active" | "pending" | "locked" => {
        if (stepNum < currentStep) return "done";
        if (stepNum === currentStep) return "active";
        if (stepNum <= maxUnlocked) return "pending";
        return "locked";
    };

    const handleClick = (step: StepDefinition): void => {
        const state = getItemState(step.number);
        if (state !== "locked") {
            onGoStep(step.number);
        }
    };

    const circleClass = (state: "done" | "active" | "pending" | "locked"): string => {
        const base =
            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300";
        switch (state) {
            case "active":
                return `${base} bg-aurora text-deep-sky shadow-[0_0_14px_rgba(78,255,206,0.4)]`;
            case "done":
                return `${base} bg-aurora/15 border border-aurora/30 text-aurora text-sm`;
            default:
                return `${base} bg-white/5 border border-white/10 text-mist`;
        }
    };

    const itemClass = (state: "done" | "active" | "pending" | "locked"): string => {
        const base = "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors border";
        switch (state) {
            case "active":
                return `${base} bg-aurora/8 border-aurora/20 cursor-pointer`;
            case "done":
                return `${base} border-white/10 bg-white/[0.03] opacity-80 cursor-pointer hover:border-aurora/15 hover:bg-aurora/[0.03]`;
            case "pending":
                return `${base} border-white/10 bg-white/[0.03] cursor-pointer hover:border-white/15`;
            default:
                return `${base} border-white/8 bg-white/[0.02] opacity-45 cursor-not-allowed`;
        }
    };

    return (
        <div className="flex flex-col gap-1 mb-7">
            {STEPS.map((step) => {
                const state = getItemState(step.number);
                return (
                    <div
                        key={step.number}
                        className={itemClass(state)}
                        onClick={() => handleClick(step)}
                        role="button"
                        tabIndex={state === "locked" ? -1 : 0}
                        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                            if (e.key === "Enter") handleClick(step);
                        }}
                    >
                        <div className={circleClass(state)}>
                            {state === "done" ? "✓" : step.number}
                        </div>
                        <div>
                            <div
                                className={`text-sm font-semibold ${state === "active" ? "text-aurora" : "text-white-soft"}`}
                            >
                                {step.title}
                            </div>
                            <div className="text-xs text-mist mt-0.5">{step.sub}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StepsNav;
