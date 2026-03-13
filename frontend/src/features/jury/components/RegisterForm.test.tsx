import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RegisterForm from "./RegisterForm";
import type { RegisterFormState } from "../types";

const emptyForm: RegisterFormState = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const filledForm: RegisterFormState = {
    fullName: "Sophie Martin",
    email: "sophie@marsai.fr",
    password: "motdepasse1",
    confirmPassword: "motdepasse1",
};

const defaultProps = {
    registerForm: emptyForm,
    onInputChange: vi.fn(),
    onSubmit: vi.fn(),
    onGoogleRegister: vi.fn(),
};

describe("RegisterForm", () => {
    it("affiche les quatre champs du formulaire d'inscription", () => {
        render(<RegisterForm {...defaultProps} />);

        expect(screen.getByLabelText(/prenom et nom/i)).toBeDefined();
        expect(screen.getByLabelText(/adresse e-mail/i)).toBeDefined();
        expect(screen.getByLabelText(/^mot de passe$/i)).toBeDefined();
        expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeDefined();
    });

    it("appelle onSubmit quand le formulaire est soumis", () => {
        const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault());
        render(<RegisterForm {...defaultProps} registerForm={filledForm} onSubmit={onSubmit} />);

        const form = document.querySelector("form");
        expect(form).not.toBeNull();
        fireEvent.submit(form!);

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("appelle onGoogleRegister quand on clique sur le bouton Google", async () => {
        const onGoogleRegister = vi.fn();
        const user = userEvent.setup();
        render(<RegisterForm {...defaultProps} onGoogleRegister={onGoogleRegister} />);

        await user.click(screen.getByRole("button", { name: /s.inscrire avec google/i }));

        expect(onGoogleRegister).toHaveBeenCalledTimes(1);
    });

    it("appelle onInputChange quand l'utilisateur saisit dans le champ nom", async () => {
        const onInputChange = vi.fn();
        const user = userEvent.setup();
        render(<RegisterForm {...defaultProps} onInputChange={onInputChange} />);

        const nameInput = screen.getByLabelText(/prenom et nom/i);
        await user.type(nameInput, "A");

        expect(onInputChange).toHaveBeenCalled();
    });

    it("affiche le message d'information sur les comptes jury et admin", () => {
        render(<RegisterForm {...defaultProps} />);

        expect(screen.getByText(/creez votre compte jury ou admin/i)).toBeDefined();
    });

    it("affiche le bouton creer mon compte", () => {
        render(<RegisterForm {...defaultProps} />);

        expect(screen.getByRole("button", { name: /creer mon compte/i })).toBeDefined();
    });
});
