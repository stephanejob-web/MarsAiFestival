import React from "react";
import {
    Smartphone,
    Zap,
    MessageCircle,
    Film,
    CheckCircle,
    Info,
    Download,
} from "lucide-react";

const FEATURES = [
    {
        icon: <Zap size={16} className="text-aurora" />,
        title: "Vote style Tinder",
        desc: "Swipez les films pour voter en quelques secondes, où que vous soyez.",
    },
    {
        icon: <Film size={16} className="text-lavande" />,
        title: "Vidéos intégrées",
        desc: "Visionnez les films directement dans l'application avec lecture automatique.",
    },
    {
        icon: <MessageCircle size={16} className="text-aurora" />,
        title: "Chat jury en temps réel",
        desc: "Communiquez avec les autres jurés instantanément depuis votre mobile.",
    },
    {
        icon: <CheckCircle size={16} className="text-[#ffd166]" />,
        title: "Suivi de progression",
        desc: "Visualisez vos films évalués, refusés, validés et à revoir en un coup d'œil.",
    },
    {
        icon: <Info size={16} className="text-lavande" />,
        title: "Détail complet des films",
        desc: "Accédez aux informations IA, workflow créatif, sous-titres et métadonnées.",
    },
];

const STEPS = [
    { num: "1", text: "Téléchargez Expo Go sur l'App Store ou Google Play" },
    { num: "2", text: "Scannez le QR code ci-dessous avec votre appareil photo" },
    { num: "3", text: "Connectez-vous avec vos identifiants jury habituels" },
];

const MobileAppView = (): React.JSX.Element => {
    return (
        <div className="flex h-full flex-col overflow-y-auto bg-background">
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-white/6 bg-gradient-to-br from-aurora/8 via-transparent to-lavande/8 px-10 py-14">
                <div className="relative z-10 flex items-center gap-8">
                    {/* App icon */}
                    <div className="flex h-[88px] w-[88px] flex-shrink-0 items-center justify-center rounded-[22px] border border-aurora/30 bg-gradient-to-br from-aurora/15 to-lavande/15 shadow-lg shadow-aurora/10">
                        <Smartphone size={40} className="text-aurora" />
                    </div>

                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <span className="rounded-full bg-aurora/12 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-aurora">
                                Nouveau
                            </span>
                        </div>
                        <h1 className="text-[1.9rem] font-extrabold leading-tight text-white-soft">
                            mars<span className="text-aurora">AI</span>
                            <span className="ml-2 text-[1.4rem] font-light text-mist">Mobile</span>
                        </h1>
                        <p className="mt-1.5 text-[0.9rem] text-mist">
                            Votez pour vos films depuis votre téléphone — rapide, fluide, intuitif.
                        </p>
                    </div>
                </div>

                {/* Deco blobs */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-aurora/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-8 right-32 h-48 w-48 rounded-full bg-lavande/6 blur-2xl" />
            </div>

            <div className="grid flex-1 grid-cols-1 gap-8 px-10 py-10 xl:grid-cols-2">
                {/* Features */}
                <div>
                    <h2 className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-mist opacity-60">
                        Fonctionnalités
                    </h2>
                    <div className="flex flex-col gap-3">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="flex items-start gap-3.5 rounded-xl border border-white/5 bg-surface px-4 py-3.5"
                            >
                                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                                    {f.icon}
                                </div>
                                <div>
                                    <div className="text-[0.84rem] font-semibold text-white-soft">
                                        {f.title}
                                    </div>
                                    <div className="mt-0.5 text-[0.75rem] leading-relaxed text-mist">
                                        {f.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Install steps + QR */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h2 className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-mist opacity-60">
                            Comment installer
                        </h2>
                        <div className="flex flex-col gap-3">
                            {STEPS.map((s) => (
                                <div key={s.num} className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-aurora/30 bg-aurora/10 font-mono text-[0.8rem] font-bold text-aurora">
                                        {s.num}
                                    </div>
                                    <p className="text-[0.82rem] text-mist">{s.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* QR placeholder */}
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/6 bg-surface p-8">
                        <div className="flex h-[160px] w-[160px] items-center justify-center rounded-xl border-2 border-dashed border-aurora/25 bg-aurora/5">
                            <div className="text-center">
                                <Smartphone size={32} className="mx-auto mb-2 text-aurora/40" />
                                <p className="text-[0.65rem] text-mist/50">QR code disponible</p>
                                <p className="text-[0.65rem] text-mist/50">après déploiement</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[0.8rem] font-semibold text-white-soft">
                                Scan to download
                            </p>
                            <p className="mt-0.5 text-[0.7rem] text-mist">
                                Compatible iOS et Android via Expo Go
                            </p>
                        </div>
                    </div>

                    {/* Store buttons */}
                    <div className="flex gap-3">
                        <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/8 bg-surface px-4 py-3 opacity-50">
                            <Download size={14} className="text-mist" />
                            <span className="text-[0.78rem] font-semibold text-mist">App Store</span>
                        </div>
                        <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/8 bg-surface px-4 py-3 opacity-50">
                            <Download size={14} className="text-mist" />
                            <span className="text-[0.78rem] font-semibold text-mist">Google Play</span>
                        </div>
                    </div>
                    <p className="text-center text-[0.68rem] text-mist/40">
                        Publication sur les stores prévue prochainement
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MobileAppView;
