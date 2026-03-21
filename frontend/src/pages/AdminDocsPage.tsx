import React, { useState } from "react";

type Section = "overview" | "architecture" | "roles" | "workflow" | "database" | "realtime" | "cms";

const NAV: { id: Section; label: string; icon: string }[] = [
    { id: "overview", label: "Vue d'ensemble", icon: "🏠" },
    { id: "architecture", label: "Architecture", icon: "🏗️" },
    { id: "roles", label: "Rôles & Accès", icon: "🔐" },
    { id: "workflow", label: "Flux de sélection", icon: "🔄" },
    { id: "database", label: "Schéma base de données", icon: "🗄️" },
    { id: "realtime", label: "Temps réel", icon: "⚡" },
    { id: "cms", label: "Gestion du site", icon: "🌐" },
];

/* ─── Composants utilitaires ─── */

const SectionTitle = ({
    children,
    sub,
}: {
    children: React.ReactNode;
    sub?: string;
}): React.JSX.Element => (
    <div className="mb-6">
        <h2 className="font-display text-[1.35rem] font-extrabold tracking-[-0.02em] text-white-soft">
            {children}
        </h2>
        {sub && <p className="mt-1 text-[0.82rem] text-mist/70">{sub}</p>}
    </div>
);

const Card = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element => (
    <div className={`rounded-xl border border-white/[0.07] bg-surface-2 p-5 ${className}`}>
        {children}
    </div>
);

