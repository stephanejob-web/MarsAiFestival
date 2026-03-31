import React from "react";
import { Clapperboard } from "lucide-react";

import type { UseJuryPanelReturn } from "../hooks/useJuryPanel";
import type { VoteMode } from "../hooks/useVoteMode";
import FilmDetail from "./FilmDetail";
import FilmList from "./FilmList";
import NotationPanel from "./NotationPanel";
import FastVote from "./FastVote";

interface EvalViewProps {
    panel: UseJuryPanelReturn;
    voteMode: VoteMode;
}

const EvalView = ({ panel, voteMode }: EvalViewProps): React.JSX.Element => {
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

    if (voteMode === "rapide") {
        if (panel.isLoadingFilms) {
            return (
                <div className="flex flex-1 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
                </div>
            );
        }
        return <FastVote panel={panel} />;
    }

    return (
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
    );
};

export default EvalView;
