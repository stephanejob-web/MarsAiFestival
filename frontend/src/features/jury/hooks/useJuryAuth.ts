import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { ActiveTab, FeedbackMessage, LoginFormState, RegisterFormState } from "../types";

const API = import.meta.env.VITE_API_URL as string;

const INITIAL_LOGIN_FORM: LoginFormState = { email: "", password: "" };
const INITIAL_REGISTER_FORM: RegisterFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export interface UseJuryAuthReturn {
    activeTab: ActiveTab;
    feedback: FeedbackMessage | null;
    loginForm: LoginFormState;
    registerForm: RegisterFormState;
    avatarFile: File | null;
    avatarPreview: string | null;
    isLoading: boolean;
    switchTab: (tab: ActiveTab) => void;
    handleLoginInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRegisterInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAvatarChange: (file: File) => void;
    handleAvatarRemove: () => void;
    handleLoginSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleRegisterSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleGoogleAuth: (credential: string) => Promise<void>;
    handleForgotPassword: () => void;
}

const redirectByRole = (role: string, navigate: ReturnType<typeof useNavigate>): void => {
    navigate(role === "admin" || role === "moderateur" ? "/admin" : "/jury/panel", {
        replace: true,
    });
};

const useJuryAuth = (): UseJuryAuthReturn => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<ActiveTab>("login");
    const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
    const [loginForm, setLoginForm] = useState<LoginFormState>(INITIAL_LOGIN_FORM);
    const [registerForm, setRegisterForm] = useState<RegisterFormState>(INITIAL_REGISTER_FORM);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const switchTab = (tab: ActiveTab): void => {
        setActiveTab(tab);
        setFeedback(null);
    };

    const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setLoginForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setRegisterForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (file: File): void => {
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
        setFeedback(null);
    };

    const handleAvatarRemove = (): void => {
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!loginForm.email.trim() || !loginForm.password.trim()) {
            setFeedback({
                type: "error",
                message: "Merci de renseigner votre e-mail et votre mot de passe.",
            });
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
            });
            const data = (await res.json()) as {
                success: boolean;
                message?: string;
                token?: string;
                user?: { role: string };
            };
            if (!data.success || !data.token) {
                setFeedback({ type: "error", message: data.message ?? "Identifiants incorrects." });
                return;
            }
            localStorage.setItem("jury_token", data.token);
            redirectByRole(data.user?.role ?? "jury", navigate);
        } catch {
            setFeedback({ type: "error", message: "Erreur réseau. Vérifiez votre connexion." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!avatarFile) {
            setFeedback({ type: "error", message: "Un avatar est obligatoire." });
            return;
        }
        if (registerForm.password !== registerForm.confirmPassword) {
            setFeedback({ type: "error", message: "Les mots de passe ne correspondent pas." });
            return;
        }
        if (registerForm.password.length < 8) {
            setFeedback({
                type: "error",
                message: "Le mot de passe doit contenir au moins 8 caractères.",
            });
            return;
        }
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("firstName", registerForm.firstName);
            formData.append("lastName", registerForm.lastName);
            formData.append("email", registerForm.email);
            formData.append("password", registerForm.password);
            formData.append("avatar", avatarFile);

            const res = await fetch(`${API}/api/auth/register`, {
                method: "POST",
                body: formData,
            });
            const data = (await res.json()) as {
                success: boolean;
                message?: string;
                token?: string;
                user?: { role: string };
            };
            if (!data.success || !data.token) {
                setFeedback({
                    type: "error",
                    message: data.message ?? "Erreur lors de la création du compte.",
                });
                return;
            }
            localStorage.setItem("jury_token", data.token);
            redirectByRole(data.user?.role ?? "jury", navigate);
        } catch {
            setFeedback({ type: "error", message: "Erreur réseau. Vérifiez votre connexion." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = async (credential: string): Promise<void> => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential }),
            });
            const data = (await res.json()) as {
                success: boolean;
                message?: string;
                token?: string;
                user?: { role: string };
            };
            if (!data.success || !data.token) {
                setFeedback({
                    type: "error",
                    message: data.message ?? "Échec de l'authentification Google.",
                });
                return;
            }
            localStorage.setItem("jury_token", data.token);
            redirectByRole(data.user?.role ?? "jury", navigate);
        } catch {
            setFeedback({ type: "error", message: "Erreur réseau. Vérifiez votre connexion." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = (): void => {
        setFeedback({
            type: "success",
            message: "Un e-mail de réinitialisation vous sera envoyé.",
        });
    };

    return {
        activeTab,
        feedback,
        loginForm,
        registerForm,
        avatarFile,
        avatarPreview,
        isLoading,
        switchTab,
        handleLoginInputChange,
        handleRegisterInputChange,
        handleAvatarChange,
        handleAvatarRemove,
        handleLoginSubmit,
        handleRegisterSubmit,
        handleGoogleAuth,
        handleForgotPassword,
    };
};

export default useJuryAuth;
