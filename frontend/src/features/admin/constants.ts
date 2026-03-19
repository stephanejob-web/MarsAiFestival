import type { AdminNavCategory } from "./types";

export const ADMIN_NAV_LINKS: AdminNavCategory[] = [
    {
        category: "Gestion",
        items: [
            { label: "Utilisateurs", to: "/admin", icon: "👥", count: 6 },
            { label: "Assignation films", to: "/admin/films", icon: "🎬", count: 50 },
        ],
    },
    {
        category: "Concours",
        items: [{ label: "Phases & Dates", to: "/admin/phases", icon: "📅" }],
    },
    {
        category: "Suivi",
        items: [{ label: "Sélection & Votes", to: "/admin/selection", icon: "🏅" }],
    },
    {
        category: "Festival",
        items: [{ label: "Awards & Sponsors", to: "/admin/awards", icon: "🏆" }],
    },
    {
        category: "Site",
        items: [{ label: "Administration site", to: "/admin/cms", icon: "🌐" }],
    },
];

export const ADMIN_LABELS = {
    TITLE: "marsAI",
    SUBTITLE: "Panneau d'administration",
    ADMIN_NAME: "Admin marsAI",
    ADMIN_ROLE: "Administrateur",
    LOGOUT: "Déconnexion",
    ADMIN_PANEL: "Panneau Admin",
    WELCOME_MESSAGE: "Sélectionnez une section dans le menu de navigation.",
    RETURN_HOME: "Retour à l'accueil",
};
