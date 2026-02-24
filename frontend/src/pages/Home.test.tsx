import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./Home";

describe("Home", () => {
    it("affiche le message Bonjour", () => {
        render(<Home />);
        expect(screen.getByRole("heading", { name: "Bonjour" })).toBeDefined();
    });
});
