import React from "react";
import { Link } from "react-router-dom";

interface HowStep {
    icon: string;
    num: string;
    title: string;
    desc: string;
    tag: string;
    tagColor: string;
}

const HOW_STEPS: HowStep[] = [
    {
        icon: "👤",
        num: "01",
        title: "Profil réalisateur",
        desc: "Renseignez votre identité, pays de résidence et email de contact. Aucun compte à créer — formulaire simple et direct.",
        tag: "Sans inscription · Accès direct",
        tagColor: "text-aurora border-aurora/30",
    },
    {
        icon: "🎬",
        num: "02",
        title: "Le Film",
        desc: "Déposez votre court-métrage de 60 secondes. La durée est vérifiée automatiquement côté client et serveur.",
        tag: "Titre · Synopsis · Vidéo",
        tagColor: "text-solar border-solar/30",
    },
    {
        icon: "🤖",
        num: "03",
        title: "Fiche IA",
        desc: "Documentez les outils d'IA utilisés — image/vidéo obligatoire, son, scénario et post-production en option.",
        tag: "Outils · Sous-titres FR/EN",
        tagColor: "text-lavande border-lavande/30",
    },
    {
        icon: "✅",
        num: "04",
        title: "Confirmation",
        desc: "Récapitulatif complet, acceptation des droits RGPD et soumission. Vous recevez un numéro de dossier instantanément.",
        tag: "RGPD · Dossier MAI-2026",
        tagColor: "text-coral border-coral/30",
    },
];

const HowSection = (): React.JSX.Element => (
    <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <div className="font-mono text-xs text-aurora tracking-widest uppercase mb-3">
                    Dépôt de film
                </div>
                <h2 className="font-display text-4xl lg:text-5xl font-black text-white-soft mb-4">
                    Comment ça marche ?
                </h2>
                <p className="text-mist max-w-lg mx-auto">
                    Un tunnel guidé en 4 étapes — de votre profil à la soumission finale. Moins de
                    10 minutes.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {HOW_STEPS.map((step) => (
                    <div
                        key={step.num}
                        className="bg-surface border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-2xl">
                                {step.icon}
                            </div>
                            <div className="font-display text-3xl font-black text-white/20">
                                {step.num}
                            </div>
                        </div>
                        <div className="font-semibold text-white-soft mb-2">{step.title}</div>
                        <p className="text-sm text-mist mb-4 leading-relaxed">{step.desc}</p>
                        <span
                            className={`font-mono text-xs border rounded-full px-3 py-1 ${step.tagColor}`}
                        >
                            {step.tag}
                        </span>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <Link
                    to="/formulaire"
                    className="inline-flex items-center gap-2 bg-aurora text-deep-sky font-bold px-8 py-4 rounded-lg hover:bg-aurora/90 transition-colors text-lg"
                >
                    Montrez votre vision du futur <span aria-hidden="true">→</span>
                </Link>
                <p className="mt-4 font-mono text-xs text-mist">
                    Participation gratuite · Ouvert à 120+ pays · Clôture le 30 sept. 2026
                </p>
            </div>
        </div>
    </section>
);

export default HowSection;
