import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AssignDistributionModal from "./AssignDistributionModal";
import type { AdminJuryMember } from "../types";

const mockJury: AdminJuryMember[] = [
    {
        id: 1,
        first_name: "Alice",
        last_name: "Dupont",
        email: "alice@test.com",
        role: "jury",
        profil_picture: null,
    },
    {
        id: 2,
        first_name: "Bob",
        last_name: "Martin",
        email: "bob@test.com",
        role: "jury",
        profil_picture: null,
    },
];

const defaultProps = {
    juryMembers: mockJury,
    totalUnassigned: 10,
    isDistributing: false,
    onClose: vi.fn(),
    onCustomDistribute: vi.fn().mockResolvedValue(undefined),
};

describe("AssignDistributionModal", () => {
    it("affiche le titre et le compteur de films", () => {
        render(<AssignDistributionModal {...defaultProps} />);
        expect(screen.getByText("Distribution des films")).toBeDefined();
        expect(screen.getByText(/10 films non-assignés/)).toBeDefined();
    });

    it("affiche la liste des jurés avec leurs noms", () => {
        render(<AssignDistributionModal {...defaultProps} />);
        expect(screen.getByText("Alice Dupont")).toBeDefined();
        expect(screen.getByText("Bob Martin")).toBeDefined();
    });

    it("affiche un slider par juré", () => {
        render(<AssignDistributionModal {...defaultProps} />);
        const sliders = screen.getAllByRole("slider");
        expect(sliders).toHaveLength(2);
    });

    it("désactive les boutons d'action pendant isDistributing", () => {
        render(<AssignDistributionModal {...defaultProps} isDistributing={true} />);
        const enCoursBtns = screen.getAllByText("En cours…");
        enCoursBtns.forEach((btn) => expect(btn).toHaveProperty("disabled", true));
    });

    it("appelle onClose quand on clique sur le bouton fermer", () => {
        const onClose = vi.fn();
        render(<AssignDistributionModal {...defaultProps} onClose={onClose} />);
        const closeBtn = screen.getByRole("button", { name: "" });
        fireEvent.click(closeBtn);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("affiche un message si aucun juré n'est disponible", () => {
        render(<AssignDistributionModal {...defaultProps} juryMembers={[]} />);
        expect(screen.getByText("Aucun juré actif disponible.")).toBeDefined();
    });

    it("met à jour le compteur total quand un slider diminue", () => {
        render(<AssignDistributionModal {...defaultProps} />);
        const sliders = screen.getAllByRole("slider");
        // Initial : Alice=5, Bob=5 → total 10/10. Diminue Alice à 3 → total 8/10.
        fireEvent.change(sliders[0], { target: { value: "3" } });
        expect(screen.getByText(/8 \/ 10/)).toBeDefined();
    });
});
