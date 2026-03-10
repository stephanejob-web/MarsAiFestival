import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./Home";

describe("Home", () => {
    it("affiche le message de bienvenue pour Mickael et le main", () => {
        render(<Home />);
        expect(screen.getByRole("heading", { name: /bonjour mickael/i })).toBeDefined();
        expect(screen.getByRole("main")).toBeDefined();
    });
});
