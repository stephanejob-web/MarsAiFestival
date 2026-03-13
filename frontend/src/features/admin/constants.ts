import type { AdminNavCategory } from "./types";

export const ADMIN_NAV_LINKS: AdminNavCategory[] = [
    {
        category: "Contenu Principal",
        items: [
            { label: "Utilisateurs", to: "/admin", indicator: "bg-emerald-500" },
            { label: "Assignations films", to: "/admin/films", indicator: "bg-zinc-600" },
            { label: "Phases & Dates", to: "/admin/jury", indicator: "bg-zinc-600" },
            { label: "Selection & Votes", to: "/admin/realisator", indicator: "bg-zinc-600" },
        ],
    },
    {
        category: "Configuration",
        items: [
            { label: "Awards & Sponsors", to: "/admin/tags", indicator: "bg-zinc-600" },
            { label: "Administration site", to: "/admin/site", indicator: "bg-zinc-600" },
        ],
    },
];

export const ADMIN_LABELS = {
    TITLE: "Mars AI Festival",
    HELLO_ADMIN: "Hello Admin",
    LOGOUT: "Déconnexion",
    ADMIN_PANEL: "Panneau Admin",
    WELCOME_MESSAGE: "Bonjour Dylan — cette page est dédiée au développement du panneau admin.",
    RETURN_HOME: "Retour à l'accueil",
};
