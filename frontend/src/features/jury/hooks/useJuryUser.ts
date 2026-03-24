import { useEffect, useState } from "react";

const ROLE_LABEL: Record<string, string> = {
    admin: "Administrateur",
    moderateur: "Modérateur",
    jury: "Membre du Jury",
};

export interface JuryUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    profilPicture: string | null;
    initials: string;
    fullName: string;
    roleLabel: string;
}

const parseToken = (): JuryUser | null => {
    const token = localStorage.getItem("jury_token");
    if (!token) return null;
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
        const payload = JSON.parse(atob(padded)) as {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            profilPicture?: string | null;
        };
        const firstName = payload.firstName ?? "";
        const lastName = payload.lastName ?? "";
        return {
            id: payload.id,
            email: payload.email,
            firstName,
            lastName,
            role: payload.role,
            profilPicture: payload.profilPicture ?? null,
            initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
            fullName: `${firstName} ${lastName}`.trim(),
            roleLabel: ROLE_LABEL[payload.role] ?? "Membre du Jury",
        };
    } catch {
        return null;
    }
};

const useJuryUser = (): JuryUser | null => {
    const [user, setUser] = useState<JuryUser | null>(parseToken);

    useEffect(() => {
        const handler = (): void => setUser(parseToken());
        window.addEventListener("jury-profile-updated", handler);
        return () => window.removeEventListener("jury-profile-updated", handler);
    }, []);

    return user;
};

export default useJuryUser;
