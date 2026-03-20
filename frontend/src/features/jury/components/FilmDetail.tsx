import React from "react";

import type { JuryComment, JuryFilm, JuryOpinion, VoteRow } from "../types";

interface FilmDetailProps {
    film: JuryFilm;
}

const OPINION_BADGE_CLASS: Record<JuryOpinion["badge"], string> = {
    like: "bg-aurora/10 text-aurora",
    discuss: "bg-lavande/10 text-lavande",
    pending: "bg-white/5 text-mist",
};

const OPINION_BADGE_LABEL: Record<JuryOpinion["badge"], string> = {
    like: "❤️ J'aime",
    discuss: "💬 À discuter",
    pending: "⏳ En attente",
};

const OPINION_AVATAR_CLASS: Record<JuryOpinion["color"], string> = {
    aurora: "bg-aurora/15 text-aurora",
    lavande: "bg-lavande/15 text-lavande",
    solar: "bg-solar/15 text-solar",
};

const VOTE_AVATAR_CLASS: Record<VoteRow["avatarVariant"], string> = {
    1: "bg-gradient-to-br from-aurora to-lavande text-deep-sky",
    2: "bg-gradient-to-br from-coral to-lavande text-white",
    3: "bg-gradient-to-br from-solar to-aurora text-deep-sky",
    4: "bg-white/8 text-mist",
};

const VOTE_DECISION_CLASS: Record<string, string> = {
    valide: "bg-aurora/10 text-aurora text-[0.68rem] font-bold px-[9px] py-[3px] rounded-full uppercase tracking-[0.05em]",
    aRevoir:
        "bg-solar/10 text-solar text-[0.68rem] font-bold px-[9px] py-[3px] rounded-full uppercase tracking-[0.05em]",
    refuse: "bg-coral/10 text-coral text-[0.68rem] font-bold px-[9px] py-[3px] rounded-full uppercase tracking-[0.05em]",
};

const VOTE_DECISION_LABEL: Record<string, string> = {
    valide: "Validé",
    aRevoir: "À revoir",
    refuse: "Refusé",
};

const DECISION_BADGE_CLASS: Record<string, string> = {
    "fdb-none": "bg-white/4 border border-white/10 text-mist",
    valide: "bg-aurora/10 border border-aurora/30 text-aurora",
    aRevoir: "bg-solar/10 border border-solar/30 text-solar",
    refuse: "bg-coral/10 border border-coral/25 text-coral",
    discuter: "bg-lavande/10 border border-lavande/25 text-lavande",
};

const getDecisionBadgeLabel = (decision: JuryFilm["myDecision"]): string => {
    if (decision === "valide") return "✓ Validé";
    if (decision === "aRevoir") return "↩ À revoir";
    if (decision === "refuse") return "✕ Refusé";
    if (decision === "discuter") return "💬 À discuter";
    return "— En attente";
};

const getDecisionBadgeClass = (decision: JuryFilm["myDecision"]): string => {
    if (decision === null) return DECISION_BADGE_CLASS["fdb-none"];
    return DECISION_BADGE_CLASS[decision] ?? DECISION_BADGE_CLASS["fdb-none"];
};

const SectionCard = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}): React.JSX.Element => (
    <section className="mb-3 rounded-[10px] border border-white/5 bg-surface-2 p-3.5">
        <h4 className="mb-2.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-mist">
            {title}
        </h4>
        {children}
    </section>
);

const CommentCard = ({ comment }: { comment: JuryComment }): React.JSX.Element => {
    const date = new Date(comment.updatedAt);
    const dateStr = date.toLocaleDateString("fr", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="flex items-start gap-3 rounded-[10px] border border-white/5 bg-surface p-3.5">
            {comment.profilPicture ? (
                <img
                    src={comment.profilPicture}
                    alt={comment.initials}
                    className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
            ) : (
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurora to-lavande text-[0.75rem] font-extrabold text-deep-sky">
                    {comment.initials}
                </div>
            )}
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="text-[0.85rem] font-semibold text-white-soft">
                        {comment.name}
                    </span>
                    <span className="text-[0.68rem] text-mist/50">
                        {dateStr} à {timeStr}
                    </span>
                </div>
                <p className="mt-1 text-[0.82rem] leading-[1.6] text-white-soft/80">
                    {comment.text}
                </p>
            </div>
        </div>
    );
};

