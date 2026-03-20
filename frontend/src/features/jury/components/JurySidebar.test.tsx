import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import JurySidebar from "./JurySidebar";

vi.mock("../hooks/useJuryUser", () => ({
    default: () => ({
        id: 1,
        email: "marie@marsai.fr",
        firstName: "Marie",
        lastName: "Lefebvre",
        role: "president",
        profilPicture: null,
        initials: "ML",
        fullName: "Marie Lefebvre",
        roleLabel: "Présidente du Jury",
    }),
}));

vi.mock("../hooks/useJuryChat", () => ({
    default: () => ({
        messages: [],
        connectedUsers: [],
        inputValue: "",
        unreadCount: 0,
        isConnected: true,
        onlineCount: 0,
        mySocketId: "socket-1",
        vocalUsers: [],
        setInputValue: vi.fn(),
        sendMessage: vi.fn(),
        joinVocal: vi.fn(),
        leaveVocal: vi.fn(),
    }),
}));

const defaultProps = {
    activeView: "eval" as const,
    onViewChange: vi.fn(),
    pendingCount: 3,
    evaluatedCount: 2,
    discussCount: 1,
    progress: 40,
    totalFilms: 5,
    isChatOpen: false,
    onChatToggle: vi.fn(),
};

const renderSidebar = (overrides = {}): void => {
    render(
        <MemoryRouter>
            <JurySidebar {...defaultProps} {...overrides} />
        </MemoryRouter>,
    );
};

describe("JurySidebar", () => {
    it("affiche le logo marsAI", () => {
        renderSidebar();
        expect(screen.getByText("mars")).toBeDefined();
        expect(screen.getByText("AI")).toBeDefined();
    });

    it("affiche les compteurs de films", () => {
        renderSidebar();
        expect(screen.getAllByText("3").length).toBeGreaterThan(0);
        expect(screen.getAllByText("2").length).toBeGreaterThan(0);
        expect(screen.getAllByText("1").length).toBeGreaterThan(0);
    });

    it("affiche la barre de progression avec la bonne largeur", () => {
        renderSidebar({ progress: 60 });
        const bar = document.querySelector("[style*='width: 60%']");
        expect(bar).not.toBeNull();
    });

    it("affiche le compte progression films evalues", () => {
        renderSidebar();
        expect(screen.getByText(/2 \/ 5 films évalués/i)).toBeDefined();
    });

    it("appelle onViewChange avec eval quand on clique sur Films assignes", async () => {
        const onViewChange = vi.fn();
        const user = userEvent.setup();
        renderSidebar({ onViewChange });
        await user.click(screen.getByRole("button", { name: /films assignés/i }));
        expect(onViewChange).toHaveBeenCalledWith("eval");
    });

    it("met en evidence l onglet actif avec la classe aurora", () => {
        renderSidebar({ activeView: "eval" });
        const btn = screen.getByRole("button", { name: /films assignés/i });
        expect(btn.className).toContain("aurora");
    });

    it("affiche l identite du jure Marie Lefebvre", () => {
        renderSidebar();
        expect(screen.getByText("Marie Lefebvre")).toBeDefined();
        expect(screen.getByText("Présidente du Jury")).toBeDefined();
    });

    it("affiche le bouton chat jury", () => {
        renderSidebar();
        expect(screen.getByText("Chat jury")).toBeDefined();
    });

    it("appelle onChatToggle quand on clique sur Chat jury", async () => {
        const onChatToggle = vi.fn();
        const user = userEvent.setup();
        renderSidebar({ onChatToggle });
        await user.click(screen.getByText("Chat jury").closest("button")!);
        expect(onChatToggle).toHaveBeenCalled();
    });

    it("affiche le panel chat quand isChatOpen est true", () => {
        renderSidebar({ isChatOpen: true });
        expect(screen.getByPlaceholderText(/message/i)).toBeDefined();
    });
});
