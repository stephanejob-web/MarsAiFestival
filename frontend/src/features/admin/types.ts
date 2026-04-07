import React from "react";

export interface AdminNavItem {
    label: string;
    to: string;
    icon: React.ReactNode;
    count?: number;
    external?: boolean;
    requiresPermission?: "can_access_admin";
}

export interface AdminNavCategory {
    category: string;
    items: AdminNavItem[];
}

export interface AdminUsersStatsData {
    adminCount: number;
    moderatorCount: number;
    deactivatedCount: number;
    totalCreatedCount: number;
}

export interface ModeratorPermissions {
    can_access_admin: boolean;
    can_disable_accounts: boolean;
    can_ban_users: boolean;
    can_send_messages: boolean;
}

export interface AdminUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: "jury" | "admin" | "moderateur";
    is_active: boolean;
    is_banned: boolean;
    profil_picture: string | null;
    jury_description: string | null;
    created_at: string;
    films_assigned: number;
    films_evaluated: number;
    permissions?: ModeratorPermissions | null;
}

export interface AdminFilm {
    id: number;
    dossier_num: string;
    original_title: string;
    statut: string;
    poster_img: string | null;
    duration: number | null;
    first_name: string;
    last_name: string;
    country: string;
    video_url: string | null;
}

export interface AdminAssignment {
    jury_id: number;
    film_id: number;
    jury_first_name: string;
    jury_last_name: string;
    film_title: string;
    assigned_at: string;
}

export interface AdminJuryMember {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    profil_picture: string | null;
}

export interface JuryDecision {
    jury_id: number;
    first_name: string;
    last_name: string;
    profil_picture: string | null;
    decision: "valide" | "arevoir" | "refuse" | "in_discussion" | null;
}

export interface AdminFilmVoteSummary {
    film_id: number;
    original_title: string;
    dossier_num: string;
    statut: string;
    video_url: string | null;
    realisator_email: string | null;
    realisator_first_name: string | null;
    realisator_last_name: string | null;
    total_votes: number;
    votes_valide: number;
    votes_arevoir: number;
    votes_refuse: number;
    votes_discussion: number;
    total_assigned: number;
    total_jury: number;
    total_comments: number;
    total_tickets: number;
    jury_decisions: JuryDecision[] | null;
}
