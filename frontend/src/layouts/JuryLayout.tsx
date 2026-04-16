import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";

import JurySidebar from "../features/jury/components/JurySidebar";
import JuryTopbar from "../features/jury/components/JuryTopbar";
import type { ActiveView } from "../features/jury/types";
import type { ScreeningPayload } from "../features/jury/hooks/useScreening";

type EvalVariant = "classic" | "modern" | "rapide";

interface JuryLayoutProps {
    activeView: ActiveView;
    onViewChange: (view: ActiveView) => void;
    pendingCount: number;
    evaluatedCount: number;
    discussCount: number;
    progress: number;
    totalFilms: number;
    isChatOpen: boolean;
    onChatToggle: () => void;
    screening: ScreeningPayload | null;
    evalVariant?: EvalVariant;
    onEvalVariantChange?: (v: EvalVariant) => void;
    children: React.ReactNode;
}

const JuryLayout = ({
    activeView,
    onViewChange,
    pendingCount,
    evaluatedCount,
    discussCount,
    progress,
    totalFilms,
    isChatOpen,
    onChatToggle,
    screening,
    evalVariant,
    onEvalVariantChange,
    children,
}: JuryLayoutProps): React.JSX.Element => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

    useEffect(() => {
        document.body.style.overflow = mobileSidebarOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileSidebarOpen]);

    const handleViewChange = (view: ActiveView): void => {
        onViewChange(view);
        setMobileSidebarOpen(false);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Overlay mobile */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 md:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar — drawer sur mobile, statique sur desktop */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-full bg-surface transition-transform duration-300 sm:w-auto md:static md:z-40 md:bg-transparent ${
                    mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
            >
                <JurySidebar
                    activeView={activeView}
                    onViewChange={handleViewChange}
                    pendingCount={pendingCount}
                    evaluatedCount={evaluatedCount}
                    discussCount={discussCount}
                    progress={progress}
                    totalFilms={totalFilms}
                    isChatOpen={isChatOpen}
                    onChatToggle={onChatToggle}
                    screening={screening}
                />
            </div>

            {/* Zone principale */}
            <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Header : burger (mobile) + topbar */}
                <header className="relative z-30 flex shrink-0 items-center">
                    <button
                        type="button"
                        onClick={() => setMobileSidebarOpen(true)}
                        className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-black/30 text-mist/60 backdrop-blur-sm transition-colors hover:text-white-soft md:hidden"
                        aria-label="Ouvrir le menu"
                    >
                        <Menu size={18} />
                    </button>
                    <JuryTopbar
                        as="div"
                        evalVariant={evalVariant}
                        onEvalVariantChange={onEvalVariantChange}
                    />
                </header>

                {/* Contenu — sous le header */}
                <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
            </div>
        </div>
    );
};

export default JuryLayout;
