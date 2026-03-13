import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
    ActiveTab,
    FeedbackMessage,
    LoginFormState,
    RegisterFormState,
    UserRole,
} from "../types";

const INITIAL_LOGIN_FORM: LoginFormState = {
    email: "jury@marsai.fr",
    password: "",
};

const INITIAL_REGISTER_FORM: RegisterFormState = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export interface UseJuryAuthReturn {
    activeTab: ActiveTab;
    role: UserRole;
    feedback: FeedbackMessage | null;
    loginForm: LoginFormState;
    registerForm: RegisterFormState;
    switchTab: (tab: ActiveTab) => void;
    handleRoleChange: (nextRole: UserRole) => void;
    handleLoginInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRegisterInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLoginSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleRegisterSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleGoogleLogin: () => void;
    handleGoogleRegister: () => void;
    handleForgotPassword: () => void;
}

const useJuryAuth = (): UseJuryAuthReturn => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<ActiveTab>("login");
    const [role, setRole] = useState<UserRole>("jury");
    const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
    const [loginForm, setLoginForm] = useState<LoginFormState>(INITIAL_LOGIN_FORM);
    const [registerForm, setRegisterForm] = useState<RegisterFormState>(INITIAL_REGISTER_FORM);

    const switchTab = (tab: ActiveTab): void => {
        setActiveTab(tab);
        setFeedback(null);
    };

    const handleRoleChange = (nextRole: UserRole): void => {
        setRole(nextRole);
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

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (!loginForm.email.trim() || !loginForm.password.trim()) {
            setFeedback({
                type: "error",
                message: "Merci de renseigner votre e-mail et votre mot de passe.",
            });
            return;
        }

        if (role === "admin") {
            navigate("/admin");
            return;
        }

        navigate("/jury/panel");
    };

    const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (registerForm.password !== registerForm.confirmPassword) {
            setFeedback({
                type: "error",
                message: "Les mots de passe ne correspondent pas.",
            });
            return;
        }

        if (registerForm.password.length < 8) {
            setFeedback({
                type: "error",
                message: "Le mot de passe doit contenir au moins 8 caracteres.",
            });
            return;
        }

        setFeedback({
            type: "success",
            message: "Compte cree avec succes. Vous pouvez maintenant vous connecter.",
        });

        setActiveTab("login");
        setLoginForm((prev) => ({ ...prev, email: registerForm.email }));
        setRegisterForm(INITIAL_REGISTER_FORM);
    };

    const handleGoogleLogin = (): void => {
        setFeedback({ type: "success", message: "Authentification Google a venir." });
    };

    const handleGoogleRegister = (): void => {
        setFeedback({ type: "success", message: "Inscription Google a venir." });
    };

    const handleForgotPassword = (): void => {
        setFeedback({
            type: "success",
            message: "Un e-mail de reinitialisation vous sera envoye.",
        });
    };

    return {
        activeTab,
        role,
        feedback,
        loginForm,
        registerForm,
        switchTab,
        handleRoleChange,
        handleLoginInputChange,
        handleRegisterInputChange,
        handleLoginSubmit,
        handleRegisterSubmit,
        handleGoogleLogin,
        handleGoogleRegister,
        handleForgotPassword,
    };
};

export default useJuryAuth;
