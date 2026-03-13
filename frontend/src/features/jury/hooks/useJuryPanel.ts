import { useCallback, useMemo, useRef, useState } from "react";

import { INITIAL_FILMS } from "../../../constants/jury";
import type { ActiveView, Decision, JuryFilm, ListTab, ModalType, ReasonTag } from "../types";

export interface UseJuryPanelReturn {
    films: JuryFilm[];
    activeFilm: JuryFilm;
    activeFilmId: number;
    activeTab: ListTab;
    commentDraft: string;
    filteredFilms: JuryFilm[];
    pendingCount: number;
    evaluatedCount: number;
    discussCount: number;
    progress: number;
    activeView: ActiveView;
    activeModal: ModalType;
    selectedReason: ReasonTag | null;
    modalMessage: string;
    notationComment: string;
    toast: string | null;
    isChatOpen: boolean;
    setActiveFilmId: (id: number) => void;
    setActiveTab: (tab: ListTab) => void;
    setCommentDraft: (value: string) => void;
    setActiveView: (view: ActiveView) => void;
    setActiveModal: (modal: ModalType) => void;
    setSelectedReason: (reason: ReasonTag | null) => void;
    setModalMessage: (message: string) => void;
    setNotationComment: (comment: string) => void;
    setIsChatOpen: (open: boolean) => void;
    handleDecision: (decision: Exclude<Decision, null>) => void;
    handleCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleCommentDraftChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showToast: (message: string) => void;
    confirmARevoir: () => void;
    confirmRefuse: () => void;
}

const useJuryPanel = (): UseJuryPanelReturn => {
    const [films, setFilms] = useState<JuryFilm[]>(INITIAL_FILMS);
    const [activeFilmId, setActiveFilmId] = useState<number>(INITIAL_FILMS[0].id);
    const [activeTab, setActiveTab] = useState<ListTab>("pending");
    const [commentDraft, setCommentDraft] = useState<string>("");
    const [activeView, setActiveView] = useState<ActiveView>("eval");
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedReason, setSelectedReason] = useState<ReasonTag | null>(null);
    const [modalMessage, setModalMessage] = useState<string>("");
    const [notationComment, setNotationComment] = useState<string>("");
    const [toast, setToast] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const pendingCount = useMemo(
        () => films.filter((film) => film.myDecision === null).length,
        [films],
    );

    const evaluatedCount = useMemo(
        () => films.filter((film) => film.myDecision !== null).length,
        [films],
    );

    const discussCount = useMemo(
        () => films.filter((film) => film.myDecision === "aRevoir").length,
        [films],
    );

    const filteredFilms = useMemo(() => {
        if (activeTab === "pending") {
            return films.filter((film) => film.myDecision === null);
        }
        if (activeTab === "evaluated") {
            return films.filter((film) => film.myDecision !== null);
        }
        return films;
    }, [films, activeTab]);

    const activeFilm = useMemo(() => {
        const found = films.find((film) => film.id === activeFilmId);
        return found ?? films[0];
    }, [films, activeFilmId]);

    const progress = Math.round((evaluatedCount / films.length) * 100);

    const showToast = useCallback((message: string): void => {
        setToast(message);
        if (toastTimerRef.current !== null) {
            clearTimeout(toastTimerRef.current);
        }
        toastTimerRef.current = setTimeout(() => {
            setToast(null);
            toastTimerRef.current = null;
        }, 3000);
    }, []);

    const applyDecision = useCallback(
        (decision: Exclude<Decision, null>): void => {
            setFilms((prev) =>
                prev.map((film) => {
                    if (film.id !== activeFilm.id) {
                        return film;
                    }
                    return { ...film, myDecision: decision };
                }),
            );
        },
        [activeFilm.id],
    );

    const handleDecision = useCallback(
        (decision: Exclude<Decision, null>): void => {
            if (decision === "aRevoir") {
                setSelectedReason(null);
                setModalMessage("");
                setActiveModal("arevoir");
                return;
            }
            if (decision === "refuse") {
                setSelectedReason(null);
                setModalMessage("");
                setActiveModal("refuse");
                return;
            }
            applyDecision(decision);
            showToast("Film validé ✓");
        },
        [applyDecision, showToast],
    );

    const confirmARevoir = useCallback((): void => {
        applyDecision("aRevoir");
        setActiveModal(null);
        setSelectedReason(null);
        setModalMessage("");
        showToast("Film mis en révision ↩");
    }, [applyDecision, showToast]);

    const confirmRefuse = useCallback((): void => {
        applyDecision("refuse");
        setActiveModal(null);
        setSelectedReason(null);
        setModalMessage("");
        showToast("Film refusé ✕");
    }, [applyDecision, showToast]);

    const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const content = commentDraft.trim();
        if (!content) {
            return;
        }

        setFilms((prev) =>
            prev.map((film) => {
                if (film.id !== activeFilm.id) {
                    return film;
                }
                return { ...film, comments: [...film.comments, content] };
            }),
        );
        setCommentDraft("");
    };

    const handleCommentDraftChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setCommentDraft(e.target.value);
    };

    return {
        films,
        activeFilm,
        activeFilmId,
        activeTab,
        commentDraft,
        filteredFilms,
        pendingCount,
        evaluatedCount,
        discussCount,
        progress,
        activeView,
        activeModal,
        selectedReason,
        modalMessage,
        notationComment,
        toast,
        isChatOpen,
        setActiveFilmId,
        setActiveTab,
        setCommentDraft,
        setActiveView,
        setActiveModal,
        setSelectedReason,
        setModalMessage,
        setNotationComment,
        setIsChatOpen,
        handleDecision,
        handleCommentSubmit,
        handleCommentDraftChange,
        showToast,
        confirmARevoir,
        confirmRefuse,
    };
};

export default useJuryPanel;
