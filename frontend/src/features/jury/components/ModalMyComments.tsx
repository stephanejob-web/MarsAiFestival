import React, { useEffect, useState } from "react";
import { MessageSquare, X } from "lucide-react";

import useJuryUser from "../hooks/useJuryUser";
import type { JuryFilm } from "../types";

interface MyFilmComment {
    id: number;
    film_id: number;
    text: string;
    created_at: string;
}

interface ApiMyFilmCommentsResponse {
    success: boolean;
    data: MyFilmComment[];
}

interface ModalMyCommentsProps {
    filmId: number;
    filmTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

const ModalMyComments = ({
    filmId,
    filmTitle,
    isOpen,
    onClose,
}: ModalMyCommentsProps): React.JSX.Element | null => {
    const user = useJuryUser();
    const [comments, setComments] = useState<MyFilmComment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        const token = localStorage.getItem("jury_token");
        if (!token) return;

        const load = async (): Promise<void> => {
            setComments([]);
            setIsLoading(true);
            setError(null);
            try {
                const r = await fetch("/api/comments/film/mine", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = (await r.json()) as ApiMyFilmCommentsResponse;
                if (!data.success) {
                    setError("Impossible de charger les commentaires.");
                    return;
                }
                setComments(data.data.filter((c) => c.film_id === filmId));
            } catch {
                setError("Une erreur est survenue.");
            } finally {
                setIsLoading(false);
            }
        };

        void load();
    }, [isOpen, filmId]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`Mes commentaires sur ${filmTitle}`}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleBackdropClick}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg mx-4 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <MessageSquare size={18} className="text-emerald-400" />
                        <div>
                            <h2 className="text-sm font-semibold text-white">Mes commentaires</h2>
                            <p className="text-xs text-slate-400 truncate max-w-xs">{filmTitle}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer"
                        className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
                        </div>
                    )}

                    {error !== null && (
                        <p className="text-sm text-red-400 text-center py-4">{error}</p>
                    )}

                    {!isLoading && error === null && comments.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-8">
                            Aucun commentaire pour ce film.
                        </p>
                    )}

                    {!isLoading && error === null && comments.length > 0 && (
                        <div className="flex flex-col gap-4">
                            {user !== null && (
                                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                                    {user.profilPicture !== null ? (
                                        <img
                                            src={user.profilPicture}
                                            alt={user.fullName}
                                            className="w-8 h-8 rounded-full object-cover border border-slate-600"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xs font-semibold text-emerald-400">
                                            {user.initials}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-slate-200">
                                        {user.fullName}
                                    </span>
                                    <span className="ml-auto text-xs text-slate-500">
                                        {comments.length} commentaire
                                        {comments.length > 1 ? "s" : ""}
                                    </span>
                                </div>
                            )}

                            {comments.map((comment) => (
                                <div key={comment.id} className="flex flex-col gap-1.5">
                                    <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/60 rounded-xl px-4 py-3 border border-white/5">
                                        {comment.text}
                                    </p>
                                    <span className="text-[0.7rem] text-slate-500 pl-1">
                                        {new Date(comment.created_at).toLocaleString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Badge autonome — gère son propre état d'ouverture ─────────────────────────

interface FilmCommentsBadgeProps {
    film: JuryFilm;
}

export const FilmCommentsBadge = ({ film }: FilmCommentsBadgeProps): React.JSX.Element | null => {
    const user = useJuryUser();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const myCommentsCount =
        user !== null ? film.comments.filter((c) => c.juryId === user.id).length : 0;

    if (myCommentsCount === 0) return null;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
        setIsOpen(true);
    };

    return (
        <>
            <button
                type="button"
                aria-label={`Voir mes commentaires (${myCommentsCount})`}
                onClick={handleClick}
                className="absolute top-1 right-1 min-w-4.5 h-4.5 px-1 bg-emerald-500 hover:bg-emerald-400 rounded-full flex items-center justify-center transition-colors"
            >
                <span className="text-[9px] font-bold text-white">{myCommentsCount}</span>
            </button>
            <ModalMyComments
                filmId={film.id}
                filmTitle={film.title}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};

export default ModalMyComments;
