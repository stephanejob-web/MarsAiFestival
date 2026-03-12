import React from "react";
import { useTranslation } from "react-i18next";
import visageImg from "../../../assets/visage-couleur.jpg";

const TOOLS: string[] = [
    "Sora",
    "Runway",
    "Kling",
    "Pika",
    "Stable Video",
    "ComfyUI",
];

const ManifesteSection = (): React.JSX.Element => {
    const { t } = useTranslation();

    const line4Full = t("manifeste.line4");
    const line4Highlight = t("manifeste.line4_highlight");
    const [before, after] = line4Full.split(line4Highlight);

    const line3Full = t("manifeste.line3");
    const line3AI = "L'IA générative";
    const line3EN = "Generative AI";
    const line3Marker = line3Full.includes(line3AI) ? line3AI : line3EN;
    const [, line3After] = line3Full.split(line3Marker);

    return (
        <section className="relative py-24 px-6 bg-surface/30 overflow-hidden">
            {/* Image de fond */}
            <img
                src={visageImg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
            />
            {/* Dégradé gauche pour lisibilité du texte */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-surface/80 via-surface/40 to-transparent pointer-events-none"
                aria-hidden="true"
            />
            <div className="relative max-w-6xl mx-auto">
                <div className="max-w-2xl ml-auto">
                    <p className="text-xl text-mist mb-4">{t("manifeste.line1")}</p>
                    <p className="text-xl text-mist mb-6">{t("manifeste.line2")}</p>

                    <div className="h-px bg-gradient-to-r from-aurora/40 to-transparent mb-6" />

                    <p className="text-2xl font-semibold text-white mb-3">
                        <span className="text-aurora">{line3Marker}</span>
                        {line3After}
                    </p>
                    <p className="text-2xl font-semibold text-white mb-8">
                        {before}
                        <span className="text-solar">{line4Highlight}</span>
                        {after}
                    </p>

                    <p className="text-mist mb-8 leading-relaxed">
                        {t("manifeste.body")}
                        <br />
                        <strong className="text-white-soft">{t("manifeste.question")}</strong>
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {TOOLS.map((tool) => (
                            <span
                                key={tool}
                                className="font-mono text-sm bg-surface border border-white/10 text-white-soft rounded-full px-3 py-1"
                            >
                                {tool}
                            </span>
                        ))}
                        <span className="font-mono text-sm bg-surface border border-white/10 text-white-soft rounded-full px-3 py-1">
                            {t("manifeste.toolsOther")}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ManifesteSection;
