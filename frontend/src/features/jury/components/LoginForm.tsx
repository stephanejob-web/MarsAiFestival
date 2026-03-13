import React from "react";
import { GoogleLogin } from "@react-oauth/google";

import type { LoginFormState } from "../types";

interface LoginFormProps {
    loginForm: LoginFormState;
    isLoading: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onGoogleAuth: (credential: string) => void;
    onForgotPassword: () => void;
    onSwitchToRegister: () => void;
}

const LoginForm = ({
    loginForm,
    isLoading,
    onInputChange,
    onSubmit,
    onGoogleAuth,
    onForgotPassword,
    onSwitchToRegister,
}: LoginFormProps): React.JSX.Element => {
    return (
        <>
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
                    disabled={isLoading}
                    className="w-full rounded-xl bg-aurora py-3 px-4 font-display text-sm font-extrabold tracking-[0.02em] text-deep-sky transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                    {isLoading ? "Connexion…" : "Se connecter"}
                </button>
            </form>

            <div className="mt-4 flex items-center gap-2.5">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-mist">ou</span>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="mt-4 flex justify-center">
                <GoogleLogin
                    onSuccess={(response) => {
                        if (response.credential) onGoogleAuth(response.credential);
                    }}
                    onError={() => undefined}
                    theme="filled_black"
                    shape="rectangular"
                    text="signin_with"
                    width="320"
                />
            </div>

            <div className="mt-3 text-center">
                <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs underline text-mist transition-colors hover:text-white-soft"
                >
                    Mot de passe oublié ?
                </button>
            </div>

            <div className="mt-2 text-center">
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-xs underline text-mist transition-colors hover:text-white-soft"
                >
                    Pas encore de compte ? Créer un compte
                </button>
            </div>
        </>
    );
};

export default LoginForm;
