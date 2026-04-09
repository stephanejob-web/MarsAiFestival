import React from "react";
import { CheckCircle, Film, MessageCircle, Zap } from "lucide-react";
import appVideo from "../../../assets/app_mobile.mov";

const FEATURES = [
    {
        icon: <Zap size={15} className="text-aurora" />,
        title: "Vote style Tinder",
        desc: "Swipez les films pour voter en quelques secondes, où que vous soyez.",
        color: "aurora",
    },
    {
        icon: <Film size={15} className="text-lavande" />,
        title: "Vidéos intégrées",
        desc: "Visionnez les films directement dans l'app avec lecture automatique.",
        color: "lavande",
    },
    {
        icon: <MessageCircle size={15} className="text-aurora" />,
        title: "Chat jury en temps réel",
        desc: "Communiquez avec les autres jurés instantanément depuis votre mobile.",
        color: "aurora",
    },
    {
        icon: <CheckCircle size={15} className="text-[#ffd166]" />,
        title: "Suivi de progression",
        desc: "Films évalués, refusés, validés et à revoir en un coup d'œil.",
        color: "amber",
    },
];

// ── iPhone Mockup ─────────────────────────────────────────────────────────────

const IPhoneMockup = (): React.JSX.Element => (
    <div className="relative flex-shrink-0" style={{ width: 240 }}>
        {/* Glow ambiance */}
        <div className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-[52px] bg-aurora/10 blur-3xl" />

        {/* Chassis */}
        <div
            className="relative rounded-[44px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-[3px]"
            style={{
                boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
        >
            {/* Screen area */}
            <div
                className="relative overflow-hidden rounded-[42px] bg-black"
                style={{ aspectRatio: "9/19.5" }}
            >
                {/* Vidéo */}
                <video
                    src={appVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Dynamic Island */}
                <div className="absolute left-1/2 top-3 z-20 h-[28px] w-[90px] -translate-x-1/2 rounded-full bg-black" />

                {/* Reflet écran */}
                <div className="pointer-events-none absolute inset-0 z-10 rounded-[42px] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
            </div>

            {/* Bouton power droit */}
            <div className="absolute -right-[5px] top-[100px] h-[60px] w-[4px] rounded-r-full bg-[#333]" />

            {/* Boutons volume gauche */}
            <div className="absolute -left-[5px] top-[80px] h-[36px] w-[4px] rounded-l-full bg-[#333]" />
            <div className="absolute -left-[5px] top-[125px] h-[60px] w-[4px] rounded-l-full bg-[#333]" />

            {/* Bouton silent gauche */}
            <div className="absolute -left-[5px] top-[50px] h-[24px] w-[4px] rounded-l-full bg-[#333]" />
        </div>
    </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────

const MobileAppView = (): React.JSX.Element => {
    return (
        <div className="relative flex h-full flex-col overflow-y-auto bg-background">
            {/* Blobs déco */}
            <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-aurora/5 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-lavande/5 blur-[100px]" />

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-16 px-10 py-16 lg:flex-row lg:items-center lg:justify-center">
                {/* ── Mockup ── */}
                <div className="flex flex-col items-center gap-6">
                    <IPhoneMockup />

                    {/* Badge store */}
                    <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-aurora animate-pulse" />
                        <span className="font-mono text-[0.65rem] text-aurora/80 uppercase tracking-widest">
                            Expo Go · iOS &amp; Android
                        </span>
                    </div>
                </div>

                {/* ── Contenu droit ── */}
                <div className="max-w-md">
                    {/* Badge */}
                    <span className="inline-block rounded-full border border-aurora/25 bg-aurora/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-aurora">
                        Application mobile
                    </span>

                    {/* Titre */}
                    <h1 className="mt-4 text-[2.4rem] font-black leading-none tracking-tight text-white-soft">
                        mars<span className="text-aurora">AI</span>
                        <span className="block text-[1.6rem] font-light text-mist/70">
                            dans votre poche
                        </span>
                    </h1>

                    <p className="mt-4 text-[0.9rem] leading-relaxed text-mist">
                        Votez, discutez et suivez vos films depuis votre téléphone. Conçue pour le
                        jury — aussi fluide qu'intuitive.
                    </p>

                    {/* Features */}
                    <div className="mt-8 flex flex-col gap-3">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 backdrop-blur-sm"
                            >
                                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                                    {f.icon}
                                </div>
                                <div>
                                    <div className="text-[0.83rem] font-semibold text-white-soft">
                                        {f.title}
                                    </div>
                                    <div className="mt-0.5 text-[0.73rem] leading-relaxed text-mist">
                                        {f.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* QR placeholder */}
                    <div className="mt-8 flex items-center gap-5 rounded-2xl border border-white/6 bg-white/[0.03] px-5 py-4">
                        <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-xl border border-dashed border-aurora/30 bg-aurora/5">
                            <span className="font-mono text-[0.55rem] text-aurora/50 text-center leading-snug">
                                QR
                                <br />
                                code
                            </span>
                        </div>
                        <div>
                            <p className="text-[0.82rem] font-semibold text-white-soft">
                                Scanner pour accéder
                            </p>
                            <p className="mt-0.5 text-[0.72rem] text-mist">
                                Ouvrez Expo Go et scannez ce code depuis votre appareil photo
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileAppView;
