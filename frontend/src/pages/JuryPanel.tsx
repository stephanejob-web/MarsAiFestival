import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./JuryPanel.css";

type Decision = "valide" | "aRevoir" | "refuse" | null;
type ListTab = "pending" | "evaluated" | "all";

interface JuryFilm {
    id: number;
    title: string;
    author: string;
    country: string;
    duration: string;
    format: string;
    subtitles: string;
    copyright: string;
    tools: string;
    iaScenario: string;
    iaImage: string;
    iaPost: string;
    note: string;
    myDecision: Decision;
    comments: string[];
}

const INITIAL_FILMS: JuryFilm[] = [
    {
        id: 1,
        title: "Reves de Silicium",
        author: "Lea Fontaine",
        country: "France",
        duration: "00:59.8",
        format: "MP4 1080p",
        subtitles: "FR",
        copyright: "Verifie",
        tools: "Runway ML, Sora, MusicGen",
        iaScenario: "ChatGPT-4o, Claude",
        iaImage: "Runway Gen-3, Sora",
        iaPost: "MusicGen, ElevenLabs",
        note: "Film sur la memoire humaine et l apprentissage machine.",
        myDecision: "valide",
        comments: [
            "Tres belle utilisation de l IA.",
            "Rythme solide et proposition visuelle forte.",
        ],
    },
    {
        id: 2,
        title: "L Enfant Pixel",
        author: "Amira Ben Said",
        country: "Tunisie",
        duration: "01:02.1",
        format: "MP4 4K",
        subtitles: "FR EN",
        copyright: "Verifie",
        tools: "Pika Labs, Udio",
        iaScenario: "GPT-4o",
        iaImage: "Pika Labs 1.5",
        iaPost: "Udio, Premiere Pro",
        note: "Exploration poetique de l enfance dans un monde synthetique.",
        myDecision: "aRevoir",
        comments: ["Tres fort esthetiquement mais fin a clarifier."],
    },
    {
        id: 3,
        title: "Memoire Vive",
        author: "Carlos Ruiz",
        country: "Espagne",
        duration: "01:28.0",
        format: "MOV 1080p",
        subtitles: "FR",
        copyright: "Verifie",
        tools: "Midjourney, ElevenLabs",
        iaScenario: "Gemini",
        iaImage: "Midjourney v6",
        iaPost: "ElevenLabs, Runway",
        note: "Transposition des souvenirs humains dans une IA narrative.",
        myDecision: null,
        comments: [],
    },
    {
        id: 4,
        title: "Frontieres Douces",
        author: "Omar Diallo",
        country: "Senegal",
        duration: "01:30.0",
        format: "MP4 1080p",
        subtitles: "FR",
        copyright: "A verifier",
        tools: "Suno AI, ElevenLabs",
        iaScenario: "Mistral",
        iaImage: "Aucun",
        iaPost: "Suno AI, ElevenLabs",
        note: "Experience sonore immersive sur les frontieres culturelles.",
        myDecision: "refuse",
        comments: ["Ne correspond pas assez aux criteres image IA."],
    },
    {
        id: 5,
        title: "Signal Perdu",
        author: "Aya Tanaka",
        country: "Japon",
        duration: "01:00.0",
        format: "MP4 1080p",
        subtitles: "FR",
        copyright: "Verifie",
        tools: "Pika Labs, Udio",
        iaScenario: "GPT-4o",
        iaImage: "Pika Labs",
        iaPost: "Udio",
        note: "Un signal emerge du bruit numerique et reconstruit une ville.",
        myDecision: null,
        comments: [],
    },
];

const DECISION_LABEL: Record<Exclude<Decision, null>, string> = {
    valide: "Valide",
    aRevoir: "A revoir",
    refuse: "Refuse",
};

const DECISION_CHIP_CLASS: Record<Exclude<Decision, null>, string> = {
    valide: "jury-chip-valide",
    aRevoir: "jury-chip-arevoir",
    refuse: "jury-chip-refuse",
};

