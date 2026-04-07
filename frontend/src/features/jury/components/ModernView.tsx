import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Clock,
    Send,
    Settings,
    User,
    X,
} from "lucide-react";

import type { UseJuryPanelReturn } from "../hooks/useJuryPanel";
import useJuryUser from "../hooks/useJuryUser";
import type { JuryFilm } from "../types";

// ── Sub-component: video thumbnail via paused video frame ─────────────────────

interface FilmThumbnailProps {
    film: JuryFilm;
    isActive: boolean;
    onClick: () => void;
}

const FilmThumbnail = ({ film, isActive, onClick }: FilmThumbnailProps): React.JSX.Element => {
    const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !film.videoUrl) return;

        const handleLoadedData = (): void => {
            video.currentTime = 2;
        };

        const handleSeeked = (): void => {
            setIsVideoReady(true);
        };

        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("seeked", handleSeeked);

        return (): void => {
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("seeked", handleSeeked);
        };
    }, [film.videoUrl]);

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
            {film.videoUrl && (
                <video
                    ref={videoRef}
                    src={film.videoUrl}
                    preload="metadata"
                    muted
                    playsInline
                    className={`w-full h-full object-cover transition-opacity ${
                        isVideoReady
                            ? isActive
                                ? "opacity-100"
                                : "opacity-60 hover:opacity-100"
                            : "opacity-0"
                    }`}
                />
            )}
            {!isVideoReady && (
                <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-800 flex items-end p-2">
                    <span className="text-[10px] text-slate-300 truncate block w-full">
                        {film.title}
                    </span>
                </div>
            )}
            {isActive && (
                <div className="absolute bottom-0 w-full bg-linear-to-t from-black/80 to-transparent p-2">
                    <span className="text-[10px] font-medium text-white truncate block">
                        {film.title}
                    </span>
                </div>
            )}
            {film.myDecision !== null && (
                <div
                    className={`absolute bottom-1 left-1 w-4 h-4 rounded-full flex items-center justify-center ${decisionColor}`}
                >
                    <Check size={8} className="text-white" />
                </div>
            )}
            {film.comments.length > 0 && (
                <div className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">{film.comments.length}</span>
                </div>
            )}
        </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────

type EvalVariant = "classic" | "modern";

interface ModernViewProps {
    panel: UseJuryPanelReturn;
    onEvalVariantChange: (v: EvalVariant) => void;
}

const ModernView = ({ panel, onEvalVariantChange }: ModernViewProps): React.JSX.Element => {
    const user = useJuryUser();
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

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
            {/* Background video */}
            {activeFilm.videoUrl && (
                <video
                    key={activeFilm.id}
                    src={activeFilm.videoUrl}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
            )}
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
                    <div className="flex items-center rounded-lg border border-white/10 bg-black/30 backdrop-blur-sm p-0.5">
                        <button
                            type="button"
                            onClick={() => onEvalVariantChange("classic")}
                            className="rounded-md px-3 py-1 text-[0.72rem] font-semibold text-slate-400 hover:text-white transition-all"
                        >
                            EvalView
                        </button>
                        <div className="rounded-md px-3 py-1 text-[0.72rem] font-semibold bg-white/15 text-white shadow-sm">
                            ModernView
                        </div>
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

            {/* Main */}
            <main className="relative z-10 grow flex flex-col items-center justify-center px-4 pb-4 -mt-10 overflow-y-auto">
                <h1
                    className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight text-white mb-3 text-center"
                    style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
                >
                    {activeFilm.title}
                </h1>
                <div className="text-lg md:text-xl text-slate-200 font-light tracking-wide mb-8 text-center">
                    {activeFilm.author} &bull; {activeFilm.country} &bull; {activeFilm.year}
                </div>

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

                {/* Details panel */}
                {isDetailsOpen && (
                    <div className="mt-4 max-w-2xl w-full bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">
                                IA Scénario
                            </span>
                            <span className="text-slate-200">{activeFilm.iaScenario}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">
                                IA Image
                            </span>
                            <span className="text-slate-200">{activeFilm.iaImage}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">
                                IA Post-prod
                            </span>
                            <span className="text-slate-200">{activeFilm.iaPost}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">
                                Outils
                            </span>
                            <span className="text-slate-200">{activeFilm.tools}</span>
                        </div>
                        {activeFilm.note && (
                            <div className="flex flex-col col-span-2">
                                <span className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">
                                    Note créative
                                </span>
                                <span className="text-slate-200">{activeFilm.note}</span>
                            </div>
                        )}
                        <div className="col-span-2 border-t border-white/10 pt-3 mt-1">
                            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                                Réalisateur·rice
                            </span>
                        </div>
                        {activeFilm.realisator.email && (
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 mb-0.5">Email</span>
                                <span className="text-slate-200">
                                    {activeFilm.realisator.email}
                                </span>
                            </div>
                        )}
                        {activeFilm.realisator.profession && (
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 mb-0.5">Profession</span>
                                <span className="text-slate-200">
                                    {activeFilm.realisator.profession}
                                </span>
                            </div>
                        )}
                        {activeFilm.realisator.city && (
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 mb-0.5">Ville</span>
                                <span className="text-slate-200">
                                    {activeFilm.realisator.city}
                                    {activeFilm.realisator.postalCode
                                        ? ` (${activeFilm.realisator.postalCode})`
                                        : ""}
                                </span>
                            </div>
                        )}
                        {activeFilm.realisator.country && (
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 mb-0.5">Pays</span>
                                <span className="text-slate-200">
                                    {activeFilm.realisator.country}
                                </span>
                            </div>
                        )}
                        {activeFilm.realisator.phone && (
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 mb-0.5">Téléphone</span>
                                <span className="text-slate-200">
                                    {activeFilm.realisator.phone}
                                </span>
                            </div>
                        )}
                        {activeFilm.realisator.instagram && (
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 mb-0.5">Instagram</span>
                                <span className="text-slate-200">
                                    {activeFilm.realisator.instagram}
                                </span>
                            </div>
                        )}
                        {activeFilm.realisator.youtube && (
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 mb-0.5">YouTube</span>
                                <span className="text-slate-200">
                                    {activeFilm.realisator.youtube}
                                </span>
                            </div>
                        )}
                        {activeFilm.realisator.linkedin && (
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 mb-0.5">LinkedIn</span>
                                <span className="text-slate-200">
                                    {activeFilm.realisator.linkedin}
                                </span>
                            </div>
                        )}
                        {activeFilm.realisator.xtwitter && (
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 mb-0.5">X / Twitter</span>
                                <span className="text-slate-200">
                                    {activeFilm.realisator.xtwitter}
                                </span>
                            </div>
                        )}
                        {activeFilm.realisator.facebook && (
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 mb-0.5">Facebook</span>
                                <span className="text-slate-200">
                                    {activeFilm.realisator.facebook}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Floating evaluation panel */}
            <section className="absolute bottom-40 right-8 z-20 w-120">
                <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
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
                            Mon commentaire (visible par tout le jury)
                        </label>
                        <textarea
                            id="modern-comment"
                            rows={3}
                            value={panel.notationComment}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                panel.setNotationComment(e.target.value)
                            }
                            placeholder="Votre avis sur ce film..."
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

            {/* Bottom carousel */}
            <footer className="absolute bottom-0 left-0 w-full px-4 pt-4 z-20">
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
            </footer>
        </div>
    );
};

export default ModernView;
