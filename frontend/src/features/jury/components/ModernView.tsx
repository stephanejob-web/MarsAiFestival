import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Clapperboard,
    Clock,
    LayoutList,
    Maximize2,
    Minimize2,
    Send,
    Settings,
    User,
    X,
    Zap,
} from "lucide-react";

import type { UseJuryPanelReturn } from "../hooks/useJuryPanel";
import useFilmPlayer from "../hooks/useFilmPlayer";
import useJuryUser from "../hooks/useJuryUser";
import type { JuryFilm } from "../types";
import { FilmCommentsBadge } from "./ModalMyComments";

// ── Sub-component: poster thumbnail (no video preloading) ────────────────────

interface FilmThumbnailProps {
    film: JuryFilm;
    isActive: boolean;
    onClick: () => void;
}

const FilmThumbnail = ({ film, isActive, onClick }: FilmThumbnailProps): React.JSX.Element => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === "Enter" || e.key === " ") onClick();
    };

    const decisionColor =
        film.myDecision === "valide"
            ? "bg-green-500"
            : film.myDecision === "refuse"
              ? "bg-red-500"
              : film.myDecision === "aRevoir"
                ? "bg-yellow-500"
                : "bg-blue-500";

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            className={`relative w-40 h-24 shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all snap-center ${
                isActive
                    ? "border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                    : "border border-transparent hover:border-slate-500"
            }`}
        >
            {/* Poster image ou gradient — aucune requête vidéo */}
            {film.posterImg ? (
                <img
                    src={film.posterImg}
                    alt={film.title}
                    className={`w-full h-full object-cover transition-opacity ${
                        isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                    }`}
                    loading="lazy"
                />
            ) : (
                <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-800" />
            )}

            {/* Overlay bas */}
            <div className="absolute bottom-0 w-full bg-linear-to-t from-black/80 to-transparent p-2">
                <span className="text-[10px] font-medium text-white truncate block">
                    {film.title}
                </span>
            </div>

            {/* Badge décision */}
            {film.myDecision !== null && (
                <div
                    className={`absolute bottom-1 left-1 w-4 h-4 rounded-full flex items-center justify-center ${decisionColor}`}
                >
                    <Check size={8} className="text-white" />
                </div>
            )}
            <FilmCommentsBadge film={film} />
        </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────

type EvalVariant = "classic" | "modern" | "rapide";

interface ModernViewProps {
    panel: UseJuryPanelReturn;
    onEvalVariantChange: (v: EvalVariant) => void;
}

