import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import AdminCmsPage from "./AdminCmsPage";

vi.mock("../features/admin/components/CmsTopBar", () => ({
    default: () => <div>CmsTopBar</div>,
}));
vi.mock("../features/admin/components/CmsVideoHero", () => ({
    default: () => <div>CmsVideoHero</div>,
}));
vi.mock("../features/admin/components/CmsHeroContent", () => ({
    default: () => <div>CmsHeroContent</div>,
}));
vi.mock("../features/admin/components/CmsCalendar", () => ({
    default: () => <div>CmsCalendar</div>,
}));
vi.mock("../features/admin/components/CmsProgramme", () => ({
    default: () => <div>CmsProgramme</div>,
}));
vi.mock("../features/admin/components/CmsJury", () => ({
    default: () => <div>CmsJury</div>,
}));
vi.mock("../features/admin/components/CmsSponsors", () => ({
    default: () => <div>CmsSponsors</div>,
}));
vi.mock("../features/admin/components/CmsContactInfo", () => ({
    default: () => <div>CmsContactInfo</div>,
}));

describe("AdminCmsPage", () => {
    it("renders the main title", () => {
        render(
            <BrowserRouter>
                <AdminCmsPage />
            </BrowserRouter>,
        );
        expect(screen.getByText("Administration du site")).toBeInTheDocument();
    });

    it("renders the subtitle", () => {
        render(
            <BrowserRouter>
                <AdminCmsPage />
            </BrowserRouter>,
        );
        expect(screen.getByText("Gérez le contenu public du festival")).toBeInTheDocument();
    });

    it("renders all quick nav links", () => {
        render(
            <BrowserRouter>
                <AdminCmsPage />
            </BrowserRouter>,
        );
        expect(screen.getByText("Programme 🗓️")).toBeInTheDocument();
        expect(screen.getByText("Jury 👥")).toBeInTheDocument();
        expect(screen.getByText("Hero 🎬")).toBeInTheDocument();
        expect(screen.getByText("Calendrier 📅")).toBeInTheDocument();
        expect(screen.getByText("Sponsors 🤝")).toBeInTheDocument();
        expect(screen.getByText("Contact 📬")).toBeInTheDocument();
    });
});
