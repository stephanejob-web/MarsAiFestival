import React from "react";

interface BanModalProps {
    visible: boolean;
}

const BanModal = ({ visible }: BanModalProps): React.JSX.Element | null => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-coral/30 bg-surface p-10 text-center shadow-[0_0_80px_rgba(255,107,107,0.15)]">
                <div className="text-6xl">🚫</div>
                <div>
                    <div className="font-display text-[1.5rem] font-extrabold text-coral">
                        Accès suspendu
                    </div>
                    <div className="mt-2 max-w-sm text-[0.9rem] leading-relaxed text-mist">
                        Votre compte a été désactivé par un administrateur.
                        <br />
                        Veuillez contacter l&apos;équipe organisatrice.
                    </div>
                </div>
                <a
                    href="/jury"
                    className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-[0.85rem] font-semibold text-mist transition-all hover:bg-white/10 hover:text-white-soft"
                >
                    Retour à l&apos;accueil
                </a>
            </div>
        </div>
    );
};

export default BanModal;
