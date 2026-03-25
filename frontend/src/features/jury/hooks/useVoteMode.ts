import { useState } from "react";

export type VoteMode = "normal" | "rapide";

const MODE_KEY = "jury_vote_mode";
const INTRO_SEEN_KEY = "jury_rapide_intro_seen";

interface UseVoteModeReturn {
    mode: VoteMode;
    setMode: (mode: VoteMode) => void;
    hasSeenIntro: boolean;
    markIntroSeen: () => void;
}

const useVoteMode = (): UseVoteModeReturn => {
    const [mode, setModeState] = useState<VoteMode>(
        () => (localStorage.getItem(MODE_KEY) as VoteMode | null) ?? "normal",
    );
    const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(
        () => localStorage.getItem(INTRO_SEEN_KEY) === "1",
    );

    const setMode = (newMode: VoteMode): void => {
        localStorage.setItem(MODE_KEY, newMode);
        setModeState(newMode);
    };

    const markIntroSeen = (): void => {
        localStorage.setItem(INTRO_SEEN_KEY, "1");
        setHasSeenIntro(true);
    };

    return { mode, setMode, hasSeenIntro, markIntroSeen };
};

export default useVoteMode;
