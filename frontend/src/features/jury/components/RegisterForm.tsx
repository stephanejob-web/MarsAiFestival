import React, { useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";

import type { RegisterFormState } from "../types";

interface RegisterFormProps {
    registerForm: RegisterFormState;
    avatarPreview: string | null;
    isLoading: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAvatarChange: (file: File) => void;
    onAvatarRemove: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onGoogleAuth: (credential: string) => void;
}

const ACCEPTED = "image/jpeg,image/png,image/webp";

const RegisterForm = ({
    registerForm,
    avatarPreview,
    isLoading,
    onInputChange,
    onAvatarChange,
    onAvatarRemove,
    onSubmit,
    onGoogleAuth,
}: RegisterFormProps): React.JSX.Element => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) onAvatarChange(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) onAvatarChange(file);
    };

    return (
        <>
            <div className="mb-5 rounded-xl border border-aurora/20 bg-aurora/10 px-3.5 py-3 text-sm leading-[1.55] text-mist">
                <span className="font-semibold text-aurora">Créez votre compte jury.</span>
                <br />
                Le rôle (jury ou admin) sera attribué par l&apos;administrateur après validation.
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-2">
                    <label className="self-start text-[0.76rem] font-semibold uppercase tracking-[0.04em] text-mist">
                        Photo de profil{" "}
                        <span className="text-coral text-[0.65rem] normal-case font-normal">*</span>
                    </label>

                    {avatarPreview ? (
                        <div className="relative">
                            <img
                                src={avatarPreview}
                                alt="Aperçu avatar"
                                className="h-20 w-20 rounded-full object-cover ring-2 ring-aurora/40"
                            />
                            <button
                                type="button"
                                onClick={onAvatarRemove}
                                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[0.65rem] font-bold text-white shadow-md"
                                title="Supprimer"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5 transition-colors hover:border-aurora/40 hover:bg-aurora/5"
                        >
                            <span className="text-2xl">👤</span>
                            <span className="mt-0.5 text-[0.6rem] text-mist">Ajouter</span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[0.72rem] text-aurora underline"
                    >
                        {avatarPreview ? "Changer la photo" : "Choisir un fichier"}
                    </button>
                    <span className="text-[0.65rem] text-mist/60">JPG, PNG ou WebP · 5 Mo max</span>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {/* Prénom / Nom */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                        <label
                            htmlFor="reg-firstName"
                            className="mb-1.5 block text-[0.76rem] font-semibold uppercase tracking-[0.04em] text-mist"
                        >
                            Prénom{" "}
                            <span className="text-coral text-[0.65rem] normal-case font-normal">
                                *
                            </span>
                        </label>
                        <input
                            id="reg-firstName"
                            name="firstName"
                            type="text"
                            required
                            placeholder="Sophie"
                            value={registerForm.firstName}
                            onChange={onInputChange}
                            className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white-soft outline-none transition-colors placeholder:text-mist/60 focus:border-aurora/40"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="reg-lastName"
                            className="mb-1.5 block text-[0.76rem] font-semibold uppercase tracking-[0.04em] text-mist"
                        >
                            Nom{" "}
                            <span className="text-coral text-[0.65rem] normal-case font-normal">
                                *
                            </span>
                        </label>
                        <input
                            id="reg-lastName"
                            name="lastName"
                            type="text"
                            required
                            placeholder="Martin"
                            value={registerForm.lastName}
                            onChange={onInputChange}
                            className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white-soft outline-none transition-colors placeholder:text-mist/60 focus:border-aurora/40"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="reg-email"
                        className="mb-1.5 block text-[0.76rem] font-semibold uppercase tracking-[0.04em] text-mist"
                    >
                        Adresse e-mail{" "}
                        <span className="text-coral text-[0.65rem] normal-case font-normal">*</span>
                    </label>
                    <input
                        id="reg-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
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
                        Mot de passe{" "}
                        <span className="text-coral text-[0.65rem] normal-case font-normal">*</span>
                    </label>
                    <input
                        id="reg-password"
                        name="password"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        placeholder="8 caractères minimum"
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
                        Confirmer le mot de passe{" "}
                        <span className="text-coral text-[0.65rem] normal-case font-normal">*</span>
                    </label>
                    <input
                        id="reg-password-confirm"
                        name="confirmPassword"
                        type="password"
                        required
                        autoComplete="new-password"
                        placeholder="Retapez votre mot de passe"
                        value={registerForm.confirmPassword}
                        onChange={onInputChange}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white-soft outline-none transition-colors placeholder:text-mist/60 focus:border-aurora/40 tracking-[0.1em]"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-gradient-to-r from-aurora to-lavande py-3 px-4 font-display text-sm font-extrabold tracking-[0.02em] text-deep-sky transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                    {isLoading ? "Création en cours…" : "Créer mon compte"}
                </button>
            </form>

            <div className="mt-5 flex items-center gap-2.5">
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
                    text="signup_with"
                    width="320"
                />
            </div>
        </>
    );
};

export default RegisterForm;
