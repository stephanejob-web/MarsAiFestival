import React from "react";

interface ConceptCard {
    num: string;
    title: string;
    desc: string;
}

const CONCEPT_CARDS: ConceptCard[] = [
    {
        num: "1'",
        title: "1 Minute, 1 Film",
        desc: "60 secondes pile. Formats : MP4 ou MOV · 200 à 300 Mo · Ratio 16:9.",
    },
    {
        num: "IA",
        title: "L'humain au cœur de l'IA",
        desc: "IA entière ou hybride — documentée dans la fiche IA. Plusieurs films par réalisateur. Groupes autorisés.",
    },
    {
        num: "50",
        title: "Films en compétition",
        desc: "50 œuvres sélectionnées parmi 20 000 candidatures. Ouvert à 120+ pays · Gratuit · Sous-titres FR et EN.",
    },
    {
        num: "30.09",
        title: "Clôture des dépôts",
        desc: "Date limite : 30 septembre 2026. Participation gratuite · Toutes nationalités.",
    },
];

const ConceptSection = (): React.JSX.Element => (
    <section id="concours" className="relative py-24 px-6 overflow-hidden">
        <div
            className="aurora-1 absolute -top-20 left-1/2 w-[600px] h-[300px] -translate-x-1/2 bg-aurora/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
        />

        {/* Robot image decoration */}
        <div
            className="absolute top-0 right-0 w-52 opacity-10 pointer-events-none hidden lg:block"
            aria-hidden="true"
        >
            <img src="/assets/femme-robot2.png" alt="" loading="lazy" />
        </div>

        <div className="max-w-6xl mx-auto">
            <div className="text-xs font-mono text-aurora tracking-widest uppercase mb-3">
                Le Concept
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                Une contrainte absolue,
                <br />
                une liberté totale
            </h2>
            <p className="text-mist max-w-2xl mb-12 leading-relaxed">
                marsAI est un concours international de courts-métrages d'une minute intégralement
                générés par IA. Co-organisé par{" "}
                <strong className="text-white-soft">La Plateforme</strong> et le{" "}
                <strong className="text-white-soft">Mobile Film Festival</strong>. L'humain reste au
                cœur de la création.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CONCEPT_CARDS.map((card) => (
                    <div
                        key={card.num}
                        className="bg-surface border border-white/10 rounded-2xl p-6 hover:border-aurora/30 transition-colors"
                    >
                        <div className="font-display text-4xl font-black text-aurora mb-3">
                            {card.num}
                        </div>
                        <div className="font-semibold text-white-soft mb-2">{card.title}</div>
                        <p className="text-sm text-mist leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default ConceptSection;
