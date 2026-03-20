import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DelibView from "../features/jury/components/DelibView";
import DiscuterView from "../features/jury/components/DiscuterView";
import EvalView from "../features/jury/components/EvalView";
import JurySidebar from "../features/jury/components/JurySidebar";
import JuryToast from "../features/jury/components/JuryToast";
import JuryTopbar from "../features/jury/components/JuryTopbar";
import ListesView from "../features/jury/components/ListesView";
import ModalARevoir from "../features/jury/components/ModalARevoir";
import ModalRefuse from "../features/jury/components/ModalRefuse";
import useJuryPanel from "../features/jury/hooks/useJuryPanel";
import { useBanProtection } from "../features/admin/hooks/useBanProtection";
import BanModal from "../features/admin/components/BanModal";

const JuryPanel = (): React.JSX.Element => {
    const panel = useJuryPanel();
    const { isBanned } = useBanProtection();

    return (
        <div className="flex h-screen overflow-hidden">
            <BanModal visible={isBanned} />
            <JurySidebar
                activeView={panel.activeView}
                onViewChange={panel.setActiveView}
                pendingCount={panel.pendingCount}
                evaluatedCount={panel.evaluatedCount}
                discussCount={panel.discussCount}
                progress={panel.progress}
                totalFilms={panel.films.length}
                isChatOpen={panel.isChatOpen}
                onChatToggle={() => panel.setIsChatOpen(!panel.isChatOpen)}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <JuryTopbar
                    activeView={panel.activeView}
                    onDisconnect={() => {
                        // Navigation handled inside JuryTopbar
                    }}
                />
                {panel.activeView === "eval" && <EvalView panel={panel} />}
                {panel.activeView === "listes" && <ListesView />}
                {panel.activeView === "discuter" && <DiscuterView panel={panel} />}
                {panel.activeView === "delib" && <DelibView />}
            </div>
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
            <ToastContainer />
        </div>
    );
};

export default JuryPanel;
