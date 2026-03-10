import React from "react";

const RulesBlock = (): React.JSX.Element => {
    const rules = [
        { label: "Durée :", value: "60 secondes pile" },
        { label: "Formats :", value: "MP4, MOV" },
        { label: "Résolution min. :", value: "1920×1080 · Ratio 16:9" },
        { label: "Taille :", value: "200 à 300 Mo" },
        { label: "Plusieurs films par réalisateur", value: "autorisés" },
        { label: "Ouverture :", value: "2 mois, fermeture auto" },
    ];

    return (
        <div className="bg-surface border border-white/5 rounded-xl px-4 py-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-mist mb-3">
                Règles essentielles
            </h4>
            <div className="flex flex-col gap-2">
                {rules.map((rule) => (
                    <div
                        key={rule.label}
                        className="flex items-start gap-2 text-xs text-mist leading-relaxed"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-aurora shrink-0 mt-1.5" />
                        <span>
                            {rule.label} <strong className="text-white-soft">{rule.value}</strong>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RulesBlock;
