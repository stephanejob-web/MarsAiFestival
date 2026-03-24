import React, { useRef, useState } from "react";
import { useCmsHero } from "../hooks/useCmsHero";
import { API_BASE_URL } from "../../../constants/api";

const CmsVideoHero = (): React.JSX.Element => {
    const { data } = useCmsHero();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [currentUrl, setCurrentUrl] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const token = localStorage.getItem("jury_token");

    const videoSrc = currentUrl ?? data.hero_video_path ?? "/assets/hero-marsai.mp4";

    const handleFile = async (file: File) => {
        setUploadError(null);
        setUploading(true);
        const form = new FormData();
        form.append("video", file);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/hero/video`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: form,
            });
            const json = await res.json();
            if (json.success) {
                setCurrentUrl(json.url as string);
                setUploaded(true);
                setTimeout(() => setUploaded(false), 3000);
            } else {
                setUploadError("Échec de l'upload");
            }
        } catch {
            setUploadError("Erreur réseau");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/5 bg-surface-2 transition-colors hover:border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pb-4 pt-[18px]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-aurora/20 bg-aurora/10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect
                            x="1"
                            y="3"
                            width="10"
                            height="10"
                            rx="2"
                            stroke="#4effce"
                            strokeWidth="1.5"
                        />
                        <path d="M11 6.5l4-2.5v8l-4-2.5V6.5z" fill="#4effce" />
                    </svg>
                </div>
                <div className="flex-1">
                    <div className="font-display text-[0.92rem] font-extrabold text-white-soft">
                        Vidéo Hero
                    </div>
                    <div className="mt-0.5 text-[0.72rem] text-mist">
                        Fond animé affiché en plein écran sur la page d'accueil
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 rounded-full border border-aurora/20 bg-aurora/5 px-2.5 py-1 font-mono text-[0.68rem] text-aurora">
                    <span className="h-1.5 w-1.5 rounded-full bg-aurora" />
                    {uploaded ? "Vidéo mise à jour" : "En ligne"}
                </div>
            </div>

            {/* Video Stage */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
                <video
                    key={videoSrc}
                    src={videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute right-3.5 top-3.5 z-10 flex gap-2">
                    <button
                        className="flex items-center gap-1.5 rounded-lg border border-aurora/40 bg-aurora/20 px-3.5 py-1.5 font-display text-[0.75rem] font-bold text-aurora backdrop-blur-md transition-all hover:bg-aurora/30 disabled:opacity-50"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <svg
                                    className="h-3.5 w-3.5 animate-spin"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                >
                                    <circle
                                        cx="7"
                                        cy="7"
                                        r="5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeDasharray="20 10"
                                    />
                                </svg>
                                Upload en cours…
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path
                                        d="M7 1v8M4 4l3-3 3 3"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M1 10v1a2 2 0 002 2h8a2 2 0 002-2v-1"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Changer la vidéo
                            </>
                        )}
                    </button>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="video/mp4,video/quicktime,video/webm"
                    className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void handleFile(f);
                        e.target.value = "";
                    }}
                />
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center gap-3.5 border-t border-white/5 px-5 py-3.5">
                <div className="flex shrink-0 gap-5">
                    {[
                        ["Format", "MP4 · MOV · WebM"],
                        ["Résolution", "1920 × 1080"],
                        ["Taille max", "200 Mo"],
                    ].map(([label, value]) => (
                        <div key={label} className="flex flex-col gap-0.5">
                            <span className="text-[0.6rem] font-bold uppercase tracking-widest text-mist">
                                {label}
                            </span>
                            <span className="font-mono text-[0.72rem] text-white-soft">
                                {value}
                            </span>
                        </div>
                    ))}
                </div>

                <div
                    className="flex flex-1 min-w-[180px] cursor-pointer items-center gap-2 rounded-lg border-[1.5px] border-dashed border-aurora/20 px-3.5 py-2.5 text-[0.75rem] text-mist transition-all hover:border-aurora/40 hover:bg-aurora/5 hover:text-aurora"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M10 3v10M7 6l3-3 3 3"
                            stroke="rgba(78,255,206,0.7)"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M3 14v1.5A1.5 1.5 0 004.5 17h11a1.5 1.5 0 001.5-1.5V14"
                            stroke="rgba(78,255,206,0.5)"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span>Glisser un fichier MP4 / MOV ici</span>
                </div>

                {uploadError && <p className="w-full text-[0.72rem] text-coral">{uploadError}</p>}
                {uploaded && (
                    <p className="w-full text-[0.72rem] text-aurora">
                        Vidéo mise à jour avec succès
                    </p>
                )}
            </div>
        </div>
    );
};

export default CmsVideoHero;
