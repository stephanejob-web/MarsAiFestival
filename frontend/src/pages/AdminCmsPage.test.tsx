import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import AdminCmsPage from "./AdminCmsPage";

vi.mock("../features/admin/components/CmsProgramme", () => ({
    default: () => <div>CmsProgramme</div>,
}));

vi.mock("../features/admin/components/CmsJury", () => ({
    default: () => <div>CmsJury</div>,
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

    it("renders quick nav links", () => {
        render(
            <BrowserRouter>
                <AdminCmsPage />
            </BrowserRouter>,
        );
        expect(screen.getByText("Programme 🗓️")).toBeInTheDocument();
        expect(screen.getByText("Jury 👥")).toBeInTheDocument();
    });
});
