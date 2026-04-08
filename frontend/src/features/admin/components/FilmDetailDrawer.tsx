import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { apiFetch } from "../../../services/api";
import { API_BASE_URL } from "../../../constants/api";

const getToken = (): string => localStorage.getItem("jury_token") ?? "";

export interface FilmDetail {
    id: number;
    dossier_num: string;
    original_title: string;
    english_title: string | null;
    language: string;
    tags: string | null;
    original_synopsis: string | null;
    english_synopsis: string | null;
    creative_workflow: string | null;
    tech_stack: string | null;
    duration: number | null;
    ia_class: "full" | "hybrid";
    ia_image: boolean | number;
    ia_son: boolean | number;
    ia_scenario: boolean | number;
    ia_post: boolean | number;
    statut: string;
    video_url: string | null;
    poster_img: string | null;
    created_at: string;
    // Réalisateur
    first_name: string;
    last_name: string;
    realisator_email: string;
    country: string;
    profession: string | null;
    mobile_phone: string | null;
    youtube: string | null;
    instagram: string | null;
    linkedin: string | null;
    facebook: string | null;
    xtwitter: string | null;
}

interface FilmDetailDrawerProps {
    filmId: number | null;
    onClose: () => void;
}

const STATUT_CONFIG: Record<string, { label: string; color: string }> = {
    to_review: { label: "À examiner", color: "text-mist border-mist/30 bg-mist/10" },
    soumis: { label: "Soumis", color: "text-lavande border-lavande/30 bg-lavande/10" },
    valide: { label: "Validé", color: "text-aurora border-aurora/30 bg-aurora/10" },
    arevoir: { label: "À revoir", color: "text-solar border-solar/30 bg-solar/10" },
    refuse: { label: "Refusé", color: "text-coral border-coral/30 bg-coral/10" },
    in_discussion: {
        label: "En discussion",
        color: "text-lavande border-lavande/30 bg-lavande/10",
    },
    asked_to_modify: { label: "Modif. demandée", color: "text-solar border-solar/30 bg-solar/10" },
    selectionne: { label: "Sélectionné", color: "text-aurora border-aurora/30 bg-aurora/10" },
    finaliste: { label: "Finaliste", color: "text-aurora border-aurora/30 bg-aurora/10" },
};

