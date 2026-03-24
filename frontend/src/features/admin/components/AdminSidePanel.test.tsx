import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AdminSidePanel from "./AdminSidePanel";
import { ADMIN_LABELS, ADMIN_NAV_LINKS } from "../constants";

const FAKE_ADMIN_TOKEN = [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    btoa(
        JSON.stringify({
            id: 1,
            email: "admin@test.com",
            firstName: "Admin",
            lastName: "Test",
            role: "admin",
            profilPicture: null,
        }),
    ),
    "fakesig",
].join(".");

describe("AdminSidePanel", () => {
    beforeEach(() => {
        localStorage.setItem("jury_token", FAKE_ADMIN_TOKEN);
    });
    afterEach(() => {
        localStorage.removeItem("jury_token");
    });

    it("affiche le titre et le sous-titre", () => {
        render(
            <MemoryRouter>
                <AdminSidePanel />
            </MemoryRouter>,
        );
        expect(screen.getByText((_, el) => el?.textContent === ADMIN_LABELS.TITLE)).toBeDefined();
        expect(screen.getByText(ADMIN_LABELS.SUBTITLE)).toBeDefined();
    });

    it("affiche toutes les catégories de navigation", () => {
        render(
            <MemoryRouter>
                <AdminSidePanel />
            </MemoryRouter>,
        );
        ADMIN_NAV_LINKS.forEach((category) => {
            expect(screen.getByText(category.category)).toBeDefined();
        });
    });

    it("affiche tous les liens de navigation", () => {
        render(
            <MemoryRouter>
                <AdminSidePanel />
            </MemoryRouter>,
        );
        ADMIN_NAV_LINKS.flatMap((c) => c.items).forEach((item) => {
            expect(screen.getByText(item.label)).toBeDefined();
        });
    });

    it("affiche le bouton de déconnexion", () => {
        render(
            <MemoryRouter>
                <AdminSidePanel />
            </MemoryRouter>,
        );
        expect(screen.getByRole("button", { name: ADMIN_LABELS.LOGOUT })).toBeDefined();
    });
});
