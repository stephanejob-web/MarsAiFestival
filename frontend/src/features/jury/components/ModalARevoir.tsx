import React, { useEffect, useState } from "react";

import type { ReasonTag } from "../types";
import useVoteTags from "../hooks/useVoteTags";

interface ModalAReVoirProps {
    isOpen: boolean;
    filmTitle: string;
    selectedReason: ReasonTag | null;
    message: string;
    onReasonSelect: (reason: ReasonTag | null) => void;
    onMessageChange: (message: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
}

const ModalARevoir = ({
    isOpen,
    filmTitle,
    selectedReason,
    message,
    onReasonSelect,
    onMessageChange,
    onCancel,
    onConfirm,
}: ModalAReVoirProps): React.JSX.Element | null => {
    const [showError, setShowError] = useState<boolean>(false);
    const allTags = useVoteTags();
    const tags = allTags.filter((t) => t.type === "a_revoir");

    useEffect((): void => {
        if (!isOpen) return;
        const defaultTag = tags.find((t) => t.is_default);
        if (defaultTag && !selectedReason && !message.trim()) {
            onReasonSelect(defaultTag.key);
            if (defaultTag.message_template) {
                onMessageChange(defaultTag.message_template);
            }
        }
    }, [isOpen, tags, selectedReason, message, onReasonSelect, onMessageChange]);

    if (!isOpen) return null;

    const handleConfirm = (): void => {
        if (!message.trim()) {
            setShowError(true);
            return;
        }
        setShowError(false);
        onConfirm();
    };

    const handleReasonClick = (key: string): void => {
        const isDeselect = selectedReason === key;
        onReasonSelect(isDeselect ? null : key);
        if (!isDeselect) {
            const tag = tags.find((t) => t.key === key);
            if (tag?.message_template) onMessageChange(tag.message_template);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
            <div className="w-full max-w-[460px] rounded-[18px] border border-white/8 bg-surface-2 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
                <span className="mb-3 block text-center text-[2rem]">↩</span>
                <div className="mb-1 text-center font-display text-[1.1rem] font-extrabold">
                    Demande de révision
                </div>
                <div className="mb-4 text-center text-[0.8rem] leading-relaxed text-mist">
                    Précisez pourquoi ce film mérite une attention particulière. Ce message sera
                    visible par les autres membres du jury.
                </div>
                <div className="mx-auto mb-4 block rounded-full border border-aurora/20 bg-aurora/10 px-3 py-1 text-center text-[0.78rem] font-semibold text-aurora">
                    {filmTitle}
                </div>

                <div className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                    Raison
                </div>
                <div className="mb-2 flex flex-wrap gap-2">
                    {tags.map((tag) => {
                        const isActive = selectedReason === tag.key;
                        return (
                            <button
                                key={tag.key}
                                type="button"
                                onClick={() => handleReasonClick(tag.key)}
                                className={`flex cursor-pointer items-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-[0.78rem] transition-all ${
                                    isActive
                                        ? `border-${tag.color}/30 bg-${tag.color}/10 text-${tag.color}`
                                        : "border-white/10 bg-white/[0.04] text-mist hover:border-white/20 hover:text-white-soft"
                                }`}
                            >
                                <span
                                    className={`h-[6px] w-[6px] shrink-0 rounded-full bg-${tag.color}`}
                                />
                                <span>{tag.icon}</span>
                                {tag.label}
                            </button>
                        );
                    })}
                </div>

                <div className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist">
                    Votre message
                </div>
                <textarea
                    value={message}
                    onChange={(e) => onMessageChange(e.target.value)}
                    placeholder="Expliquez pourquoi ce film doit être révisé..."
                    rows={3}
                    className="mt-2 w-full resize-none rounded-[10px] border border-white/10 bg-white/4 px-3 py-2.5 text-[0.82rem] text-white-soft outline-none focus:border-aurora/35 min-h-[80px]"
                />
                {showError && (
                    <div className="mt-1.5 text-[0.72rem] text-coral">
                        ⚠ Veuillez écrire un message avant de continuer.
                    </div>
                )}

                <div className="mt-5 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-[10px] border border-white/12 bg-white/4 py-2.5 text-[0.82rem] text-mist transition-all hover:bg-white/8"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="flex-[2] rounded-[10px] border border-solar/30 bg-solar/10 py-2.5 text-[0.82rem] font-bold text-solar transition-all hover:bg-solar/20"
                    >
                        ↩ Marquer à revoir →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalARevoir;
