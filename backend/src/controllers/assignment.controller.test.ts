import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

vi.mock("../repositories/assignment.repository", () => ({
    assignFilmToJury: vi.fn(),
    removeAssignment: vi.fn(),
    getFilmsByJury: vi.fn(),
    getJuryByFilm: vi.fn(),
    getAllAssignments: vi.fn(),
    getAllJuryMembers: vi.fn(),
}));

vi.mock("../repositories/film.repository", () => ({
    getFilms: vi.fn(),
    getUnassignedFilms: vi.fn(),
}));

vi.mock("../services/s3.service", () => ({
    getPresignedVideoUrl: vi.fn(),
    extractS3Key: vi.fn(),
}));

import { customDistribute } from "./assignment.controller";
import { assignFilmToJury } from "../repositories/assignment.repository";
import { getUnassignedFilms } from "../repositories/film.repository";

const mockReq = (body: unknown, juryUser = { id: 1 }): Partial<Request> => ({
    body,
    juryUser: juryUser as Request["juryUser"],
});

const mockRes = (): {
    res: Partial<Response>;
    json: ReturnType<typeof vi.fn>;
    status: ReturnType<typeof vi.fn>;
} => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const res: Partial<Response> = { json, status } as Partial<Response>;
    (res.json as ReturnType<typeof vi.fn>) = json;
    return { res, json, status };
};

describe("customDistribute", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("retourne 400 si allocations est absent", async () => {
        const req = mockReq({});
        const { res, status } = mockRes();
        await customDistribute(req as Request, res as Response);
        expect(status).toHaveBeenCalledWith(400);
    });

    it("retourne 400 si allocations est un tableau vide", async () => {
        const req = mockReq({ allocations: [] });
        const { res, status } = mockRes();
        await customDistribute(req as Request, res as Response);
        expect(status).toHaveBeenCalledWith(400);
    });

    it("distribue les films selon les quotas et retourne les paires", async () => {
        vi.mocked(getUnassignedFilms).mockResolvedValue([
            { id: 10 },
            { id: 20 },
            { id: 30 },
        ] as never);
        vi.mocked(assignFilmToJury).mockResolvedValue(1);

        const req = mockReq({
            allocations: [
                { juryId: 1, count: 2 },
                { juryId: 2, count: 1 },
            ],
        });
        const { res, json } = mockRes();
        await customDistribute(req as Request, res as Response);

        expect(assignFilmToJury).toHaveBeenCalledTimes(3);
        expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, assigned: 3 }));
    });

    it("ignore silencieusement les doublons et continue la distribution", async () => {
        vi.mocked(getUnassignedFilms).mockResolvedValue([{ id: 10 }, { id: 20 }] as never);
        vi.mocked(assignFilmToJury)
            .mockRejectedValueOnce(new Error("ER_DUP_ENTRY"))
            .mockResolvedValue(1);

        const req = mockReq({ allocations: [{ juryId: 1, count: 2 }] });
        const { res, json } = mockRes();
        await customDistribute(req as Request, res as Response);

        expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, assigned: 1 }));
    });

    it("retourne 500 en cas d'erreur inattendue", async () => {
        vi.mocked(getUnassignedFilms).mockRejectedValue(new Error("DB error"));

        const req = mockReq({ allocations: [{ juryId: 1, count: 1 }] });
        const { res, status } = mockRes();
        await customDistribute(req as Request, res as Response);

        expect(status).toHaveBeenCalledWith(500);
    });
});
