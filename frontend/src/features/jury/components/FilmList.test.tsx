import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { JuryFilm } from "../types";
import FilmList from "./FilmList";

const film1: JuryFilm = {
    id: 1,
    title: "Reves de Silicium",
    author: "Lea Fontaine",
    country: "France",
    year: "2026",
    duration: "00:59.8",
    format: "MP4 1080p",
    subtitles: "FR",
    copyright: "Verifie",
    tools: "Runway ML",
    iaScenario: "ChatGPT-4o",
    iaImage: "Runway Gen-3",
    iaPost: "MusicGen",
    note: "Film sur la memoire humaine.",
    videoUrl: null,
    myDecision: null,
    comments: [],
    opinions: [],
    votes: [],
    realisator: {
        gender: "Mme", firstName: "Lea", lastName: "Fontaine", birthDate: null,
        email: "lea@test.com", profession: null, phone: null, mobilePhone: "+33612345678",
        street: "1 rue Test", postalCode: "75001", city: "Paris", country: "FR",
        youtube: null, instagram: null, linkedin: null, facebook: null, xtwitter: null,
        howDidYouKnowUs: null, newsletter: false,
    },
};

const film2: JuryFilm = {
    id: 2,
    title: "L Enfant Pixel",
    author: "Amira Ben Said",
    country: "Tunisie",
    year: "2026",
    duration: "01:02.1",
    format: "MP4 4K",
    subtitles: "FR EN",
    copyright: "Verifie",
    tools: "Pika Labs",
    iaScenario: "GPT-4o",
    iaImage: "Pika Labs 1.5",
    iaPost: "Udio",
    note: "Exploration poetique.",
    videoUrl: null,
    myDecision: "valide",
    comments: [],
    opinions: [],
    votes: [],
    realisator: {
        gender: "Mme", firstName: "Amira", lastName: "Ben Said", birthDate: null,
        email: "amira@test.com", profession: null, phone: null, mobilePhone: "+21612345678",
        street: "5 avenue Test", postalCode: "1000", city: "Tunis", country: "TN",
        youtube: null, instagram: null, linkedin: null, facebook: null, xtwitter: null,
        howDidYouKnowUs: null, newsletter: false,
    },
};

const defaultProps = {
    films: [film1, film2],
    activeFilm: film1,
    onSelectFilm: vi.fn(),
};

describe("FilmList", () => {
    it("affiche la liste des films avec titre et auteur", () => {
        render(<FilmList {...defaultProps} />);
        expect(screen.getByText("Reves de Silicium")).toBeDefined();
        expect(screen.getByText("L Enfant Pixel")).toBeDefined();
        expect(screen.getByText(/Lea Fontaine/)).toBeDefined();
    });

    it("appelle onSelectFilm avec l id du film quand on clique dessus", async () => {
        const onSelectFilm = vi.fn();
        const user = userEvent.setup();
        render(<FilmList {...defaultProps} onSelectFilm={onSelectFilm} />);
        await user.click(screen.getByText("L Enfant Pixel"));
        expect(onSelectFilm).toHaveBeenCalledWith(2);
    });

    it("affiche le tiret pour un film sans decision", () => {
        render(<FilmList {...defaultProps} films={[film1]} />);
        expect(screen.getByText("—")).toBeDefined();
    });

    it("affiche le badge de decision pour un film evalue", () => {
        render(<FilmList {...defaultProps} films={[film2]} />);
        expect(screen.getByText(/validé/i)).toBeDefined();
    });

    it("met en evidence le film actif avec la classe aurora", () => {
        render(<FilmList {...defaultProps} activeFilm={film1} />);
        const buttons = screen.getAllByRole("button");
        const activeBtn = buttons.find((b) => b.textContent?.includes("Reves de Silicium"));
        expect(activeBtn?.className).toContain("aurora");
    });

    it("affiche une liste vide sans erreur quand films est vide", () => {
        render(<FilmList {...defaultProps} films={[]} />);
        expect(screen.queryByText("Reves de Silicium")).toBeNull();
        expect(screen.queryByText("L Enfant Pixel")).toBeNull();
    });
});
