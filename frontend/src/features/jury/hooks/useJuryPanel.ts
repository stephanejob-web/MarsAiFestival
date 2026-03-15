import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { INITIAL_FILMS } from "../../../constants/jury";
import type { ActiveView, Decision, JuryFilm, ListTab, ModalType, ReasonTag } from "../types";
import useJuryUser from "./useJuryUser";

const API = import.meta.env.VITE_API_URL as string;

// ── Mapping décisions frontend ↔ backend ──────────────────────────────────────
const toApiDecision = (d: Exclude<Decision, null>): string | null => {
    if (d === "valide") return "valide";
    if (d === "aRevoir") return "arevoir";
    if (d === "refuse") return "refuse";
    if (d === "discuter") return "in_discussion";
    return null;
};

const fromApiDecision = (d: string | null | undefined): Decision => {
    if (d === "valide") return "valide";
    if (d === "arevoir") return "aRevoir";
    if (d === "refuse") return "refuse";
    if (d === "in_discussion") return "discuter";
    return null;
};

// ── Shape returned by GET /api/assignments/jury/:id ───────────────────────────
interface ApiFilmRow {
    film_id: number;
    dossier_num: string;
    original_title: string;
    english_title: string | null;
    language: string | null;
    tags: string | null;
    duration: number | null;
    ia_class: "full" | "hybrid" | null;
    video_url: string | null;
    ia_image: number;
    ia_son: number;
    ia_scenario: number;
    ia_post: number;
    creative_workflow: string | null;
    tech_stack: string | null;
    subtitle_fr_url: string | null;
    subtitle_en_url: string | null;
    film_year: number | null;
    realisator_first: string;
    realisator_last: string;
    realisator_country: string | null;
}

const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
};

const mapApiFilm = (row: ApiFilmRow): JuryFilm => ({
    id: row.film_id,
    title: row.original_title,
    author: `${row.realisator_first} ${row.realisator_last}`,
    country: row.realisator_country ?? "—",
    year: String(row.film_year ?? 2026),
    duration: formatDuration(row.duration),
    format: row.ia_class === "full" ? "Full IA" : "Hybride",
    subtitles: row.subtitle_fr_url ? "FR" : row.subtitle_en_url ? "EN" : "—",
    copyright: "Vérifié",
    tools: row.tech_stack ?? "—",
    iaScenario: row.ia_scenario ? "Oui" : "Non",
    iaImage: row.ia_image ? "Oui" : "Non",
    iaPost: row.ia_post ? "Oui" : "Non",
    note: row.creative_workflow ?? "",
    videoUrl: row.video_url ?? null,
    myDecision: null,
    comments: [],
    opinions: [],
    votes: [],
});

export interface UseJuryPanelReturn {
    films: JuryFilm[];
    isLoadingFilms: boolean;
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
    removeFromDiscussion: (filmId: number) => void;
    handleCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    addDiscussionComment: (filmId: number, comment: string) => void;
    handleCommentDraftChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showToast: (message: string) => void;
    confirmARevoir: () => void;
    confirmRefuse: () => void;
}

const useJuryPanel = (): UseJuryPanelReturn => {
    const user = useJuryUser();

    const [films, setFilms] = useState<JuryFilm[]>(INITIAL_FILMS);
    const [isLoadingFilms, setIsLoadingFilms] = useState<boolean>(false);
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

    // ── Fetch real films + existing votes when user is authenticated ──────────
    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem("jury_token");
        const headers = { Authorization: `Bearer ${token ?? ""}` };
        setIsLoadingFilms(true);
        Promise.all([
            fetch(`${API}/api/assignments/jury/${user.id}`, { headers }).then(
                (r) => r.json() as Promise<{ success: boolean; data: ApiFilmRow[] }>,
            ),
            fetch(`${API}/api/votes?juryId=${user.id}`, { headers }).then(
                (r) =>
                    r.json() as Promise<{
                        success: boolean;
                        data: { film_id: number; decision: string }[];
                    }>,
            ),
        ])
            .then(([filmsData, votesData]) => {
                if (filmsData.success && filmsData.data.length > 0) {
                    const voteMap = new Map<number, Decision>(
                        (votesData.success ? votesData.data : []).map((v) => [
                            v.film_id,
                            fromApiDecision(v.decision),
                        ]),
                    );
                    const realFilms = filmsData.data.map((row) => ({
                        ...mapApiFilm(row),
                        myDecision: voteMap.get(row.film_id) ?? null,
                    }));
                    setFilms(realFilms);
                    setActiveFilmId(realFilms[0].id);
                }
            })
            .catch(() => {
                // Keep INITIAL_FILMS on network error
            })
            .finally(() => setIsLoadingFilms(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]); // intentionally track only id to avoid re-fetch on reference change

    const pendingCount = useMemo(
        () => films.filter((film) => film.myDecision === null).length,
        [films],
    );

    const evaluatedCount = useMemo(
        () => films.filter((film) => film.myDecision !== null).length,
        [films],
    );

    const discussCount = useMemo(
        () => films.filter((film) => film.myDecision === "discuter").length,
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

    const progress = films.length > 0 ? Math.round((evaluatedCount / films.length) * 100) : 0;

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
                    if (film.id !== activeFilm.id) return film;
                    return { ...film, myDecision: decision };
                }),
            );
            // Persist vote to backend (fire and forget)
            const apiDecision = toApiDecision(decision);
            if (apiDecision) {
                const token = localStorage.getItem("jury_token");
                if (token) {
                    void fetch(`${API}/api/votes`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ filmId: activeFilm.id, decision: apiDecision }),
                    });
                }
            }
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
            if (decision === "discuter") {
                if (activeFilm.myDecision === "discuter") {
                    // Toggle off — retirer de la discussion
                    setFilms((prev) =>
                        prev.map((f) => (f.id === activeFilm.id ? { ...f, myDecision: null } : f)),
                    );
                    const token = localStorage.getItem("jury_token");
                    if (token) {
                        void fetch(`${API}/api/votes?filmId=${activeFilm.id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                        });
                    }
                    showToast("Film retiré de la discussion");
                    return;
                }
                applyDecision(decision);
                setActiveView("discuter");
                showToast("Film ajouté à la discussion 💬");
                return;
            }
            applyDecision(decision);
            showToast("Film validé ✓");
        },
        [applyDecision, showToast, activeFilm.id, activeFilm.myDecision],
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

    const removeFromDiscussion = useCallback(
        (filmId: number): void => {
            setFilms((prev) => prev.map((f) => (f.id === filmId ? { ...f, myDecision: null } : f)));
            const token = localStorage.getItem("jury_token");
            if (token) {
                void fetch(`${API}/api/votes?filmId=${filmId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            showToast("Film retiré de la discussion");
        },
        [showToast],
    );

    const addDiscussionComment = useCallback((filmId: number, comment: string): void => {
        const content = comment.trim();
        if (!content) return;
        setFilms((prev) =>
            prev.map((film) => {
                if (film.id !== filmId) return film;
                return { ...film, comments: [...film.comments, content] };
            }),
        );
    }, []);

    return {
        films,
        isLoadingFilms,
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
        removeFromDiscussion,
        handleCommentSubmit,
        handleCommentDraftChange,
        addDiscussionComment,
        showToast,
        confirmARevoir,
        confirmRefuse,
    };
};

export default useJuryPanel;
