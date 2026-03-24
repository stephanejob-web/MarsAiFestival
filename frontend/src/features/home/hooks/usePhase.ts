import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../constants/api";

export type PhaseNumber = 0 | 1 | 2 | 3;

export interface PhaseInfo {
    phase: PhaseNumber;
    label: string;
    nextDate: string | null;
    submissionOpen: boolean;
    finalist_count: number;
    dates: {
        submission_open: string | null;
        submission_close: string | null;
        phase_top50_open: string | null;
        phase_top50_close: string | null;
        phase_award_open: string | null;
        phase_award_close: string | null;
        ceremony: string | null;
    };
}

const DEFAULT: PhaseInfo = {
    phase: 0,
    label: "Inscriptions",
    nextDate: "2026-09-30T23:59:59Z",
    submissionOpen: true,
    finalist_count: 5,
    dates: {
        submission_open: null,
        submission_close: "2026-09-30T23:59:59Z",
        phase_top50_open: null,
        phase_top50_close: null,
        phase_award_open: null,
        phase_award_close: null,
        ceremony: null,
    },
};

export const usePhase = (): { phase: PhaseInfo; loading: boolean } => {
    const [phase, setPhase] = useState<PhaseInfo>(DEFAULT);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/public/phase`)
            .then((r) => r.json())
            .then((json) => {
                if (json.success && json.data) setPhase(json.data as PhaseInfo);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { phase, loading };
};
