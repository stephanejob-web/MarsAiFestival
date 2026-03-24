import React from "react";

const BANNER_BASE =
    "mb-5 rounded-[12px] border px-4 py-3.5 flex items-start gap-3 text-sm";

interface SaveDataBannerProps {
    /** null = pas encore décidé, true = accepté, false = refusé */
    consent: boolean | null;
    hasSavedData: boolean;
    restoreDismissed: boolean;
    onAcceptConsent: () => void;
    onRefuseConsent: () => void;
    onRestoreData: () => void;
    onDismissRestore: () => void;
}

const SaveDataBanner = ({
    consent,
    hasSavedData,
    restoreDismissed,
    onAcceptConsent,
    onRefuseConsent,
    onRestoreData,
    onDismissRestore,
}: SaveDataBannerProps): React.JSX.Element | null => {
    // Bannière de restauration — données dispo + consentement donné + pas encore ignoré
    if (consent === true && hasSavedData && !restoreDismissed) {
        return (
            <div className={`${BANNER_BASE} border-aurora/25 bg-aurora/5`}>
                <span className="text-lg leading-none mt-0.5">💾</span>
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-aurora mb-0.5">
                        Vos informations ont été retrouvées
                    </div>
                    <div className="text-mist text-xs leading-relaxed">
                        Souhaitez-vous pré-remplir le formulaire avec vos coordonnées précédentes ?
                    </div>
                    <div className="flex gap-2 mt-2.5">
                        <button
                            type="button"
                            onClick={onRestoreData}
                            className="bg-aurora text-deep-sky text-xs font-bold px-4 py-1.5 rounded-[7px] cursor-pointer hover:opacity-90 transition-opacity"
                        >
                            Oui, pré-remplir
                        </button>
                        <button
                            type="button"
                            onClick={onDismissRestore}
                            className="bg-white/8 text-mist text-xs px-4 py-1.5 rounded-[7px] cursor-pointer hover:text-white-soft transition-colors"
                        >
                            Non, recommencer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Bannière de consentement — pas encore décidé
    if (consent === null) {
        return (
            <div className={`${BANNER_BASE} border-white/12 bg-white/3`}>
                <span className="text-lg leading-none mt-0.5">🔒</span>
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white-soft mb-0.5">
                        Faciliter vos prochains dépôts ?
                    </div>
                    <div className="text-mist text-xs leading-relaxed">
                        Vos informations personnelles (nom, email, adresse) peuvent être sauvegardées
                        dans ce navigateur pour pré-remplir ce formulaire lors d'une prochaine soumission.
                        Ces données restent sur votre appareil et ne sont jamais transmises à des tiers.
                    </div>
                    <div className="flex gap-2 mt-2.5">
                        <button
                            type="button"
                            onClick={onAcceptConsent}
                            className="bg-white/10 border border-white/15 text-white-soft text-xs font-semibold px-4 py-1.5 rounded-[7px] cursor-pointer hover:bg-white/15 transition-colors"
                        >
                            Accepter
                        </button>
                        <button
                            type="button"
                            onClick={onRefuseConsent}
                            className="text-mist/70 text-xs px-3 py-1.5 rounded-[7px] cursor-pointer hover:text-mist transition-colors"
                        >
                            Refuser
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default SaveDataBanner;
