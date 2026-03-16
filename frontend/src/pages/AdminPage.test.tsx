import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AdminPage from "./AdminPage";
import { ADMIN_LABELS } from "../features/admin/constants";

describe("AdminPage", () => {
    it("affiche le panel latéral avec le titre", () => {
        render(
            <MemoryRouter>
                <AdminPage />
            </MemoryRouter>,
        );
        expect(screen.getByText(ADMIN_LABELS.TITLE)).toBeDefined();
    });

    it("affiche la barre du haut", () => {
        render(
            <MemoryRouter>
                <AdminPage />
            </MemoryRouter>,
        );
        expect(screen.getByText("Gestion des utilisateurs")).toBeDefined();
    });

    it("contient le composant de statistiques", () => {
        render(
            <MemoryRouter>
                <AdminPage />
            </MemoryRouter>,
        );
        expect(screen.getByText(/Chargement des statistiques en cours.../i)).toBeDefined();
    });
});
