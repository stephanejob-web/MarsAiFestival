import { useState } from "react";

const getToken = (): string => localStorage.getItem("jury_token") ?? "";

export interface AdminVocalReturn {
    isInVocal: boolean;
    joinVocal: () => void;
    leaveVocal: () => void;
}

const useAdminVocal = (): AdminVocalReturn => {
    const [isInVocal, setIsInVocal] = useState(false);

    const joinVocal = (): void => {
        fetch("/api/admin/vocal/start", {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((r) => {
                console.log("[AdminVocal] start →", r.status); // eslint-disable-line no-console
                if (r.ok) setIsInVocal(true);
            })
            .catch((e) => console.error("[AdminVocal] start error", e)); // eslint-disable-line no-console
    };

    const leaveVocal = (): void => {
        fetch("/api/admin/vocal/stop", {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((r) => {
                console.log("[AdminVocal] stop →", r.status); // eslint-disable-line no-console
                if (r.ok) setIsInVocal(false);
            })
            .catch((e) => console.error("[AdminVocal] stop error", e)); // eslint-disable-line no-console
    };

    return { isInVocal, joinVocal, leaveVocal };
};

export default useAdminVocal;
