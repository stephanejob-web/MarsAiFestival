import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import LoginForm from "./LoginForm";
import type { LoginFormState, UserRole } from "../types";

const defaultLoginForm: LoginFormState = {
    email: "jury@marsai.fr",
    password: "",
};

const defaultProps = {
    role: "jury" as UserRole,
    loginForm: defaultLoginForm,
    onRoleChange: vi.fn(),
    onInputChange: vi.fn(),
    onSubmit: vi.fn(),
    onGoogleLogin: vi.fn(),
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

    it("appelle onRoleChange quand on clique sur le bouton Admin", async () => {
        const onRoleChange = vi.fn();
        const user = userEvent.setup();
        render(<LoginForm {...defaultProps} onRoleChange={onRoleChange} />);

        await user.click(screen.getByRole("button", { name: /admin/i }));

        expect(onRoleChange).toHaveBeenCalledWith("admin");
    });

    it("appelle onSubmit quand le formulaire est soumis", async () => {
        const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault());
        render(<LoginForm {...defaultProps} onSubmit={onSubmit} />);

        const form = document.querySelector("form");
        expect(form).not.toBeNull();
        fireEvent.submit(form!);

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("appelle onGoogleLogin quand on clique sur le bouton Google", async () => {
        const onGoogleLogin = vi.fn();
        const user = userEvent.setup();
        render(<LoginForm {...defaultProps} onGoogleLogin={onGoogleLogin} />);

        await user.click(screen.getByRole("button", { name: /s.identifier avec google/i }));

        expect(onGoogleLogin).toHaveBeenCalledTimes(1);
    });

    it("appelle onForgotPassword quand on clique sur le lien oublie", async () => {
        const onForgotPassword = vi.fn();
        const user = userEvent.setup();
        render(<LoginForm {...defaultProps} onForgotPassword={onForgotPassword} />);

        await user.click(screen.getByRole("button", { name: /mot de passe oublie/i }));

        expect(onForgotPassword).toHaveBeenCalledTimes(1);
    });

    it("appelle onSwitchToRegister quand on clique sur creer un compte", async () => {
        const onSwitchToRegister = vi.fn();
        const user = userEvent.setup();
        render(<LoginForm {...defaultProps} onSwitchToRegister={onSwitchToRegister} />);

        await user.click(screen.getByRole("button", { name: /creer un compte/i }));

        expect(onSwitchToRegister).toHaveBeenCalledTimes(1);
    });

    it("affiche le role jury actif avec la classe aurora", () => {
        render(<LoginForm {...defaultProps} role="jury" />);

        const juryBtn = screen.getByRole("button", { name: /^jury$/i });
        expect(juryBtn.className).toContain("text-aurora");
    });

    it("affiche le role admin actif avec la classe aurora quand admin est selectionne", () => {
        render(<LoginForm {...defaultProps} role="admin" />);

        const adminBtn = screen.getByRole("button", { name: /^admin$/i });
        expect(adminBtn.className).toContain("text-aurora");
    });
});
