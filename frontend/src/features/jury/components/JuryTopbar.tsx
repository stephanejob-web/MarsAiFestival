import React from "react";
import { Clapperboard, LayoutList, Zap } from "lucide-react";

type EvalVariant = "classic" | "modern" | "rapide";

interface JuryTopbarProps {
    evalVariant?: EvalVariant;
    onEvalVariantChange?: (v: EvalVariant) => void;
}

const JuryTopbar = ({ evalVariant, onEvalVariantChange }: JuryTopbarProps): React.JSX.Element => {
    const showVariantToggle = evalVariant !== undefined && onEvalVariantChange !== undefined;

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-end px-6 py-4">
            <div className="flex items-center gap-3">
                {showVariantToggle && (
                    <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-black/30 p-1 backdrop-blur-sm">
                        <button
                            type="button"
                            onClick={() => onEvalVariantChange("classic")}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold transition-all duration-200 ${
                                evalVariant === "classic"
                                    ? "bg-white/15 text-white shadow-[0_1px_8px_rgba(0,0,0,0.3)]"
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            <LayoutList size={12} />
                            Liste
                        </button>
                        <button
                            type="button"
                            onClick={() => onEvalVariantChange("modern")}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold transition-all duration-200 ${
                                evalVariant === "modern"
                                    ? "bg-aurora/20 text-aurora shadow-[0_1px_12px_rgba(100,220,200,0.25)]"
                                    : "text-slate-400 hover:text-aurora/70"
                            }`}
                        >
                            <Clapperboard size={12} />
                            Cinéma
                        </button>
                        <button
                            type="button"
                            onClick={() => onEvalVariantChange("rapide")}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold transition-all duration-200 ${
                                evalVariant === "rapide"
                                    ? "bg-amber-400/15 text-amber-300 shadow-[0_1px_12px_rgba(251,191,36,0.2)]"
                                    : "text-slate-400 hover:text-amber-400/70"
                            }`}
                        >
                            <Zap size={12} />
                            Rapide
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default JuryTopbar;
