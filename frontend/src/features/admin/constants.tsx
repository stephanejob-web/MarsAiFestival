import { Users, Film, Trophy, Tag, Globe, BookOpen, Plug } from "lucide-react";
import type { AdminNavCategory } from "./types";

export const ADMIN_NAV_LINKS: AdminNavCategory[] = [
    {
        category: "Gestion",
        items: [
            { label: "Utilisateurs", to: "/admin", icon: <Users size={15} />, count: 6 },
            { label: "Assignation films", to: "/admin/films", icon: <Film size={15} />, count: 50 },
        ],
    },
    {
        category: "Suivi",
        items: [{ label: "Sélection & Votes", to: "/admin/selection", icon: <Trophy size={15} /> }],
    },
    {
        category: "Configuration",
        items: [{ label: "Étiquettes jury", to: "/admin/tags", icon: <Tag size={15} /> }],
    },
    {
        category: "Site",
        items: [
            {
                label: "Administration site",
                to: "/admin/cms",
                icon: <Globe size={15} />,
                requiresPermission: "can_access_admin",
            },
        ],
    },
    {
        category: "Développement",
        items: [
            { label: "Documentation", to: "/admin/docs", icon: <BookOpen size={15} /> },
            {
                label: "Documentation API",
                to: "/api/docs",
                icon: <Plug size={15} />,
                external: true,
            },
        ],
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
