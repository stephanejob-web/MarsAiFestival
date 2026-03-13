import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RegisterForm from "./RegisterForm";
import type { RegisterFormState } from "../types";

const emptyForm: RegisterFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const filledForm: RegisterFormState = {
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie@marsai.fr",
    password: "motdepasse1",
    confirmPassword: "motdepasse1",
};

const defaultProps = {
    registerForm: emptyForm,
    avatarPreview: null,
    isLoading: false,
    onInputChange: vi.fn(),
    onAvatarChange: vi.fn(),
    onAvatarRemove: vi.fn(),
    onSubmit: vi.fn(),
    onGoogleAuth: vi.fn(),
};

describe("RegisterForm", () => {
    it("affiche les champs prénom, nom, email, mot de passe", () => {
        render(<RegisterForm {...defaultProps} />);

        expect(screen.getByLabelText(/prénom/i)).toBeDefined();
        expect(screen.getByLabelText(/^nom/i)).toBeDefined();
        expect(screen.getByLabelText(/adresse e-mail/i)).toBeDefined();
        expect(screen.getByLabelText(/^mot de passe/i)).toBeDefined();
        expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeDefined();
    });

    it("affiche la zone d'upload avatar", () => {
        render(<RegisterForm {...defaultProps} />);

        expect(screen.getByText(/photo de profil/i)).toBeDefined();
        expect(screen.getByText(/choisir un fichier/i)).toBeDefined();
    });

    it("appelle onSubmit quand le formulaire est soumis", () => {
        const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault());
        render(<RegisterForm {...defaultProps} registerForm={filledForm} onSubmit={onSubmit} />);

        const form = document.querySelector("form");
        expect(form).not.toBeNull();
        fireEvent.submit(form!);

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("affiche l'aperçu de l'avatar quand avatarPreview est fourni", () => {
        render(<RegisterForm {...defaultProps} avatarPreview="data:image/png;base64,abc" />);

        const img = screen.getByAltText(/aperçu avatar/i);
        expect(img).toBeDefined();
        expect(screen.getByText(/changer la photo/i)).toBeDefined();
    });

    it("appelle onAvatarRemove quand on clique sur supprimer l'avatar", async () => {
        const onAvatarRemove = vi.fn();
        const user = userEvent.setup();
        render(<RegisterForm {...defaultProps} avatarPreview="data:image/png;base64,abc" onAvatarRemove={onAvatarRemove} />);

        await user.click(screen.getByTitle(/supprimer/i));

        expect(onAvatarRemove).toHaveBeenCalledTimes(1);
    });

    it("désactive le bouton submit quand isLoading est true", () => {
        render(<RegisterForm {...defaultProps} isLoading={true} />);

        const btn = screen.getByRole("button", { name: /cr.ation en cours/i });
        expect((btn as HTMLButtonElement).disabled).toBe(true);
    });
});
