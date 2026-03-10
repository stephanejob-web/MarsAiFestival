import React, { useRef, useEffect } from "react";

interface FileCardProps {
    file: File;
    progress: number;
    onReset: () => void;
}

const FileCard = ({ file, progress, onReset }: FileCardProps): React.JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.src = url;
        video.muted = true;
        video.preload = "metadata";

        const handleMetadata = (): void => {
            video.currentTime = Math.min(1, video.duration * 0.1);
        };

        const handleSeeked = (): void => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = 256;
            canvas.height = 144;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, 256, 144);
            }
            URL.revokeObjectURL(url);
        };

        video.addEventListener("loadedmetadata", handleMetadata);
        video.addEventListener("seeked", handleSeeked);
        video.load();

        return () => {
            video.removeEventListener("loadedmetadata", handleMetadata);
            video.removeEventListener("seeked", handleSeeked);
            URL.revokeObjectURL(url);
        };
    }, [file]);

    const sizeMo = (file.size / 1024 / 1024).toFixed(1);
    const ext = file.name.split(".").pop()?.toUpperCase() ?? "";
    const isOversize = file.size / 1024 / 1024 > 300;

    const progressMsg = progress >= 100 ? "Upload terminé" : "Upload en cours…";

    const handleResetClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
        onReset();
    };

    return (
        <div className="bg-white/3 border border-aurora/[0.18] rounded-2xl overflow-hidden mt-3">
            {/* En-tête avec vignette */}
            <div className="flex items-center gap-3.5 p-4">
                <div className="w-24 h-[54px] bg-black rounded-lg overflow-hidden shrink-0 relative flex items-center justify-center">
                    <canvas ref={canvasRef} className="w-24 h-[54px] block" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white-soft truncate mb-1.5">
                        {file.name}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[0.65rem] font-bold px-2 py-0.5 rounded bg-aurora/10 border border-aurora/20 text-aurora">
                            {ext}
                        </span>
                        <span className="font-mono text-xs text-mist">{sizeMo} Mo</span>
                        {isOversize && <span className="text-xs text-solar">⚠ &gt; 300 Mo</span>}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleResetClick}
                    className="bg-white/4 border border-white/9 text-mist cursor-pointer text-xs px-3 py-1.5 rounded-lg transition-all hover:bg-coral/10 hover:border-coral/25 hover:text-coral shrink-0 whitespace-nowrap font-body"
                >
                    ✕ Changer
                </button>
            </div>

            {/* Barre de progression */}
            <div className="px-4 pb-4">
                <div className="h-1 bg-white/7 rounded-sm overflow-hidden mb-2">
                    <div
                        className="progress-bar-fill h-full rounded-sm"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs">
                    <span className="font-mono text-aurora">{Math.round(progress)}%</span>
                    <span className="text-mist">{progressMsg}</span>
                </div>
            </div>
        </div>
    );
};

export default FileCard;
