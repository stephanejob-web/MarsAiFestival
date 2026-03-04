import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DepotForm from "./DepotForm";

describe("DepotForm", () => {
    it("affiche l'étape 1 par défaut avec le titre Profil réalisateur", () => {
        render(<DepotForm />);
        expect(screen.getByRole("heading", { name: /profil réalisateur/i })).toBeDefined();
    });

    it("affiche la sidebar avec la navigation par étapes", () => {
        render(<DepotForm />);
        expect(screen.getByRole("navigation", { name: /étapes du formulaire/i })).toBeDefined();
        expect(screen.getByText("Le Film")).toBeDefined();
        expect(screen.getByText("Déclaration IA")).toBeDefined();
        expect(screen.getByText("Confirmation")).toBeDefined();
    });

    it("affiche des erreurs de validation quand on clique Suivant sans remplir le formulaire", () => {
        render(<DepotForm />);
        fireEvent.click(screen.getByRole("button", { name: /étape suivante — le film/i }));
        expect(screen.getByText(/prénom requis/i)).toBeDefined();
    });

    it("ne montre pas le bouton Retour sur l'étape 1", () => {
        render(<DepotForm />);
        expect(screen.queryByRole("button", { name: /retour/i })).toBeNull();
    });
});
