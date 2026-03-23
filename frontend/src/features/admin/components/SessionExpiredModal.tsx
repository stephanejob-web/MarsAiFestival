import React from "react";

interface SessionExpiredModalProps {
    visible: boolean;
}

const SessionExpiredModal = ({ visible }: SessionExpiredModalProps): React.JSX.Element | null => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-solar/30 bg-surface p-10 text-center shadow-[0_0_80px_rgba(255,200,50,0.15)]">
                <div className="text-6xl">⚠️</div>
                <div>
                    <div className="font-display text-[1.5rem] font-extrabold text-solar">
                        Session expirée
                    </div>
                    <div className="mt-2 max-w-sm text-[0.9rem] leading-relaxed text-mist">
                        Vous avez été déconnecté car une nouvelle connexion a été détectée sur votre
                        compte.
                        <br />
                        Si ce n&apos;est pas vous, changez votre mot de passe.
                    </div>
                </div>
                <a
                    href="/jury"
                    className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-[0.85rem] font-semibold text-mist transition-all hover:bg-white/10 hover:text-white-soft"
                >
                    Se reconnecter
                </a>
            </div>
        </div>
    );
};

export default SessionExpiredModal;
