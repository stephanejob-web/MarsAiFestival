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
        void fetch("/api/admin/vocal/start", {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        setIsInVocal(true);
    };

    const leaveVocal = (): void => {
        void fetch("/api/admin/vocal/stop", {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        setIsInVocal(false);
    };

    return { isInVocal, joinVocal, leaveVocal };
};

export default useAdminVocal;
