import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import videoAsset from "../../../assets/video.mp4";
import videoPlayback from "../../../assets/videoplayback.mp4";

interface Film {
    flag: string;
    author: string;
    title: string;
    country: string;
    synopsis: string;
    gradient: string;
}

interface FilmHeroProps {
    film: Film;
    videoSrc: string;
}

interface FilmCardProps {
    film: Film;
    filmIdx: number;
    isSelected: boolean;
    onSelect: () => void;
}

const getPosterArt = (idx: number): React.JSX.Element => {
    const arts: React.JSX.Element[] = [];
    return arts[idx % arts.length];
};

interface FilmStatic {
    flag: string;
    author: string;
    gradient: string;
}

const FILMS_STATIC: FilmStatic[] = [
    { flag: "🇫🇷", author: "Léa Fontaine", gradient: "from-aurora/60 via-[#0a1628]" },
    { flag: "🇺🇸", author: "Brad Pitt · Tom Cruise", gradient: "from-orange-600/60 via-[#1a0800]" },
    { flag: "🇯🇵", author: "Kenji Ito", gradient: "from-solar/50 via-[#1a1400]" },
    { flag: "🇪🇸", author: "Carlos Ruiz", gradient: "from-coral/60 via-[#280a0a]" },
    { flag: "🇮🇳", author: "Priya Mehta", gradient: "from-blue-500/60 via-[#0a1428]" },
    { flag: "🇸🇳", author: "Omar Diallo", gradient: "from-emerald-500/60 via-[#0a2814]" },
    { flag: "🇸🇪", author: "Sofia Ek", gradient: "from-pink-500/60 via-[#280a1e]" },
    { flag: "🇨🇳", author: "Lin Wei", gradient: "from-indigo-500/60 via-[#0a0a28]" },
    { flag: "🇧🇷", author: "Yuki Tanaka", gradient: "from-orange-500/60 via-[#281400]" },
    { flag: "🇩🇪", author: "Mia Schultz", gradient: "from-teal-500/60 via-[#0a2828]" },
    { flag: "🇰🇷", author: "Ji-young Park", gradient: "from-aurora/50 via-[#0a1e28]" },
    { flag: "🇧🇷", author: "Valentina Costa", gradient: "from-lavande/50 via-[#1e0a28]" },
    { flag: "🇲🇦", author: "Yasmine El Fassi", gradient: "from-solar/45 via-[#281e00]" },
    { flag: "🇺🇸", author: "Alex Chen", gradient: "from-coral/50 via-[#280a14]" },
    { flag: "🇮🇹", author: "Marco Ferretti", gradient: "from-blue-400/60 via-[#00141e]" },
    { flag: "🇳🇬", author: "Chioma Adeyemi", gradient: "from-emerald-400/60 via-[#001e0a]" },
    { flag: "🇷🇺", author: "Anastasia Volkov", gradient: "from-pink-400/60 via-[#1e0014]" },
    { flag: "🇦🇺", author: "Noah Williams", gradient: "from-indigo-400/60 via-[#00001e]" },
    { flag: "🇵🇱", author: "Maja Kowalski", gradient: "from-orange-400/60 via-[#1e0a00]" },
    { flag: "🇲🇽", author: "Diego Hernández", gradient: "from-teal-400/60 via-[#001e1e]" },
];

const VISIBLE_COUNT = 6;

