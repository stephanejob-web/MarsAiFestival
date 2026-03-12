import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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

const DAY_EVENT_TYPES: EventType[][] = [
    ["default", "opening", "masterclass", "pause", "projection", "masterclass", "projection", "default", "gala"],
    ["projection", "masterclass", "pause", "projection", "default", "opening", "gala", "gala"],
];

const DAY_EVENT_TIMES: string[][] = [
    ["09:00", "10:00", "10:45", "12:30", "14:00", "15:45", "17:00", "18:30", "20:00"],
    ["09:30", "11:00", "12:30", "14:00", "15:30", "17:30", "19:00", "20:30"],
];

const ProgrammeSection = (): React.JSX.Element => {
    const [activeDay, setActiveDay] = useState<number>(0);
    const { t } = useTranslation();

    const TYPE_LABELS: Record<EventType, string> = {
        opening: t("programme.typeLabels.opening"),
        projection: t("programme.typeLabels.projection"),
        masterclass: t("programme.typeLabels.masterclass"),
        pause: t("programme.typeLabels.pause"),
        gala: t("programme.typeLabels.gala"),
        default: t("programme.typeLabels.default"),
    };

    const buildDays = (): Day[] =>
        [0, 1].map((di) => {
            const eventKeys = Object.keys(
                (t(`programme.days.${di}.events`, { returnObjects: true }) as Record<string, unknown>)
            );
            const events: Event[] = eventKeys.map((ek) => {
                const evData = t(`programme.days.${di}.events.${ek}`, {
                    returnObjects: true,
                }) as { title: string; desc?: string };
                return {
                    time: DAY_EVENT_TIMES[di][Number(ek)],
                    title: evData.title,
                    desc: evData.desc,
                    type: DAY_EVENT_TYPES[di][Number(ek)],
                };
            });
            return {
                label: t(`programme.days.${di}.label`),
                date: t(`programme.days.${di}.date`),
                events,
            };
        });

    const DAYS: Day[] = buildDays();
    const day = DAYS[activeDay];

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

                {/* Onglets jours */}
                <div className="flex gap-2 justify-center mb-10">
                    {DAYS.map((d, i) => (
                        <button
                            key={d.label}
                            onClick={(): void => setActiveDay(i)}
                            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                                activeDay === i
                                    ? "bg-aurora text-deep-sky"
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

                {/* Date complète */}
                <div className="text-center font-mono text-xs text-white/30 uppercase tracking-widest mb-8">
                    {day.date}
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Ligne verticale */}
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
            </div>
        </section>
    );
};

export default ProgrammeSection;
