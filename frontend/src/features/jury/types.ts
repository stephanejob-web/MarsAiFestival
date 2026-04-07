export type Decision = "valide" | "aRevoir" | "refuse" | "discuter" | null;

export type ListTab = "pending" | "evaluated" | "all";

export type ActiveTab = "login" | "register";

export type UserRole = "jury" | "admin";

export type FeedbackType = "error" | "success";

export type ActiveView = "eval" | "listes" | "discuter" | "tinder" | "mobile" | "screening";

export type ModalType = "arevoir" | "refuse" | null;

export type ReasonTag = string;

export interface FeedbackMessage {
    type: FeedbackType;
    message: string;
}

export interface LoginFormState {
    email: string;
    password: string;
}

export interface RegisterFormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface JuryOpinion {
    initials: string;
    name: string;
    badge: "like" | "discuss" | "pending";
    comment: string;
    color: "aurora" | "lavande" | "solar";
}

export interface VoteRow {
    initials: string;
    name: string;
    role: string;
    decision: Decision;
    comment?: string;
    avatarVariant: 1 | 2 | 3 | 4;
}

export interface JuryComment {
    id: number;
    juryId: number;
    name: string;
    initials: string;
    profilPicture: string | null;
    text: string;
    updatedAt: string;
}

export interface Realisator {
    gender: string | null;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    email: string;
    profession: string | null;
    phone: string | null;
    mobilePhone: string | null;
    street: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
    youtube: string | null;
    instagram: string | null;
    linkedin: string | null;
    facebook: string | null;
    xtwitter: string | null;
    howDidYouKnowUs: string | null;
    newsletter: boolean;
}

export interface JuryFilm {
    id: number;
    title: string;
    author: string;
    country: string;
    year: string;
    duration: string;
    format: string;
    subtitles: string;
    copyright: string;
    tools: string;
    iaScenario: string;
    iaImage: string;
    iaPost: string;
    note: string;
    videoUrl: string | null;
    myDecision: Decision;
    comments: JuryComment[];
    opinions: JuryOpinion[];
    votes: VoteRow[];
    realisator: Realisator;
}
