export interface FormDepotData {
    // Étape 1 — Profil réalisateur
    civilite: "M" | "Mme";
    prenom: string;
    nom: string;
    dob: string;
    metier: string;
    email: string;
    tel: string;
    mobile: string;
    rue: string;
    cp: string;
    ville: string;
    pays: string;
    youtube: string;
    instagram: string;
    linkedin: string;
    facebook: string;
    xtwitter: string;
    discovery: string;
    newsletter: boolean;

    // Étape 2 — Le Film
    titre: string;
    titreEn: string;
    langue: string;
    tags: string;
    synopsis: string;
    synopsisEn: string;
    intention: string;
    outils: string;

    // Étape 3 — Déclaration IA
    iaClass: "full" | "hybrid";
    iaImg: string;
    iaSon: string;
    iaScenario: string;
    iaPost: string;
}

export interface FormDepotErrors {
    [key: string]: string;
}

export type SubmissionState = "idle" | "submitting" | "success";

export type DragState = "idle" | "dragging" | "error";

export type DurationStatus = "ok" | "warn" | "err";

export interface StepDefinition {
    number: number;
    title: string;
    sub: string;
    icon: string;
}

export interface CountryOption {
    value: string;
    label: string;
}

export interface SelectOption {
    value: string;
    label: string;
}
