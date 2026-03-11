import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Step4Confirm from "./Step4Confirm";
import type { FormDepotData } from "../types";
import { INITIAL_FORM_DATA } from "../constants";

const baseProps = {
    formData: {
        ...INITIAL_FORM_DATA,
        prenom: "Alice",
        nom: "Dupont",
        email: "alice@test.com",
        mobile: "+33612345678",
        dob: "1995-01-01",
        ville: "Marseille",
        pays: "FR",
        titre: "Mon Film",
        titreEn: "My Film",
        iaClass: "full" as FormDepotData["iaClass"],
        iaImg: "Runway ML",
    },
    videoValid: true,
    subtitleFR: new File([""], "sub-fr.srt"),
    subtitleEN: new File([""], "sub-en.srt"),
    rgpdChecked: [false, false, false] as boolean[],
    submissionState: "idle" as const,
    onToggleRgpd: vi.fn(),
    onPrev: vi.fn(),
    onSubmit: vi.fn(),
};

describe("Step4Confirm", () => {
    it("affiche le récapitulatif avec les données du formulaire", () => {
        render(<Step4Confirm {...baseProps} />);

        expect(screen.getByText("Alice Dupont")).toBeDefined();
        expect(screen.getByText("Mon Film")).toBeDefined();
        expect(screen.getByText("alice@test.com")).toBeDefined();
        expect(screen.getByText("Confirmation & Droits")).toBeDefined();
    });

    it("désactive le bouton soumettre tant que les 3 RGPD ne sont pas cochées", () => {
        render(<Step4Confirm {...baseProps} />);

        const submitBtn = screen.getByRole("button", { name: /soumettre mon film/i });
        expect(submitBtn).toHaveProperty("disabled", true);
    });

    it("active le bouton soumettre quand les 3 RGPD sont cochées", () => {
        render(<Step4Confirm {...baseProps} rgpdChecked={[true, true, true]} />);

        const submitBtn = screen.getByRole("button", { name: /soumettre mon film/i });
        expect(submitBtn).toHaveProperty("disabled", false);
    });

    it("appelle onToggleRgpd quand on clique sur une condition", async () => {
        const onToggleRgpd = vi.fn();
        const user = userEvent.setup();
        render(<Step4Confirm {...baseProps} onToggleRgpd={onToggleRgpd} />);

        const rgpdItems = screen.getAllByText(/Cession de droits|Conformité RGPD|Originalité/i);
        const firstRgpd = rgpdItems[0].closest("button");
        expect(firstRgpd).not.toBeNull();
        await user.click(firstRgpd!);

        expect(onToggleRgpd).toHaveBeenCalledWith(0);
    });

    it("appelle onSubmit quand le formulaire est prêt et soumis", async () => {
        const onSubmit = vi.fn();
        const user = userEvent.setup();
        render(
            <Step4Confirm {...baseProps} rgpdChecked={[true, true, true]} onSubmit={onSubmit} />,
        );

        const submitBtn = screen.getByRole("button", { name: /soumettre mon film/i });
        await user.click(submitBtn);

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("affiche Envoi en cours pendant la soumission", () => {
        render(<Step4Confirm {...baseProps} submissionState="submitting" />);

        expect(screen.getByText(/envoi en cours/i)).toBeDefined();
    });

    it("affiche un avertissement si toutes les RGPD ne sont pas cochées", () => {
        render(<Step4Confirm {...baseProps} />);

        expect(screen.getByText(/vous devez accepter toutes les conditions/i)).toBeDefined();
    });

    it("appelle onPrev quand on clique sur le bouton retour", async () => {
        const onPrev = vi.fn();
        const user = userEvent.setup();
        render(<Step4Confirm {...baseProps} onPrev={onPrev} />);

        const backBtn = screen.getByRole("button", { name: /retour/i });
        await user.click(backBtn);

        expect(onPrev).toHaveBeenCalledTimes(1);
    });
});
