import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

const renderHome = (): ReturnType<typeof render> =>
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>,
    );

describe("Home", () => {
    it("affiche le titre marsAI", () => {
        renderHome();
        expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    });

    it("affiche le lien de soumission vers le formulaire", () => {
        renderHome();
        const links = screen.getAllByRole("link", { name: /soumettre un film/i });
        expect(links.length).toBeGreaterThan(0);
    });

    it("affiche la section concept avec les 4 cartes", () => {
        renderHome();
        expect(screen.getByText("1 Minute, 1 Film")).toBeDefined();
        expect(screen.getByText("Films en compétition")).toBeDefined();
        expect(screen.getByText("Clôture des dépôts")).toBeDefined();
    });

    it("affiche les 4 étapes du dépôt de film", () => {
        renderHome();
        expect(screen.getByText("Profil réalisateur")).toBeDefined();
        expect(screen.getByText("Le Film")).toBeDefined();
        expect(screen.getByText("Fiche IA")).toBeDefined();
        expect(screen.getByText("Confirmation")).toBeDefined();
    });

    it("affiche la section Palmarès avec le Grand Prix", () => {
        renderHome();
        expect(screen.getByText("Grand Prix")).toBeDefined();
    });

    it("affiche le footer avec le lien de contact", () => {
        renderHome();
        expect(screen.getByText("contact@marsai.fr")).toBeDefined();
    });
});
