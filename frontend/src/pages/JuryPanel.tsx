import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DiscuterView from "../features/jury/components/DiscuterView";
import EvalView from "../features/jury/components/EvalView";
import JuryToast from "../features/jury/components/JuryToast";
import ListesView from "../features/jury/components/ListesView";
import MobileAppView from "../features/jury/components/MobileAppView";
import ModalARevoir from "../features/jury/components/ModalARevoir";
import ModalRefuse from "../features/jury/components/ModalRefuse";
import ModernView from "../features/jury/components/ModernView";
import ScreeningView from "../features/jury/components/ScreeningView";
import useJuryPanel from "../features/jury/hooks/useJuryPanel";
import useJuryUser from "../features/jury/hooks/useJuryUser";
import useScreening from "../features/jury/hooks/useScreening";
import { useBanProtection } from "../features/admin/hooks/useBanProtection";
import BanModal from "../features/admin/components/BanModal";
import SessionExpiredModal from "../features/admin/components/SessionExpiredModal";
import AdminMessageToast from "../features/admin/components/AdminMessageToast";
import JuryLayout from "../layouts/JuryLayout";

type EvalVariant = "classic" | "modern" | "rapide";

const JuryPanel = (): React.JSX.Element => {
    const user = useJuryUser();
    const panel = useJuryPanel();
    const { isBanned, isSessionExpired, adminMessage, clearAdminMessage } = useBanProtection();
    const screening = useScreening();

    // Si la projection s'arrête pendant que le jury est sur la vue screening → retour eval
    useEffect(() => {
        if (!screening && panel.activeView === "screening") {
            panel.setActiveView("eval");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screening]);

    const [evalVariant, setEvalVariantState] = useState<EvalVariant>(() => {
        const stored = localStorage.getItem("jury_eval_variant") as EvalVariant | null;
        if (!stored || stored === "classic") return "rapide";
        return stored;
    });

    const handleEvalVariantChange = (v: EvalVariant): void => {
        localStorage.setItem("jury_eval_variant", v);
        setEvalVariantState(v);
    };

    if (!user) return <Navigate to="/jury" replace />;

    return (
        <>
            <BanModal visible={isBanned} />
            <SessionExpiredModal visible={isSessionExpired} />
            <JuryLayout
                activeView={panel.activeView}
                onViewChange={panel.setActiveView}
                pendingCount={panel.pendingCount}
                evaluatedCount={panel.evaluatedCount}
                discussCount={panel.discussCount}
                progress={panel.progress}
                totalFilms={panel.films.length}
                isChatOpen={panel.isChatOpen}
                onChatToggle={() => panel.setIsChatOpen(!panel.isChatOpen)}
                screening={screening}
                evalVariant={evalVariant}
                onEvalVariantChange={handleEvalVariantChange}
            >
                {(panel.activeView === "eval" || panel.activeView === "tinder") &&
                    (evalVariant === "modern" ? (
                        <ModernView panel={panel} />
                    ) : evalVariant === "rapide" ? (
                        <EvalView panel={panel} voteMode="rapide" />
                    ) : (
                        <EvalView panel={panel} voteMode="normal" />
                    ))}
                {panel.activeView === "listes" && <ListesView />}
                {panel.activeView === "discuter" && <DiscuterView panel={panel} />}
                {panel.activeView === "screening" && screening && (
                    <ScreeningView screening={screening} />
                )}
                {panel.activeView === "mobile" && <MobileAppView />}
            </JuryLayout>
            <ModalARevoir
                isOpen={panel.activeModal === "arevoir"}
                filmTitle={panel.activeFilm.title}
                selectedReason={panel.selectedReason}
                message={panel.modalMessage}
                onReasonSelect={panel.setSelectedReason}
                onMessageChange={panel.setModalMessage}
                onCancel={() => panel.setActiveModal(null)}
                onConfirm={panel.confirmARevoir}
            />
            <ModalRefuse
                isOpen={panel.activeModal === "refuse"}
                filmTitle={panel.activeFilm.title}
                selectedReason={panel.selectedReason}
                message={panel.modalMessage}
                onReasonSelect={panel.setSelectedReason}
                onMessageChange={panel.setModalMessage}
                onCancel={() => panel.setActiveModal(null)}
                onConfirm={panel.confirmRefuse}
            />
            <JuryToast message={panel.toast} />
            <AdminMessageToast message={adminMessage} onClose={clearAdminMessage} />
            <ToastContainer />
        </>
    );
};

export default JuryPanel;
