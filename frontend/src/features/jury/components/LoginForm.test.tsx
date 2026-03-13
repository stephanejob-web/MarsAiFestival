import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import LoginForm from "./LoginForm";

vi.mock("@react-oauth/google", () => ({
    GoogleLogin: ({ onSuccess }: { onSuccess: () => void }) => (
        <button type="button" onClick={onSuccess}>
            Connexion Google
        </button>
    ),
}));
import type { LoginFormState } from "../types";

const defaultLoginForm: LoginFormState = {
    email: "jury@marsai.fr",
    password: "",
};

const defaultProps = {
    loginForm: defaultLoginForm,
    isLoading: false,
    onInputChange: vi.fn(),
    onSubmit: vi.fn(),
    onGoogleAuth: vi.fn(),
    onForgotPassword: vi.fn(),
    onSwitchToRegister: vi.fn(),
};

describe("LoginForm", () => {
    it("affiche le formulaire avec les champs email et mot de passe", () => {
        render(<LoginForm {...defaultProps} />);

        expect(screen.getByLabelText(/adresse e-mail/i)).toBeDefined();
        expect(screen.getByLabelText(/mot de passe/i)).toBeDefined();
        expect(screen.getByRole("button", { name: /se connecter/i })).toBeDefined();
    });

    it("appelle onSubmit quand le formulaire est soumis", async () => {
        const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault());
        render(<LoginForm {...defaultProps} onSubmit={onSubmit} />);

        const form = document.querySelector("form");
        expect(form).not.toBeNull();
        fireEvent.submit(form!);

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("appelle onForgotPassword quand on clique sur le lien oublié", async () => {
        const onForgotPassword = vi.fn();
        const user = userEvent.setup();
        render(<LoginForm {...defaultProps} onForgotPassword={onForgotPassword} />);

        await user.click(screen.getByRole("button", { name: /mot de passe oubli/i }));

        expect(onForgotPassword).toHaveBeenCalledTimes(1);
    });

    it("appelle onSwitchToRegister quand on clique sur créer un compte", async () => {
        const onSwitchToRegister = vi.fn();
        const user = userEvent.setup();
        render(<LoginForm {...defaultProps} onSwitchToRegister={onSwitchToRegister} />);

        await user.click(screen.getByRole("button", { name: /cr.er un compte/i }));

        expect(onSwitchToRegister).toHaveBeenCalledTimes(1);
    });

    it("désactive le bouton submit quand isLoading est true", () => {
        render(<LoginForm {...defaultProps} isLoading={true} />);

        const btn = screen.getByRole("button", { name: /^connexion…$/i });
        expect((btn as HTMLButtonElement).disabled).toBe(true);
    });
});