const Badge = ({
    children,
    color = "aurora",
}: {
    children: React.ReactNode;
    color?: "aurora" | "solar" | "coral" | "lavande" | "mist";
}): React.JSX.Element => {
    const styles: Record<string, string> = {
        aurora: "bg-aurora/10 text-aurora border-aurora/20",
        solar: "bg-solar/10 text-solar border-solar/20",
        coral: "bg-coral/10 text-coral border-coral/20",
        lavande: "bg-lavande/10 text-lavande border-lavande/20",
        mist: "bg-white/[0.05] text-mist border-white/10",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold ${styles[color]}`}
        >
            {children}
        </span>
    );
};

const Tag = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
    <span className="rounded-[5px] border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.7rem] text-mist">
        {children}
    </span>
);

/* ─── Tables BDD ─── */

interface DbField {
    name: string;
    type: string;
    note?: string;
    pk?: boolean;
    fk?: string;
    enum?: string[];
}

interface DbTable {
    name: string;
    description: string;
    color: "aurora" | "solar" | "coral" | "lavande" | "mist";
    fields: DbField[];
}

const DB_TABLES: DbTable[] = [
    {
        name: "jury",
        description: "Membres du jury et administrateurs",
        color: "aurora",
        fields: [
            { name: "id", type: "INT", pk: true },
            { name: "first_name", type: "VARCHAR(100)" },
            { name: "last_name", type: "VARCHAR(100)" },
            { name: "email", type: "VARCHAR(255)", note: "unique" },
            { name: "password_hash", type: "VARCHAR(255)" },
            {
                name: "role",
                type: "ENUM",
                enum: ["jury", "admin", "moderateur"],
            },
            { name: "is_active", type: "BOOLEAN", note: "défaut true" },
            { name: "google_id", type: "VARCHAR(255)", note: "nullable" },
            { name: "profil_picture", type: "TEXT", note: "URL avatar" },
            { name: "jury_description", type: "TEXT", note: "nullable" },
            { name: "created_at / updated_at", type: "TIMESTAMP" },
        ],
    },
    {
        name: "realisator",
        description: "Réalisateurs ayant soumis un dossier",
        color: "solar",
        fields: [
            { name: "id", type: "INT", pk: true },
            { name: "gender", type: "VARCHAR(20)" },
            { name: "first_name / last_name", type: "VARCHAR(100)" },
            { name: "email", type: "VARCHAR(255)", note: "unique" },
            { name: "profession", type: "VARCHAR(255)" },
            { name: "phone / website", type: "VARCHAR", note: "nullable" },
            { name: "instagram / youtube", type: "VARCHAR", note: "nullable" },
            { name: "created_at", type: "TIMESTAMP" },
        ],
    },
    {
        name: "film",
        description: "Dossiers de films soumis au festival",
        color: "lavande",
        fields: [
            { name: "id", type: "INT", pk: true },
            { name: "realisator_id", type: "INT", fk: "realisator.id" },
            { name: "dossier_num", type: "VARCHAR(50)", note: "unique" },
            { name: "original_title", type: "VARCHAR(255)" },
            { name: "english_title", type: "VARCHAR(255)", note: "nullable" },
            { name: "language", type: "VARCHAR(100)" },
            { name: "synopsis", type: "TEXT" },
            { name: "video_url", type: "TEXT", note: "chemin S3" },
            { name: "poster_img", type: "TEXT", note: "nullable" },
            { name: "duration", type: "INT", note: "en secondes" },
            {
                name: "status",
                type: "ENUM",
                enum: [
                    "to_review",
                    "valide",
                    "arevoir",
                    "refuse",
                    "in_discussion",
                    "asked_to_modify",
                ],
            },
            { name: "ai_genre / ai_theme / ai_keywords", type: "TEXT", note: "classification IA" },
            { name: "created_at / updated_at", type: "TIMESTAMP" },
        ],
    },
    {
        name: "jury_film_assignment",
        description: "Attribution des films aux membres du jury",
        color: "mist",
        fields: [
            { name: "id", type: "INT", pk: true },
            { name: "jury_id", type: "INT", fk: "jury.id" },
            { name: "film_id", type: "INT", fk: "film.id" },
            { name: "assigned_by", type: "INT", fk: "jury.id", note: "admin qui a assigné" },
            { name: "assigned_at", type: "TIMESTAMP" },
        ],
    },
    {
        name: "jury_film_commentary",
        description: "Votes et décisions du jury (1 vote par juré par film)",
        color: "coral",
        fields: [
            { name: "id", type: "INT", pk: true },
            { name: "jury_id", type: "INT", fk: "jury.id" },
            { name: "film_id", type: "INT", fk: "film.id" },
            {
                name: "decision",
                type: "ENUM",
                enum: ["valide", "arevoir", "refuse", "in_discussion"],
            },
            { name: "commentary_id", type: "INT", fk: "commentary.id", note: "nullable" },
            { name: "created_at / updated_at", type: "TIMESTAMP" },
            { name: "UNIQUE", type: "CONSTRAINT", note: "(jury_id, film_id)" },
        ],
    },
    {
        name: "award",
        description: "Prix et récompenses du festival",
        color: "solar",
        fields: [
            { name: "id", type: "INT", pk: true },
            { name: "name", type: "VARCHAR(255)" },
            { name: "description", type: "TEXT", note: "nullable" },
            { name: "cash_prize", type: "DECIMAL(10,2)", note: "nullable" },
            { name: "laureat", type: "INT", fk: "film.id", note: "nullable" },
            { name: "created_at / updated_at", type: "TIMESTAMP" },
        ],
    },
    {
        name: "sponsor",
        description: "Sponsors du festival",
        color: "aurora",
        fields: [
            { name: "id", type: "INT", pk: true },
            { name: "name", type: "VARCHAR(255)" },
            {
                name: "partnership_statut",
                type: "ENUM",
                enum: ["main", "lead", "partner", "supporter", "premium"],
            },
            { name: "sponsor_link", type: "TEXT", note: "nullable" },
            { name: "sponsor_logo", type: "TEXT", note: "nullable" },
            { name: "created_at / updated_at", type: "TIMESTAMP" },
        ],
    },
    {
        name: "cms_content",
        description: "Contenu du site public (1 seule ligne)",
        color: "lavande",
        fields: [
            { name: "id", type: "INT", pk: true },
            { name: "hero_video_path", type: "TEXT" },
            { name: "hero_title / hero_description", type: "TEXT" },
            { name: "jury_section_*", type: "TEXT", note: "titres & textes section jury" },
            { name: "phase_1_start … phase_3_end", type: "DATE", note: "dates des phases" },
            { name: "show_jury / show_sponsors / …", type: "BOOLEAN", note: "visibilité sections" },
        ],
    },
    {
        name: "ticket",
        description: "Tickets de support soumis par le jury",
        color: "coral",
        fields: [
            { name: "id", type: "INT", pk: true },
            { name: "jury_id", type: "INT", fk: "jury.id" },
            { name: "film_id", type: "INT", fk: "film.id", note: "nullable" },
            {
                name: "type",
                type: "ENUM",
                enum: ["content", "technical", "rights", "other"],
            },
            { name: "description", type: "TEXT" },
            {
                name: "status",
                type: "ENUM",
                enum: ["open", "in_progress", "resolved", "rejected"],
            },
            { name: "admin_note", type: "TEXT", note: "nullable" },
        ],
    },
];

const colorDot: Record<string, string> = {
    aurora: "bg-aurora",
    solar: "bg-solar",
    coral: "bg-coral",
    lavande: "bg-lavande",
    mist: "bg-mist",
};

const colorText: Record<string, string> = {
    aurora: "text-aurora",
    solar: "text-solar",
    coral: "text-coral",
    lavande: "text-lavande",
    mist: "text-mist",
};

const DbTableCard = ({ table }: { table: DbTable }): React.JSX.Element => (
    <Card>
        <div className="mb-3 flex items-center gap-2.5">
            <span className={`h-2.5 w-2.5 rounded-full ${colorDot[table.color]}`} />
            <span className={`font-mono text-[0.88rem] font-bold ${colorText[table.color]}`}>
                {table.name}
            </span>
            <span className="text-[0.72rem] text-mist/60">{table.description}</span>
        </div>
        <div className="overflow-hidden rounded-lg border border-white/[0.06]">
            <table className="w-full text-[0.75rem]">
                <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                        <th className="px-3 py-1.5 text-left font-semibold uppercase tracking-[0.06em] text-mist/50">
                            Colonne
                        </th>
                        <th className="px-3 py-1.5 text-left font-semibold uppercase tracking-[0.06em] text-mist/50">
                            Type
                        </th>
                        <th className="px-3 py-1.5 text-left font-semibold uppercase tracking-[0.06em] text-mist/50">
                            Note
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {table.fields.map((f) => (
                        <tr
                            key={f.name}
                            className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]"
                        >
                            <td className="px-3 py-2">
                                <span className="flex items-center gap-1.5">
                                    {f.pk && (
                                        <span
                                            title="Clé primaire"
                                            className="rounded-[3px] bg-solar/20 px-1 text-[0.6rem] font-bold text-solar"
                                        >
                                            PK
                                        </span>
                                    )}
                                    {f.fk && (
                                        <span
                                            title={`FK → ${f.fk}`}
                                            className="rounded-[3px] bg-aurora/15 px-1 text-[0.6rem] font-bold text-aurora"
                                        >
                                            FK
                                        </span>
                                    )}
                                    <span className="font-mono text-white-soft/90">{f.name}</span>
                                </span>
                            </td>
                            <td className="px-3 py-2">
                                {f.enum ? (
                                    <div className="flex flex-wrap gap-1">
                                        {f.enum.map((v) => (
                                            <Tag key={v}>{v}</Tag>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="font-mono text-mist/70">{f.type}</span>
                                )}
                            </td>
                            <td className="px-3 py-2 text-mist/50">
                                {f.fk ? (
                                    <span className="text-aurora/60">→ {f.fk}</span>
                                ) : (
                                    (f.note ?? "")
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

/* ─── Sections ─── */

const SectionOverview = (): React.JSX.Element => (
    <div>
        <SectionTitle sub="Festival de films courts réalisés avec ou sur l'intelligence artificielle">
            Vue d&apos;ensemble — marsAI Festival
        </SectionTitle>

        <div className="mb-6 grid grid-cols-3 gap-4">
            {[
                {
                    icon: "🎬",
                    label: "Films",
                    value: "50+",
                    desc: "dossiers soumis",
                    color: "text-aurora",
                },
                {
                    icon: "👥",
                    label: "Jury",
                    value: "6",
                    desc: "membres actifs",
                    color: "text-solar",
                },
                {
                    icon: "🏆",
                    label: "Prix",
                    value: "3",
                    desc: "catégories de récompenses",
                    color: "text-lavande",
                },
            ].map((s) => (
                <Card key={s.label} className="text-center">
                    <div className="mb-1 text-[1.6rem]">{s.icon}</div>
                    <div className={`font-display text-[1.6rem] font-extrabold ${s.color}`}>
                        {s.value}
                    </div>
                    <div className="text-[0.75rem] font-semibold text-white-soft/80">{s.label}</div>
                    <div className="text-[0.7rem] text-mist/50">{s.desc}</div>
                </Card>
            ))}
        </div>

        <Card className="mb-4">
            <h3 className="mb-3 text-[0.88rem] font-bold text-white-soft">
                Qu&apos;est-ce que marsAI Festival ?
            </h3>
            <p className="mb-3 text-[0.82rem] leading-relaxed text-mist/80">
                marsAI est une plateforme complète de gestion de festival de films courts. Elle
                couvre l&apos;intégralité du cycle de vie d&apos;un dossier de candidature : de la
                soumission par le réalisateur jusqu&apos;à la délibération finale du jury et la
                publication des résultats sur le site public.
            </p>
            <div className="grid grid-cols-2 gap-3 text-[0.8rem]">
                {[
                    "Soumission de dossiers via formulaire public",
                    "Stockage vidéo sécurisé sur AWS S3",
                    "Attribution des films au jury par l'admin",
                    "Système de vote avec commentaires",
                    "Chat et audio temps réel pour le jury",
                    "CMS intégré pour le site public",
                    "Palmarès et gestion des prix",
                    "Swagger UI pour l'API REST",
                ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-mist/70">
                        <span className="mt-0.5 text-aurora">✓</span>
                        {item}
                    </div>
                ))}
            </div>
        </Card>

        <Card>
            <h3 className="mb-3 text-[0.88rem] font-bold text-white-soft">Stack technique</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist/50">
                        Frontend
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {[
                            "React 19",
                            "TypeScript",
                            "Vite",
                            "Tailwind CSS 4",
                            "React Router 7",
                            "Socket.io client",
                            "i18next",
                            "LiveKit",
                        ].map((t) => (
                            <Tag key={t}>{t}</Tag>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-mist/50">
                        Backend
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {[
                            "Node.js",
                            "Express",
                            "TypeScript",
                            "MySQL 8",
                            "JWT",
                            "Socket.io",
                            "AWS S3",
                            "Multer",
                            "Swagger",
                        ].map((t) => (
                            <Tag key={t}>{t}</Tag>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    </div>
);

const SectionArchitecture = (): React.JSX.Element => (
    <div>
        <SectionTitle sub="Comment les différentes couches du système communiquent entre elles">
            Architecture du système
        </SectionTitle>

        <div className="mb-4 grid grid-cols-3 gap-4">
            {[
                {
                    title: "Frontend",
                    color: "aurora",
                    port: ":5173",
                    items: [
                        "React SPA (Vite)",
                        "Routes publiques & admin",
                        "Panel jury protégé",
                        "Appels REST → /api/*",
                        "WebSocket → Socket.io",
                        "LiveKit → audio vocal",
                    ],
                },
                {
                    title: "Backend",
                    color: "solar",
                    port: ":3000",
                    items: [
                        "Express REST API",
                        "Authentification JWT",
                        "Socket.io server",
                        "Multer (uploads)",
                        "AWS SDK (S3 presigned URLs)",
                        "Swagger UI (/api/docs)",
                    ],
                },
                {
                    title: "Base de données",
                    color: "lavande",
                    port: "MySQL :3306",
                    items: [
                        "MySQL 8+",
                        "Base : MarsAi",
                        "9+ tables relationnelles",
                        "Contraintes FK & UNIQUE",
                        "ENUMs pour les statuts",
                        "Migrations via script.sql",
                    ],
                },
            ].map((layer) => (
                <Card key={layer.title}>
                    <div className="mb-1 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${colorDot[layer.color]}`} />
                        <span
                            className={`font-display text-[0.9rem] font-bold ${colorText[layer.color]}`}
                        >
                            {layer.title}
                        </span>
                    </div>
                    <div className="mb-3 font-mono text-[0.65rem] text-mist/40">{layer.port}</div>
                    <ul className="space-y-1">
                        {layer.items.map((i) => (
                            <li
                                key={i}
                                className="flex items-start gap-1.5 text-[0.78rem] text-mist/70"
                            >
                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-mist/30" />
                                {i}
                            </li>
                        ))}
                    </ul>
                </Card>
            ))}
        </div>

        <Card>
            <h3 className="mb-4 text-[0.88rem] font-bold text-white-soft">Flux de communication</h3>
            <div className="space-y-2.5 text-[0.8rem]">
                {[
                    {
                        from: "Navigateur",
                        via: "HTTP / REST",
                        to: "Express API",
                        detail: "CRUD films, users, CMS, votes — toutes les requêtes passent par /api/*",
                        color: "aurora",
                    },
                    {
                        from: "Navigateur",
                        via: "WebSocket",
                        to: "Socket.io server",
                        detail: "Chat jury en temps réel, présence en ligne, notifications",
                        color: "solar",
                    },
                    {
                        from: "Navigateur",
                        via: "WebRTC (LiveKit)",
                        to: "LiveKit Cloud",
                        detail: "Sessions vocales du jury — l'admin démarre, les jurés rejoignent",
                        color: "lavande",
                    },
                    {
                        from: "Express",
                        via: "mysql2",
                        to: "MySQL",
                        detail: "Toutes les lectures/écritures de données persistantes",
                        color: "mist",
                    },
                    {
                        from: "Express",
                        via: "AWS SDK",
                        to: "S3",
                        detail: "Stockage des vidéos + génération de presigned URLs (1h de validité)",
                        color: "coral",
                    },
                ].map((f) => (
                    <div
                        key={f.via}
                        className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5"
                    >
                        <span className="w-[90px] shrink-0 font-mono text-[0.72rem] text-white-soft/80">
                            {f.from}
                        </span>
                        <span
                            className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[0.62rem] font-semibold ${
                                {
                                    aurora: "border-aurora/30 text-aurora",
                                    solar: "border-solar/30 text-solar",
                                    lavande: "border-lavande/30 text-lavande",
                                    mist: "border-white/15 text-mist",
                                    coral: "border-coral/30 text-coral",
                                }[f.color]
                            }`}
                        >
                            {f.via}
                        </span>
                        <span className="text-mist/30">→</span>
                        <span className="w-[110px] shrink-0 font-mono text-[0.72rem] text-white-soft/80">
                            {f.to}
                        </span>
                        <span className="text-[0.75rem] text-mist/50">{f.detail}</span>
                    </div>
                ))}
            </div>
        </Card>
    </div>
);

const SectionRoles = (): React.JSX.Element => (
    <div>
        <SectionTitle sub="Qui peut faire quoi dans le système">Rôles & permissions</SectionTitle>

        <div className="mb-4 grid grid-cols-3 gap-4">
            {[
                {
                    role: "admin",
                    color: "solar" as const,
                    icon: "👑",
                    label: "Administrateur",
                    desc: "Accès complet au panel admin",
                    perms: [
                        "Gérer les utilisateurs (créer, modifier, bannir)",
                        "Envoyer des invitations jury par email",
                        "Assigner des films aux jurés",
                        "Voir tous les votes et commentaires",
                        "Démarrer les sessions vocales",
                        "Modifier le contenu du site (CMS)",
                        "Gérer les prix et sponsors",
                        "Configurer les étiquettes de vote",
                    ],
                },
                {
                    role: "jury",
                    color: "aurora" as const,
                    icon: "🎬",
                    label: "Membre du jury",
                    desc: "Accès au panel jury uniquement",
                    perms: [
                        "Visionner les films assignés",
                        "Voter : Valider / À revoir / Refuser / En discussion",
                        "Laisser des commentaires",
                        "Participer au chat jury",
                        "Rejoindre les sessions vocales",
                        "Soumettre des tickets de support",
                        "Modifier son profil",
                    ],
                },
                {
                    role: "moderateur",
                    color: "lavande" as const,
                    icon: "🛡️",
                    label: "Modérateur",
                    desc: "Accès limité en lecture/modération",
                    perms: [
                        "Accès au panel jury",
                        "Voir les films soumis",
                        "Modérer les commentaires",
                        "Participer au chat",
                        "Pas d'accès au panel admin",
                    ],
                },
            ].map((r) => (
                <Card key={r.role}>
                    <div className="mb-1 flex items-center gap-2">
                        <span className="text-[1.1rem]">{r.icon}</span>
                        <span
                            className={`font-display text-[0.9rem] font-bold ${colorText[r.color]}`}
                        >
                            {r.label}
                        </span>
                    </div>
                    <div className="mb-3 font-mono text-[0.65rem] text-mist/40">
                        role = &ldquo;{r.role}&rdquo;
                    </div>
                    <p className="mb-3 text-[0.75rem] text-mist/60">{r.desc}</p>
                    <ul className="space-y-1.5">
                        {r.perms.map((p) => (
                            <li
                                key={p}
                                className="flex items-start gap-1.5 text-[0.75rem] text-mist/75"
                            >
                                <span
                                    className={`mt-0.5 shrink-0 text-[0.6rem] ${colorText[r.color]}`}
                                >
                                    ✓
                                </span>
                                {p}
                            </li>
                        ))}
                    </ul>
                </Card>
            ))}
        </div>

        <Card>
            <h3 className="mb-3 text-[0.88rem] font-bold text-white-soft">Authentification JWT</h3>
            <div className="grid grid-cols-2 gap-6 text-[0.8rem] text-mist/70">
                <div>
                    <div className="mb-2 font-semibold text-white-soft/80">Connexion standard</div>
                    <ol className="space-y-1.5">
                        {[
                            "L'utilisateur saisit email + mot de passe",
                            "Le backend vérifie le hash bcrypt",
                            "Un JWT signé est retourné (payload : id, role)",
                            "Stocké dans localStorage sous jury_token",
                            "Envoyé dans l'en-tête Authorization: Bearer <token>",
                        ].map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="shrink-0 font-mono text-[0.65rem] text-aurora/60">
                                    0{i + 1}
                                </span>
                                {s}
                            </li>
                        ))}
                    </ol>
                </div>
                <div>
                    <div className="mb-2 font-semibold text-white-soft/80">
                        Connexion Google OAuth
                    </div>
                    <ol className="space-y-1.5">
                        {[
                            "Redirection vers Google OAuth",
                            "Google retourne un profil (email, nom, avatar)",
                            "Le backend recherche le google_id en base",
                            "Crée le compte si premier login",
                            "Retourne un JWT identique au flux standard",
                        ].map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="shrink-0 font-mono text-[0.65rem] text-solar/60">
                                    0{i + 1}
                                </span>
                                {s}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </Card>
    </div>
);

const SectionWorkflow = (): React.JSX.Element => {
    const steps = [
        {
            num: "01",
            title: "Soumission",
            color: "aurora" as const,
            actor: "Réalisateur",
            desc: "Le réalisateur remplit le formulaire public avec ses informations, celles de son film et upload la vidéo. Un dossier est créé avec le statut to_review.",
            tables: ["realisator", "film", "collaborator"],
        },
        {
            num: "02",
            title: "Ingestion vidéo",
            color: "mist" as const,
            actor: "Système",
            desc: "La vidéo est uploadée sur AWS S3 via Multer. Le backend génère des presigned URLs valables 1 heure pour la lecture sécurisée. Le réalisateur ne dispose d'aucun accès direct au bucket.",
            tables: ["film.video_url"],
        },
        {
            num: "03",
            title: "Attribution",
            color: "solar" as const,
            actor: "Administrateur",
            desc: "L'admin sélectionne les films et les assigne à un ou plusieurs membres du jury via le panneau « Assignation films ». Une entrée est créée dans jury_film_assignment.",
            tables: ["jury_film_assignment"],
        },
        {
            num: "04",
            title: "Visionnage & Vote",
            color: "lavande" as const,
            actor: "Juré",
            desc: "Le juré visionne les films assignés dans son panel. Pour chaque film il rend une décision (Valider / À revoir / Refuser / En discussion) avec un commentaire optionnel. Une contrainte UNIQUE empêche le double vote.",
            tables: ["jury_film_commentary", "commentary"],
        },
        {
            num: "05",
            title: "Délibération",
            color: "solar" as const,
            actor: "Jury",
            desc: "Le jury débat en temps réel via le chat et les sessions vocales LiveKit. L'admin suit la progression des votes depuis la page « Sélection & Votes ».",
            tables: ["jury_film_commentary", "cms_content"],
        },
        {
            num: "06",
            title: "Sélection finale",
            color: "aurora" as const,
            actor: "Administrateur",
            desc: "L'admin met à jour le statut des films (valide / refuse / etc.) et désigne les lauréats pour chaque prix via la gestion des awards.",
            tables: ["film.status", "award.laureat"],
        },
        {
            num: "07",
            title: "Publication",
            color: "coral" as const,
            actor: "Administrateur",
            desc: "L'admin met à jour le site public via le CMS : palmarès, photos du jury, programme, dates, sponsors. Les changements sont immédiatement visibles sur le site.",
            tables: ["cms_content", "award", "sponsor"],
        },
    ];

    return (
        <div>
            <SectionTitle sub="De la soumission d'un dossier à la publication du palmarès">
                Flux de sélection des films
            </SectionTitle>

            <div className="relative">
                <div className="absolute left-[28px] top-4 bottom-4 w-px bg-white/[0.06]" />
                <div className="space-y-3">
                    {steps.map((step, idx) => (
                        <div key={step.num} className="relative flex gap-4">
                            <div
                                className={`relative z-10 flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border font-mono text-[0.7rem] font-bold ${
                                    {
                                        aurora: "border-aurora/40 bg-aurora/10 text-aurora",
                                        solar: "border-solar/40 bg-solar/10 text-solar",
                                        lavande: "border-lavande/40 bg-lavande/10 text-lavande",
                                        coral: "border-coral/40 bg-coral/10 text-coral",
                                        mist: "border-white/15 bg-white/[0.04] text-mist",
                                    }[step.color]
                                }`}
                            >
                                {step.num}
                            </div>
                            <Card className={`flex-1 ${idx === steps.length - 1 ? "" : "mb-0"}`}>
                                <div className="mb-2 flex items-center gap-3">
                                    <span
                                        className={`font-display text-[0.88rem] font-bold ${colorText[step.color]}`}
                                    >
                                        {step.title}
                                    </span>
                                    <Badge color={step.color}>{step.actor}</Badge>
                                </div>
                                <p className="mb-2.5 text-[0.78rem] leading-relaxed text-mist/70">
                                    {step.desc}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {step.tables.map((t) => (
                                        <Tag key={t}>{t}</Tag>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SectionDatabase = (): React.JSX.Element => (
    <div>
        <SectionTitle sub="Structure de la base de données MySQL · Base : MarsAi">
            Schéma base de données
        </SectionTitle>

        <Card className="mb-5">
            <h3 className="mb-3 text-[0.88rem] font-bold text-white-soft">Relations principales</h3>
            <div className="grid grid-cols-2 gap-3 text-[0.78rem]">
                {[
                    {
                        rel: "realisator → film",
                        type: "1 : N",
                        desc: "Un réalisateur peut soumettre plusieurs films",
                    },
                    {
                        rel: "jury ↔ film",
                        type: "N : N",
                        desc: "Via jury_film_assignment (attribution par l'admin)",
                    },
                    {
                        rel: "jury ↔ film",
                        type: "N : N",
                        desc: "Via jury_film_commentary (vote — 1 seul par juré/film)",
                    },
                    {
                        rel: "film → award",
                        type: "1 : N",
                        desc: "Un film peut remporter plusieurs prix (laureat FK)",
                    },
                    {
                        rel: "jury → ticket",
                        type: "1 : N",
                        desc: "Un juré peut ouvrir plusieurs tickets de support",
                    },
                    {
                        rel: "film ↔ gallery",
                        type: "N : N",
                        desc: "Via film_gallery — galerie d'images par film",
                    },
                ].map((r) => (
                    <div
                        key={r.rel}
                        className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                    >
                        <span className="shrink-0 rounded border border-aurora/20 bg-aurora/10 px-1.5 py-0.5 font-mono text-[0.62rem] font-bold text-aurora">
                            {r.type}
                        </span>
                        <div>
                            <div className="font-mono text-[0.75rem] font-semibold text-white-soft/80">
                                {r.rel}
                            </div>
                            <div className="mt-0.5 text-[0.72rem] text-mist/55">{r.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
            {DB_TABLES.map((t) => (
                <DbTableCard key={t.name} table={t} />
            ))}
        </div>
    </div>
);

const SectionRealtime = (): React.JSX.Element => (
    <div>
        <SectionTitle sub="Chat jury et sessions vocales en temps réel">
            Fonctionnalités temps réel
        </SectionTitle>

        <div className="mb-4 grid grid-cols-2 gap-4">
            <Card>
                <div className="mb-3 flex items-center gap-2">
                    <span className="text-[1.1rem]">💬</span>
                    <span className="font-display text-[0.9rem] font-bold text-aurora">
                        Chat jury
                    </span>
                    <Badge color="aurora">Socket.io</Badge>
                </div>
                <p className="mb-3 text-[0.78rem] leading-relaxed text-mist/70">
                    Canal de communication privé entre tous les membres du jury et les admins.
                    Visible directement dans la sidebar du panel admin et du panel jury.
                </p>
                <ul className="space-y-2">
                    {[
                        "Connexion automatique à l'ouverture du panel",
                        "Présence en ligne : indicateur vert/rouge en temps réel",
                        "Compteur de messages non lus",
                        "Avatars des membres connectés",
                        "Historique persisté en base de données",
                        "Envoi avec Entrée ou le bouton ↑",
                    ].map((i) => (
                        <li
                            key={i}
                            className="flex items-start gap-1.5 text-[0.75rem] text-mist/70"
                        >
                            <span className="mt-0.5 shrink-0 text-[0.6rem] text-aurora">✓</span>
                            {i}
                        </li>
                    ))}
                </ul>
            </Card>

            <Card>
                <div className="mb-3 flex items-center gap-2">
                    <span className="text-[1.1rem]">🎙️</span>
                    <span className="font-display text-[0.9rem] font-bold text-solar">
                        Sessions vocales
                    </span>
                    <Badge color="solar">LiveKit</Badge>
                </div>
                <p className="mb-3 text-[0.78rem] leading-relaxed text-mist/70">
                    Conférences audio WebRTC hébergées sur LiveKit Cloud. Permettent des
                    délibérations orales entre les jurés sans quitter l&apos;interface.
                </p>
                <ul className="space-y-2">
                    {[
                        "L'admin démarre la session via le bouton « Vocal »",
                        "Les jurés rejoignent en un clic",
                        "Plusieurs participants simultanés",
                        "Contrôle micro (mute/unmute)",
                        "Indicateur visuel des speakers actifs",
                        "Indépendant du chat texte",
                    ].map((i) => (
                        <li
                            key={i}
                            className="flex items-start gap-1.5 text-[0.75rem] text-mist/70"
                        >
                            <span className="mt-0.5 shrink-0 text-[0.6rem] text-solar">✓</span>
                            {i}
                        </li>
                    ))}
                </ul>
            </Card>
        </div>

        <Card>
            <h3 className="mb-3 text-[0.88rem] font-bold text-white-soft">Événements Socket.io</h3>
            <div className="overflow-hidden rounded-lg border border-white/[0.06]">
                <table className="w-full text-[0.75rem]">
                    <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                            <th className="px-3 py-2 text-left font-semibold uppercase tracking-[0.06em] text-mist/50">
                                Événement
                            </th>
                            <th className="px-3 py-2 text-left font-semibold uppercase tracking-[0.06em] text-mist/50">
                                Direction
                            </th>
                            <th className="px-3 py-2 text-left font-semibold uppercase tracking-[0.06em] text-mist/50">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            {
                                event: "chat:message",
                                dir: "bidirectionnel",
                                desc: "Envoi et réception de messages texte",
                            },
                            {
                                event: "chat:history",
                                dir: "server → client",
                                desc: "Historique des messages à la connexion",
                            },
                            {
                                event: "users:online",
                                dir: "server → client",
                                desc: "Liste des utilisateurs connectés",
                            },
                            {
                                event: "user:join / user:leave",
                                dir: "server → client",
                                desc: "Notification de connexion/déconnexion",
                            },
                            {
                                event: "vocal:start / vocal:stop",
                                dir: "bidirectionnel",
                                desc: "Contrôle des sessions vocales admin",
                            },
                        ].map((e) => (
                            <tr
                                key={e.event}
                                className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]"
                            >
                                <td className="px-3 py-2 font-mono text-aurora/80">{e.event}</td>
                                <td className="px-3 py-2">
                                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] text-mist/60">
                                        {e.dir}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-mist/60">{e.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
);

const SectionCms = (): React.JSX.Element => (
    <div>
        <SectionTitle sub="Gestion du contenu du site public sans redéploiement">
            CMS — Administration du site
        </SectionTitle>

        <Card className="mb-4">
            <p className="text-[0.82rem] leading-relaxed text-mist/70">
                Le CMS intégré permet à l&apos;administrateur de modifier l&apos;intégralité du
                contenu visible sur le site public en temps réel, sans intervention technique.
                Toutes les données sont stockées dans la table{" "}
                <span className="font-mono text-aurora/80">cms_content</span> (ligne unique) et les
                tables associées.
            </p>
        </Card>

        <div className="grid grid-cols-2 gap-4">
            {[
                {
                    icon: "🎥",
                    title: "Hero & Vidéo",
                    color: "aurora" as const,
                    fields: [
                        "Vidéo de fond (hero_video_path)",
                        "Titre principal & sous-titre",
                        "Label et description",
                        "Contenu éditorial libre",
                    ],
                },
                {
                    icon: "📅",
                    title: "Programme & Phases",
                    color: "solar" as const,
                    fields: [
                        "Dates phase 1 (soumissions)",
                        "Dates phase 2 (sélection)",
                        "Dates phase 3 (délibération)",
                        "Basculements d'affichage",
                    ],
                },
                {
                    icon: "👨‍⚖️",
                    title: "Section Jury",
                    color: "lavande" as const,
                    fields: [
                        "Titre et description de la section",
                        "Profils des membres (nom, bio, photo)",
                        "Ordre d'affichage",
                        "Visibilité de la section",
                    ],
                },
                {
                    icon: "🏆",
                    title: "Prix & Palmarès",
                    color: "solar" as const,
                    fields: [
                        "Nom et description du prix",
                        "Dotation financière",
                        "Désignation du lauréat (FK film)",
                        "Lien avec les sponsors",
                    ],
                },
                {
                    icon: "🤝",
                    title: "Sponsors",
                    color: "mist" as const,
                    fields: [
                        "Nom & logo du sponsor",
                        "Niveau de partenariat",
                        "Lien vers le site",
                        "Prix sponsorisé",
                    ],
                },
                {
                    icon: "📞",
                    title: "Contact & Informations",
                    color: "coral" as const,
                    fields: [
                        "Email de contact",
                        "Réseaux sociaux",
                        "Adresse / lieu du festival",
                        "Mentions légales",
                    ],
                },
            ].map((s) => (
                <Card key={s.title}>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="text-[1rem]">{s.icon}</span>
                        <span
                            className={`font-display text-[0.85rem] font-bold ${colorText[s.color]}`}
                        >
                            {s.title}
                        </span>
                    </div>
                    <ul className="space-y-1.5">
                        {s.fields.map((f) => (
                            <li
                                key={f}
                                className="flex items-start gap-1.5 text-[0.75rem] text-mist/70"
                            >
                                <span
                                    className={`mt-0.5 shrink-0 text-[0.6rem] ${colorText[s.color]}`}
                                >
                                    ›
                                </span>
                                {f}
                            </li>
                        ))}
                    </ul>
                </Card>
            ))}
        </div>
    </div>
);

/* ─── Page principale ─── */

const AdminDocsPage = (): React.JSX.Element => {
    const [active, setActive] = useState<Section>("overview");

    const renderSection = (): React.JSX.Element => {
        switch (active) {
            case "overview":
                return <SectionOverview />;
            case "architecture":
                return <SectionArchitecture />;
            case "roles":
                return <SectionRoles />;
            case "workflow":
                return <SectionWorkflow />;
            case "database":
                return <SectionDatabase />;
            case "realtime":
                return <SectionRealtime />;
            case "cms":
                return <SectionCms />;
        }
    };

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            {/* Topbar */}
            <div className="flex h-[50px] min-h-[50px] items-center gap-3 border-b border-white/[0.06] bg-surface px-5">
                <span className="font-display text-[0.88rem] font-extrabold text-white-soft">
                    Documentation
                </span>
                <div className="h-[18px] w-px bg-white/[0.08]" />
                <span className="text-[0.75rem] text-mist">
                    Référence technique & fonctionnelle — marsAI Festival
                </span>
                <div className="ml-auto">
                    <span className="rounded-full border border-aurora/20 bg-aurora/10 px-3 py-1 text-[0.68rem] font-semibold text-aurora">
                        v1.0 · 2026
                    </span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar nav docs */}
                <div className="w-[200px] shrink-0 border-r border-white/[0.06] bg-surface px-2 py-4">
                    <div className="mb-2 px-2 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-mist/40">
                        Sections
                    </div>
                    <ul className="space-y-0.5">
                        {NAV.map((item) => (
                            <li key={item.id}>
                                <button
                                    type="button"
                                    onClick={() => setActive(item.id)}
                                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[0.78rem] transition-all ${
                                        active === item.id
                                            ? "bg-aurora/10 text-aurora"
                                            : "text-mist hover:bg-white/[0.04] hover:text-white-soft"
                                    }`}
                                >
                                    <span className="text-[0.85rem]">{item.icon}</span>
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-7">{renderSection()}</div>
            </div>
        </div>
    );
};

export default AdminDocsPage;
