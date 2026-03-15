export interface AdminNavItem {
    label: string;
    to: string;
    icon: string;
    count?: number;
}

export interface AdminNavCategory {
    category: string;
    items: AdminNavItem[];
}

export interface AdminUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: "jury" | "admin";
    is_active: boolean;
    profil_picture: string | null;
    jury_description: string | null;
    created_at: string;
    films_assigned: number;
    films_evaluated: number;
}

export interface AdminFilm {
    id: number;
    dossier_num: string;
    original_title: string;
    statut: string;
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
