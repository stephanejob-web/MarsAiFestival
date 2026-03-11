import React from "react";

const TOOLS: string[] = [
    "Sora",
    "Runway",
    "Kling",
    "Pika",
    "Stable Video",
    "ComfyUI",
    "+ tous les autres",
];

const ManifesteSection = (): React.JSX.Element => (
    <section className="py-24 px-6 bg-surface/30">
        <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl ml-auto">
                <p className="text-xl text-mist mb-4">
                    1895. Le cinéma naît. Une caméra, une pellicule.
                </p>
                <p className="text-xl text-mist mb-6">
                    Pendant 130 ans, filmer exigeait du matériel.
                </p>

                <div className="h-px bg-gradient-to-r from-aurora/40 to-transparent mb-6" />

                <p className="text-2xl font-semibold text-white mb-3">
                    <span className="text-aurora">L'IA générative</span> a tout changé.
                </p>
                <p className="text-2xl font-semibold text-white mb-8">
                    Aujourd'hui, <span className="text-solar">votre imagination</span> est la seule
                    limite.
                </p>

                <p className="text-mist mb-8 leading-relaxed">
                    Les outils existent. La question n'est plus <em>comment créer</em>.<br />
                    <strong className="text-white-soft">
                        La question est : qu'avez-vous à raconter en 60 secondes ?
                    </strong>
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
                </div>
            </div>
        </div>
    </section>
);

export default ManifesteSection;
