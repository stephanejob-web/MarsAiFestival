import { useState } from "react";

export type VoteMode = "normal" | "rapide";

const MODE_KEY = "jury_vote_mode";

interface UseVoteModeReturn {
    mode: VoteMode;
    setMode: (mode: VoteMode) => void;
}

const useVoteMode = (): UseVoteModeReturn => {
    const [mode, setModeState] = useState<VoteMode>(
        () => (localStorage.getItem(MODE_KEY) as VoteMode | null) ?? "normal",
    );

    const setMode = (newMode: VoteMode): void => {
        localStorage.setItem(MODE_KEY, newMode);
        setModeState(newMode);
    };

    return { mode, setMode };
};

export default useVoteMode;
