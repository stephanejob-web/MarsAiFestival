import React, { useEffect, useState } from "react";
import StatCard from "../features/admin/components/StatCard";
import useAdminSelection, {
    getConsensus,
    type FilterKey,
    type SortKey,
} from "../features/admin/hooks/useAdminSelection";
import type { AdminFilmVoteSummary, JuryDecision } from "../features/admin/types";
import useVoteTags from "../features/jury/hooks/useVoteTags";
import { apiFetch } from "../services/api";

const getToken = (): string => localStorage.getItem("jury_token") ?? "";

interface DiscussionMessage {
    id: number;
    jury_name: string;
    jury_initials: string;
    profil_picture: string | null;
    message: string;
    sent_at: string;
}

interface FilmComment {
    id: number;
    jury_id: number;
    film_id: number;
    text: string;
    created_at: string;
    first_name: string;
    last_name: string;
    profil_picture: string | null;
}

interface VoteDetail {
    jury_id: number;
    decision: string;
    message: string | null;
    updated_at: string;
    first_name: string;
    last_name: string;
    profil_picture: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const CONSENSUS_CONFIG: Record<string, { label: string; cls: string }> = {
    unanime: {
        label: "✅ Unanime",
        cls: "bg-aurora/10 text-aurora border border-aurora/25",
    },
    majorite: {
        label: "👍 Majorité",
        cls: "bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/25",
    },
    partage: {
        label: "⚠️ Partagé",
        cls: "bg-solar/10 text-solar border border-solar/25",
    },
    rejete: {
        label: "❌ Rejeté",
        cls: "bg-coral/10 text-coral border border-coral/25",
    },
    attente: {
        label: "⏳ En attente",
        cls: "bg-white/[0.04] text-mist border border-white/[0.08]",
    },
};

const FILTER_BUTTONS: Array<{
    key: FilterKey;
    label: string;
    countKey?: keyof ReturnType<typeof useAdminSelection>["stats"];
}> = [
    { key: "tous", label: "Tous" },
    { key: "unanime", label: "✅ Unanimes", countKey: "unanime" },
    { key: "majorite", label: "👍 Majorité", countKey: "majorite" },
    { key: "partage", label: "⚠️ Partagés", countKey: "partage" },
    { key: "rejete", label: "❌ Rejetés", countKey: "rejete" },
    { key: "attente", label: "⏳ En attente", countKey: "attente" },
    { key: "signale", label: "🚩 Signalements", countKey: "signale" },
    { key: "selectionne", label: "★ Top 50", countKey: "selectionne" },
    { key: "finaliste", label: "🏆 Top 5 — Finale", countKey: "finaliste" },
];

const SORT_BUTTONS: Array<{ key: SortKey; label: string }> = [
    { key: "score", label: "Score ↓" },
    { key: "title", label: "Titre A-Z" },
    { key: "comments", label: "💬 Commentaires" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const DECISION_STYLE: Record<
    string,
    { border: string; bg: string; label: string; labelCls: string }
> = {
    valide: {
        border: "#4effce",
        bg: "rgba(78,255,206,0.15)",
        label: "✓ Validé",
        labelCls: "text-aurora",
    },
    arevoir: {
        border: "#f5e642",
        bg: "rgba(245,230,66,0.12)",
        label: "↩ À revoir",
        labelCls: "text-solar",
    },
    refuse: {
        border: "#ff6b6b",
        bg: "rgba(255,107,107,0.12)",
        label: "✕ Refusé",
        labelCls: "text-coral",
    },
    in_discussion: {
        border: "#c084fc",
        bg: "rgba(192,132,252,0.12)",
        label: "💬 Discussion",
        labelCls: "text-lavande",
    },
};

const PENDING_STYLE = {
    border: "rgba(255,255,255,0.18)",
    bg: "rgba(255,255,255,0.04)",
};

interface JuryVoteDotsProps {
    film: AdminFilmVoteSummary;
}

const JuryVoteDots = ({ film }: JuryVoteDotsProps): React.JSX.Element => {
    const decisions = film.jury_decisions ?? [];

    if (decisions.length === 0) {
        return <span className="text-[0.65rem] text-mist opacity-40">—</span>;
    }

    return (
        <div className="flex flex-wrap gap-1.5">
            {decisions.map((d: JuryDecision) => {
                const hasVoted = d.decision !== null;
                const style = d.decision
                    ? (DECISION_STYLE[d.decision] ?? PENDING_STYLE)
                    : PENDING_STYLE;
                const initials = `${d.first_name.charAt(0)}${d.last_name.charAt(0)}`.toUpperCase();
                const fullName = `${d.first_name} ${d.last_name}`;
                const voteLabel =
                    hasVoted && d.decision
                        ? (DECISION_STYLE[d.decision] ?? DECISION_STYLE.valide).label
                        : "En attente…";

                return (
                    <div
                        key={d.jury_id}
                        className="group/dot relative"
                        style={{ opacity: hasVoted ? 1 : 0.4 }}
                        title={`${fullName} — ${voteLabel}`}
                    >
                        <div
                            className="inline-flex h-[46px] w-[46px] shrink-0 overflow-hidden rounded-full"
                            style={{ border: `2.5px solid ${style.border}` }}
                        >
                            {d.profil_picture ? (
                                <img
                                    src={d.profil_picture}
                                    alt={fullName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div
                                    className="flex h-full w-full items-center justify-center font-display text-[0.78rem] font-black text-white-soft"
                                    style={{ background: style.bg }}
                                >
                                    {initials}
                                </div>
                            )}
                        </div>
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/[0.08] bg-deep-sky px-2 py-1 opacity-0 shadow-lg transition-opacity duration-150 group-hover/dot:opacity-100">
                            <div className="text-[0.65rem] font-semibold text-white-soft">
                                {fullName}
                            </div>
                            <div
                                className={`text-[0.6rem] font-bold ${hasVoted && d.decision ? (DECISION_STYLE[d.decision] ?? DECISION_STYLE.valide).labelCls : "text-mist opacity-60"}`}
                            >
                                {voteLabel}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

interface VoteBarProps {
    film: AdminFilmVoteSummary;
}

const VoteBar = ({ film }: VoteBarProps): React.JSX.Element => {
    const total = film.votes_valide + film.votes_arevoir + film.votes_refuse;
    if (total === 0) {
        return <span className="text-[0.72rem] text-mist opacity-50">Aucun vote</span>;
    }
    const pV = Math.round((film.votes_valide / total) * 100);
    const pA = Math.round((film.votes_arevoir / total) * 100);
    const pR = 100 - pV - pA;
    return (
        <div className="flex min-w-[170px] items-center gap-2">
            <div className="flex h-[6px] flex-1 overflow-hidden rounded-sm bg-white/[0.06]">
                <div className="h-full bg-aurora" style={{ width: `${pV}%` }} />
                <div className="h-full bg-solar" style={{ width: `${pA}%` }} />
                <div className="h-full bg-coral" style={{ width: `${pR}%` }} />
            </div>
            <span className="whitespace-nowrap font-mono text-[0.68rem] text-mist">
                {film.votes_valide}✓ {film.votes_arevoir}↩ {film.votes_refuse}✕
            </span>
        </div>
    );
};

interface AdminDecisionProps {
    film: AdminFilmVoteSummary;
    onUpdate: (filmId: number, statut: string) => Promise<void>;
}

const AdminDecision = ({ film, onUpdate }: AdminDecisionProps): React.JSX.Element => {
    const isTop50 = film.statut === "selectionne" || film.statut === "finaliste";
    const isFinaliste = film.statut === "finaliste";

    const handleToggleTop50 = (): void => {
        void onUpdate(film.film_id, isTop50 ? "soumis" : "selectionne");
    };

    const handleToggleFinaliste = (): void => {
        void onUpdate(film.film_id, isFinaliste ? "selectionne" : "finaliste");
    };

    return (
        <div className="flex flex-col gap-1.5">
            <button
                type="button"
                onClick={handleToggleTop50}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-display text-[0.72rem] font-extrabold transition-all ${
                    isTop50
                        ? "bg-aurora text-deep-sky shadow-[0_2px_12px_rgba(78,255,206,0.35)] hover:opacity-90"
                        : "border border-white/[0.12] bg-white/[0.04] text-mist hover:border-aurora/30 hover:bg-aurora/[0.06] hover:text-aurora"
                }`}
            >
                {isTop50 ? (
                    <>
                        <svg
                            width="11"
                            height="11"
                            viewBox="0 0 12 12"
                            fill="none"
                            className="shrink-0"
                        >
                            <path
                                d="M2 6l3 3 5-5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Sélectionné
                    </>
                ) : (
                    <>
                        <svg
                            width="11"
                            height="11"
                            viewBox="0 0 12 12"
                            fill="none"
                            className="shrink-0"
                        >
                            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                            <path
                                d="M6 4v4M4 6h4"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                            />
                        </svg>
                        Sélectionner
                    </>
                )}
            </button>
            {isTop50 && (
                <button
                    type="button"
                    onClick={handleToggleFinaliste}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-display text-[0.72rem] font-extrabold transition-all ${
                        isFinaliste
                            ? "border border-lavande/50 bg-lavande/[0.15] text-lavande"
                            : "border border-lavande/25 bg-lavande/[0.06] text-lavande hover:bg-lavande/[0.14]"
                    }`}
                >
                    {isFinaliste ? "🏆 Finaliste" : "→ Top 5"}
                </button>
            )}
        </div>
    );
};

interface FilmInsightDrawerProps {
    film: AdminFilmVoteSummary | null;
    onClose: () => void;
}

type InsightTab = "votes" | "commentaires" | "discussion" | "email";

const STATUT_BADGE: Record<string, { label: string; cls: string }> = {
    selectionne: {
        label: "★ Sélectionné",
        cls: "bg-aurora/10 text-aurora border border-aurora/25",
    },
    finaliste: {
        label: "🏆 Finaliste",
        cls: "bg-lavande/10 text-lavande border border-lavande/25",
    },
    soumis: {
        label: "En attente",
        cls: "bg-white/[0.04] text-mist border border-white/[0.08]",
    },
};

const FilmInsightDrawer = ({ film, onClose }: FilmInsightDrawerProps): React.JSX.Element => {
    const [messages, setMessages] = useState<DiscussionMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [filmComments, setFilmComments] = useState<FilmComment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [voteDetails, setVoteDetails] = useState<VoteDetail[]>([]);
    const [activeTab, setActiveTab] = useState<InsightTab>("votes");
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [emailSelectedTag, setEmailSelectedTag] = useState<string | null>(null);
    const voteTags = useVoteTags();

    useEffect(() => {
        if (!film) return;
        const filmId = film.film_id;

        setMessages([]);
        setFilmComments([]);
        setVoteDetails([]);
        setVideoUrl(null);
        setActiveTab("votes");
        setEmailSubject(`Votre film — ${film.original_title}`);
        setEmailBody("");
        setEmailStatus("idle");
        setEmailSelectedTag(null);
        setLoadingMessages(true);
        setLoadingComments(true);

        if (film.video_url) {
            apiFetch<{ success: boolean; url: string }>(`/api/films/${filmId}/video-url`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            })
                .then((res) => {
                    if (!cancelled && res.success) setVideoUrl(res.url);
                })
                .catch(() => undefined);
        }

        let cancelled = false;

        apiFetch<{ success: boolean; data: DiscussionMessage[] }>(
            `/api/discussion/messages/${filmId}`,
            { headers: { Authorization: `Bearer ${getToken()}` } },
        )
            .then((res) => {
                if (!cancelled && res.success) setMessages(res.data);
            })
            .catch(() => undefined)
            .finally(() => {
                if (!cancelled) setLoadingMessages(false);
            });

        apiFetch<{ success: boolean; data: FilmComment[] }>(`/api/comments/film?filmId=${filmId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => {
                if (!cancelled && res.success) setFilmComments(res.data);
            })
            .catch(() => undefined)
            .finally(() => {
                if (!cancelled) setLoadingComments(false);
            });

        apiFetch<{ success: boolean; data: VoteDetail[] }>(`/api/votes?filmId=${filmId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => {
                if (!cancelled && res.success) setVoteDetails(res.data);
            })
            .catch(() => undefined);

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [film?.film_id]);

    const voteMessageByJury = new Map<number, VoteDetail>(
        voteDetails
            .filter((v) => v.message && (v.decision === "arevoir" || v.decision === "refuse"))
            .map((v) => [v.jury_id, v]),
    );

    const commentsByJury = filmComments.reduce<Map<number, FilmComment[]>>((acc, c) => {
        const list = acc.get(c.jury_id) ?? [];
        list.push(c);
        acc.set(c.jury_id, list);
        return acc;
    }, new Map());

    const isOpen = film !== null;
    const total = film ? (film.total_jury ?? film.total_assigned) : 0;
    const participationPct = total > 0 && film ? Math.round((film.total_votes / total) * 100) : 0;

    const statutBadge = film ? (STATUT_BADGE[film.statut] ?? STATUT_BADGE.soumis) : null;

    const voteRows = film
        ? [
              {
                  label: "✓ Validé",
                  count: film.votes_valide,
                  color: "text-aurora",
                  bg: "bg-aurora",
                  icon: "✓",
                  cardCls: "border-aurora/20 bg-aurora/[0.06]",
                  iconCls: "text-aurora",
              },
              {
                  label: "↩ À revoir",
                  count: film.votes_arevoir,
                  color: "text-solar",
                  bg: "bg-solar",
                  icon: "↩",
                  cardCls: "border-solar/20 bg-solar/[0.06]",
                  iconCls: "text-solar",
              },
              {
                  label: "✕ Refusé",
                  count: film.votes_refuse,
                  color: "text-coral",
                  bg: "bg-coral",
                  icon: "✕",
                  cardCls: "border-coral/20 bg-coral/[0.06]",
                  iconCls: "text-coral",
              },
              {
                  label: "💬 Discussion",
                  count: film.votes_discussion,
                  color: "text-lavande",
                  bg: "bg-lavande",
                  icon: "💬",
                  cardCls: "border-lavande/20 bg-lavande/[0.06]",
                  iconCls: "text-lavande",
              },
          ]
        : [];

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[700] bg-black/50 backdrop-blur-[3px] transition-opacity duration-300 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div
                className={`fixed bottom-0 right-0 top-0 z-[710] flex w-[520px] flex-col border-l border-white/[0.08] bg-surface shadow-[-24px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex shrink-0 items-start justify-between border-b border-white/[0.06] px-6 py-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[0.65rem] text-mist opacity-60">
                                #{film?.dossier_num}
                            </span>
                            {statutBadge && (
                                <span
                                    className={`inline-block rounded-full px-2 py-0.5 text-[0.62rem] font-semibold ${statutBadge.cls}`}
                                >
                                    {statutBadge.label}
                                </span>
                            )}
                        </div>
                        <div className="mt-1 font-display text-[1.05rem] font-extrabold text-white-soft">
                            {film?.original_title}
                        </div>
                        <div className="mt-0.5 text-[0.75rem] text-mist">
                            {film?.realisator_first_name} {film?.realisator_last_name}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-[0.85rem] text-mist transition-all hover:bg-white/[0.1] hover:text-white-soft"
                    >
                        ✕
                    </button>
                </div>

                {/* Video player */}
                {film?.video_url && (
                    <div className="shrink-0 bg-black">
                        {videoUrl ? (
                            <video
                                key={videoUrl}
                                src={videoUrl}
                                controls
                                className="aspect-video w-full"
                            />
                        ) : (
                            <div className="flex aspect-video w-full items-center justify-center text-[0.78rem] text-mist opacity-50">
                                Chargement de la vidéo…
                            </div>
                        )}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex shrink-0 border-b border-white/[0.06] px-6">
                    {(
                        [
                            { key: "votes", label: "Votes" },
                            { key: "commentaires", label: "Commentaires" },
                            { key: "discussion", label: "Discussion" },
                            ...(film?.realisator_email ? [{ key: "email", label: "✉ Email" }] : []),
                        ] as Array<{ key: InsightTab; label: string }>
                    ).map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-1.5 border-b-2 px-4 py-3 font-display text-[0.78rem] font-semibold capitalize transition-colors ${
                                activeTab === key
                                    ? key === "email"
                                        ? "border-solar text-solar"
                                        : "border-aurora text-aurora"
                                    : "border-transparent text-mist hover:text-white-soft"
                            }`}
                        >
                            {label}
                            {key === "commentaires" && filmComments.length > 0 && (
                                <span className="rounded-full bg-aurora/15 px-1.5 py-0.5 font-mono text-[0.58rem] text-aurora">
                                    {filmComments.length}
                                </span>
                            )}
                            {key === "discussion" && messages.length > 0 && (
                                <span className="rounded-full bg-lavande/15 px-1.5 py-0.5 font-mono text-[0.58rem] text-lavande">
                                    {messages.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* TAB: votes */}
                    {activeTab === "votes" && film && (
                        <>
                            {/* Big numbers row */}
                            <div className="mb-6 grid grid-cols-4 gap-3">
                                {voteRows.map(({ label, count, cardCls, iconCls, icon }) => (
                                    <div
                                        key={label}
                                        className={`rounded-xl border px-3 py-3 text-center ${cardCls}`}
                                    >
                                        <div className={`text-[1.1rem] ${iconCls}`}>{icon}</div>
                                        <div
                                            className={`font-display text-[1.5rem] font-extrabold leading-none ${iconCls}`}
                                        >
                                            {count}
                                        </div>
                                        <div className="mt-1 text-[0.62rem] text-mist opacity-70">
                                            {label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Progress bars */}
                            <div className="mb-6 space-y-2">
                                {voteRows.map(({ label, count, color, bg }) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <span
                                            className={`w-28 shrink-0 text-[0.75rem] font-semibold ${color}`}
                                        >
                                            {label}
                                        </span>
                                        <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                                            <div
                                                className={`h-full rounded-full ${bg}`}
                                                style={{
                                                    width:
                                                        total > 0
                                                            ? `${(count / total) * 100}%`
                                                            : "0%",
                                                }}
                                            />
                                        </div>
                                        <span className="w-6 shrink-0 text-right font-mono text-[0.72rem] text-mist">
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Participation */}
                            <div className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                                <div className="mb-3 text-[0.65rem] uppercase tracking-[0.1em] text-mist">
                                    Participation
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-display text-[1.8rem] font-extrabold leading-none text-white-soft">
                                        {film.total_votes}
                                    </span>
                                    <span className="text-mist">/</span>
                                    <span className="text-[1.2rem] text-mist">{total} jurés</span>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                                    <div
                                        className="h-full rounded-full bg-aurora"
                                        style={{ width: `${participationPct}%` }}
                                    />
                                </div>
                            </div>

                            {/* Jury decisions grid */}
                            <div>
                                <div className="mb-3 text-[0.65rem] uppercase tracking-[0.1em] text-mist">
                                    Vote par juré
                                </div>
                                <div className="space-y-2">
                                    {(film.jury_decisions ?? []).map((d) => {
                                        const style = d.decision
                                            ? (DECISION_STYLE[d.decision] ?? PENDING_STYLE)
                                            : PENDING_STYLE;
                                        const initials =
                                            `${d.first_name.charAt(0)}${d.last_name.charAt(0)}`.toUpperCase();
                                        const decisionInfo = d.decision
                                            ? DECISION_STYLE[d.decision]
                                            : null;
                                        const decisionIcon = d.decision
                                            ? ({
                                                  valide: "✓",
                                                  arevoir: "↩",
                                                  refuse: "✕",
                                                  in_discussion: "💬",
                                              }[d.decision] ?? "?")
                                            : null;
                                        const voteMsg = voteMessageByJury.get(d.jury_id);
                                        const hasMotif =
                                            voteMsg &&
                                            (d.decision === "arevoir" || d.decision === "refuse");
                                        return (
                                            <div
                                                key={d.jury_id}
                                                className="rounded-xl border border-white/[0.05] bg-white/[0.025]"
                                            >
                                                <div className="flex items-center gap-3 px-3 py-2.5">
                                                    <div
                                                        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full font-display text-[0.7rem] font-black"
                                                        style={{
                                                            border: `2px solid ${style.border}`,
                                                            background: style.bg,
                                                        }}
                                                    >
                                                        {d.profil_picture ? (
                                                            <img
                                                                src={d.profil_picture}
                                                                alt={`${d.first_name} ${d.last_name}`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-white-soft">
                                                                {initials}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-[0.82rem] text-white-soft">
                                                            {d.first_name} {d.last_name}
                                                        </div>
                                                        {decisionInfo ? (
                                                            <span
                                                                className={`text-[0.72rem] font-semibold ${decisionInfo.labelCls}`}
                                                            >
                                                                {decisionInfo.label}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[0.72rem] text-mist opacity-50">
                                                                En attente…
                                                            </span>
                                                        )}
                                                    </div>
                                                    {decisionIcon && (
                                                        <span
                                                            className={`text-[0.85rem] ${decisionInfo?.labelCls ?? ""}`}
                                                        >
                                                            {decisionIcon}
                                                        </span>
                                                    )}
                                                </div>
                                                {hasMotif && (
                                                    <div
                                                        className={`border-t px-3 pb-3 pt-2.5 ${
                                                            d.decision === "refuse"
                                                                ? "border-coral/15 bg-coral/[0.04]"
                                                                : "border-solar/15 bg-solar/[0.04]"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.08em] ${
                                                                d.decision === "refuse"
                                                                    ? "text-coral opacity-60"
                                                                    : "text-solar opacity-60"
                                                            }`}
                                                        >
                                                            {d.decision === "refuse"
                                                                ? "✉ Message envoyé au réalisateur"
                                                                : "💬 Motif de révision"}
                                                        </div>
                                                        <p className="text-[0.78rem] leading-relaxed text-white-soft/80">
                                                            {voteMsg.message}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* TAB: commentaires */}
                    {activeTab === "commentaires" && (
                        <>
                            {loadingComments ? (
                                <div className="flex items-center justify-center py-12 text-[0.82rem] text-mist opacity-50">
                                    Chargement…
                                </div>
                            ) : filmComments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-12">
                                    <span className="text-[1.5rem] opacity-30">📝</span>
                                    <span className="text-[0.82rem] text-mist opacity-50">
                                        Aucun commentaire pour ce film.
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {Array.from(commentsByJury.entries()).map(
                                        ([juryId, comments]) => {
                                            const first = comments[0];
                                            const name = `${first.first_name} ${first.last_name}`;
                                            return (
                                                <div key={juryId}>
                                                    <div className="mb-3 flex items-center gap-3">
                                                        <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-aurora/30 bg-aurora/[0.12] font-display text-[0.7rem] font-black text-aurora">
                                                            {first.profil_picture ? (
                                                                <img
                                                                    src={first.profil_picture}
                                                                    alt={name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                `${first.first_name[0]}${first.last_name[0]}`.toUpperCase()
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-[0.85rem] text-aurora">
                                                                {name}
                                                            </div>
                                                            <div className="text-[0.65rem] text-mist">
                                                                {comments.length} commentaire
                                                                {comments.length > 1 ? "s" : ""}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 pl-[52px]">
                                                        {comments.map((c) => (
                                                            <div
                                                                key={c.id}
                                                                className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3"
                                                            >
                                                                <p className="text-[0.82rem] leading-relaxed text-white-soft">
                                                                    {c.text}
                                                                </p>
                                                                <span className="mt-1 block font-mono text-[0.6rem] text-mist opacity-40">
                                                                    {new Date(
                                                                        c.created_at,
                                                                    ).toLocaleString("fr-FR", {
                                                                        day: "2-digit",
                                                                        month: "2-digit",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    })}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* TAB: email */}
                    {activeTab === "email" && film && (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-[0.75rem]">
                                <div className="mb-2 text-[0.65rem] uppercase tracking-[0.1em] text-mist">
                                    Destinataire
                                </div>
                                <div className="flex gap-2">
                                    <span className="w-12 shrink-0 font-semibold text-mist">À</span>
                                    <span className="text-white-soft">
                                        {film.realisator_first_name} {film.realisator_last_name}{" "}
                                        <span className="text-mist opacity-60">
                                            ({film.realisator_email})
                                        </span>
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="w-12 shrink-0 font-semibold text-mist">
                                        Objet
                                    </span>
                                    <input
                                        type="text"
                                        value={emailSubject}
                                        onChange={(e) => setEmailSubject(e.target.value)}
                                        className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[0.75rem] text-white-soft outline-none focus:border-solar/40"
                                    />
                                </div>
                            </div>

                            {voteTags.length > 0 && (
                                <div>
                                    <div className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                        Modèle de message
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {voteTags.map((tag) => {
                                            const isActive = emailSelectedTag === tag.key;
                                            return (
                                                <button
                                                    key={tag.key}
                                                    type="button"
                                                    onClick={() => {
                                                        const next = isActive ? null : tag.key;
                                                        setEmailSelectedTag(next);
                                                        if (!isActive && tag.message_template) {
                                                            setEmailBody(tag.message_template);
                                                            setEmailStatus("idle");
                                                        }
                                                    }}
                                                    className={`flex items-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-[0.75rem] transition-all ${
                                                        isActive
                                                            ? `border-${tag.color}/30 bg-${tag.color}/10 text-${tag.color}`
                                                            : "border-white/10 bg-white/[0.04] text-mist hover:border-white/20 hover:text-white-soft"
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-[5px] w-[5px] shrink-0 rounded-full bg-${tag.color}`}
                                                    />
                                                    <span>{tag.icon}</span>
                                                    {tag.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <textarea
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                placeholder="Votre message… ou sélectionnez un modèle ci-dessus"
                                rows={7}
                                className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[0.78rem] text-white-soft outline-none placeholder:text-mist focus:border-solar/40"
                            />

                            {emailStatus === "sent" && (
                                <div className="rounded-xl border border-aurora/25 bg-aurora/[0.06] px-4 py-3 text-[0.78rem] text-aurora">
                                    ✓ Email envoyé avec succès.
                                </div>
                            )}
                            {emailStatus === "error" && (
                                <div className="rounded-xl border border-coral/25 bg-coral/[0.06] px-4 py-3 text-[0.78rem] text-coral">
                                    ✕ Erreur lors de l&apos;envoi. Réessayez.
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    disabled={!emailBody.trim() || emailStatus === "sending"}
                                    onClick={() => {
                                        if (!emailBody.trim()) return;
                                        setEmailStatus("sending");
                                        apiFetch<{ success: boolean }>(
                                            `/api/films/${film.film_id}/email`,
                                            {
                                                method: "POST",
                                                headers: {
                                                    Authorization: `Bearer ${getToken()}`,
                                                },
                                                body: JSON.stringify({
                                                    subject: emailSubject,
                                                    message: emailBody,
                                                }),
                                            },
                                        )
                                            .then(() => setEmailStatus("sent"))
                                            .catch(() => setEmailStatus("error"));
                                    }}
                                    className="rounded-lg border border-solar/30 bg-solar/[0.1] px-5 py-2 text-[0.78rem] font-bold text-solar transition-all hover:bg-solar/[0.2] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {emailStatus === "sending"
                                        ? "Envoi…"
                                        : emailStatus === "sent"
                                          ? "✓ Envoyé !"
                                          : "📧 Envoyer"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: discussion */}
                    {activeTab === "discussion" && (
                        <>
                            {loadingMessages ? (
                                <div className="flex items-center justify-center py-12 text-[0.82rem] text-mist opacity-50">
                                    Chargement…
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-12">
                                    <span className="text-[1.5rem] opacity-30">💬</span>
                                    <span className="text-[0.82rem] text-mist opacity-50">
                                        Aucun message de discussion pour ce film.
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className="flex items-start gap-3">
                                            <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-lavande/30 bg-lavande/[0.12] font-display text-[0.65rem] font-black text-lavande">
                                                {msg.profil_picture ? (
                                                    <img
                                                        src={msg.profil_picture}
                                                        alt={msg.jury_name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    msg.jury_name
                                                        .split(" ")
                                                        .map((n: string) => n[0])
                                                        .join("")
                                                        .toUpperCase()
                                                        .slice(0, 2)
                                                )}
                                            </div>
                                            <div className="flex-1 rounded-xl border border-white/[0.05] bg-white/[0.025] px-4 py-3">
                                                <div className="mb-1 flex items-baseline gap-2">
                                                    <span className="font-bold text-[0.78rem] text-lavande">
                                                        {msg.jury_name}
                                                    </span>
                                                    <span className="font-mono text-[0.6rem] text-mist opacity-40">
                                                        {new Date(msg.sent_at).toLocaleString(
                                                            "fr-FR",
                                                            {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-[0.82rem] leading-relaxed text-white-soft">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

// ── Modals ────────────────────────────────────────────────────────────────────


// ── Main component ────────────────────────────────────────────────────────────

const AdminSelectionPage = (): React.JSX.Element => {
    const {
        allFilms,
        filtered,
        isLoading,
        error,
        lastUpdated,
        filter,
        setFilter,
        sort,
        setSort,
        search,
        setSearch,
        stats,
        updateStatut,
        reload,
    } = useAdminSelection();

    const [expandedId, setExpandedId] = useState<number | null>(null);
    const expandedFilm = allFilms.find((f) => f.film_id === expandedId) ?? null;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearch(e.target.value);
    };

    const handleRowClick = (filmId: number): void => {
        setExpandedId((prev) => (prev === filmId ? null : filmId));
    };

    // ── Top 50 special view ────────────────────────────────────────────────────
    const renderTop50 = (): React.JSX.Element => {
        const top50 = allFilms.filter(
            (f) => f.statut === "selectionne" || f.statut === "finaliste",
        );
        const pct = Math.min((top50.length / 50) * 100, 100);
        return (
            <div className="overflow-hidden rounded-xl border border-aurora/20">
                {/* Header progress */}
                <div className="flex items-center gap-4 border-b border-aurora/10 bg-aurora/[0.04] px-5 py-3">
                    <span className="text-[0.75rem] font-bold text-aurora">★ Top 50</span>
                    <div
                        className="flex-1 overflow-hidden rounded-full bg-aurora/[0.08]"
                        style={{ height: 5 }}
                    >
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-aurora to-[#a8ffec] transition-all"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <span className="font-mono text-[0.78rem] font-black text-aurora">
                        {top50.length}
                        <span className="font-normal text-mist"> / 50</span>
                    </span>
                    {top50.length >= 50 && (
                        <span className="text-[0.72rem] font-bold text-aurora">
                            ✓ Quota atteint
                        </span>
                    )}
                </div>
                {top50.length === 0 ? (
                    <div className="py-12 text-center text-[0.85rem] text-mist">
                        Aucun film sélectionné.
                        <br />
                        <span className="text-[0.75rem] opacity-60">
                            Utilisez le bouton "Sélectionner" dans la vue principale.
                        </span>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                    #
                                </th>
                                <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                    Film
                                </th>
                                <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                    Consensus
                                </th>
                                <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                    Votes
                                </th>
                                <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                    Top 5
                                </th>
                                <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                    ✕
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {top50.map((film, idx) => {
                                const consensus = getConsensus(film);
                                const badge = CONSENSUS_CONFIG[consensus];
                                const isFinal = film.statut === "finaliste";
                                return (
                                    <tr
                                        key={film.film_id}
                                        className={`border-b border-white/[0.04] transition-colors ${
                                            isFinal
                                                ? "bg-lavande/[0.04] hover:bg-lavande/[0.08]"
                                                : "bg-aurora/[0.02] hover:bg-aurora/[0.05]"
                                        }`}
                                    >
                                        <td className="px-4 py-3 font-mono text-[0.78rem] font-bold text-solar">
                                            {String(idx + 1).padStart(2, "0")}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-white-soft">
                                                {film.original_title}
                                                {isFinal && (
                                                    <span className="text-[0.65rem] text-lavande">
                                                        🏆
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-0.5 font-mono text-[0.62rem] text-mist">
                                                {film.dossier_num}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${badge.cls}`}
                                            >
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <JuryVoteDots film={film} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={(): void => {
                                                    void updateStatut(
                                                        film.film_id,
                                                        isFinal ? "selectionne" : "finaliste",
                                                    );
                                                }}
                                                className={`rounded-lg px-3 py-1.5 font-display text-[0.72rem] font-extrabold transition-all ${
                                                    isFinal
                                                        ? "border border-lavande/40 bg-lavande/[0.12] text-lavande"
                                                        : "border border-lavande/20 bg-lavande/[0.05] text-lavande hover:bg-lavande/[0.14]"
                                                }`}
                                            >
                                                {isFinal ? "🏆 Finaliste" : "→ Top 5"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={(): void => {
                                                    void updateStatut(film.film_id, "soumis");
                                                }}
                                                className="rounded-lg border border-coral/20 bg-coral/[0.04] px-2.5 py-1.5 font-display text-[0.72rem] font-bold text-coral transition-all hover:bg-coral/[0.1]"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        );
    };

    // ── Top 5 special view ─────────────────────────────────────────────────────
    const renderTop5 = (): React.JSX.Element => {
        const finalists = allFilms.filter((f) => f.statut === "finaliste");
        const medals = ["🥇", "🥈", "🥉", "④", "⑤"];
        const missing = 5 - finalists.length;
        return (
            <div className="overflow-hidden rounded-xl border border-lavande/25">
                {/* Header progress */}
                <div className="flex items-center gap-4 border-b border-lavande/15 bg-lavande/[0.04] px-5 py-3">
                    <span className="text-[0.75rem] font-bold text-lavande">🏆 Top 5 — Finale</span>
                    <div
                        className="flex-1 overflow-hidden rounded-full bg-lavande/[0.08]"
                        style={{ height: 5 }}
                    >
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-lavande to-[#e0c3ff] transition-all"
                            style={{ width: `${Math.min((finalists.length / 5) * 100, 100)}%` }}
                        />
                    </div>
                    <span className="font-mono text-[0.78rem] font-black text-lavande">
                        {finalists.length}
                        <span className="font-normal text-mist"> / 5</span>
                    </span>
                    {finalists.length >= 5 ? (
                        <span className="text-[0.72rem] font-bold text-lavande">
                            ✓ Finale constituée
                        </span>
                    ) : (
                        <span className="text-[0.72rem] text-solar">
                            Il manque {missing} finaliste{missing > 1 ? "s" : ""}
                        </span>
                    )}
                </div>
                {finalists.length === 0 ? (
                    <div className="py-12 text-center text-[0.85rem] text-mist">
                        Aucun finaliste désigné.
                        <br />
                        <span className="text-[0.75rem] opacity-60">
                            Allez dans <strong className="text-solar">★ Top 50</strong> et cliquez
                            sur <strong className="text-lavande">→ Top 5</strong> pour désigner vos
                            5 finalistes.
                        </span>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                    Rang
                                </th>
                                <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                    Film
                                </th>
                                <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                    Consensus
                                </th>
                                <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                    Votes
                                </th>
                                <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                                    Retirer
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {finalists.map((film, idx) => {
                                const consensus = getConsensus(film);
                                const badge = CONSENSUS_CONFIG[consensus];
                                return (
                                    <tr
                                        key={film.film_id}
                                        className="border-b border-white/[0.04] bg-lavande/[0.05] transition-colors hover:bg-lavande/[0.09]"
                                    >
                                        <td className="px-4 py-3 text-center text-[1.1rem]">
                                            {medals[idx] ?? idx + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-[0.88rem] font-bold text-white-soft">
                                                {film.original_title}
                                            </div>
                                            <div className="mt-0.5 font-mono text-[0.62rem] text-mist">
                                                {film.dossier_num}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${badge.cls}`}
                                            >
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <JuryVoteDots film={film} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={(): void => {
                                                    void updateStatut(film.film_id, "selectionne");
                                                }}
                                                className="rounded-lg border border-coral/20 bg-coral/[0.04] px-2.5 py-1.5 font-display text-[0.72rem] font-bold text-coral transition-all hover:bg-coral/[0.1]"
                                            >
                                                ✕ Retirer
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        );
    };

    // ── Default table view ─────────────────────────────────────────────────────
    const renderDefaultTable = (): React.JSX.Element => (
        <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                        <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                            #
                        </th>
                        <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                            Film
                        </th>
                        <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                            Répartition votes
                        </th>
                        <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                            Consensus
                        </th>
                        <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                            Jurés
                        </th>
                        <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                            💬
                        </th>
                        <th className="px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mist">
                            Décision admin
                        </th>
                        <th className="w-8 px-2 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td
                                colSpan={8}
                                className="px-4 py-12 text-center text-[0.82rem] text-mist"
                            >
                                Aucun film ne correspond à ce filtre.
                            </td>
                        </tr>
                    ) : (
                        filtered.map((film, index) => {
                            const consensus = getConsensus(film);
                            const badge = CONSENSUS_CONFIG[consensus];
                            return (
                                <React.Fragment key={film.film_id}>
                                    <tr
                                        onClick={(): void => handleRowClick(film.film_id)}
                                        className="group/row cursor-pointer border-b border-white/[0.04] transition-colors hover:bg-white/[0.04]"
                                        title="Cliquez pour voir les détails"
                                    >
                                        {/* # */}
                                        <td className="px-4 py-3 font-mono text-[0.7rem] text-mist">
                                            {index + 1}
                                        </td>

                                        {/* Film */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono text-[0.65rem] font-black text-mist opacity-40">
                                                    {String(film.film_id).padStart(3, "0")}
                                                </span>
                                                <div className="text-[0.82rem] font-semibold text-white-soft">
                                                    {film.original_title}
                                                </div>
                                            </div>
                                            <div className="mt-0.5 font-mono text-[0.62rem] text-mist">
                                                {film.dossier_num}
                                            </div>
                                        </td>

                                        {/* Répartition votes */}
                                        <td className="px-4 py-3">
                                            <VoteBar film={film} />
                                        </td>

                                        {/* Consensus */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${badge.cls}`}
                                            >
                                                {badge.label}
                                            </span>
                                        </td>

                                        {/* Jurés */}
                                        <td className="px-4 py-3">
                                            <JuryVoteDots film={film} />
                                        </td>

                                        {/* Commentaires */}
                                        <td className="px-4 py-3 font-mono text-[0.75rem]">
                                            {film.total_comments > 0 ? (
                                                <span className="text-lavande">
                                                    {film.total_comments}
                                                </span>
                                            ) : (
                                                <span className="text-mist opacity-40">—</span>
                                            )}
                                            {film.total_tickets > 0 && (
                                                <span className="ml-1.5 rounded-full bg-solar/10 px-1.5 py-0.5 text-[0.62rem] text-solar">
                                                    🚩{film.total_tickets}
                                                </span>
                                            )}
                                        </td>

                                        {/* Décision admin */}
                                        <td
                                            className="px-4 py-3"
                                            onClick={(e: React.MouseEvent): void =>
                                                e.stopPropagation()
                                            }
                                        >
                                            <AdminDecision film={film} onUpdate={updateStatut} />
                                        </td>

                                        {/* Chevron */}
                                        <td className="w-8 px-2 py-3 text-right">
                                            <span className="text-[1rem] text-mist opacity-25 transition-all group-hover/row:opacity-80 group-hover/row:text-aurora">
                                                ›
                                            </span>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            {/* Topbar */}
            <div className="flex h-[50px] min-h-[50px] items-center gap-3 border-b border-white/[0.06] bg-surface px-5">
                <span className="font-display text-[0.88rem] font-extrabold text-white-soft">
                    Sélection &amp; Votes
                </span>
                <div className="h-[18px] w-px bg-white/[0.08]" />
                <span className="text-[0.75rem] text-mist">
                    Votes, commentaires, signalements du jury — synthèse complète
                </span>
                <div className="ml-auto flex items-center gap-3">
                    {lastUpdated && (
                        <span className="font-mono text-[0.65rem] text-mist opacity-50">
                            màj{" "}
                            {lastUpdated.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={(): void => reload()}
                        className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[0.7rem] text-mist transition-all hover:border-aurora/30 hover:text-aurora"
                        title="Rafraîchir les votes"
                    >
                        ↺ Rafraîchir
                    </button>
                    <span className="rounded-md border border-solar/20 bg-solar/[0.07] px-2.5 py-1 font-mono text-[0.7rem] text-mist">
                        🛡️ Admin
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {error && (
                    <div className="mb-5 rounded-xl border border-coral/20 bg-coral/10 px-4 py-3 text-[0.82rem] text-coral">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-[0.82rem] text-mist">
                        Chargement…
                    </div>
                ) : (
                    <>
                        {/* Section head */}
                        <div className="mb-5 flex items-start justify-between">
                            <div>
                                <h2 className="font-display text-[0.95rem] font-extrabold text-white-soft">
                                    Sélection &amp; Modération — Synthèse complète
                                </h2>
                                <p className="mt-0.5 text-[0.72rem] text-mist">
                                    Votes, commentaires, signalements du jury — tout en un seul
                                    endroit pour faciliter vos décisions.
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mb-6 grid grid-cols-6 gap-3">
                            <StatCard
                                label="Unanimes ✅"
                                value={stats.unanime}
                                sub="tous valident"
                                color="aurora"
                            />
                            <StatCard
                                label="Majorité 👍"
                                value={stats.majorite}
                                sub="+50% valident"
                                color="aurora"
                            />
                            <StatCard
                                label="Partagés ⚠️"
                                value={stats.partage}
                                sub="nécessitent attention"
                                color="solar"
                            />
                            <StatCard
                                label="Rejetés ❌"
                                value={stats.rejete}
                                sub="majorité refuse"
                                color="coral"
                            />
                            <StatCard
                                label="En attente ⏳"
                                value={stats.attente}
                                sub="pas encore évalués"
                                color="lavande"
                            />
                            <StatCard
                                label="Signalements 🚩"
                                value={stats.signale}
                                sub="tickets ouverts"
                                color="solar"
                            />
                        </div>

                        {/* Phase / selection progress banner */}
                        <div className="mb-5 flex items-center gap-4 rounded-xl border border-aurora/[0.15] bg-aurora/[0.03] px-5 py-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aurora/[0.08] text-lg">
                                ★
                            </div>
                            <div className="flex-1">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="text-[0.8rem] font-bold text-aurora">
                                        Sélection en cours
                                    </span>
                                    <span className="rounded-full border border-aurora/20 bg-aurora/[0.08] px-2 py-0.5 text-[0.65rem] font-bold text-aurora">
                                        {stats.selectionne} / 50 sélectionnés
                                    </span>
                                    {stats.selectionne >= 50 && (
                                        <span className="text-[0.72rem] font-bold text-aurora">
                                            ✓ Quota atteint
                                        </span>
                                    )}
                                </div>
                                <div className="h-[5px] overflow-hidden rounded-full bg-aurora/[0.08]">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-aurora to-[#a8ffec] transition-all duration-500"
                                        style={{
                                            width: `${Math.min(100, (stats.selectionne / 50) * 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="shrink-0 text-right">
                                <div className="font-mono text-[1.4rem] font-black leading-none text-aurora">
                                    {stats.selectionne}
                                </div>
                                <div className="mt-0.5 text-[0.65rem] text-mist">/ 50 films</div>
                            </div>
                            <div className="h-10 w-px shrink-0 bg-white/[0.06]" />
                            <div className="shrink-0 text-right">
                                <div className="font-mono text-[1.4rem] font-black leading-none text-lavande">
                                    {stats.finaliste}
                                </div>
                                <div className="mt-0.5 text-[0.65rem] text-mist">
                                    / 5 finalistes
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            {FILTER_BUTTONS.map(({ key, label, countKey }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={(): void => setFilter(key)}
                                    className={`rounded-lg border px-3 py-1.5 text-[0.78rem] font-semibold transition-all ${
                                        filter === key
                                            ? "border-aurora/30 bg-aurora/10 text-aurora"
                                            : "border-white/[0.08] bg-white/[0.03] text-mist hover:bg-white/[0.06] hover:text-white-soft"
                                    }`}
                                >
                                    {label}
                                    {countKey !== undefined && (
                                        <span className="ml-1.5 font-mono text-[0.65rem] opacity-70">
                                            {stats[countKey]}
                                        </span>
                                    )}
                                </button>
                            ))}
                            <div className="flex-1" />
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="🔍 Rechercher un film…"
                                className="min-w-[200px] rounded-lg border border-white/[0.09] bg-white/[0.04] px-3 py-1.5 font-body text-[0.82rem] text-white-soft outline-none placeholder:text-mist focus:border-aurora/40"
                            />
                        </div>

                        {/* Sort + count (only for non-special views) */}
                        {filter !== "selectionne" && filter !== "finaliste" && (
                            <div className="mb-4 flex items-center gap-2">
                                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-mist">
                                    Trier par :
                                </span>
                                {SORT_BUTTONS.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={(): void => setSort(key)}
                                        className={`rounded-lg border px-3 py-1.5 text-[0.75rem] font-semibold transition-all ${
                                            sort === key
                                                ? "border-aurora/30 bg-aurora/10 text-aurora"
                                                : "border-white/[0.08] bg-white/[0.03] text-mist hover:bg-white/[0.06] hover:text-white-soft"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                                <span className="ml-auto font-mono text-[0.72rem] text-mist">
                                    {filtered.length} film{filtered.length !== 1 ? "s" : ""} /{" "}
                                    {allFilms.length} total
                                </span>
                            </div>
                        )}

                        {/* Table / special views */}
                        {filter === "selectionne"
                            ? renderTop50()
                            : filter === "finaliste"
                              ? renderTop5()
                              : renderDefaultTable()}

                        {/* Row expand hint */}
                        {filter !== "selectionne" &&
                            filter !== "finaliste" &&
                            filtered.length > 0 && (
                                <p className="mt-3 text-center text-[0.68rem] text-mist opacity-40">
                                    Cliquez sur une ligne pour voir le détail des votes
                                </p>
                            )}
                    </>
                )}
            </div>

            <FilmInsightDrawer film={expandedFilm} onClose={() => setExpandedId(null)} />
        </div>
    );
};

export default AdminSelectionPage;