const JuryPanel = (): React.JSX.Element => {
    const [films, setFilms] = useState<JuryFilm[]>(INITIAL_FILMS);
    const [activeFilmId, setActiveFilmId] = useState<number>(INITIAL_FILMS[0].id);
    const [activeTab, setActiveTab] = useState<ListTab>("pending");
    const [commentDraft, setCommentDraft] = useState<string>("");

    const pendingCount = useMemo(
        () => films.filter((film) => film.myDecision === null).length,
        [films],
    );
    const evaluatedCount = useMemo(
        () => films.filter((film) => film.myDecision !== null).length,
        [films],
    );
    const discussCount = useMemo(
        () => films.filter((film) => film.myDecision === "aRevoir").length,
        [films],
    );

    const filteredFilms = useMemo(() => {
        if (activeTab === "pending") {
            return films.filter((film) => film.myDecision === null);
        }

        if (activeTab === "evaluated") {
            return films.filter((film) => film.myDecision !== null);
        }

        return films;
    }, [films, activeTab]);

    const activeFilm = useMemo(() => {
        const found = films.find((film) => film.id === activeFilmId);
        return found ?? films[0];
    }, [films, activeFilmId]);

    const progress = Math.round((evaluatedCount / films.length) * 100);

    const handleDecision = (decision: Exclude<Decision, null>): void => {
        setFilms((prev) =>
            prev.map((film) => {
                if (film.id !== activeFilm.id) {
                    return film;
                }

                return {
                    ...film,
                    myDecision: decision,
                };
            }),
        );
    };

    const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const content = commentDraft.trim();
        if (!content) {
            return;
        }

        setFilms((prev) =>
            prev.map((film) => {
                if (film.id !== activeFilm.id) {
                    return film;
                }

                return {
                    ...film,
                    comments: [...film.comments, content],
                };
            }),
        );
        setCommentDraft("");
    };

    return (
        <section className="jury-panel-page">
            <div className="jury-panel-shell">
                <aside className="jury-sidebar">
                    <div className="jury-brand">
                        mars<span>AI</span>
                    </div>

                    <div className="jury-id">
                        <div className="jury-id-name">Marie Lefebvre</div>
                        <div className="jury-id-role">Presidente du jury</div>
                    </div>

                    <div className="jury-nav-group">
                        <div className="jury-nav-label">Evaluation</div>
                        <button
                            type="button"
                            className={`jury-nav-btn ${activeTab === "pending" ? "jury-nav-btn-active" : ""}`}
                            onClick={() => setActiveTab("pending")}
                        >
                            <span>Films assignes</span>
                            <span>{pendingCount}</span>
                        </button>
                        <button
                            type="button"
                            className={`jury-nav-btn ${activeTab === "evaluated" ? "jury-nav-btn-active" : ""}`}
                            onClick={() => setActiveTab("evaluated")}
                        >
                            <span>Evalues</span>
                            <span>{evaluatedCount}</span>
                        </button>
                        <button type="button" className="jury-nav-btn">
                            <span>A discuter</span>
                            <span>{discussCount}</span>
                        </button>
                    </div>

                    <div className="jury-progress">
                        <div className="jury-progress-label">Progression personnelle</div>
                        <div className="jury-progress-bar">
                            <div className="jury-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="jury-progress-val">
                            {evaluatedCount} / {films.length} filmes evalues
                        </div>
                    </div>
                </aside>

                <section className="jury-main">
                    <header className="jury-topbar">
                        <div>
                            <h1>Films a evaluer</h1>
                            <p>Evaluation individuelle puis deliberation collective</p>
                        </div>
                        <div className="jury-topbar-actions">
                            <span className="jury-phase">Phase 1 - Top 50</span>
                            <Link to="/jury" className="jury-link">
                                Deconnexion
                            </Link>
                        </div>
                    </header>

                    <div className="jury-content">
                        <div className="jury-list">
                            <div className="jury-tabs">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("pending")}
                                    className={`jury-tab-btn ${activeTab === "pending" ? "jury-tab-btn-active" : ""}`}
                                >
                                    A evaluer ({pendingCount})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("evaluated")}
                                    className={`jury-tab-btn ${activeTab === "evaluated" ? "jury-tab-btn-active" : ""}`}
                                >
                                    Evalues ({evaluatedCount})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("all")}
                                    className={`jury-tab-btn ${activeTab === "all" ? "jury-tab-btn-active" : ""}`}
                                >
                                    Tous ({films.length})
                                </button>
                            </div>

                            <div className="jury-film-items">
                                {filteredFilms.map((film) => (
                                    <button
                                        key={film.id}
                                        type="button"
                                        onClick={() => setActiveFilmId(film.id)}
                                        className={`jury-film-item ${activeFilm.id === film.id ? "jury-film-item-selected" : ""}`}
                                    >
                                        <div className="jury-film-title">{film.title}</div>
                                        <div className="jury-film-sub">
                                            {film.author} - {film.country}
                                        </div>
                                        {film.myDecision ? (
                                            <span
                                                className={`jury-chip ${DECISION_CHIP_CLASS[film.myDecision]}`}
                                            >
                                                {DECISION_LABEL[film.myDecision]}
                                            </span>
                                        ) : (
                                            <span className="jury-chip jury-chip-none">
                                                En attente
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <article className="jury-detail">
                            <div className="jury-player">Lecteur video jury (preview)</div>

                            <div className="jury-head">
                                <div>
                                    <h2>{activeFilm.title}</h2>
                                    <div className="jury-meta">
                                        {activeFilm.author} - {activeFilm.country}
                                    </div>
                                    <div className="jury-tags">
                                        <span className="jury-tag">Image IA</span>
                                        <span className="jury-tag">{activeFilm.tools}</span>
                                    </div>
                                </div>
                                {activeFilm.myDecision ? (
                                    <span
                                        className={`jury-chip ${DECISION_CHIP_CLASS[activeFilm.myDecision]}`}
                                    >
                                        {DECISION_LABEL[activeFilm.myDecision]}
                                    </span>
                                ) : (
                                    <span className="jury-chip jury-chip-none">En attente</span>
                                )}
                            </div>

                            <div className="jury-grid">
                                <div className="jury-cell">
                                    <div className="jury-cell-label">Duree</div>
                                    <div className="jury-cell-value">{activeFilm.duration}</div>
                                </div>
                                <div className="jury-cell">
                                    <div className="jury-cell-label">Format</div>
                                    <div className="jury-cell-value">{activeFilm.format}</div>
                                </div>
                                <div className="jury-cell">
                                    <div className="jury-cell-label">Sous-titres</div>
                                    <div className="jury-cell-value">{activeFilm.subtitles}</div>
                                </div>
                                <div className="jury-cell">
                                    <div className="jury-cell-label">Copyright</div>
                                    <div className="jury-cell-value">{activeFilm.copyright}</div>
                                </div>
                            </div>

                            <section className="jury-card">
                                <h3>Fiche IA</h3>
                                <p className="jury-tools">Scenario: {activeFilm.iaScenario}</p>
                                <p className="jury-tools">Image/Video: {activeFilm.iaImage}</p>
                                <p className="jury-tools">Post-production: {activeFilm.iaPost}</p>
                            </section>

                            <section className="jury-card">
                                <h3>Note creative</h3>
                                <p className="jury-note">{activeFilm.note}</p>
                            </section>

                            <section className="jury-card">
                                <h3>Decision du jury</h3>
                                <div className="jury-decision-actions">
                                    <button
                                        type="button"
                                        onClick={() => handleDecision("valide")}
                                        className={`jury-decision-btn ${activeFilm.myDecision === "valide" ? "jury-decision-btn-active" : ""}`}
                                    >
                                        Valider
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDecision("aRevoir")}
                                        className={`jury-decision-btn ${activeFilm.myDecision === "aRevoir" ? "jury-decision-btn-active" : ""}`}
                                    >
                                        A discuter
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDecision("refuse")}
                                        className={`jury-decision-btn ${activeFilm.myDecision === "refuse" ? "jury-decision-btn-active" : ""}`}
                                    >
                                        Refuser
                                    </button>
                                </div>
                            </section>

                            <section className="jury-card">
                                <h3>Commentaires du jury</h3>
                                {activeFilm.comments.length > 0 ? (
                                    <ul className="jury-comment-list">
                                        {activeFilm.comments.map((comment) => (
                                            <li key={comment}>{comment}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="jury-tools">Aucun commentaire pour ce film.</p>
                                )}

                                <form className="jury-comment-form" onSubmit={handleCommentSubmit}>
                                    <input
                                        type="text"
                                        value={commentDraft}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                            setCommentDraft(e.target.value)
                                        }
                                        className="jury-comment-input"
                                        placeholder="Ajouter un commentaire"
                                    />
                                    <button type="submit" className="jury-comment-btn">
                                        Envoyer
                                    </button>
                                </form>
                            </section>
                        </article>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default JuryPanel;
