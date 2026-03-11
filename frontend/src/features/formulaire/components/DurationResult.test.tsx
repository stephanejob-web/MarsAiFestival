import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DurationResult from "./DurationResult";

describe("DurationResult", () => {
    it("retourne null si aucune durée n'est fournie", () => {
        const { container } = render(<DurationResult durationSec={null} status={null} />);
        expect(container.firstChild).toBeNull();
    });

    it("affiche Durée valide quand le statut est ok", () => {
        render(<DurationResult durationSec={60} status="ok" />);
        expect(screen.getByText(/durée valide/i)).toBeDefined();
        expect(screen.getByText("1:00.0")).toBeDefined();
    });

    it("affiche Film trop court quand le statut est warn", () => {
        render(<DurationResult durationSec={45.5} status="warn" />);
        expect(screen.getByText(/film trop court/i)).toBeDefined();
        expect(screen.getByText("0:45.5")).toBeDefined();
    });

    it("affiche Film trop long quand le statut est err", () => {
        render(<DurationResult durationSec={75.3} status="err" />);
        expect(screen.getByText(/film trop long/i)).toBeDefined();
        expect(screen.getByText("1:15.3")).toBeDefined();
    });

    it("formate correctement la durée avec minutes et secondes", () => {
        render(<DurationResult durationSec={62.7} status="err" />);
        expect(screen.getByText("1:02.7")).toBeDefined();
    });
});
