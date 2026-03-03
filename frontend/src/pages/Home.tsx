import React from "react";

const TEAM_MEMBERS: string[] = ["Mickaël", "Valérie", "Jean-Deny", "Dylan", "Stéphane"];

interface MemberColor {
    text: string;
    border: string;
    bg: string;
}

const MEMBER_COLORS: MemberColor[] = [
    { text: "text-cyan-300", border: "border-cyan-300/30", bg: "bg-cyan-300/10" },
    { text: "text-yellow-300", border: "border-yellow-300/30", bg: "bg-yellow-300/10" },
    { text: "text-purple-400", border: "border-purple-400/30", bg: "bg-purple-400/10" },
    { text: "text-red-400", border: "border-red-400/30", bg: "bg-red-400/10" },
    { text: "text-teal-300", border: "border-teal-300/30", bg: "bg-teal-300/10" },
];

const Home = (): React.JSX.Element => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* ── Hero ── */}
            <section className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
                {/* Logo */}
                <p className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-4">
                    Concours International de Courts-Métrages IA
                </p>
                <h1 className="text-8xl font-black tracking-tighter mb-2">
                    mars<span className="text-cyan-300">AI</span>
                </h1>

                {/* Séparateur décoratif */}
                <div className="flex items-center gap-3 my-10">
                    <div className="w-20 h-px bg-slate-700" />
                    <div className="w-2 h-2 rounded-full bg-cyan-300" />
                    <div className="w-20 h-px bg-slate-700" />
                </div>

                {/* Message principal */}
                <p className="text-4xl font-bold text-slate-100 leading-snug mb-4">
                    Bon courage à toute l&apos;équipe
                </p>
                <p className="text-slate-400 text-lg max-w-lg leading-relaxed mb-16">
                    Vous construisez quelque chose d&apos;extraordinaire. Chaque ligne de code
                    rapproche ce projet des étoiles.
                </p>

                {/* Équipe */}
                <p className="text-xs tracking-widest text-slate-500 uppercase mb-6">
                    L&apos;équipe
                </p>
                <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                    {TEAM_MEMBERS.map((name, index) => {
                        const color = MEMBER_COLORS[index % MEMBER_COLORS.length];
                        return (
                            <div
                                key={name}
                                className={`flex items-center gap-3 rounded-xl ${color.bg} border ${color.border} px-5 py-3 transition-all hover:brightness-125`}
                            >
                                <span
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${color.text} bg-slate-900`}
                                >
                                    {name[0]}
                                </span>
                                <span className="text-sm font-medium text-slate-200">{name}</span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="text-center py-5 text-slate-600 text-xs border-t border-slate-800 font-mono">
                marsAI · {currentYear} · Propulsé par IA &amp; passion
            </footer>
        </div>
    );
};

export default Home;