const ModernView = ({ panel, onEvalVariantChange }: ModernViewProps): React.JSX.Element => {
    const user = useJuryUser();
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    const [isFooterOpen, setIsFooterOpen] = useState<boolean>(true);
    const [isWatchingFilm, setIsWatchingFilm] = useState<boolean>(false);
    const {
        videoRef: playerRef,
        handlePlay,
        handlePause,
        handleEnded,
    } = useFilmPlayer({ startMuted: false });

    const isDragging = useRef<boolean>(false);
    const dragStartX = useRef<number>(0);
    const dragScrollLeft = useRef<number>(0);

    const sortedFilms = useMemo<JuryFilm[]>(() => {
        const decided = panel.films.filter((f) => f.myDecision !== null);
        const pending = panel.films.filter((f) => f.myDecision === null);
        return [...decided, ...pending];
    }, [panel.films]);

    useEffect(() => {
        const container = carouselRef.current;
        if (!container) return;
        const activeIndex = sortedFilms.findIndex((f) => f.id === panel.activeFilmId);
        if (activeIndex < 0) return;
        const thumbWidth = 172;
        const targetScroll = activeIndex * thumbWidth - container.clientWidth / 2 + thumbWidth / 2;
        container.scrollTo({ left: targetScroll, behavior: "smooth" });
    }, [panel.activeFilmId, sortedFilms]);

    const scrollCarousel = useCallback((direction: "left" | "right"): void => {
        const container = carouselRef.current;
        if (!container) return;
        container.scrollBy({ left: direction === "right" ? 340 : -340, behavior: "smooth" });
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
        const container = carouselRef.current;
        if (!container) return;
        isDragging.current = true;
        dragStartX.current = e.pageX - container.offsetLeft;
        dragScrollLeft.current = container.scrollLeft;
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
        if (!isDragging.current || !carouselRef.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - dragStartX.current) * 1.5;
        carouselRef.current.scrollLeft = dragScrollLeft.current - walk;
    }, []);

    const handleMouseUp = useCallback((): void => {
        isDragging.current = false;
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>): void => {
        if (!carouselRef.current) return;
        carouselRef.current.scrollLeft += e.deltaY;
    }, []);

    const toggleDetails = (): void => setIsDetailsOpen((v) => !v);

    const { activeFilm } = panel;

    if (panel.isLoadingFilms) {
        return (
            <div className="flex flex-1 items-center justify-center bg-slate-900">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
            </div>
        );
    }

    if (panel.films.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center bg-slate-900">
                <div className="text-sm text-slate-400">Aucun film assigné</div>
            </div>
        );
    }

    return (
        <div className="relative flex-1 overflow-hidden bg-slate-900 flex flex-col">
            {/* Background video — film actif uniquement, muet en fond */}
            {activeFilm.videoUrl ? (
                <video
                    key={activeFilm.id}
                    src={activeFilm.videoUrl}
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700"
                    style={{ animation: "bgFadeIn 0.8s ease-out" }}
                />
            ) : activeFilm.posterImg ? (
                <img
                    key={activeFilm.id}
                    src={activeFilm.posterImg}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover z-0 blur-sm scale-105"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 z-0" />
            )}
            <style>{`
                @keyframes bgFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
            `}</style>
            <div className="absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-900/60 to-slate-900/90 z-1" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-4 shrink-0">
                <div className="flex items-center gap-3 cursor-pointer group">
                    {user?.profilPicture ? (
                        <img
                            src={user.profilPicture}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full border border-slate-600 object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full border border-slate-600 bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-200">
                            {user?.initials ?? "?"}
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="font-medium text-sm text-slate-200">
                                {user?.fullName ?? "Jury"}
                            </span>
                            <ChevronDown
                                size={14}
                                className="text-slate-400 group-hover:text-white transition-colors"
                            />
                        </div>
                        <span className="text-xs text-slate-400">
                            {user?.roleLabel ?? "Membre du Jury"}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-black/30 backdrop-blur-sm p-1">
                        <button
                            type="button"
                            onClick={() => onEvalVariantChange("classic")}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold text-slate-400 hover:text-slate-200 transition-all duration-200"
                        >
                            <LayoutList size={12} />
                            Liste
                        </button>
                        <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold bg-aurora/20 text-aurora shadow-[0_1px_12px_rgba(100,220,200,0.25)]">
                            <Clapperboard size={12} />
                            Cinéma
                        </div>
                        <button
                            type="button"
                            onClick={() => onEvalVariantChange("rapide")}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold text-slate-400 hover:text-amber-400/70 transition-all duration-200"
                        >
                            <Zap size={12} />
                            Rapide
                        </button>
                    </div>
                    <button
                        type="button"
                        aria-label="Compte utilisateur"
                        className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 transition-colors"
                    >
                        <User size={18} className="text-slate-300" />
                    </button>
                    <button
                        type="button"
                        aria-label="Paramètres"
                        className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 transition-colors"
                    >
                        <Settings size={18} className="text-slate-300" />
                    </button>
                </div>
            </header>

            {/* Fullscreen film player */}
            {isWatchingFilm && (
                <div className="absolute inset-0 z-30 bg-black flex items-center justify-center">
                    {/* Bouton fermer */}
                    <button
                        type="button"
                        onClick={() => setIsWatchingFilm(false)}
                        aria-label="Quitter le plein écran"
                        className="absolute top-4 right-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 text-white/70 hover:text-white text-xs font-medium transition-all"
                    >
                        <Minimize2 size={13} />
                        Quitter
                    </button>
                    <video
                        ref={playerRef}
                        key={activeFilm.id}
                        src={activeFilm.videoUrl ?? undefined}
                        autoPlay
                        controls
                        preload="auto"
                        className="w-full h-full object-contain"
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onEnded={() => {
                            handleEnded();
                            setIsWatchingFilm(false);
                        }}
                    />
                </div>
            )}

            {/* Main */}
            <main className="relative z-10 grow flex flex-col items-center px-4 pb-52 overflow-y-auto justify-center">
                <h1
                    className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight text-white mb-3 text-center"
                    style={{ textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}
                >
                    {activeFilm.title}
                </h1>
                <div className="text-lg md:text-xl text-slate-200 font-light tracking-wide mb-6 text-center">
                    {activeFilm.author} &bull; {activeFilm.country} &bull; {activeFilm.year}
                </div>

                {/* Bouton plein écran discret */}
                {activeFilm.videoUrl && (
                    <button
                        type="button"
                        onClick={() => setIsWatchingFilm(true)}
                        aria-label="Voir en plein écran"
                        className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 text-white/60 hover:text-white text-xs font-medium transition-all hover:scale-105"
                    >
                        <Maximize2 size={13} />
                        Plein écran
                    </button>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-8 md:gap-14 text-center mb-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                            Durée
                        </span>
                        <span className="text-xl text-slate-100">{activeFilm.duration}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                            Format
                        </span>
                        <span className="text-xl text-slate-100">{activeFilm.format}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                            Sous-titres
                        </span>
                        <span
                            className={`text-xl ${activeFilm.subtitles === "—" ? "text-slate-500" : "text-slate-100"}`}
                        >
                            {activeFilm.subtitles}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                            Copyright
                        </span>
                        <span className="text-xl text-emerald-400 font-medium">
                            {activeFilm.copyright}
                        </span>
                    </div>
                </div>

                {/* Details toggle */}
                <button
                    type="button"
                    onClick={toggleDetails}
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors mt-2"
                >
                    {isDetailsOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    <span>{isDetailsOpen ? "Masquer les détails" : "Voir tous les détails"}</span>
                </button>
            </main>

            {/* ── Drawer latéral détails ─────────────────────────────────────── */}
            {/* Backdrop */}
            <div
                className={`absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
                    isDetailsOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={toggleDetails}
                aria-hidden="true"
            />

            {/* Drawer */}
            <aside
                className={`absolute top-0 right-0 h-full w-full max-w-sm z-40 flex flex-col bg-slate-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-300 ease-in-out ${
                    isDetailsOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header drawer */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
                    <div>
                        <h2 className="text-sm font-semibold text-white truncate max-w-[200px]">
                            {activeFilm.title}
                        </h2>
                        <p className="text-[10px] text-slate-500 mt-0.5">{activeFilm.author}</p>
                    </div>
                    <button
                        type="button"
                        onClick={toggleDetails}
                        aria-label="Fermer"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Contenu scrollable */}
                <div
                    className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
                    style={{ scrollbarWidth: "none" }}
                >
                    {/* Film */}
                    <section>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
                            Film
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: "Durée", value: activeFilm.duration },
                                { label: "Format", value: activeFilm.format },
                                { label: "Sous-titres", value: activeFilm.subtitles },
                                { label: "Langue", value: activeFilm.country },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-slate-800/60 rounded-xl px-3 py-2.5">
                                    <span className="block text-[10px] text-slate-500 mb-1">
                                        {label}
                                    </span>
                                    <span className="text-slate-200 font-medium text-xs">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Intelligence artificielle */}
                    <section>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
                            Intelligence artificielle
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: "Scénario IA", value: activeFilm.iaScenario },
                                { label: "Image IA", value: activeFilm.iaImage },
                                { label: "Post-prod IA", value: activeFilm.iaPost },
                                { label: "Outils", value: activeFilm.tools },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-slate-800/60 rounded-xl px-3 py-2.5">
                                    <span className="block text-[10px] text-slate-500 mb-1">
                                        {label}
                                    </span>
                                    <span className="text-slate-200 font-medium text-xs">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {activeFilm.note && (
                            <div className="mt-2 bg-slate-800/40 rounded-xl px-3 py-2.5">
                                <span className="block text-[10px] text-slate-500 mb-1">
                                    Note créative
                                </span>
                                <span className="text-slate-200 text-xs leading-relaxed">
                                    {activeFilm.note}
                                </span>
                            </div>
                        )}
                    </section>

                    {/* Réalisateur */}
                    <section>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
                            Réalisateur·rice
                        </p>
                        <div className="space-y-2">
                            {[
                                { label: "Email", value: activeFilm.realisator.email },
                                { label: "Profession", value: activeFilm.realisator.profession },
                                {
                                    label: "Ville",
                                    value: activeFilm.realisator.city
                                        ? `${activeFilm.realisator.city}${activeFilm.realisator.postalCode ? ` (${activeFilm.realisator.postalCode})` : ""}`
                                        : null,
                                },
                                { label: "Pays", value: activeFilm.realisator.country },
                                { label: "Téléphone", value: activeFilm.realisator.phone },
                                { label: "Mobile", value: activeFilm.realisator.mobilePhone },
                            ]
                                .filter(({ value }) => !!value)
                                .map(({ label, value }) => (
                                    <div
                                        key={label}
                                        className="flex items-start justify-between gap-3 py-2 border-b border-white/[0.04]"
                                    >
                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0 pt-0.5">
                                            {label}
                                        </span>
                                        <span className="text-slate-200 text-xs text-right break-all">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </section>

                    {/* Réseaux sociaux */}
                    {[
                        { label: "Instagram", value: activeFilm.realisator.instagram },
                        { label: "YouTube", value: activeFilm.realisator.youtube },
                        { label: "LinkedIn", value: activeFilm.realisator.linkedin },
                        { label: "X / Twitter", value: activeFilm.realisator.xtwitter },
                        { label: "Facebook", value: activeFilm.realisator.facebook },
                    ].some(({ value }) => !!value) && (
                        <section>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
                                Réseaux sociaux
                            </p>
                            <div className="space-y-2">
                                {[
                                    { label: "Instagram", value: activeFilm.realisator.instagram },
                                    { label: "YouTube", value: activeFilm.realisator.youtube },
                                    { label: "LinkedIn", value: activeFilm.realisator.linkedin },
                                    { label: "X / Twitter", value: activeFilm.realisator.xtwitter },
                                    { label: "Facebook", value: activeFilm.realisator.facebook },
                                ]
                                    .filter(({ value }) => !!value)
                                    .map(({ label, value }) => (
                                        <div
                                            key={label}
                                            className="flex items-start justify-between gap-3 py-2 border-b border-white/[0.04]"
                                        >
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0 pt-0.5">
                                                {label}
                                            </span>
                                            <span className="text-slate-200 text-xs text-right break-all">
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    )}
                </div>
            </aside>

            {/* Floating evaluation panel with right-edge indicator */}
            <div className="absolute bottom-40 right-0 z-20 flex items-center group">
                <section className="pointer-events-none absolute right-full top-1/2 w-100 -translate-y-1/2 translate-x-full transition-transform duration-300 ease-in-out group-hover:pointer-events-auto group-hover:translate-x-0">
                    <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mr-1 shadow-2xl">
                        <div className="grid grid-cols-3 gap-3 mb-5">
                            <button
                                type="button"
                                onClick={() => panel.handleDecision("valide")}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all font-medium text-sm ${
                                    activeFilm.myDecision === "valide"
                                        ? "border-green-400 bg-green-900/50 text-green-400"
                                        : "border-white/10 bg-white/5 text-slate-400 hover:border-green-400/40 hover:bg-green-900/15 hover:text-green-400"
                                }`}
                            >
                                <Check size={15} />
                                Valider
                            </button>
                            <button
                                type="button"
                                onClick={() => panel.handleDecision("aRevoir")}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all font-medium text-sm ${
                                    activeFilm.myDecision === "aRevoir"
                                        ? "border-yellow-400 bg-yellow-900/50 text-yellow-400"
                                        : "border-white/10 bg-white/5 text-slate-400 hover:border-yellow-400/40 hover:bg-yellow-900/15 hover:text-yellow-400"
                                }`}
                            >
                                <Clock size={15} />À revoir
                            </button>
                            <button
                                type="button"
                                onClick={() => panel.handleDecision("refuse")}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all font-medium text-sm ${
                                    activeFilm.myDecision === "refuse"
                                        ? "border-red-400 bg-red-900/50 text-red-400"
                                        : "border-white/10 bg-white/5 text-slate-400 hover:border-red-400/40 hover:bg-red-900/15 hover:text-red-400"
                                }`}
                            >
                                <X size={15} />
                                Refuser
                            </button>
                        </div>
                        <div className="relative">
                            <label
                                htmlFor="modern-comment"
                                className="block text-xs text-slate-400 mb-2"
                            >
                                Note Personelle
                            </label>
                            <textarea
                                id="modern-comment"
                                rows={3}
                                value={panel.notationComment}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    panel.setNotationComment(e.target.value)
                                }
                                placeholder=""
                                className="w-full rounded-xl bg-slate-900/40 border border-white/10 focus:border-white/30 p-4 text-sm text-slate-200 placeholder-slate-500 resize-none outline-none transition-colors"
                            />
                            <div className="flex justify-end -mt-9.5 mr-2 relative z-10 pointer-events-none">
                                <button
                                    type="button"
                                    onClick={panel.handleCommentPublish}
                                    className="pointer-events-auto flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold py-1.5 px-4 rounded-lg shadow-lg transition-transform hover:scale-105 text-sm"
                                >
                                    <Send size={13} />
                                    Publier
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right-edge indicator tab */}
                <div className="flex flex-col items-center gap-2 py-5 px-1.5 bg-slate-800/80 backdrop-blur-sm border-y border-l border-white/15 rounded-l-xl cursor-pointer shadow-lg shrink-0 transition-all duration-300 group-hover:bg-slate-700/80 group-hover:border-white/30">
                    <ChevronLeft
                        size={12}
                        className="text-slate-300 group-hover:text-white transition-colors"
                    />
                    <div className="w-px h-8 bg-linear-to-b from-transparent via-slate-500/60 to-transparent group-hover:via-emerald-400/60 rounded-full transition-colors" />
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400/60 group-hover:bg-green-400/90 transition-colors" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 group-hover:bg-yellow-400/90 transition-colors" />
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400/60 group-hover:bg-red-400/90 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Bottom carousel */}
            <footer className="absolute bottom-0 left-0 w-full z-20">
                <div className="flex justify-center px-4">
                    <button
                        type="button"
                        onClick={() => setIsFooterOpen((v) => !v)}
                        aria-label={isFooterOpen ? "Masquer le carousel" : "Afficher le carousel"}
                        className="flex items-center gap-1.5 px-5 py-1 bg-slate-800/80 backdrop-blur-sm border border-b-0 border-white/15 rounded-t-xl text-slate-400 hover:text-white hover:bg-slate-700/80 transition-colors"
                    >
                        {isFooterOpen ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                    </button>
                </div>
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out px-4 ${isFooterOpen ? "max-h-48" : "max-h-0"}`}
                >
                    <div className="relative rounded-t-2xl overflow-hidden border border-white/10">
                        <div className="absolute inset-0 bg-slate-800/90 backdrop-blur-xl opacity-10" />
                        <div className="relative p-3 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => scrollCarousel("left")}
                                className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 border border-slate-700/50"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div
                                ref={carouselRef}
                                className="grow overflow-x-auto flex gap-3 snap-x cursor-grab active:cursor-grabbing select-none"
                                style={{ scrollbarWidth: "none" }}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onWheel={handleWheel}
                            >
                                {sortedFilms.map((film) => (
                                    <FilmThumbnail
                                        key={film.id}
                                        film={film}
                                        isActive={film.id === panel.activeFilmId}
                                        onClick={() => panel.setActiveFilmId(film.id)}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => scrollCarousel("right")}
                                className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 border border-slate-700/50"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ModernView;
