import React, { useState } from "react";
import { RefreshCw, ExternalLink, Maximize2 } from "lucide-react";

const GRAFANA_BASE =
    import.meta.env.VITE_GRAFANA_URL ??
    (typeof window !== "undefined" && window.location.hostname !== "localhost"
        ? `${window.location.origin}/grafana`
        : "http://localhost:3001");

const DASHBOARD_UID = "marsai-festival";
const DASHBOARD_URL = `${GRAFANA_BASE}/d/${DASHBOARD_UID}?orgId=1&kiosk&theme=dark&refresh=30s`;
const DASHBOARD_FULL = `${GRAFANA_BASE}/d/${DASHBOARD_UID}?orgId=1&theme=dark`;

export default function AdminStatsPage(): React.JSX.Element {
    const [key, setKey] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    const handleRefresh = () => setKey((k) => k + 1);
    const handleFullscreen = () => setFullscreen((f) => !f);

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-6 py-4">
                <div>
                    <h1 className="font-display text-[1.2rem] font-extrabold tracking-[-0.02em] text-white-soft">
                        Statistiques
                    </h1>
                    <p className="mt-0.5 text-[0.8rem] text-mist/50">
                        Dashboard temps réel — rafraîchissement automatique toutes les 30 s
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-surface-2 px-3 py-2 text-[0.8rem] text-mist/70 transition-colors hover:text-white-soft"
                        title="Actualiser"
                    >
                        <RefreshCw size={13} />
                        Actualiser
                    </button>
                    <button
                        onClick={handleFullscreen}
                        className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-surface-2 px-3 py-2 text-[0.8rem] text-mist/70 transition-colors hover:text-white-soft"
                        title={fullscreen ? "Réduire" : "Plein écran"}
                    >
                        <Maximize2 size={13} />
                        {fullscreen ? "Réduire" : "Plein écran"}
                    </button>
                    <a
                        href={DASHBOARD_FULL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-aurora/30 bg-aurora/10 px-3 py-2 text-[0.8rem] text-aurora transition-colors hover:bg-aurora/20"
                    >
                        <ExternalLink size={13} />
                        Ouvrir Grafana
                    </a>
                </div>
            </div>

            {/* iframe */}
            <div
                className={`relative flex-1 bg-[#111217] transition-all ${
                    fullscreen ? "fixed inset-0 z-50" : ""
                }`}
            >
                {fullscreen && (
                    <button
                        onClick={handleFullscreen}
                        className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-[0.8rem] text-white backdrop-blur-sm"
                    >
                        <Maximize2 size={13} />
                        Fermer
                    </button>
                )}
                <iframe
                    key={key}
                    src={DASHBOARD_URL}
                    className="h-full w-full border-0"
                    title="Grafana — MarsAI Festival"
                    allow="fullscreen"
                />
            </div>
        </div>
    );
}