const FilmDetail = ({ film }: FilmDetailProps): React.JSX.Element => {
    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5">
                {/* Video player */}
                <div className="mb-[18px] overflow-hidden rounded-[12px] border border-white/8 bg-black">
                    {film.videoUrl ? (
                        <video
                            key={film.videoUrl}
                            src={film.videoUrl}
                            controls
                            className="aspect-video w-full bg-black"
                            preload="metadata"
                        />
                    ) : (
                        <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-[#0d1b3e] via-[#1a0a3e] to-[#0a2e2e]">
                            <div className="text-center">
                                <div className="mb-2 text-3xl opacity-30">🎬</div>
                                <div className="text-[0.75rem] text-mist/50">
                                    Vidéo non disponible
                                </div>
                            </div>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/75 px-3.5 py-[5px] text-[0.85rem]">
                                {film.title} · {film.author}
                            </div>
                        </div>
                    )}
                </div>

                {/* Jury opinions */}
                <SectionCard title="Avis des autres jurés">
                    <div className="flex flex-col gap-2">
                        {film.opinions.map((opinion) => (
                            <div key={opinion.initials} className="flex items-start gap-3">
                                <div
                                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[0.72rem] font-bold ${OPINION_AVATAR_CLASS[opinion.color]}`}
                                >
                                    {opinion.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 text-[0.8rem] font-semibold">
                                        {opinion.name}
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${OPINION_BADGE_CLASS[opinion.badge]}`}
                                        >
                                            {OPINION_BADGE_LABEL[opinion.badge]}
                                        </span>
                                    </div>
                                    <div className="mt-0.5 text-[0.72rem] leading-relaxed text-mist">
                                        {opinion.comment}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* Film header */}
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="mb-1 font-display text-[1.25rem] font-extrabold tracking-[-0.02em]">
                            {film.title}
                        </h2>
                        <div className="mb-2 text-[0.82rem] text-mist">
                            {film.author} · {film.country} · {film.year}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            <span className="rounded-[5px] bg-aurora/10 px-[9px] py-[3px] text-[0.68rem] font-bold uppercase tracking-[0.04em] text-aurora">
                                Image IA
                            </span>
                            <span className="rounded-[5px] bg-white/6 px-[9px] py-[3px] text-[0.68rem] text-mist">
                                {film.tools}
                            </span>
                        </div>
                    </div>
                    <span
                        className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-[6px] text-[0.72rem] font-bold uppercase tracking-[0.05em] ${getDecisionBadgeClass(film.myDecision)}`}
                    >
                        {getDecisionBadgeLabel(film.myDecision)}
                    </span>
                </div>

                {/* Meta row */}
                <div className="mb-4 grid grid-cols-4 gap-2">
                    <div className="rounded-[8px] border border-white/5 bg-surface-2 px-3 py-2.5">
                        <div className="mb-[3px] text-[0.62rem] uppercase tracking-[0.07em] text-mist">
                            Durée
                        </div>
                        <div className="font-mono text-[0.85rem] font-semibold">
                            {film.duration}
                        </div>
                    </div>
                    <div className="rounded-[8px] border border-white/5 bg-surface-2 px-3 py-2.5">
                        <div className="mb-[3px] text-[0.62rem] uppercase tracking-[0.07em] text-mist">
                            Format
                        </div>
                        <div className="font-mono text-[0.85rem] font-semibold">{film.format}</div>
                    </div>
                    <div className="rounded-[8px] border border-white/5 bg-surface-2 px-3 py-2.5">
                        <div className="mb-[3px] text-[0.62rem] uppercase tracking-[0.07em] text-mist">
                            Sous-titres
                        </div>
                        <div className="text-[0.85rem] font-semibold">{film.subtitles}</div>
                    </div>
                    <div className="rounded-[8px] border border-white/5 bg-surface-2 px-3 py-2.5">
                        <div className="mb-[3px] text-[0.62rem] uppercase tracking-[0.07em] text-mist">
                            Copyright
                        </div>
                        <div className="text-[0.85rem] font-semibold text-aurora">
                            {film.copyright}
                        </div>
                    </div>
                </div>

                {/* IA section */}
                <SectionCard title="Fiche IA — Détails obligatoires">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-[6px] border border-white/5 bg-white/3 px-3 py-2.5">
                            <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-aurora">
                                Scénario
                            </div>
                            <div className="text-[0.75rem] text-mist">{film.iaScenario}</div>
                        </div>
                        <div className="rounded-[6px] border border-white/5 bg-white/3 px-3 py-2.5">
                            <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-aurora">
                                Image / Vidéo
                            </div>
                            <div className="text-[0.75rem] text-mist">{film.iaImage}</div>
                        </div>
                        <div className="rounded-[6px] border border-white/5 bg-white/3 px-3 py-2.5">
                            <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-aurora">
                                Post-production
                            </div>
                            <div className="text-[0.75rem] text-mist">{film.iaPost}</div>
                        </div>
                    </div>
                </SectionCard>

                {/* Note */}
                <SectionCard title="Note de démarche créative">
                    <p className="text-[0.82rem] leading-[1.65] text-white-soft/75">{film.note}</p>
                </SectionCard>

                {/* Votes */}
                <SectionCard title="Décisions du jury">
                    <div className="flex flex-col gap-2">
                        {film.votes.map((vote) => (
                            <div
                                key={vote.initials + vote.name}
                                className="flex items-center gap-2.5 rounded-[8px] border border-white/4 bg-surface px-3 py-2.5"
                            >
                                <div
                                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[0.68rem] font-extrabold ${VOTE_AVATAR_CLASS[vote.avatarVariant]}`}
                                >
                                    {vote.initials}
                                </div>
                                <span className="flex-1 text-[0.8rem] font-semibold">
                                    {vote.name}
                                </span>
                                <span className="text-[0.68rem] text-mist">{vote.role}</span>
                                {vote.decision !== null ? (
                                    <span className={VOTE_DECISION_CLASS[vote.decision] ?? ""}>
                                        {VOTE_DECISION_LABEL[vote.decision] ?? ""}
                                    </span>
                                ) : (
                                    <span className="bg-white/5 px-[9px] py-[3px] text-[0.68rem] italic text-mist/50">
                                        —
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* Comments */}
                <SectionCard title="Commentaires du jury">
                    {film.comments.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {film.comments.map((comment: JuryComment) => (
                                <CommentCard key={comment.id} comment={comment} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-[0.8rem] italic text-mist">
                            Aucun commentaire pour ce film.
                        </p>
                    )}
                </SectionCard>
            </div>
        </div>
    );
};

export default FilmDetail;
