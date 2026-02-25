import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./Home";

describe("Home", () => {
    it("affiche le titre de bienvenue", () => {
        render(<Home />);
        expect(
            screen.getByRole("heading", { name: /bienvenue sur marsaifestival/i }),
        ).toBeDefined();
    });

    it("affiche tous les membres de l'équipe", () => {
        render(<Home />);
        const members = ["Mickaël", "Valérie", "Jean-Deny", "Dylan", "Stéphane"];
        members.forEach((name) => {
            expect(screen.getByText(name)).toBeDefined();
        });
    });
});
