import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AdminPage from "./AdminPage";
import { ADMIN_LABELS } from "../features/admin/constants";

describe("AdminPage", () => {
    it("affiche le titre du panneau admin", () => {
        render(
            <MemoryRouter>
                <AdminPage />
            </MemoryRouter>,
        );
        expect(screen.getByText(ADMIN_LABELS.ADMIN_PANEL)).toBeDefined();
    });

    it("affiche le message de bienvenue", () => {
        render(
            <MemoryRouter>
                <AdminPage />
            </MemoryRouter>,
        );
        expect(screen.getByText(ADMIN_LABELS.WELCOME_MESSAGE)).toBeDefined();
    });

    it("contient un lien de retour à l'accueil", () => {
        render(
            <MemoryRouter>
                <AdminPage />
            </MemoryRouter>,
        );
        const link = screen.getByRole("link", { name: ADMIN_LABELS.RETURN_HOME });
        expect(link).toBeDefined();
        expect(link.getAttribute("href")).toBe("/");
    });
});
