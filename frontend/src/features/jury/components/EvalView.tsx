import React from "react";

import type { UseJuryPanelReturn } from "../hooks/useJuryPanel";
import FilmDetail from "./FilmDetail";
import FilmList from "./FilmList";
import NotationPanel from "./NotationPanel";

interface EvalViewProps {
    panel: UseJuryPanelReturn;
}

const EvalView = ({ panel }: EvalViewProps): React.JSX.Element => {
    const handlePublish = (): void => {
        panel.handleCommentPublish();
    };

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
