import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./Home";

describe("Home", () => {
    it("affiche le heading principal marsAI", () => {
        render(<Home />);
        expect(screen.getByRole("heading", { name: /mars\s*ai/i })).toBeDefined();
    });

    it("affiche le message de courage", () => {
        render(<Home />);
        expect(screen.getByText(/bon courage à toute l'équipe/i)).toBeDefined();
    });

    it("affiche tous les membres de l'équipe", () => {
        render(<Home />);
        const members = ["Mickaël", "Valérie", "Jean-Deny", "Dylan", "Stéphane"];
        members.forEach((name) => {
            expect(screen.getByText(name)).toBeDefined();
        });
    });

    it("affiche le footer avec l'année courante", () => {
        render(<Home />);
        const currentYear = new Date().getFullYear().toString();
        const footer = screen.getByRole("contentinfo");
        expect(footer.textContent?.includes(currentYear)).toBe(true);
    });
});
