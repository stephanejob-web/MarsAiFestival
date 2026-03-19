import React, { useState } from "react";
import StatCard from "../features/admin/components/StatCard";
import useAdminSelection, {
    getConsensus,
    type FilterKey,
    type SortKey,
} from "../features/admin/hooks/useAdminSelection";
import type { AdminFilmVoteSummary, JuryDecision } from "../features/admin/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const CONSENSUS_CONFIG: Record<string, { label: string; cls: string }> = {
    unanime: {
        label: "✅ Unanime",
        cls: "bg-aurora/10 text-aurora border border-aurora/25",
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

const exportCSV = (films: AdminFilmVoteSummary[]): void => {
    const headers = [
        "#",
        "Dossier",
        "Titre",
        "Valide",
        "À revoir",
        "Refusé",
        "Discussion",
        "Total votes",
        "Jurés assignés",
        "Commentaires",
        "Tickets",
        "Statut",
    ];
    const rows = films.map((f, i) => [
        i + 1,
        f.dossier_num,
        `"${f.original_title.replace(/"/g, '""')}"`,
        f.votes_valide,
        f.votes_arevoir,
        f.votes_refuse,
        f.votes_discussion,
        f.total_votes,
        f.total_assigned,
        f.total_comments,
        f.total_tickets,
        f.statut || "—",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selection-votes.csv";
    a.click();
    URL.revokeObjectURL(url);
};

// ── Sub-components ────────────────────────────────────────────────────────────

// Vert = a voté, gris = pas encore voté
const VOTED_BORDER = "#4effce"; // aurora green
const PENDING_BORDER = "rgba(255,255,255,0.18)";
const VOTED_BG = "rgba(78,255,206,0.15)";
const PENDING_BG = "rgba(255,255,255,0.04)";

interface JuryVoteDotsProps {
    film: AdminFilmVoteSummary;
}

const JuryVoteDots = ({ film }: JuryVoteDotsProps): React.JSX.Element => {
    const decisions = film.jury_decisions ?? [];

    if (decisions.length === 0) {
        return <span className="text-[0.65rem] text-mist opacity-40">—</span>;
    }

    return (
        <div className="flex flex-col gap-1.5">
            {decisions.map((d: JuryDecision) => {
                const hasVoted = d.decision !== null;
                const borderColor = hasVoted ? VOTED_BORDER : PENDING_BORDER;
                const bgColor = hasVoted ? VOTED_BG : PENDING_BG;
                const initials = `${d.first_name.charAt(0)}${d.last_name.charAt(0)}`.toUpperCase();
                const fullName = `${d.first_name} ${d.last_name}`;

                return (
                    <div
                        key={d.jury_id}
                        className="flex items-center gap-2"
                        style={{ opacity: hasVoted ? 1 : 0.4 }}
                    >
                        {/* Avatar */}
                        <div
                            className="relative inline-flex h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full"
                            style={{ border: `3px solid ${borderColor}` }}
                        >
                            {d.profil_picture ? (
                                <img
                                    src={d.profil_picture}
                                    alt={fullName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div
                                    className="flex h-full w-full items-center justify-center font-display text-[0.75rem] font-black text-white-soft"
                                    style={{ background: bgColor }}
                                >
                                    {initials}
                                </div>
                            )}
                            {hasVoted && (
                                <span
                                    className="absolute -bottom-[3px] -right-[3px] flex h-[14px] w-[14px] items-center justify-center rounded-full"
                                    style={{ background: VOTED_BORDER }}
                                >
                                    <svg width="8" height="8" viewBox="0 0 6 6" fill="none">
                                        <path
                                            d="M1 3l1.5 1.5L5 1.5"
                                            stroke="#0a0c14"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                            )}
                        </div>

                        {/* Nom complet */}
                        <span
                            className="font-display text-[0.72rem] font-semibold"
                            style={{ color: hasVoted ? VOTED_BORDER : "rgba(255,255,255,0.45)" }}
                        >
                            {fullName}
                        </span>
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
                        ? "border border-aurora/50 bg-aurora/[0.15] text-aurora shadow-[0_0_12px_rgba(78,255,206,0.15)]"
                        : "border border-aurora/20 bg-aurora/[0.05] text-aurora hover:bg-aurora/[0.12]"
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
                                strokeWidth="1.8"
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

interface ExpandedRowProps {
    film: AdminFilmVoteSummary;
    colSpan: number;
}

const ExpandedRow = ({ film, colSpan }: ExpandedRowProps): React.JSX.Element => (
    <tr>
        <td colSpan={colSpan} className="border-t border-white/[0.04] bg-white/[0.015] px-5 py-4">
            <div className="grid grid-cols-2 gap-4">
                {/* Vote breakdown */}
                <div>
                    <div className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-mist">
                        ⚖️ Répartition des votes
                    </div>
                    <div className="space-y-1.5">
                        {[
                            { label: "✓ Validé", count: film.votes_valide, color: "text-aurora" },
                            { label: "↩ À revoir", count: film.votes_arevoir, color: "text-solar" },
                            { label: "✕ Refusé", count: film.votes_refuse, color: "text-coral" },
                            {
                                label: "💬 En discussion",
                                count: film.votes_discussion,
                                color: "text-lavande",
                            },
                        ].map(({ label, count, color }) => (
                            <div key={label} className="flex items-center gap-2">
                                <span className={`w-28 text-[0.75rem] font-semibold ${color}`}>
                                    {label}
                                </span>
                                <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                                    <div
                                        className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
                                        style={{
                                            width:
                                                (film.total_jury ?? film.total_assigned) > 0
                                                    ? `${(count / (film.total_jury ?? film.total_assigned)) * 100}%`
                                                    : "0%",
                                        }}
                                    />
                                </div>
                                <span className="w-6 text-right font-mono text-[0.72rem] text-mist">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Meta */}
                <div>
                    <div className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-mist">
                        📊 Données
                    </div>
                    <div className="space-y-1">
                        <div className="flex gap-2 text-[0.75rem]">
                            <span className="text-mist">Jurés ayant voté :</span>
                            <span className="font-semibold text-white-soft">
                                {film.total_votes} / {film.total_jury ?? film.total_assigned}
                            </span>
                        </div>
                        <div className="flex gap-2 text-[0.75rem]">
                            <span className="text-mist">Commentaires :</span>
                            <span className="font-semibold text-lavande">
                                {film.total_comments}
                            </span>
                        </div>
                        {film.total_tickets > 0 && (
                            <div className="flex gap-2 text-[0.75rem]">
                                <span className="text-mist">Tickets ouverts :</span>
                                <span className="font-semibold text-solar">
                                    {film.total_tickets}
                                </span>
                            </div>
                        )}
                        <div className="flex gap-2 text-[0.75rem]">
                            <span className="text-mist">Dossier :</span>
                            <span className="font-mono font-semibold text-white-soft">
                                {film.dossier_num}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </td>
    </tr>
);

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearch(e.target.value);
    };

    const handleRowClick = (filmId: number): void => {
        setExpandedId((prev) => (prev === filmId ? null : filmId));
    };

    const handleExport = (): void => {
        exportCSV(filtered);
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
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="px-4 py-12 text-center text-[0.82rem] text-mist"
                            >
                                Aucun film ne correspond à ce filtre.
                            </td>
                        </tr>
                    ) : (
                        filtered.map((film, index) => {
                            const consensus = getConsensus(film);
                            const badge = CONSENSUS_CONFIG[consensus];
                            const isExpanded = expandedId === film.film_id;
                            return (
                                <React.Fragment key={film.film_id}>
                                    <tr
                                        onClick={(): void => handleRowClick(film.film_id)}
                                        className="cursor-pointer border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                                    >
                                        {/* # */}
                                        <td className="px-4 py-3 font-mono text-[0.7rem] text-mist">
                                            {index + 1}
                                        </td>

                                        {/* Film */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <div className="text-[0.82rem] font-semibold text-white-soft">
                                                    {film.original_title}
                                                </div>
                                                {isExpanded && (
                                                    <span className="text-[0.65rem] text-aurora opacity-60">
                                                        ▲
                                                    </span>
                                                )}
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
                                    </tr>
                                    {isExpanded && <ExpandedRow film={film} colSpan={7} />}
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
                            <button
                                type="button"
                                onClick={handleExport}
                                className="flex shrink-0 items-center gap-2 rounded-[9px] bg-aurora px-[18px] py-2.5 font-display text-[0.82rem] font-extrabold tracking-[0.01em] text-deep-sky transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(78,255,206,0.35)]"
                            >
                                📤 Exporter CSV
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="mb-6 grid grid-cols-5 gap-3">
                            <StatCard
                                label="Unanimes ✅"
                                value={stats.unanime}
                                sub="validation directe"
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
                                sub="majorité refusé"
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
        </div>
    );
};

export default AdminSelectionPage;
