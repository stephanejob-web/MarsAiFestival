import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import StepsNav from "./StepsNav";

describe("StepsNav", () => {
    const defaultProps = {
        currentStep: 1,
        maxUnlocked: 1,
        onGoStep: vi.fn(),
    };

    it("affiche les 4 étapes du formulaire", () => {
        render(<StepsNav {...defaultProps} />);

        expect(screen.getByText("Profil réalisateur")).toBeDefined();
        expect(screen.getByText("Le Film")).toBeDefined();
        expect(screen.getByText("Déclaration IA")).toBeDefined();
        expect(screen.getByText("Confirmation")).toBeDefined();
    });

    it("appelle onGoStep quand on clique sur une étape déverrouillée", async () => {
        const onGoStep = vi.fn();
        const user = userEvent.setup();
        render(<StepsNav currentStep={2} maxUnlocked={2} onGoStep={onGoStep} />);

        const step1 = screen.getByText("Profil réalisateur").closest("[role='button']");
        expect(step1).not.toBeNull();
        await user.click(step1!);

        expect(onGoStep).toHaveBeenCalledWith(1);
    });

    it("n'appelle pas onGoStep quand on clique sur une étape verrouillée", async () => {
        const onGoStep = vi.fn();
        const user = userEvent.setup();
        render(<StepsNav currentStep={1} maxUnlocked={1} onGoStep={onGoStep} />);

        const step3 = screen.getByText("Déclaration IA").closest("[role='button']");
        expect(step3).not.toBeNull();
        await user.click(step3!);

        expect(onGoStep).not.toHaveBeenCalled();
    });

    it("marque l'étape active avec un style distinct", () => {
        render(<StepsNav currentStep={2} maxUnlocked={2} onGoStep={vi.fn()} />);

        const step2Title = screen.getByText("Le Film");
        expect(step2Title.className).toContain("text-aurora");
    });

    it("affiche un check ✓ pour les étapes terminées", () => {
        render(<StepsNav currentStep={3} maxUnlocked={3} onGoStep={vi.fn()} />);

        const circles = document.querySelectorAll("[role='button']");
        expect(circles[0]?.textContent).toContain("✓");
        expect(circles[1]?.textContent).toContain("✓");
    });
});
