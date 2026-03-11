import React, { useState } from "react";

interface Event {
    time: string;
    title: string;
    desc?: string;
    type: "opening" | "projection" | "masterclass" | "pause" | "gala" | "default";
}

interface Day {
    label: string;
    date: string;
    events: Event[];
}

const TYPE_STYLES: Record<Event["type"], string> = {
    opening: "text-aurora border-aurora/40 bg-aurora/5",
    projection: "text-solar border-solar/40 bg-solar/5",
    masterclass: "text-lavande border-lavande/40 bg-lavande/5",
    pause: "text-mist border-white/10 bg-white/3",
    gala: "text-coral border-coral/40 bg-coral/5",
    default: "text-white/60 border-white/10 bg-white/3",
};

const TYPE_DOT: Record<Event["type"], string> = {
    opening: "bg-aurora",
    projection: "bg-solar",
    masterclass: "bg-lavande",
    pause: "bg-white/20",
    gala: "bg-coral",
    default: "bg-white/30",
};

const DAYS: Day[] = [
    {
        label: "Jour 1",
        date: "Samedi 14 mars 2026",
        events: [
            {
                time: "09:00",
                title: "Accueil & accréditations",
                desc: "Ouverture des portes — Friches Belle de Mai, Marseille.",
                type: "default",
            },
            {
                time: "10:00",
                title: "Ouverture officielle",
                desc: "Mot de la présidente du jury et présentation de l'édition 2026.",
                type: "opening",
            },
            {
                time: "10:45",
                title: "Masterclass — Créer avec Sora & Runway",
                desc: "Techniques, prompts et workflow pour le court-métrage IA.",
                type: "masterclass",
            },
            {
                time: "12:30",
                title: "Pause déjeuner",
                type: "pause",
            },
            {
                time: "14:00",
                title: "Projections — Sélection officielle (Bloc 1/4)",
                desc: "5 films en compétition. Séance suivie d'une discussion avec les créateurs.",
                type: "projection",
            },
            {
                time: "15:45",
                title: "Table ronde — L'IA change-t-elle le regard du cinéaste ?",
                desc: "Avec des réalisateurs, producteurs et artistes numériques.",
                type: "masterclass",
            },
            {
                time: "17:00",
                title: "Projections — Sélection officielle (Bloc 2/4)",
                desc: "5 films en compétition.",
                type: "projection",
            },
            {
                time: "18:30",
                title: "Apéritif créateurs",
                desc: "Networking & rencontres entre participants.",
                type: "default",
            },
            {
                time: "20:00",
                title: "Soirée d'ouverture — DJ set génératif",
                desc: "Musique générée en temps réel par IA. Entrée libre.",
                type: "gala",
            },
        ],
    },
    {
        label: "Jour 2",
        date: "Dimanche 15 mars 2026",
        events: [
            {
                time: "09:30",
                title: "Projections — Sélection officielle (Bloc 3/4)",
                desc: "5 films en compétition.",
                type: "projection",
            },
            {
                time: "11:00",
                title: "Atelier live — Prompt to Screen en 60 minutes",
                desc: "Créez un court-métrage IA en direct avec les outils du festival.",
                type: "masterclass",
            },
            {
                time: "12:30",
                title: "Pause déjeuner",
                type: "pause",
            },
            {
                time: "14:00",
                title: "Projections — Sélection officielle (Bloc 4/4)",
                desc: "5 films en compétition. Dernière séance avant délibération.",
                type: "projection",
            },
            {
                time: "15:30",
                title: "Délibération du jury",
                desc: "Séance à huis clos — vote du public ouvert en ligne.",
                type: "default",
            },
            {
                time: "17:30",
                title: "Clôture du vote public",
                type: "opening",
            },
            {
                time: "19:00",
                title: "Gala de clôture — Mars.AI Night",
                desc: "Tapis rouge, performances et remise des prix.",
                type: "gala",
            },
            {
                time: "20:30",
                title: "Palmarès & DJ set de clôture",
                desc: "Annonce des lauréats. Fête jusqu'au bout de la nuit.",
                type: "gala",
            },
        ],
    },
];

const TYPE_LABELS: Record<Event["type"], string> = {
    opening: "Cérémonie",
    projection: "Projection",
    masterclass: "Masterclass",
    pause: "Pause",
    gala: "Gala",
    default: "",
};

const ProgrammeSection = (): React.JSX.Element => {
    const [activeDay, setActiveDay] = useState<number>(0);
    const day = DAYS[activeDay];

    return (
        <section id="programme" className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="font-mono text-xs text-aurora tracking-widest uppercase mb-3">
                        Marseille · 14 &amp; 15 mars 2026
                    </div>
                    <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                        Programme
                    </h2>
                    <p className="text-mist max-w-lg mx-auto">
                        Deux jours de projections, masterclasses et rencontres autour du cinéma IA.
                    </p>
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
                    <div className="absolute left-[72px] top-0 bottom-0 w-px bg-white/8" aria-hidden="true" />

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
