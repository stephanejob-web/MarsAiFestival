import React from "react";
import { Link } from "react-router-dom";

import LoginForm from "../features/jury/components/LoginForm";
import RegisterForm from "../features/jury/components/RegisterForm";
import useJuryAuth from "../features/jury/hooks/useJuryAuth";

const Jury = (): React.JSX.Element => {
    const {
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
    } = useJuryAuth();

    const feedbackClasses =
        feedback?.type === "error"
            ? "mb-4 rounded-lg border px-3 py-2 text-sm border-red-400/30 bg-red-400/10 text-red-200"
            : "mb-4 rounded-lg border px-3 py-2 text-sm border-emerald-400/30 bg-emerald-400/10 text-emerald-200";

    return (
        <section className="relative min-h-[calc(100vh-3rem)] overflow-hidden py-10 px-4 sm:py-14 sm:px-6">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 20% 30%, rgba(78,255,206,0.07) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(192,132,252,0.07) 0%, transparent 55%)",
                }}
            />

            <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
                <Link
                    to="/"
                    className="mb-8 font-display text-3xl font-extrabold tracking-tight text-white-soft"
                >
                    mars<span className="text-aurora">AI</span>
                </Link>

                <article className="w-full rounded-[20px] border border-white/10 bg-surface p-7 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-9">
                    <header className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-aurora/20 bg-aurora/10 text-2xl">
                            🔐
                        </div>
                        <h1 className="font-display text-[1.45rem] font-extrabold leading-tight text-white-soft">
                            Espace Jury et Admin
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-mist">
                            Connectez-vous ou creez votre compte pour acceder a l&apos;interface du
                            jury ou d&apos;administration.
                        </p>
                    </header>

                    <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
                        <button
                            type="button"
                            onClick={() => switchTab("login")}
                            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:text-white-soft ${activeTab === "login" ? "border border-aurora/30 bg-aurora/10 !text-aurora" : "text-mist"}`}
                        >
                            Se connecter
                        </button>
                        <button
                            type="button"
                            onClick={() => switchTab("register")}
                            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:text-white-soft ${activeTab === "register" ? "border border-aurora/30 bg-aurora/10 !text-aurora" : "text-mist"}`}
                        >
                            Creer un compte
                        </button>
                    </div>

                    {feedback !== null && <div className={feedbackClasses}>{feedback.message}</div>}

                    {activeTab === "login" ? (
                        <LoginForm
                            role={role}
                            loginForm={loginForm}
                            onRoleChange={handleRoleChange}
                            onInputChange={handleLoginInputChange}
                            onSubmit={handleLoginSubmit}
                            onGoogleLogin={handleGoogleLogin}
                            onForgotPassword={handleForgotPassword}
                            onSwitchToRegister={() => switchTab("register")}
                        />
                    ) : (
                        <RegisterForm
                            registerForm={registerForm}
                            onInputChange={handleRegisterInputChange}
                            onSubmit={handleRegisterSubmit}
                            onGoogleRegister={handleGoogleRegister}
                        />
                    )}
                </article>

                <Link
                    to="/"
                    className="mt-6 text-sm text-mist transition-colors hover:text-white-soft"
                >
                    Retour au site
                </Link>
            </div>
        </section>
    );
};

export default Jury;
