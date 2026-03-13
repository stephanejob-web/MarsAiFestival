import React from "react";

import type { RegisterFormState } from "../types";

interface RegisterFormProps {
    registerForm: RegisterFormState;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onGoogleRegister: () => void;
}

const RegisterForm = ({
    registerForm,
    onInputChange,
    onSubmit,
    onGoogleRegister,
}: RegisterFormProps): React.JSX.Element => {
    return (
        <>
            <div className="mb-4 rounded-xl border border-aurora/20 bg-aurora/10 px-3.5 py-3 text-sm leading-[1.55] text-mist">
                <span className="font-semibold text-aurora">Creez votre compte jury ou admin.</span>
                <br />
                Les realisateurs n&apos;ont pas besoin de se connecter: le depot de film est
                accessible directement.
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label
                        htmlFor="reg-name"
                        className="mb-1.5 block text-[0.76rem] font-semibold uppercase tracking-[0.04em] text-mist"
                    >
                        Prenom et nom
                    </label>
                    <input
                        id="reg-name"
                        name="fullName"
                        type="text"
                        required
                        placeholder="ex: Sophie Martin"
                        value={registerForm.fullName}
                        onChange={onInputChange}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white-soft outline-none transition-colors placeholder:text-mist/60 focus:border-aurora/40"
                    />
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="reg-email"
                        className="mb-1.5 block text-[0.76rem] font-semibold uppercase tracking-[0.04em] text-mist"
                    >
                        Adresse e-mail
                    </label>
                    <input
                        id="reg-email"
                        name="email"
                        type="email"
                        required
                        placeholder="votre@email.com"
                        value={registerForm.email}
                        onChange={onInputChange}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white-soft outline-none transition-colors placeholder:text-mist/60 focus:border-aurora/40"
                    />
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="reg-password"
                        className="mb-1.5 block text-[0.76rem] font-semibold uppercase tracking-[0.04em] text-mist"
                    >
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
                        onChange={onInputChange}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white-soft outline-none transition-colors placeholder:text-mist/60 focus:border-aurora/40 tracking-[0.1em]"
                    />
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="reg-password-confirm"
                        className="mb-1.5 block text-[0.76rem] font-semibold uppercase tracking-[0.04em] text-mist"
                    >
                        Confirmer le mot de passe
                    </label>
                    <input
                        id="reg-password-confirm"
                        name="confirmPassword"
                        type="password"
                        required
                        placeholder="Retapez votre mot de passe"
                        value={registerForm.confirmPassword}
                        onChange={onInputChange}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white-soft outline-none transition-colors placeholder:text-mist/60 focus:border-aurora/40 tracking-[0.1em]"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-aurora to-lavande py-3 px-4 font-display text-sm font-extrabold tracking-[0.02em] text-deep-sky transition-all hover:-translate-y-0.5 hover:opacity-90"
                >
                    Creer mon compte
                </button>
            </form>

            <div className="mt-4 flex items-center gap-2.5">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-mist">ou</span>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
                type="button"
                onClick={onGoogleRegister}
                className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white-soft transition-colors hover:bg-white/10"
            >
                S&apos;inscrire avec Google
            </button>
        </>
    );
};

export default RegisterForm;
