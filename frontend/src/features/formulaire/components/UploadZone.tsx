import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { DragState } from "../types";
import { VIDEO_ACCEPTED_EXTENSIONS, VIDEO_ACCEPTED_TYPES } from "../constants";

interface UploadZoneProps {
    visible: boolean;
    onFileSelect: (file: File) => void;
}

const UploadZone = ({ visible, onFileSelect }: UploadZoneProps): React.JSX.Element | null => {
    const { t } = useTranslation();
    const [dragState, setDragState] = useState<DragState>("idle");
    const dragDepthRef = useRef<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        };
    }, []);

    const isValidFile = useCallback((file: File): boolean => {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
        return VIDEO_ACCEPTED_TYPES.includes(file.type) || VIDEO_ACCEPTED_EXTENSIONS.includes(ext);
    }, []);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        dragDepthRef.current++;
        if (dragDepthRef.current === 1) {
            setDragState("dragging");
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };

    const handleDragLeave = (): void => {
        dragDepthRef.current--;
        if (dragDepthRef.current <= 0) {
            dragDepthRef.current = 0;
            setDragState("idle");
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        dragDepthRef.current = 0;

        const file = e.dataTransfer.files[0];
        if (!file) {
            setDragState("idle");
            return;
        }

        if (!isValidFile(file)) {
            setDragState("error");
            errorTimeoutRef.current = setTimeout(() => setDragState("idle"), 2200);
            return;
        }

        setDragState("idle");
        onFileSelect(file);
    };

    const handleClick = (): void => {
        inputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    if (!visible) return null;

    const zoneClass = (): string => {
        const base =
            "border-2 border-dashed rounded-2xl px-8 py-12 text-center cursor-pointer transition-all duration-250 bg-aurora/[0.015] relative flex flex-col items-center justify-center min-h-[300px]";
        if (dragState === "dragging") return `${base} upload-zone-dragging`;
        if (dragState === "error") return `${base} upload-zone-error`;
        return `${base} border-aurora/[0.28] hover:border-aurora/55 hover:bg-aurora/4 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(78,255,206,0.07)]`;
    };

    return (
        <div
            className={zoneClass()}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter") handleClick();
            }}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".mp4,.mov,video/mp4,video/quicktime"
                onChange={handleInputChange}
                className="hidden"
            />

            {/* État par défaut */}
            {dragState === "idle" && (
                <>
                    <div className="w-[72px] h-[72px] bg-aurora/8 border-[1.5px] border-aurora/[0.22] rounded-full flex items-center justify-center mb-5 uz-cloud-float">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#4EFFCE"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="16 16 12 12 8 16" />
                            <line x1="12" y1="12" x2="12" y2="21" />
                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                        </svg>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-aurora text-deep-sky rounded-xl px-7 py-3 text-sm font-bold font-display mb-4 pointer-events-none shadow-[0_4px_22px_rgba(78,255,206,0.28)]">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="16 16 12 12 8 16" />
                            <line x1="12" y1="12" x2="12" y2="21" />
                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                        </svg>
                        {t("form.upload.drag")}
                    </div>
                    <div className="text-sm text-mist mb-3.5 tracking-wide">{t("form.upload.or")}</div>
                    <div className="text-sm text-aurora font-semibold underline mb-7">
                        {t("form.upload.browse")}
                    </div>
                    <div className="flex gap-2 justify-center flex-wrap">
                        {["MP4", "MOV", "200–300 Mo", "16:9", "60 sec pile"].map((spec) => (
                            <span
                                key={spec}
                                className="bg-white/5 border border-white/10 rounded-md px-3 py-1 font-mono text-xs text-mist"
                            >
                                {spec}
                            </span>
                        ))}
                    </div>
                </>
            )}

            {/* État : fichier survolé */}
            {dragState === "dragging" && (
                <>
                    <div className="text-4xl mb-4 uz-bounce-icon">⬇️</div>
                    <div className="text-lg font-bold font-display text-aurora mb-2">
                        {t("form.upload.dropping")}
                    </div>
                    <div className="text-sm text-aurora/70">
                        {t("form.upload.droppingHint")}
                    </div>
                </>
            )}

            {/* État : format refusé */}
            {dragState === "error" && (
                <>
                    <div className="text-4xl mb-4">🚫</div>
                    <div className="text-lg font-bold font-display text-coral mb-2">
                        {t("form.upload.errorFormat")}
                    </div>
                    <div className="text-sm text-coral/80">{t("form.upload.errorFormatHint")}</div>
                </>
            )}
        </div>
    );
};

export default UploadZone;
