import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { JuryFilm } from "../types";
import FilmDetail from "./FilmDetail";

const baseFilm: JuryFilm = {
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
    note: "Film sur la memoire humaine et l apprentissage machine.",
    videoUrl: null,
    myDecision: null,
    comments: [],
    opinions: [
        {
            initials: "TR",
            name: "Thomas Richard",
            badge: "like",
            comment: "Tres belle utilisation.",
            color: "aurora",
        },
    ],
    votes: [
        {
            initials: "ML",
            name: "Marie Lefebvre",
            role: "Presidente",
            decision: "valide",
            avatarVariant: 1,
        },
    ],
};

const filmWithDecision: JuryFilm = {
    ...baseFilm,
    myDecision: "valide",
    comments: [
        {
            juryId: 1,
            name: "Thomas Richard",
            initials: "TR",
            profilPicture: null,
            text: "Tres belle utilisation.",
            updatedAt: "2026-03-15T10:00:00Z",
        },
        {
            juryId: 2,
            name: "Marie Lefebvre",
            initials: "ML",
            profilPicture: null,
            text: "Rythme solide.",
            updatedAt: "2026-03-15T11:00:00Z",
        },
    ],
};

describe("FilmDetail", () => {
    it("affiche le titre et l auteur du film", () => {
        render(<FilmDetail film={baseFilm} />);
        expect(screen.getAllByText("Reves de Silicium").length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Lea Fontaine/).length).toBeGreaterThan(0);
    });

    it("affiche le badge En attente quand aucune decision n est prise", () => {
        render(<FilmDetail film={baseFilm} />);
        expect(screen.getByText(/en attente/i)).toBeDefined();
    });

    it("affiche le badge de decision quand une decision est prise", () => {
        render(<FilmDetail film={filmWithDecision} />);
        expect(screen.getAllByText(/validé/i).length).toBeGreaterThan(0);
    });

    it("affiche les metadonnees du film", () => {
        render(<FilmDetail film={baseFilm} />);
        expect(screen.getByText("00:59.8")).toBeDefined();
        expect(screen.getByText("MP4 1080p")).toBeDefined();
        expect(screen.getByText("FR")).toBeDefined();
    });

    it("affiche les commentaires existants du film", () => {
        render(<FilmDetail film={filmWithDecision} />);
        expect(screen.getAllByText("Tres belle utilisation.").length).toBeGreaterThan(0);
        expect(screen.getByText("Rythme solide.")).toBeDefined();
    });

    it("affiche le message aucun commentaire quand la liste est vide", () => {
        render(<FilmDetail film={baseFilm} />);
        expect(screen.getByText(/aucun commentaire pour ce film/i)).toBeDefined();
    });

    it("affiche les avis des autres jures", () => {
        render(<FilmDetail film={baseFilm} />);
        expect(screen.getByText("Thomas Richard")).toBeDefined();
    });

    it("affiche les votes du jury", () => {
        render(<FilmDetail film={baseFilm} />);
        expect(screen.getByText("Marie Lefebvre")).toBeDefined();
    });

    it("affiche la fiche IA avec scenario image et post-production", () => {
        render(<FilmDetail film={baseFilm} />);
        expect(screen.getByText("ChatGPT-4o")).toBeDefined();
        expect(screen.getByText("Runway Gen-3")).toBeDefined();
        expect(screen.getByText("MusicGen")).toBeDefined();
    });

    it("affiche le placeholder video quand videoUrl est null", () => {
        render(<FilmDetail film={baseFilm} />);
        expect(screen.getByText(/vidéo non disponible/i)).toBeDefined();
    });

    it("affiche un element video quand videoUrl est defini", () => {
        const filmWithVideo: JuryFilm = { ...baseFilm, videoUrl: "https://example.com/video.mp4" };
        const { container } = render(<FilmDetail film={filmWithVideo} />);
        const videoEl = container.querySelector("video");
        expect(videoEl).not.toBeNull();
        expect(videoEl?.getAttribute("src")).toBe("https://example.com/video.mp4");
    });
});
