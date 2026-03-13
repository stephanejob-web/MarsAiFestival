const ROLE_LABEL: Record<string, string> = {
    admin: "Administrateur",
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

const useJuryUser = (): JuryUser | null => {
    const token = localStorage.getItem("jury_token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1])) as {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
        };

        const firstName = payload.firstName ?? "";
        const lastName = payload.lastName ?? "";

        return {
            id: payload.id,
            email: payload.email,
            firstName,
            lastName,
            role: payload.role,
            profilPicture: (payload as { profilPicture?: string }).profilPicture ?? null,
            initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
            fullName: `${firstName} ${lastName}`.trim(),
            roleLabel: ROLE_LABEL[payload.role] ?? "Membre du Jury",
        };
    } catch {
        return null;
    }
};

export default useJuryUser;
