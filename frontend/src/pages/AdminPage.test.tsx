import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AdminPage from "./AdminPage";
import * as useAdminUsersModule from "../features/admin/hooks/useAdminUsers";

const mockUseAdminUsers = vi.spyOn(useAdminUsersModule, "default");

describe("AdminPage", () => {
    beforeEach(() => {
        mockUseAdminUsers.mockReturnValue({
            users: [],
            isLoading: false,
            error: null,
            toggleStatus: vi.fn(),
            changeRole: vi.fn(),
            banUser: vi.fn(),
            unbanUser: vi.fn(),
            sendMessage: vi.fn(),
            updatePermissions: vi.fn(),
            reload: vi.fn(),
        });
    });

    it("affiche le titre de la vue utilisateurs", () => {
        render(
            <MemoryRouter>
                <AdminPage />
            </MemoryRouter>,
        );
        expect(screen.getByRole("heading")).toBeDefined();
    });

    it("affiche le bouton d'invitation", () => {
        render(
            <MemoryRouter>
                <AdminPage />
            </MemoryRouter>,
        );
        expect(screen.getByRole("button", { name: /Inviter un membre/i })).toBeDefined();
    });

    it("affiche l'état de chargement au montage", () => {
        mockUseAdminUsers.mockReturnValue({
            users: [],
            isLoading: true,
            error: null,
            toggleStatus: vi.fn(),
            changeRole: vi.fn(),
            banUser: vi.fn(),
            unbanUser: vi.fn(),
            sendMessage: vi.fn(),
            updatePermissions: vi.fn(),
            reload: vi.fn(),
        });
        render(
            <MemoryRouter>
                <AdminPage />
            </MemoryRouter>,
        );
        expect(screen.getByText("Chargement…")).toBeDefined();
    });
});
