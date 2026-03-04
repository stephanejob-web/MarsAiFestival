import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./Home";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: "fr", changeLanguage: vi.fn() },
    }),
}));

describe("Home", () => {
    it("affiche le titre hello", () => {
        render(<Home />);
        expect(screen.getByRole("heading", { name: /hello/i })).toBeDefined();
    });

    it("affiche tous les membres de l'équipe", () => {
        render(<Home />);
        expect(screen.getByText("Mickael")).toBeDefined();
        expect(screen.getByText("Jean-Denis")).toBeDefined();
        expect(screen.getByText("Stéphane")).toBeDefined();
        expect(screen.getByText("Valérie")).toBeDefined();
        expect(screen.getByText("Wiem")).toBeDefined();
        expect(screen.getByText("Dylan")).toBeDefined();
    });

    it("affiche le badge du projet", () => {
        render(<Home />);
        expect(screen.getAllByText(/MarsAI Festival/i).length).toBeGreaterThan(0);
    });

    it("affiche le contenu dans un main", () => {
        render(<Home />);
        expect(screen.getByRole("main")).toBeDefined();
    });

    it("affiche le bouton de changement de langue", () => {
        render(<Home />);
        expect(screen.getByRole("button", { name: /lang/i })).toBeDefined();
    });
});
