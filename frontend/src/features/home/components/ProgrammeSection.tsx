import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../../constants/api";

type EventType = "opening" | "projection" | "masterclass" | "pause" | "gala" | "default";

interface Event {
    time: string;
    title: string;
    desc?: string;
    type: EventType;
}

interface Day {
    label: string;
    date: string;
    events: Event[];
}

interface ApiEvent {
    id: number;
    day: number;
    event_date: string | null;
    time: string;
    title: string;
    description: string | null;
    type: EventType;
    sort_order: number;
}

const TYPE_STYLES: Record<EventType, string> = {
    opening: "text-aurora border-aurora/40 bg-aurora/5",
    projection: "text-solar border-solar/40 bg-solar/5",
    masterclass: "text-lavande border-lavande/40 bg-lavande/5",
    pause: "text-mist border-white/10 bg-white/3",
    gala: "text-coral border-coral/40 bg-coral/5",
    default: "text-white/60 border-white/10 bg-white/3",
};

const TYPE_DOT: Record<EventType, string> = {
    opening: "bg-aurora",
    projection: "bg-solar",
    masterclass: "bg-lavande",
    pause: "bg-white/20",
    gala: "bg-coral",
    default: "bg-white/30",
};

const ProgrammeSection = (): React.JSX.Element => {
    const [activeDay, setActiveDay] = useState<number>(0);
    const [apiEvents, setApiEvents] = useState<ApiEvent[] | null>(null);
    const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
    const { t } = useTranslation();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/programme`)
            .then((r) => r.json())
            .then((json) => {
                if (json.success && Array.isArray(json.data)) {
                    setApiEvents(json.data);
                } else {
                    setApiEvents([]);
                }
            })
            .catch(() => {
                setApiEvents([]);
            })
            .finally(() => {
                setLoadingEvents(false);
            });
    }, []);

    const TYPE_LABELS: Record<EventType, string> = {
        opening: t("programme.typeLabels.opening"),
        projection: t("programme.typeLabels.projection"),
        masterclass: t("programme.typeLabels.masterclass"),
        pause: t("programme.typeLabels.pause"),
        gala: t("programme.typeLabels.gala"),
        default: t("programme.typeLabels.default"),
    };

    const buildDays = (): Day[] => {
        if (!apiEvents || apiEvents.length === 0) return [];
        const dateKeys = [
            ...new Set(
                apiEvents
                    .map((e) => (e.event_date ? String(e.event_date).slice(0, 10) : null))
                    .filter(Boolean) as string[],
            ),
        ].sort();
        return dateKeys.map((dk) => {
            const d = new Date(dk + "T00:00:00");
            const label = d.toLocaleDateString("fr-FR", { weekday: "long" });
            const date = d.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            const events = apiEvents
                .filter((e) => e.event_date && String(e.event_date).slice(0, 10) === dk)
                .map((e) => ({
                    time: e.time,
                    title: e.title,
                    desc: e.description ?? undefined,
                    type: e.type,
                }));
            return { label, date, events };
        });
    };

    const DAYS: Day[] = buildDays();
    const day = DAYS[activeDay] ?? { label: "", date: "", events: [] };

    return (
        <section id="programme" className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="font-mono text-xs text-aurora tracking-widest uppercase mb-3">
                        {t("programme.overline")}
                    </div>
                    <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                        {t("programme.title")}
                    </h2>
                    <p className="text-mist max-w-lg mx-auto">{t("programme.subtitle")}</p>
                </div>

                {/* Onglets jours — cachés si 0 ou 1 jour */}
                {DAYS.length > 1 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-10">
                        {DAYS.map((d, i) => (
                            <button
                                key={i}
                                onClick={(): void => setActiveDay(i)}
                                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                                    activeDay === i
                                        ? "bg-aurora text-[#0a0f2e]"
                                        : "bg-surface border border-white/10 text-mist hover:text-white hover:border-white/25"
                                }`}
                            >
                                {d.label}
                                <span className="hidden sm:inline text-xs font-normal ml-2 opacity-70">
                                    {d.date.split(" ").slice(0, 2).join(" ")}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Date complète */}
                {day.date && (
                    <div className="text-center font-mono text-xs text-white/30 uppercase tracking-widest mb-8">
                        {day.date}
                    </div>
                )}

                {/* Loading state */}
                {loadingEvents && (
                    <div className="text-center text-sm text-mist py-12">
                        Chargement du programme…
                    </div>
                )}

                {/* Empty state */}
                {!loadingEvents && (DAYS.length === 0 || day.events.length === 0) && (
                    <div className="text-center py-16 border border-white/8 rounded-2xl">
                        <div className="font-mono text-xs text-aurora/50 uppercase tracking-widest mb-2">
                            {t("programme.overline")}
                        </div>
                        <p className="text-mist text-sm">
                            {t("programme.empty", "Programme à venir")}
                        </p>
                    </div>
                )}

                {/* Timeline */}
                {!loadingEvents && day.events.length > 0 && (
                    <div className="relative">
                        <div
                            className="absolute left-[72px] top-0 bottom-0 w-px bg-white/8"
                            aria-hidden="true"
                        />

                        <div className="flex flex-col gap-1">
                            {day.events.map((event, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    {/* Heure */}
                                    <div className="w-[72px] shrink-0 text-right pt-3.5">
                                        <span className="font-mono text-sm font-semibold text-white/40">
                                            {event.time}
                                        </span>
                                    </div>

                                    {/* Point sur la ligne */}
                                    <div className="shrink-0 relative z-10 mt-4">
                                        <div
                                            className={`w-2.5 h-2.5 rounded-full ring-2 ring-[#050714] ${TYPE_DOT[event.type]}`}
                                        />
                                    </div>

                                    {/* Carte événement */}
                                    <div
                                        className={`flex-1 mb-3 border rounded-xl px-4 py-3 transition-colors ${TYPE_STYLES[event.type]} ${event.type === "pause" ? "opacity-50" : ""}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="font-semibold text-sm leading-snug text-white-soft">
                                                {event.title}
                                            </span>
                                            {TYPE_LABELS[event.type] && (
                                                <span
                                                    className={`font-mono text-[10px] uppercase tracking-wider shrink-0 mt-0.5 ${TYPE_STYLES[event.type].split(" ")[0]}`}
                                                >
                                                    {TYPE_LABELS[event.type]}
                                                </span>
                                            )}
                                        </div>
                                        {event.desc && (
                                            <p className="text-xs text-mist mt-1 leading-relaxed">
                                                {event.desc}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProgrammeSection;
