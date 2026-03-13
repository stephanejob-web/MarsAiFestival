import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Jury.css";

type ActiveTab = "login" | "register";
type UserRole = "jury" | "admin";
type FeedbackType = "error" | "success";

interface FeedbackMessage {
    type: FeedbackType;
    message: string;
}

interface LoginFormState {
    email: string;
    password: string;
}

interface RegisterFormState {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const initialLoginForm: LoginFormState = {
    email: "jury@marsai.fr",
    password: "",
};

const initialRegisterForm: RegisterFormState = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const Jury = (): React.JSX.Element => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<ActiveTab>("login");
    const [role, setRole] = useState<UserRole>("jury");
    const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
    const [loginForm, setLoginForm] = useState<LoginFormState>(initialLoginForm);
    const [registerForm, setRegisterForm] = useState<RegisterFormState>(initialRegisterForm);

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
        setLoginForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setRegisterForm((prev) => ({
            ...prev,
            [name]: value,
        }));
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
                message: "Le mot de passe doit contenir au moins 8 caractères.",
            });
            return;
        }

        setFeedback({
            type: "success",
            message: "Compte créé avec succès. Vous pouvez maintenant vous connecter.",
        });

        setActiveTab("login");
        setLoginForm((prev) => ({ ...prev, email: registerForm.email }));
        setRegisterForm(initialRegisterForm);
    };

    const isError = feedback?.type === "error";
    const feedbackClasses = isError
        ? "jury-feedback jury-feedback-error"
        : "jury-feedback jury-feedback-success";

    return (
        <section className="jury-page">
            <div aria-hidden="true" className="jury-bg" />

            <div className="jury-shell">
                <Link to="/" className="jury-logo">
                    mars<span className="jury-logo-accent">AI</span>
                </Link>

                <article className="jury-card">
                    <header className="jury-header">
                        <div className="jury-icon">🔐</div>
                        <h1 className="jury-title">Espace Jury et Admin</h1>
                        <p className="jury-subtitle">
                            Connectez-vous ou creez votre compte pour acceder a l&apos;interface du
                            jury ou d&apos;administration.
                        </p>
                    </header>

                    <div className="jury-switch">
                        <button
                            type="button"
                            onClick={() => switchTab("login")}
                            className={`jury-switch-btn ${activeTab === "login" ? "jury-switch-btn-active" : ""}`}
                        >
                            Se connecter
                        </button>
                        <button
                            type="button"
                            onClick={() => switchTab("register")}
                            className={`jury-switch-btn ${activeTab === "register" ? "jury-switch-btn-active" : ""}`}
                        >
                            Creer un compte
                        </button>
                    </div>

                    {feedback ? <div className={feedbackClasses}>{feedback.message}</div> : null}

                    {activeTab === "login" ? (
                        <>
                            <div className="jury-switch">
                                <button
                                    type="button"
                                    onClick={() => handleRoleChange("jury")}
                                    className={`jury-switch-btn ${role === "jury" ? "jury-switch-btn-active" : ""}`}
                                >
                                    Jury
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRoleChange("admin")}
                                    className={`jury-switch-btn ${role === "admin" ? "jury-switch-btn-active" : ""}`}
                                >
                                    Admin
                                </button>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="jury-form">
                                <div className="jury-field">
                                    <label htmlFor="email" className="jury-label">
                                        Adresse e-mail
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="votre@email.com"
                                        value={loginForm.email}
                                        onChange={handleLoginInputChange}
                                        className="jury-input"
                                    />
                                </div>

                                <div className="jury-field">
                                    <label htmlFor="password" className="jury-label">
                                        Mot de passe
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        value={loginForm.password}
                                        onChange={handleLoginInputChange}
                                        className="jury-input jury-input-password"
                                    />
                                </div>

                                <button type="submit" className="jury-submit-btn">
                                    Se connecter
                                </button>
                            </form>

                            <div className="jury-separator">
                                <div className="jury-separator-line" />
                                <span className="jury-separator-text">ou</span>
                                <div className="jury-separator-line" />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setFeedback({
                                        type: "success",
                                        message: "Authentification Google a venir.",
                                    })
                                }
                                className="jury-oauth-btn"
                            >
                                S&apos;identifier avec Google
                            </button>

                            <div className="jury-link-wrap">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFeedback({
                                            type: "success",
                                            message:
                                                "Un e-mail de reinitialisation vous sera envoye.",
                                        })
                                    }
                                    className="jury-link-btn"
                                >
                                    Mot de passe oublie ?
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="jury-info-box">
                                <span className="jury-info-accent">
                                    Creez votre compte jury ou admin.
                                </span>
                                <br />
                                Les realisateurs n&apos;ont pas besoin de se connecter: le depot de
                                film est accessible directement.
                            </div>

                            <form onSubmit={handleRegisterSubmit} className="jury-form">
                                <div className="jury-field">
                                    <label htmlFor="reg-name" className="jury-label">
                                        Prenom et nom
                                    </label>
                                    <input
                                        id="reg-name"
                                        name="fullName"
                                        type="text"
                                        required
                                        placeholder="ex: Sophie Martin"
                                        value={registerForm.fullName}
                                        onChange={handleRegisterInputChange}
                                        className="jury-input"
                                    />
                                </div>

                                <div className="jury-field">
                                    <label htmlFor="reg-email" className="jury-label">
                                        Adresse e-mail
                                    </label>
                                    <input
                                        id="reg-email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="votre@email.com"
                                        value={registerForm.email}
                                        onChange={handleRegisterInputChange}
                                        className="jury-input"
                                    />
                                </div>

                                <div className="jury-field">
                                    <label htmlFor="reg-password" className="jury-label">
                                        Mot de passe
                                    </label>
                                    <input
                                        id="reg-password"
                                        name="password"
                                        type="password"
                                        required
                                        minLength={8}
                                        placeholder="8 caracteres minimum"
                                        value={registerForm.password}
                                        onChange={handleRegisterInputChange}
                                        className="jury-input jury-input-password"
                                    />
                                </div>

                                <div className="jury-field">
                                    <label htmlFor="reg-password-confirm" className="jury-label">
                                        Confirmer le mot de passe
                                    </label>
                                    <input
                                        id="reg-password-confirm"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        placeholder="Retapez votre mot de passe"
                                        value={registerForm.confirmPassword}
                                        onChange={handleRegisterInputChange}
                                        className="jury-input jury-input-password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="jury-submit-btn jury-submit-btn-register"
                                >
                                    Creer mon compte
                                </button>
                            </form>

                            <div className="jury-separator">
                                <div className="jury-separator-line" />
                                <span className="jury-separator-text">ou</span>
                                <div className="jury-separator-line" />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setFeedback({
                                        type: "success",
                                        message: "Inscription Google a venir.",
                                    })
                                }
                                className="jury-oauth-btn"
                            >
                                S&apos;inscrire avec Google
                            </button>
                        </>
                    )}
                </article>

                <Link to="/" className="jury-back-link">
                    Retour au site
                </Link>
            </div>
        </section>
    );
};

export default Jury;
