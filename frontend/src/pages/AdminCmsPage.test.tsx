import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import AdminCmsPage from "./AdminCmsPage";

describe("AdminCmsPage", () => {
    it("renders the main title", () => {
        render(
            <BrowserRouter>
                <AdminCmsPage />
            </BrowserRouter>,
        );
        expect(screen.getByText("Administration du site")).toBeInTheDocument();
    });

    it("renders the top bar with site online status", () => {
        render(
            <BrowserRouter>
                <AdminCmsPage />
            </BrowserRouter>,
        );
        expect(screen.getByText("Site en ligne")).toBeInTheDocument();
    });

    it("renders the video hero section", () => {
        render(
            <BrowserRouter>
                <AdminCmsPage />
            </BrowserRouter>,
        );
        expect(screen.getByText("Vidéo Hero")).toBeInTheDocument();
        expect(
            screen.getByText("Fond animé affiché en plein écran sur la page d'accueil"),
        ).toBeInTheDocument();
    });
});
