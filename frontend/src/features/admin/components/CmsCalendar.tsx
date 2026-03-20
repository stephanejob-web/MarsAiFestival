import React, { useState } from "react";

interface CalendarItemProps {
    name: string;
    sub: string;
    date: string;
    initialActive: boolean;
}

const CalendarItem = ({ name, sub, date, initialActive }: CalendarItemProps): React.JSX.Element => {
    const [isActive, setIsActive] = useState<boolean>(initialActive);

    const handleToggle = (): void => {
        setIsActive(!isActive);
    };

    return (
        <div className="mt-2.5 grid grid-cols-1 items-center gap-2 rounded-lg border border-white/5 bg-white/5 p-3 sm:grid-cols-[1fr_auto_auto] sm:gap-3">
            <div>
                <div className="text-[0.82rem] font-semibold text-white-soft">{name}</div>
                <div className="mt-0.5 text-[0.68rem] text-mist">{sub}</div>
            </div>
            <input
                type="date"
                defaultValue={date}
                className="w-full rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-[0.78rem] text-white-soft outline-none scheme-dark sm:w-auto"
            />
            {/* Custom Toggle Switch */}
            <div
                className={`relative h-[18px] w-[34px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                    isActive ? "bg-aurora/35" : "bg-white/10"
                }`}
                onClick={handleToggle}
            >
                <div
                    className={`absolute left-[2px] top-[2px] h-[14px] w-[14px] rounded-full transition-all duration-200 ${
                        isActive ? "translate-x-4 bg-aurora" : "bg-mist"
                    }`}
                ></div>
            </div>
        </div>
    );
};

const CmsCalendar = (): React.JSX.Element => {
    return (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/5 bg-surface-2 transition-colors hover:border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pb-4 pt-[18px]">
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
                <div>
                    <div className="font-display text-[0.92rem] font-extrabold text-white-soft">
                        Calendrier
                    </div>
                    <div className="mt-0.5 text-[0.72rem] text-mist">
                        Dates clés affichées publiquement
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="border-t border-white/5 px-5 pb-5 pt-1">
                <CalendarItem
                    name="Ouverture des candidatures"
                    sub="Formulaire de dépôt accessible"
                    date="2026-03-01"
                    initialActive={true}
                />
                <CalendarItem
                    name="Clôture des candidatures"
                    sub="Fermeture du formulaire"
                    date="2026-10-31"
                    initialActive={true}
                />
                <CalendarItem
                    name="Phase 1 — Jury Top 50"
                    sub="Évaluation première sélection"
                    date="2026-12-12"
                    initialActive={true}
                />
                <CalendarItem
                    name="Phase 2 — Jury Top 5"
                    sub="Délibération finale"
                    date="2026-12-22"
                    initialActive={true}
                />
                <CalendarItem
                    name="Cérémonie de clôture"
                    sub="Remise des prix — Marseille"
                    date="2027-01-15"
                    initialActive={true}
                />

                <button className="mt-[14px] block w-full shrink-0 cursor-pointer rounded-lg border border-aurora/25 bg-aurora/10 px-4.5 py-2 text-center font-display text-[0.8rem] font-extrabold text-aurora transition-all hover:border-aurora/40 hover:bg-aurora/15">
                    Enregistrer le calendrier →
                </button>
            </div>
        </div>
    );
};

export default CmsCalendar;