const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}min ${s > 0 ? `${s}s` : ""}`.trim();
};

const IaBadge = ({ label, active }: { label: string; active: boolean }): React.JSX.Element => (
    <span
        className={`rounded-full border px-2.5 py-1 font-mono text-[0.62rem] font-bold ${
            active
                ? "border-aurora/30 bg-aurora/10 text-aurora"
                : "border-white/[0.07] bg-white/[0.03] text-mist opacity-40 line-through"
        }`}
    >
        {label}
    </span>
);

const SocialLink = ({
    href,
    label,
    icon,
}: {
    href: string | null;
    label: string;
    icon: string;
}): React.JSX.Element | null => {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[0.72rem] text-mist transition-colors hover:border-white/20 hover:text-white-soft"
        >
            <span>{icon}</span>
            {label}
        </a>
    );
};

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}): React.JSX.Element => (
    <div className="border-t border-white/[0.05] pt-4">
        <div className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-mist opacity-60">
            {title}
        </div>
        {children}
    </div>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }): React.JSX.Element => (
    <div className="flex gap-3 py-1">
        <span className="w-32 shrink-0 text-[0.72rem] text-mist">{label}</span>
        <span className="flex-1 text-[0.78rem] text-white-soft">{value ?? "—"}</span>
    </div>
);

const FilmDetailDrawer = ({ filmId, onClose }: FilmDetailDrawerProps): React.JSX.Element => {
    const [film, setFilm] = useState<FilmDetail | null>(null);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [emailStatus, setEmailStatus] = useState<"idle" | "ok" | "error">("idle");
    const [posterUploading, setPosterUploading] = useState(false);
    const posterInputRef = React.useRef<HTMLInputElement>(null);

    const sendEmail = (): void => {
        if (!filmId || !emailSubject.trim() || !emailMessage.trim()) return;
        setSending(true);
        setEmailStatus("idle");
        apiFetch<{ success: boolean }>(`/api/films/${filmId}/email`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subject: emailSubject.trim(), message: emailMessage.trim() }),
        })
            .then((res) => {
                setEmailStatus(res.success ? "ok" : "error");
                if (res.success) {
                    setEmailSubject("");
                    setEmailMessage("");
                }
            })
            .catch(() => setEmailStatus("error"))
            .finally(() => setSending(false));
    };

    useEffect(() => {
        if (!filmId) return;
        apiFetch<{ success: boolean; data: FilmDetail }>(`/api/films/${filmId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => {
                if (res.success) setFilm(res.data);
            })
            .catch(() => undefined);
    }, [filmId]);

    const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (!file || !filmId) return;
        setPosterUploading(true);
        const fd = new FormData();
        fd.append("poster", file);
        fetch(`${API_BASE_URL}/api/films/${filmId}/poster`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: fd,
        })
            .then((r) => r.json())
            .then((res: { success: boolean; poster_img?: string }) => {
                if (res.success && res.poster_img) {
                    setFilm((prev) => prev ? { ...prev, poster_img: res.poster_img! } : prev);
                }
            })
            .catch(() => undefined)
            .finally(() => setPosterUploading(false));
    };

    const isOpen = filmId !== null;
    // loading = drawer open but film not yet fetched (or fetching a new film)
    const loading = isOpen && film?.id !== filmId;
    const statut = film
        ? (STATUT_CONFIG[film.statut] ?? { label: film.statut, color: "text-mist" })
        : null;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[700] bg-[rgba(5,8,24,0.55)] backdrop-blur-[4px] transition-opacity duration-[280ms] ${
                    isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`fixed bottom-0 right-0 top-0 z-[710] flex w-[480px] flex-col border-l border-white/[0.08] bg-surface shadow-[-32px_0_80px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex shrink-0 items-start gap-3 border-b border-white/[0.06] px-5 pb-4 pt-5">
                    <div className="flex-1 min-w-0">
                        {loading || !film ? (
                            <div className="h-4 w-48 animate-pulse rounded bg-white/[0.06]" />
                        ) : (
                            <>
                                <div className="truncate font-display text-[0.95rem] font-extrabold leading-tight text-white-soft">
                                    {film.original_title}
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="font-mono text-[0.65rem] text-mist opacity-50">
                                        #{film.id} · {film.dossier_num}
                                    </span>
                                    {statut && (
                                        <span
                                            className={`rounded-full border px-2 py-0.5 text-[0.6rem] font-bold ${statut.color}`}
                                        >
                                            {statut.label}
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-0.5 shrink-0 cursor-pointer p-1 text-mist transition-colors hover:text-white-soft"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {loading && (
                        <div className="space-y-3">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-3 animate-pulse rounded bg-white/[0.05]"
                                    style={{ width: `${60 + (i % 3) * 15}%` }}
                                />
                            ))}
                        </div>
                    )}

                    {!loading && film && (
                        <div className="space-y-4">
                            {/* ── Affiche ── */}
                            <div className="mb-4">
                                <input
                                    ref={posterInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handlePosterUpload}
                                />
                                {film.poster_img ? (
                                    <div className="group relative">
                                        <img
                                            src={film.poster_img}
                                            alt={`Affiche — ${film.original_title}`}
                                            className="w-full rounded-xl object-cover max-h-64"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => posterInputRef.current?.click()}
                                            disabled={posterUploading}
                                            className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 text-transparent transition-all group-hover:bg-black/50 group-hover:text-white text-xs font-semibold"
                                        >
                                            {posterUploading ? "Upload…" : "Changer l'affiche"}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => posterInputRef.current?.click()}
                                        disabled={posterUploading}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.1] bg-white/[0.02] py-6 text-[0.75rem] text-mist transition-colors hover:border-aurora/40 hover:text-aurora disabled:opacity-50"
                                    >
                                        {posterUploading ? "Upload en cours…" : "🖼️ Uploader une affiche"}
                                    </button>
                                )}
                            </div>

                            {/* ── Film ── */}
                            <Section title="Film">
                                <Row label="Titre original" value={film.original_title} />
                                {film.english_title && (
                                    <Row label="Titre anglais" value={film.english_title} />
                                )}
                                <Row label="Langue" value={film.language} />
                                <Row
                                    label="Durée"
                                    value={film.duration ? formatDuration(film.duration) : null}
                                />
                                {film.tags && (
                                    <Row
                                        label="Tags"
                                        value={
                                            <div className="flex flex-wrap gap-1">
                                                {film.tags.split(",").map((t) => (
                                                    <span
                                                        key={t}
                                                        className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[0.65rem] text-mist"
                                                    >
                                                        {t.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        }
                                    />
                                )}
                            </Section>

                            {/* ── Synopsis ── */}
                            {(film.original_synopsis || film.english_synopsis) && (
                                <Section title="Synopsis">
                                    {film.original_synopsis && (
                                        <div className="mb-3">
                                            <div className="mb-1 text-[0.65rem] text-mist opacity-50">
                                                Français
                                            </div>
                                            <p className="text-[0.78rem] leading-relaxed text-white-soft">
                                                {film.original_synopsis}
                                            </p>
                                        </div>
                                    )}
                                    {film.english_synopsis && (
                                        <div>
                                            <div className="mb-1 text-[0.65rem] text-mist opacity-50">
                                                English
                                            </div>
                                            <p className="text-[0.78rem] leading-relaxed text-white-soft">
                                                {film.english_synopsis}
                                            </p>
                                        </div>
                                    )}
                                </Section>
                            )}

                            {/* ── Démarche & Outils ── */}
                            {(film.creative_workflow || film.tech_stack) && (
                                <Section title="Démarche & Outils">
                                    {film.creative_workflow && (
                                        <div className="mb-3">
                                            <div className="mb-1 text-[0.65rem] text-mist opacity-50">
                                                Workflow créatif
                                            </div>
                                            <p className="text-[0.78rem] leading-relaxed text-white-soft">
                                                {film.creative_workflow}
                                            </p>
                                        </div>
                                    )}
                                    {film.tech_stack && (
                                        <div>
                                            <div className="mb-1 text-[0.65rem] text-mist opacity-50">
                                                Outils & tech
                                            </div>
                                            <p className="text-[0.78rem] leading-relaxed text-white-soft">
                                                {film.tech_stack}
                                            </p>
                                        </div>
                                    )}
                                </Section>
                            )}

                            {/* ── Déclaration IA ── */}
                            <Section title="Déclaration IA">
                                <div className="mb-3">
                                    <Row
                                        label="Classification"
                                        value={
                                            <span
                                                className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] font-bold ${
                                                    film.ia_class === "full"
                                                        ? "border-aurora/30 bg-aurora/10 text-aurora"
                                                        : "border-lavande/30 bg-lavande/10 text-lavande"
                                                }`}
                                            >
                                                {film.ia_class === "full" ? "Full AI" : "Hybrid"}
                                            </span>
                                        }
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <IaBadge label="Image IA" active={!!film.ia_image} />
                                    <IaBadge label="Son IA" active={!!film.ia_son} />
                                    <IaBadge label="Scénario IA" active={!!film.ia_scenario} />
                                    <IaBadge label="Post-prod IA" active={!!film.ia_post} />
                                </div>
                            </Section>

                            {/* ── Réalisateur ── */}
                            <Section title="Réalisateur">
                                <Row label="Nom" value={`${film.first_name} ${film.last_name}`} />
                                <Row label="Email" value={film.realisator_email} />
                                <Row label="Pays" value={film.country} />
                                {film.profession && <Row label="Métier" value={film.profession} />}
                                {film.mobile_phone && (
                                    <Row label="Téléphone" value={film.mobile_phone} />
                                )}
                                {(film.youtube ||
                                    film.instagram ||
                                    film.linkedin ||
                                    film.facebook ||
                                    film.xtwitter) && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <SocialLink href={film.youtube} label="YouTube" icon="▶" />
                                        <SocialLink
                                            href={film.instagram}
                                            label="Instagram"
                                            icon="◈"
                                        />
                                        <SocialLink
                                            href={film.linkedin}
                                            label="LinkedIn"
                                            icon="in"
                                        />
                                        <SocialLink
                                            href={film.facebook}
                                            label="Facebook"
                                            icon="f"
                                        />
                                        <SocialLink href={film.xtwitter} label="X" icon="𝕏" />
                                    </div>
                                )}
                            </Section>

                            {/* ── Dépôt ── */}
                            <Section title="Dépôt">
                                <Row
                                    label="Date de dépôt"
                                    value={new Date(film.created_at).toLocaleDateString("fr-FR", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                />
                                <Row label="N° dossier" value={film.dossier_num} />
                                {film.video_url && (
                                    <Row
                                        label="Vidéo"
                                        value={
                                            <span className="flex items-center gap-1">
                                                <Check size={12} /> Uploadée
                                            </span>
                                        }
                                    />
                                )}
                            </Section>
                        </div>
                    )}
                </div>

                {/* ── Email footer ── */}
                {film && film.realisator_email && (
                    <div className="shrink-0 border-t border-white/[0.06] px-5 py-4">
                        <div className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-mist opacity-60">
                            Email au réalisateur
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Sujet…"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                className="w-full rounded-lg border border-white/[0.09] bg-white/[0.04] px-3 py-2 text-[0.78rem] text-white-soft placeholder-mist/50 outline-none transition-colors focus:border-aurora/40"
                            />
                            <textarea
                                placeholder="Message…"
                                value={emailMessage}
                                onChange={(e) => setEmailMessage(e.target.value)}
                                rows={3}
                                className="w-full resize-none rounded-lg border border-white/[0.09] bg-white/[0.04] px-3 py-2 text-[0.78rem] text-white-soft placeholder-mist/50 outline-none transition-colors focus:border-aurora/40"
                            />
                            <div className="flex items-center justify-between">
                                {emailStatus === "ok" && (
                                    <span className="flex items-center gap-1 text-[0.72rem] text-aurora">
                                        <Check size={12} /> Email envoyé
                                    </span>
                                )}
                                {emailStatus === "error" && (
                                    <span className="flex items-center gap-1 text-[0.72rem] text-coral">
                                        <X size={12} /> Échec de l&apos;envoi
                                    </span>
                                )}
                                {emailStatus === "idle" && <span />}
                                <button
                                    type="button"
                                    onClick={sendEmail}
                                    disabled={
                                        sending || !emailSubject.trim() || !emailMessage.trim()
                                    }
                                    className="rounded-lg border border-aurora/30 bg-aurora/[0.08] px-4 py-1.5 font-display text-[0.75rem] font-semibold text-aurora transition-all hover:border-aurora/50 hover:bg-aurora/[0.14] disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    {sending ? "Envoi…" : "Envoyer"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FilmDetailDrawer;
