import React from "react";
import { Clapperboard, LayoutList, Zap } from "lucide-react";

import type { UseJuryPanelReturn } from "../hooks/useJuryPanel";
import useVoteMode, { type VoteMode } from "../hooks/useVoteMode";
import type { Decision } from "../types";
import FilmDetail from "./FilmDetail";
import FilmList from "./FilmList";
import NotationPanel from "./NotationPanel";
import TinderView from "./TinderView";

// ── Segmented control ────────────────────────────────────────────────────────

interface VoteModeToggleProps {
    mode: VoteMode;
    onChange: (m: VoteMode) => void;
    pendingCount: number;
}

const VoteModeToggle = ({
    mode,
    onChange,
    pendingCount,
}: VoteModeToggleProps): React.JSX.Element => (
    <div className="relative flex p-1 rounded-xl bg-surface-2 border border-white/8">
        {/* Sliding background pill */}
        <div
            className="absolute top-1 bottom-1 rounded-lg transition-all duration-200 ease-out pointer-events-none"
            style={{
                left: mode === "normal" ? "4px" : "calc(50% + 2px)",
                right: mode === "normal" ? "calc(50% + 2px)" : "4px",
                background:
                    mode === "normal"
                        ? "rgba(255,255,255,0.07)"
                        : "linear-gradient(135deg, rgba(78,255,206,0.9) 0%, rgba(78,255,206,1) 100%)",
                boxShadow: mode === "rapide" ? "0 0 12px rgba(78,255,206,0.35)" : "none",
            }}
        />

        <button
            type="button"
            onClick={() => onChange("normal")}
            className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-lg text-[0.82rem] font-semibold transition-colors duration-200 w-1/2 justify-center ${
                mode === "normal" ? "text-white-soft" : "text-mist hover:text-white-soft"
            }`}
        >
            <LayoutList size={13} />
            Normal
        </button>

        <button
            type="button"
            onClick={() => onChange("rapide")}
            className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-lg text-[0.82rem] font-semibold transition-colors duration-200 w-1/2 justify-center ${
                mode === "rapide" ? "text-deep-sky" : "text-mist hover:text-white-soft"
            }`}
        >
            <Zap size={13} />
            Vote rapide
            {pendingCount > 0 && (
                <span
                    className={`font-mono text-[0.65rem] rounded-full px-1.5 py-0.5 leading-none transition-colors duration-200 ${
                        mode === "rapide"
                            ? "bg-deep-sky/20 text-deep-sky"
                            : "bg-coral/15 text-coral"
                    }`}
                >
                    {pendingCount}
                </span>
            )}
        </button>
    </div>
);

// ── EvalView ─────────────────────────────────────────────────────────────────

interface EvalViewProps {
    panel: UseJuryPanelReturn;
    onVoteDirect: (filmId: number, decision: Exclude<Decision, null>, message?: string) => void;
    showToast: (message: string) => void;
}

const EvalView = ({ panel, onVoteDirect, showToast }: EvalViewProps): React.JSX.Element => {
    const { mode, setMode, hasSeenIntro, markIntroSeen } = useVoteMode();

    const handlePublish = (): void => {
        panel.handleCommentPublish();
    };

    if (!panel.isLoadingFilms && panel.films.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <div className="mb-3 flex justify-center opacity-20">
                        <Clapperboard size={36} />
                    </div>
                    <div className="text-[0.9rem] font-semibold text-white-soft">
                        Aucun film assigné
                    </div>
                    <div className="mt-1 text-[0.78rem] text-mist">
                        L'administrateur n'a pas encore assigné de films à votre compte.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            {/* ── Mode toggle header ── */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/6 bg-surface px-5 py-2.5">
                <div className="text-[0.78rem] text-mist">
                    <span className="font-semibold text-white-soft">{panel.pendingCount}</span> film
                    {panel.pendingCount !== 1 ? "s" : ""} en attente
                </div>
                <VoteModeToggle mode={mode} onChange={setMode} pendingCount={panel.pendingCount} />
            </div>

            {/* ── Content ── */}
            {mode === "normal" ? (
                <div className="flex flex-1 overflow-hidden">
                    <FilmList
                        films={panel.films}
                        activeFilm={panel.activeFilm}
                        onSelectFilm={panel.setActiveFilmId}
                    />
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <FilmDetail film={panel.activeFilm} />
                        <NotationPanel
                            currentDecision={panel.activeFilm.myDecision}
                            notationComment={panel.notationComment}
                            onDecision={panel.handleDecision}
                            onNotationCommentChange={panel.setNotationComment}
                            onPublish={handlePublish}
                        />
                    </div>
                </div>
            ) : (
                <TinderView
                    films={panel.films}
                    onVoteDirect={onVoteDirect}
                    showToast={showToast}
                    skipIntro={hasSeenIntro}
                    onIntroComplete={markIntroSeen}
                />
            )}
        </div>
    );
};

export default EvalView;
