import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";

import type { ActiveView } from "../types";

type EvalVariant = "classic" | "modern";

interface JuryTopbarProps {
    activeView: ActiveView;
    onDisconnect: () => void;
    evalVariant?: EvalVariant;
    onEvalVariantChange?: (v: EvalVariant) => void;
}

interface ViewMeta {
    title: string;
    subtitle: string;
}

const VIEW_META: Record<ActiveView, ViewMeta> = {
    eval: {
        title: "Films à évaluer",
        subtitle: "Évaluation individuelle puis délibération collective",
    },
    listes: {
        title: "Mes listes",
        subtitle: "Films sélectionnés, rejetés, en attente",
    },
    discuter: {
        title: "À discuter",
        subtitle: "Films en révision collective",
    },
    delib: {
        title: "Délibération",
        subtitle: "Vote final du jury",
    },
    tinder: {
        title: "Vote rapide",
        subtitle: "Swipe pour voter sur les films un par un",
    },
    mobile: {
        title: "Application mobile",
        subtitle: "Votez depuis votre téléphone — rapide, fluide, intuitif",
    },
};

const JuryTopbar = ({
    activeView,
    onDisconnect,
    evalVariant,
    onEvalVariantChange,
}: JuryTopbarProps): React.JSX.Element => {
    const navigate = useNavigate();
    const meta = VIEW_META[activeView];
    const showVariantToggle =
        (activeView === "eval" || activeView === "tinder") &&
        evalVariant !== undefined &&
        onEvalVariantChange !== undefined;

    const handleDisconnect = (): void => {
        onDisconnect();
        navigate("/jury");
    };

    return (
        <div className="flex h-[52px] min-h-[52px] items-center gap-3.5 border-b border-white/6 bg-surface px-5">
            <span className="font-display text-[0.9rem] font-extrabold">{meta.title}</span>
            <div className="h-5 w-px bg-white/8" />
            <span className="text-[0.78rem] text-mist">{meta.subtitle}</span>
            <div className="ml-auto flex items-center gap-2.5">
                <span className="rounded-full border border-aurora/25 bg-aurora/10 px-3 py-1 text-[0.7rem] font-bold tracking-[0.04em] text-aurora">
                    Phase 1 · Top 50 · 12/12/26
                </span>
                {showVariantToggle && (
                    <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
                        <button
                            type="button"
                            onClick={() => onEvalVariantChange("classic")}
                            className={`rounded-md px-3 py-1 text-[0.72rem] font-semibold transition-all ${
                                evalVariant === "classic"
                                    ? "bg-white/15 text-white-soft shadow-sm"
                                    : "text-mist hover:text-white-soft"
                            }`}
                        >
                            EvalView
                        </button>
                        <button
                            type="button"
                            onClick={() => onEvalVariantChange("modern")}
                            className={`rounded-md px-3 py-1 text-[0.72rem] font-semibold transition-all ${
                                evalVariant === "modern"
                                    ? "bg-white/15 text-white-soft shadow-sm"
                                    : "text-mist hover:text-white-soft"
                            }`}
                        >
                            ModernView
                        </button>
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-white/12 bg-white/5 px-[13px] py-1.5 text-[0.78rem] font-semibold text-mist transition-all hover:bg-white/10 hover:text-white-soft"
                >
                    <ArrowLeft size={14} />
                    <span>Retour au site</span>
                </button>
                <button
                    type="button"
                    onClick={handleDisconnect}
                    className="flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-coral/25 bg-coral/8 px-[13px] py-1.5 text-[0.78rem] font-semibold text-coral transition-all hover:bg-coral/16"
                >
                    <LogOut size={14} />
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default JuryTopbar;
