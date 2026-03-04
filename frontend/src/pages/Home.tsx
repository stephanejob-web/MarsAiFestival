import React from "react";
import { useTranslation } from "react-i18next";
import { PROJECT_NAME, PROJECT_YEAR, TEAM_MEMBERS } from "../constants/team";
import type { Lang } from "../constants/i18n";

const Home = (): React.JSX.Element => {
    const { t, i18n } = useTranslation();

    const handleLangSwitch = (): void => {
        const next: Lang = i18n.language === "fr" ? "en" : "fr";
        void i18n.changeLanguage(next);
    };

    return (
        <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-zinc-950">
            {/* Aurora blobs */}
            <div className="aurora-1 absolute left-[-10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-3xl" />
            <div className="aurora-2 absolute bottom-[-15%] right-[-10%] h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="aurora-1 absolute bottom-[20%] left-[15%] h-72 w-72 rounded-full bg-purple-500/15 blur-3xl" />
            <div className="absolute right-[20%] top-[30%] h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />

            {/* Lang switcher */}
            <button
                onClick={handleLangSwitch}
                className="absolute right-6 top-6 z-10 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-xs uppercase tracking-widest text-violet-300 transition-all hover:border-violet-400/60 hover:bg-violet-500/20 hover:text-white"
            >
                {t("lang")}
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-12 px-8 py-20 text-center">
                {/* Badge */}
                <div className="flex flex-col items-center gap-3">
                    <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-5 py-2 text-xs uppercase tracking-widest text-violet-300">
                        {PROJECT_NAME} — {t("badge")}
                    </span>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1 text-xs tracking-wide text-emerald-400">
                        ✦ {t("ready")}
                    </span>
                </div>

                {/* Titre principal */}
                <div className="flex flex-col gap-4">
                    <p className="text-base font-light tracking-[0.3em] text-white/30 uppercase">
                        {t("welcome")}
                    </p>
                    <h1 className="text-6xl font-bold leading-tight text-white md:text-8xl">
                        {t("hello")},
                        <br />
                        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                            {t("team")}
                        </span>
                    </h1>
                    <p className="text-xl font-light text-white/50">{t("tagline")}</p>
                </div>

                {/* Séparateur */}
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

                {/* Membres */}
                <div className="flex flex-col items-center gap-4">
                    <p className="text-xs uppercase tracking-widest text-white/20">
                        {t("subtitle")}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {TEAM_MEMBERS.map((name) => (
                            <span
                                key={name}
                                className="group relative rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/60 backdrop-blur-sm transition-all duration-300 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white hover:shadow-lg hover:shadow-violet-500/10"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Séparateur */}
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

                {/* Citation motivante */}
                <div className="max-w-xl rounded-2xl border border-white/5 bg-white/3 p-8 backdrop-blur-sm">
                    <p className="mb-3 text-xs uppercase tracking-widest text-violet-400/70">
                        ✦ {t("motivationTitle")}
                    </p>
                    <p className="text-sm leading-relaxed text-white/40 italic">
                        "{t("motivation")}"
                    </p>
                </div>

                {/* Footer */}
                <p className="text-xs text-white/15 tracking-widest uppercase">
                    {PROJECT_NAME} · {PROJECT_YEAR}
                </p>
            </div>
        </main>
    );
};

export default Home;
