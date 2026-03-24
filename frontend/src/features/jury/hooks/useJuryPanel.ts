import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
    ActiveView,
    Decision,
    JuryComment,
    JuryFilm,
    ListTab,
    ModalType,
    ReasonTag,
} from "../types";
import useJuryUser from "./useJuryUser";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

// ── Mapping décisions frontend ↔ backend (hors discuter, géré séparément) ──────
const toApiDecision = (d: Exclude<Decision, null>): string | null => {
    if (d === "valide") return "valide";
    if (d === "aRevoir") return "arevoir";
    if (d === "refuse") return "refuse";
    return null;
};

const fromApiDecision = (d: string | null | undefined): Decision => {
    if (d === "valide") return "valide";
    if (d === "arevoir") return "aRevoir";
    if (d === "refuse") return "refuse";
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
    realisator_gender: string | null;
    realisator_first: string;
    realisator_last: string;
    realisator_birth_date: string | null;
    realisator_email: string;
    realisator_profession: string | null;
    realisator_phone: string | null;
    realisator_mobile_phone: string | null;
    realisator_street: string | null;
    realisator_postal_code: string | null;
    realisator_city: string | null;
    realisator_country: string | null;
    realisator_youtube: string | null;
    realisator_instagram: string | null;
    realisator_linkedin: string | null;
    realisator_facebook: string | null;
    realisator_xtwitter: string | null;
    realisator_how_did_you_know_us: string | null;
    realisator_newsletter: number;
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
    realisator: {
        gender: row.realisator_gender ?? null,
        firstName: row.realisator_first,
        lastName: row.realisator_last,
        birthDate: row.realisator_birth_date ?? null,
        email: row.realisator_email,
        profession: row.realisator_profession ?? null,
        phone: row.realisator_phone ?? null,
        mobilePhone: row.realisator_mobile_phone ?? null,
        street: row.realisator_street ?? null,
        postalCode: row.realisator_postal_code ?? null,
        city: row.realisator_city ?? null,
        country: row.realisator_country ?? null,
        youtube: row.realisator_youtube ?? null,
        instagram: row.realisator_instagram ?? null,
        linkedin: row.realisator_linkedin ?? null,
        facebook: row.realisator_facebook ?? null,
        xtwitter: row.realisator_xtwitter ?? null,
        howDidYouKnowUs: row.realisator_how_did_you_know_us ?? null,
        newsletter: !!row.realisator_newsletter,
    },
});

// ── Shape returned by GET /api/comments/film?filmId=X ────────────────────────
interface ApiFilmCommentRow {
    id: number;
    jury_id: number;
    film_id: number;
    text: string;
    created_at: string;
    first_name: string;
    last_name: string;
    profil_picture: string | null;
}

