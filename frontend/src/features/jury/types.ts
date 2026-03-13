export type Decision = "valide" | "aRevoir" | "refuse" | null;

export type ListTab = "pending" | "evaluated" | "all";

export type ActiveTab = "login" | "register";

export type UserRole = "jury" | "admin";

export type FeedbackType = "error" | "success";

export type ActiveView = "eval" | "listes" | "discuter" | "delib";

export type ModalType = "arevoir" | "refuse" | null;

export type ReasonTag = "rights" | "quality" | "content" | "tech" | "other";

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
    myDecision: Decision;
    comments: string[];
    opinions: JuryOpinion[];
    votes: VoteRow[];
}
