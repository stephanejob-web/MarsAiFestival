import React from "react";

interface AdminMessageToastProps {
    message: string | null;
    onClose: () => void;
}

const AdminMessageToast = ({
    message,
    onClose,
}: AdminMessageToastProps): React.JSX.Element | null => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-lavande/30 bg-surface p-10 text-center shadow-[0_0_80px_rgba(139,92,246,0.15)]">
                <div className="text-6xl">📩</div>
                <div>
                    <div className="font-display text-[1.5rem] font-extrabold text-lavande">
                        Message de l&apos;administrateur
                    </div>
                    <div className="mt-2 max-w-sm text-[0.9rem] leading-relaxed text-mist">
                        {message}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-[0.85rem] font-semibold text-mist transition-all hover:bg-white/10 hover:text-white-soft"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default AdminMessageToast;