const mapApiFilmComment = (r: ApiFilmCommentRow): JuryComment => ({
    id: r.id,
    juryId: r.jury_id,
    name: `${r.first_name} ${r.last_name}`,
    initials: `${r.first_name[0]}${r.last_name[0]}`.toUpperCase(),
    profilPicture: r.profil_picture ?? null,
    text: r.text,
    updatedAt: r.created_at,
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
    voteDirect: (filmId: number, decision: Exclude<Decision, null>) => void;
    removeFromDiscussion: (filmId: number) => void;
    handleCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    addDiscussionComment: (filmId: number, comment: string) => void;
    handleCommentDraftChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCommentPublish: () => void;
    showToast: (message: string) => void;
    confirmARevoir: () => void;
    confirmRefuse: () => void;
}

const useJuryPanel = (): UseJuryPanelReturn => {
    const user = useJuryUser();

    const [films, setFilms] = useState<JuryFilm[]>([]);
    const [isLoadingFilms, setIsLoadingFilms] = useState<boolean>(true);
    const [activeFilmId, setActiveFilmId] = useState<number>(0);
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

    // ── Fetch films + votes personnels + liste discussion partagée ───────────
    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem("jury_token");
        const headers = { Authorization: `Bearer ${token ?? ""}` };
        setIsLoadingFilms(true);
        const fallbackVotes = {
            success: false,
            data: [] as { film_id: number; decision: string }[],
        };
        const fallbackDiscussion = { success: false, data: [] as number[] };
        Promise.all([
            fetch(`${API}/api/assignments/jury/${user.id}`, { headers }).then(
                (r) => r.json() as Promise<{ success: boolean; data: ApiFilmRow[] }>,
            ),
            fetch(`${API}/api/votes?juryId=${user.id}`, { headers })
                .then(
                    (r) =>
                        r.json() as Promise<{
                            success: boolean;
                            data: { film_id: number; decision: string }[];
                        }>,
                )
                .catch(() => fallbackVotes),
            fetch(`${API}/api/discussion`, { headers })
                .then((r) => r.json() as Promise<{ success: boolean; data: number[] }>)
                .catch(() => fallbackDiscussion),
        ])
            .then(([filmsData, votesData, discussionData]) => {
                if (filmsData.success) {
                    const voteMap = new Map<number, Decision>(
                        (votesData.success ? votesData.data : []).map((v) => [
                            v.film_id,
                            fromApiDecision(v.decision),
                        ]),
                    );
                    const discussionSet = new Set<number>(
                        discussionData.success ? discussionData.data : [],
                    );
                    const realFilms = filmsData.data.map((row) => ({
                        ...mapApiFilm(row),
                        myDecision: discussionSet.has(row.film_id)
                            ? "discuter"
                            : (voteMap.get(row.film_id) ?? null),
                    }));
                    setFilms(realFilms);
                    if (realFilms.length > 0) setActiveFilmId(realFilms[0].id);
                }
            })
            .catch(() => {})
            .finally(() => setIsLoadingFilms(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    // ── Fetch all jury comments for the active film ───────────────────────────
    useEffect(() => {
        if (!activeFilmId) return;
        const token = localStorage.getItem("jury_token");
        if (!token) return;
        fetch(`/api/comments/film?filmId=${activeFilmId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json() as Promise<{ success: boolean; data: ApiFilmCommentRow[] }>)
            .then((data) => {
                if (!data.success) return;
                const comments = data.data.map(mapApiFilmComment);
                setFilms((prev) =>
                    prev.map((f) => (f.id === activeFilmId ? { ...f, comments } : f)),
                );
            })
            .catch(() => {});
    }, [activeFilmId]);

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

    const activeFilm = useMemo((): JuryFilm => {
        const found = films.find((film) => film.id === activeFilmId);
        return (
            found ??
            films[0] ?? {
                id: 0,
                title: "",
                author: "",
                country: "",
                year: "",
                duration: "",
                format: "",
                subtitles: "",
                copyright: "",
                tools: "",
                iaScenario: "",
                iaImage: "",
                iaPost: "",
                note: "",
                videoUrl: null,
                myDecision: null,
                comments: [],
                opinions: [],
                votes: [],
                realisator: {
                    gender: null,
                    firstName: "",
                    lastName: "",
                    birthDate: null,
                    email: "",
                    profession: null,
                    phone: null,
                    mobilePhone: null,
                    street: null,
                    postalCode: null,
                    city: null,
                    country: null,
                    youtube: null,
                    instagram: null,
                    linkedin: null,
                    facebook: null,
                    xtwitter: null,
                    howDidYouKnowUs: null,
                    newsletter: false,
                },
            }
        );
    }, [films, activeFilmId]);

    const progress = films.length > 0 ? Math.round((evaluatedCount / films.length) * 100) : 0;

    const changeView = useCallback((view: ActiveView): void => {
        setActiveView(view);
        setActiveFilmId(0);
    }, []);

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
        (decision: Exclude<Decision, null>, message?: string): void => {
            const filmId = activeFilm.id;
            const previousDecision = activeFilm.myDecision;
            setFilms((prev) =>
                prev.map((film) => {
                    if (film.id !== filmId) return film;
                    return { ...film, myDecision: decision };
                }),
            );
            const apiDecision = toApiDecision(decision);
            if (apiDecision) {
                const token = localStorage.getItem("jury_token");
                if (token) {
                    fetch(`${API}/api/votes`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            filmId,
                            decision: apiDecision,
                            ...(message?.trim() ? { message: message.trim() } : {}),
                        }),
                    })
                        .then((r) => {
                            if (!r.ok) throw new Error("Vote failed");
                        })
                        .catch(() => {
                            setFilms((prev) =>
                                prev.map((film) =>
                                    film.id !== filmId
                                        ? film
                                        : { ...film, myDecision: previousDecision },
                                ),
                            );
                            showToast("Erreur : vote non enregistré");
                        });
                }
            }
        },
        [activeFilm.id, activeFilm.myDecision, showToast],
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
                const token = localStorage.getItem("jury_token");
                if (activeFilm.myDecision === "discuter") {
                    // Toggle off — retirer de la liste partagée
                    setFilms((prev) =>
                        prev.map((f) => (f.id === activeFilm.id ? { ...f, myDecision: null } : f)),
                    );
                    if (token) {
                        void fetch(`${API}/api/discussion?filmId=${activeFilm.id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                        });
                    }
                    showToast("Film retiré de la discussion");
                    return;
                }
                // Ajouter à la liste partagée
                setFilms((prev) =>
                    prev.map((f) =>
                        f.id === activeFilm.id ? { ...f, myDecision: "discuter" } : f,
                    ),
                );
                if (token) {
                    void fetch(`${API}/api/discussion`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ filmId: activeFilm.id }),
                    });
                }
                changeView("discuter");
                showToast("Film ajouté à la discussion");
                return;
            }
            applyDecision(decision);
            showToast("Film validé");
        },
        [applyDecision, changeView, showToast, activeFilm.id, activeFilm.myDecision],
    );

    const confirmARevoir = useCallback((): void => {
        applyDecision("aRevoir", modalMessage);
        setActiveModal(null);
        setSelectedReason(null);
        setModalMessage("");
        showToast("Film mis en révision");
    }, [applyDecision, showToast, modalMessage]);

    const voteDirect = useCallback(
        (filmId: number, decision: Exclude<Decision, null>): void => {
            setFilms((prev) => prev.map((f) => (f.id !== filmId ? f : { ...f, myDecision: decision })));
            const token = localStorage.getItem("jury_token");
            if (!token) return;
            if (decision === "discuter") {
                void fetch(`${API}/api/discussion`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ filmId }),
                });
                return;
            }
            const apiDecision = toApiDecision(decision);
            if (!apiDecision) return;
            void fetch(`${API}/api/votes`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ filmId, decision: apiDecision }),
            })
                .then((r) => {
                    if (!r.ok) throw new Error("Vote failed");
                })
                .catch(() => {
                    showToast("Erreur : vote non enregistré");
                });
        },
        [showToast],
    );

    const confirmRefuse = useCallback((): void => {
        applyDecision("refuse", modalMessage);
        setActiveModal(null);
        setSelectedReason(null);
        setModalMessage("");
        showToast("Film refusé");
    }, [applyDecision, showToast, modalMessage]);

    const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const content = commentDraft.trim();
        if (!content) return;
        setCommentDraft("");
        addDiscussionComment(activeFilm.id, content);
    };

    const handleCommentDraftChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setCommentDraft(e.target.value);
    };

    const removeFromDiscussion = useCallback(
        (filmId: number): void => {
            setFilms((prev) => prev.map((f) => (f.id === filmId ? { ...f, myDecision: null } : f)));
            const token = localStorage.getItem("jury_token");
            if (token) {
                void fetch(`${API}/api/discussion?filmId=${filmId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            showToast("Film retiré de la discussion");
        },
        [showToast],
    );

    const addDiscussionComment = useCallback(
        (filmId: number, comment: string): void => {
            const content = comment.trim();
            if (!content) return;
            const token = localStorage.getItem("jury_token");
            if (!token || !user) return;
            void fetch(`/api/comments/film`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ filmId, text: content }),
            })
                .then((r) => r.json() as Promise<{ success: boolean; data: { id: number } }>)
                .then((res) => {
                    if (!res.success) return;
                    setFilms((prev) =>
                        prev.map((film) => {
                            if (film.id !== filmId) return film;
                            return {
                                ...film,
                                comments: [
                                    ...film.comments,
                                    {
                                        id: res.data.id,
                                        juryId: user.id,
                                        name: user.fullName,
                                        initials: user.initials,
                                        profilPicture: user.profilPicture ?? null,
                                        text: content,
                                        updatedAt: new Date().toISOString(),
                                    },
                                ],
                            };
                        }),
                    );
                });
        },
        [user],
    );

    const handleCommentPublish = useCallback((): void => {
        const content = notationComment.trim();
        if (!content || !user) return;

        const token = localStorage.getItem("jury_token");
        if (!token) return;

        // Persistance DB, puis mise à jour locale avec l'id réel retourné
        void fetch(`/api/comments/film`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ filmId: activeFilm.id, text: content }),
        })
            .then((r) => r.json() as Promise<{ success: boolean; data: { id: number } }>)
            .then((res) => {
                if (!res.success) return;
                const newComment: JuryComment = {
                    id: res.data.id,
                    juryId: user.id,
                    name: user.fullName,
                    initials: user.initials,
                    profilPicture: user.profilPicture ?? null,
                    text: content,
                    updatedAt: new Date().toISOString(),
                };
                setFilms((prev) =>
                    prev.map((film) =>
                        film.id !== activeFilm.id
                            ? film
                            : { ...film, comments: [...film.comments, newComment] },
                    ),
                );
                setNotationComment("");
            });
        showToast("Commentaire publié");
    }, [notationComment, user, activeFilm.id, showToast]);

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
        setActiveView: changeView,
        setActiveModal,
        setSelectedReason,
        setModalMessage,
        setNotationComment,
        setIsChatOpen,
        handleDecision,
        voteDirect,
        removeFromDiscussion,
        handleCommentSubmit,
        handleCommentDraftChange,
        addDiscussionComment,
        handleCommentPublish,
        showToast,
        confirmARevoir,
        confirmRefuse,
    };
};

export default useJuryPanel;
