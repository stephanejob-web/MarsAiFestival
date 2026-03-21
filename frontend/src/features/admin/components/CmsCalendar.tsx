import React from "react";
import { useCmsCalendar } from "../hooks/useCmsCalendar";

interface DateRowProps {
    label: string;
    sub: string;
    value: string;
    onChange: (v: string) => void;
    status?: "past" | "active" | "upcoming";
}

const STATUS_DOT: Record<string, string> = {
    past: "bg-white/20",
    active: "bg-aurora",
    upcoming: "bg-solar",
};

const DateRow = ({ label, sub, value, onChange, status }: DateRowProps): React.JSX.Element => {
    const dot = status ? STATUS_DOT[status] : "bg-white/10";

    return (
        <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-white/10">
            <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
            <div className="min-w-0 flex-1">
                <div className="text-[0.81rem] font-semibold leading-snug text-white-soft">
                    {label}
                </div>
                <div className="text-[0.67rem] text-mist">{sub}</div>
            </div>
            <input
                type="datetime-local"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-[180px] shrink-0 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-[0.75rem] text-white-soft outline-none transition-colors focus:border-aurora/40 scheme-dark"
            />
        </div>
    );
};

const getStatus = (dateStr: string): "past" | "active" | "upcoming" | undefined => {
    if (!dateStr) return undefined;
    const d = new Date(dateStr);
    const now = new Date();
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < -1) return "past";
    if (diff <= 1) return "active";
    return "upcoming";
};

const GroupLabel = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
    <div className="mb-1.5 mt-4 first:mt-0 font-mono text-[0.62rem] uppercase tracking-widest text-white/25">
        {children}
    </div>
);

const CmsCalendar = (): React.JSX.Element => {
    const { data, isSaving, saved, handleChange, handleSave } = useCmsCalendar();

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.05] bg-surface-2 transition-colors hover:border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pb-3 pt-[18px]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-solar/20 bg-solar/10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect
                            x="2"
                            y="3"
                            width="12"
                            height="11"
                            rx="2"
                            stroke="#f5e642"
                            strokeWidth="1.4"
                        />
                        <path
                            d="M2 7h12M5 1v4M11 1v4"
                            stroke="#f5e642"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <div className="flex-1">
                    <div className="font-display text-[0.92rem] font-extrabold text-white-soft">
                        Calendrier
                    </div>
                    <div className="text-[0.71rem] text-mist">
                        Dates clés affichées publiquement
                    </div>
                </div>
                {/* Légende */}
                <div className="hidden sm:flex items-center gap-3 text-[0.65rem] text-mist">
                    <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-aurora inline-block" /> En
                        cours
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-solar inline-block" /> À venir
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/20 inline-block" /> Passé
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="border-t border-white/[0.05] px-5 pb-5 pt-3">
                <GroupLabel>Candidatures</GroupLabel>
                <div className="flex flex-col gap-1.5">
                    <DateRow
                        label="Ouverture des candidatures"
                        sub="Le formulaire de dépôt devient accessible"
                        value={data.submission_open}
                        onChange={(v) => handleChange("submission_open", v)}
                        status={getStatus(data.submission_open)}
                    />
                    <DateRow
                        label="Clôture des candidatures"
                        sub="Fermeture définitive du formulaire"
                        value={data.submission_close}
                        onChange={(v) => handleChange("submission_close", v)}
                        status={getStatus(data.submission_close)}
                    />
                </div>

                <GroupLabel>Phases de délibération</GroupLabel>
                <div className="flex flex-col gap-1.5">
                    <DateRow
                        label="Phase 1 — Jury Top 50"
                        sub="Ouverture de l'évaluation première sélection"
                        value={data.phase1_open}
                        onChange={(v) => handleChange("phase1_open", v)}
                        status={getStatus(data.phase1_open)}
                    />
                    <DateRow
                        label="Phase 2 — Jury Top 5"
                        sub="Ouverture de la délibération finale"
                        value={data.phase2_open}
                        onChange={(v) => handleChange("phase2_open", v)}
                        status={getStatus(data.phase2_open)}
                    />
                </div>

                <GroupLabel>Cérémonie</GroupLabel>
                <div className="flex flex-col gap-1.5">
                    <DateRow
                        label="Cérémonie de clôture"
                        sub="Remise des prix — Friches Belle de Mai, Marseille"
                        value={data.ceremony_date}
                        onChange={(v) => handleChange("ceremony_date", v)}
                        status={getStatus(data.ceremony_date)}
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`mt-4 block w-full rounded-lg border px-4 py-2 text-center font-display text-[0.8rem] font-extrabold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                        saved
                            ? "border-aurora/40 bg-aurora/15 text-aurora"
                            : "border-aurora/25 bg-aurora/10 text-aurora hover:border-aurora/40 hover:bg-aurora/15"
                    }`}
                >
                    {saved
                        ? "Calendrier enregistré"
                        : isSaving
                          ? "Enregistrement…"
                          : "Enregistrer le calendrier"}
                </button>
            </div>
        </div>
    );
};

export default CmsCalendar;
