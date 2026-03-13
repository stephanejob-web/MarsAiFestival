import React from "react";

import type { LoginFormState, UserRole } from "../types";

interface LoginFormProps {
    role: UserRole;
    loginForm: LoginFormState;
    onRoleChange: (role: UserRole) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onGoogleLogin: () => void;
    onForgotPassword: () => void;
    onSwitchToRegister: () => void;
}

const LoginForm = ({
    role,
    loginForm,
    onRoleChange,
    onInputChange,
    onSubmit,
    onGoogleLogin,
    onForgotPassword,
    onSwitchToRegister,
}: LoginFormProps): React.JSX.Element => {
    return (
        <>
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
                <button
                    type="button"
                    onClick={() => onRoleChange("jury")}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:text-white-soft ${role === "jury" ? "border border-aurora/30 bg-aurora/10 !text-aurora" : "text-mist"}`}
                >
                    Jury
                </button>
                <button
                    type="button"
                    onClick={() => onRoleChange("admin")}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:text-white-soft ${role === "admin" ? "border border-aurora/30 bg-aurora/10 !text-aurora" : "text-mist"}`}
                >
                    Admin
                </button>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label
                        htmlFor="email"
                        className="mb-1.5 block text-[0.76rem] font-semibold uppercase tracking-[0.04em] text-mist"
                    >
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
                        onChange={onInputChange}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white-soft outline-none transition-colors placeholder:text-mist/60 focus:border-aurora/40"
                    />
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="password"
                        className="mb-1.5 block text-[0.76rem] font-semibold uppercase tracking-[0.04em] text-mist"
                    >
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
                        onChange={onInputChange}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white-soft outline-none transition-colors placeholder:text-mist/60 focus:border-aurora/40 tracking-[0.1em]"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-xl bg-aurora py-3 px-4 font-display text-sm font-extrabold tracking-[0.02em] text-deep-sky transition-all hover:-translate-y-0.5 hover:opacity-90"
                >
                    Se connecter
                </button>
            </form>

            <div className="mt-4 flex items-center gap-2.5">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-mist">ou</span>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
                type="button"
                onClick={onGoogleLogin}
                className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white-soft transition-colors hover:bg-white/10"
            >
                S&apos;identifier avec Google
            </button>

            <div className="mt-3 text-center">
                <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs underline text-mist transition-colors hover:text-white-soft"
                >
                    Mot de passe oublie ?
                </button>
            </div>

            <div className="mt-3 text-center">
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-xs underline text-mist transition-colors hover:text-white-soft"
                >
                    Pas encore de compte ? Creer un compte
                </button>
            </div>
        </>
    );
};

export default LoginForm;