const FilmHero = ({ film, videoSrc }: FilmHeroProps): React.JSX.Element => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { t } = useTranslation();

    useEffect((): void => {
        videoRef.current?.load();
        videoRef.current?.play().catch((): void => {});
    }, [videoSrc]);

    const handleWatch = (): void => {
        window.open(videoSrc, "_blank");
    };

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ height: "clamp(300px, 52vw, 520px)" }}
        >
            {/* Vidéo de fond — sans effet */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
            >
                <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Fondu bas uniquement pour lisibilité du texte */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Contenu */}
            <div className="absolute inset-0 flex flex-col justify-end px-12 pb-10 max-w-2xl [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-2 mb-4">
                    <span className="font-display font-black text-aurora text-base leading-none">
                        M
                    </span>
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">
                        Festival
                    </span>
                </div>

                <h3 className="font-display text-5xl lg:text-6xl font-black text-white leading-none mb-4">
                    {film.title}
                </h3>

                <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className="text-[#46d369] font-semibold text-sm">
                        {t("films.officialSelection")}
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/50 text-sm">2026</span>
                    {["IA", "60s", "4K"].map((tag) => (
                        <span
                            key={tag}
                            className="border border-white/30 text-white/50 font-mono text-[11px] px-1.5 py-px rounded-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <p className="text-white/55 text-sm mb-3">
                    {film.flag} <strong className="text-white/80">{film.author}</strong> ·{" "}
                    {film.country}
                </p>

                <p className="text-white/50 text-sm mb-6 leading-relaxed max-w-md line-clamp-2">
                    {film.synopsis}
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleWatch}
                        className="flex items-center gap-2 bg-white text-black font-bold text-sm px-7 py-2.5 rounded hover:bg-white/90 transition-colors"
                    >
                        <span aria-hidden="true">▶</span> {t("films.watch")}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FilmCard = ({ film, filmIdx, isSelected, onSelect }: FilmCardProps): React.JSX.Element => (
    <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>): void => {
            if (e.key === "Enter" || e.key === " ") onSelect();
        }}
        className="group flex-shrink-0 flex-1 min-w-0 cursor-pointer transition-transform duration-200 hover:scale-[1.05] hover:z-10 relative"
        aria-pressed={isSelected}
    >
        <div
            className={`aspect-video relative overflow-hidden rounded-sm transition-all duration-150 ${
                isSelected ? "ring-2 ring-white" : "hover:ring-1 hover:ring-white/40"
            }`}
        >
            {/* Affiche SVG */}
            {getPosterArt(filmIdx)}

            {/* Badge M */}
            <div className="absolute top-1.5 left-2 font-display font-black text-aurora text-xs leading-none select-none z-10">
                M
            </div>

            {/* Durée */}
            <span className="absolute top-1.5 right-2 font-mono text-[10px] text-white/55 bg-black/60 rounded px-1.5 py-px z-10">
                1:00
            </span>

            {/* Bouton play */}
            <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 z-10 ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
            >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xl">
                    <span className="text-black text-xs font-bold ml-0.5" aria-hidden="true">
                        ▶
                    </span>
                </div>
            </div>

            {/* Gradient bas */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/80 to-transparent z-10" />

            {/* Titre overlaid */}
            <div className="absolute bottom-1.5 left-2 right-2 z-10">
                <div className="text-white text-[11px] font-bold truncate drop-shadow">
                    {film.title}
                </div>
            </div>
        </div>

        {isSelected && (
            <div className="mt-2 px-0.5">
                <div className="font-mono text-[11px] text-white/40 truncate">
                    {film.flag} {film.country}
                </div>
            </div>
        )}
    </div>
);

const FilmsSection = (): React.JSX.Element => {
    const [selectedIdx, setSelectedIdx] = useState<number>(0);
    const [rowStart, setRowStart] = useState<number>(0);
    const { t } = useTranslation();

    const filmItems = t("films.items", { returnObjects: true }) as Record<
        string,
        { title: string; country: string; synopsis: string }
    >;

    const ALL_FILMS: Film[] = FILMS_STATIC.map((s, i) => ({
        flag: s.flag,
        author: s.author,
        gradient: s.gradient,
        title: filmItems[String(i)]?.title ?? "",
        country: filmItems[String(i)]?.country ?? "",
        synopsis: filmItems[String(i)]?.synopsis ?? "",
    }));

    const selectedFilm = ALL_FILMS[selectedIdx];
    const currentVideoSrc = selectedIdx % 2 === 0 ? videoAsset : videoPlayback;
    const canPrev = rowStart > 0;
    const canNext = rowStart + VISIBLE_COUNT < ALL_FILMS.length;
    const totalPages = Math.ceil(ALL_FILMS.length / VISIBLE_COUNT);
    const currentPage = Math.floor(rowStart / VISIBLE_COUNT);

    const handlePrev = (): void => {
        setRowStart((prev) => Math.max(0, prev - VISIBLE_COUNT));
    };

    const handleNext = (): void => {
        setRowStart((prev) => Math.min(ALL_FILMS.length - VISIBLE_COUNT, prev + VISIBLE_COUNT));
    };

    const handleSelect = (absoluteIdx: number): void => {
        setSelectedIdx(absoluteIdx);
    };

    return (
        <section id="films" className="bg-black">
            {/* Hero vidéo du film sélectionné */}
            <FilmHero film={selectedFilm} videoSrc={currentVideoSrc} />

            {/* Rangée de films */}
            <div className="pt-6 pb-10">
                {/* Label */}
                <div className="flex items-center gap-3 mb-4 px-12">
                    <span className="text-sm font-bold text-white">{t("films.competition")}</span>
                    <span className="font-mono text-xs text-aurora/70">{t("films.overline")}</span>
                </div>

                {/* Carousel */}
                <div className="relative group/row">
                    {/* Bouton gauche — Netflix style */}
                    <button
                        onClick={handlePrev}
                        disabled={!canPrev}
                        aria-label={t("films.prevLabel")}
                        className="absolute left-0 top-0 bottom-0 z-20 w-14 flex items-center justify-center bg-gradient-to-r from-black/90 via-black/50 to-transparent opacity-0 group-hover/row:opacity-100 disabled:!opacity-0 transition-opacity duration-200 focus-visible:outline-none"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-9 h-9 text-white drop-shadow-lg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    {/* Piste sliding — overflow-hidden clipping */}
                    <div className="overflow-hidden px-12">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                width: `${(ALL_FILMS.length / VISIBLE_COUNT) * 100}%`,
                                transform: `translateX(-${(rowStart / ALL_FILMS.length) * 100}%)`,
                            }}
                        >
                            {ALL_FILMS.map((film, i) => (
                                <div
                                    key={film.title}
                                    className="flex-shrink-0 px-1"
                                    style={{ width: `${100 / ALL_FILMS.length}%` }}
                                >
                                    <FilmCard
                                        film={film}
                                        filmIdx={i}
                                        isSelected={i === selectedIdx}
                                        onSelect={(): void => handleSelect(i)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bouton droit — Netflix style */}
                    <button
                        onClick={handleNext}
                        disabled={!canNext}
                        aria-label={t("films.nextLabel")}
                        className="absolute right-0 top-0 bottom-0 z-20 w-14 flex items-center justify-center bg-gradient-to-l from-black/90 via-black/50 to-transparent opacity-0 group-hover/row:opacity-100 disabled:!opacity-0 transition-opacity duration-200 focus-visible:outline-none"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-9 h-9 text-white drop-shadow-lg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>

                {/* Indicateurs de page */}
                <div className="flex justify-end gap-1 mt-3 px-12">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-0.5 rounded-full transition-all duration-300 ${
                                currentPage === i ? "w-5 bg-aurora" : "w-2 bg-white/25"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FilmsSection;
