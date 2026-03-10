import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FormFieldError } from "./formHelpers";
import { getInputClass } from "./formUtils";

describe("FormFieldError", () => {
    it("retourne null quand le champ n'a pas d'erreur", () => {
        const { container } = render(<FormFieldError errors={{}} field="prenom" />);
        expect(container.firstChild).toBeNull();
    });

    it("affiche le message d'erreur quand le champ a une erreur", () => {
        render(<FormFieldError errors={{ prenom: "Champ requis" }} field="prenom" />);
        expect(screen.getByText("Champ requis")).toBeDefined();
    });

    it("applique la className additionnelle si fournie", () => {
        render(
            <FormFieldError errors={{ email: "Email invalide" }} field="email" className="mt-2" />,
        );
        const el = screen.getByText("Email invalide");
        expect(el.className).toContain("mt-2");
    });

    it("n'affiche rien pour un champ différent", () => {
        const { container } = render(
            <FormFieldError errors={{ nom: "Champ requis" }} field="prenom" />,
        );
        expect(container.firstChild).toBeNull();
    });
});

describe("getInputClass", () => {
    it("retourne les classes de base quand pas d'erreur", () => {
        const cls = getInputClass("prenom", {});
        expect(cls).toContain("border-white/9");
        expect(cls).not.toContain("border-coral/50");
    });

    it("retourne la classe d'erreur quand le champ a une erreur", () => {
        const cls = getInputClass("prenom", { prenom: "Champ requis" });
        expect(cls).toContain("border-coral/50");
        expect(cls).not.toContain("border-white/9");
    });

    it("contient le focus ring aurora", () => {
        const cls = getInputClass("email", {});
        expect(cls).toContain("focus:border-aurora");
    });

    it("contient les styles de base (fond, border-radius, padding)", () => {
        const cls = getInputClass("nom", {});
        expect(cls).toContain("bg-white/4");
        expect(cls).toContain("rounded-[10px]");
        expect(cls).toContain("px-3.5");
    });
});
