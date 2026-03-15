import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AdminPage from "./AdminPage";

describe("AdminPage", () => {
    it("affiche le titre de la vue utilisateurs", () => {
        render(
            <MemoryRouter>
                <AdminPage />
            </MemoryRouter>,
        );
        expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    });

    it("affiche le bouton d'invitation", () => {
        render(
            <MemoryRouter>
                <AdminPage />
            </MemoryRouter>,
        );
        expect(screen.getByRole("button", { name: /Inviter un membre/i })).toBeDefined();
    });

    it("affiche l'état de chargement au montage", () => {
        render(
            <MemoryRouter>
                <AdminPage />
            </MemoryRouter>,
        );
        expect(screen.getByText("Chargement…")).toBeDefined();
    });
});
