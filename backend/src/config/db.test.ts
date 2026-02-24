import { describe, it, expect, vi, afterAll } from "vitest";

vi.mock("mysql2/promise", () => {
    const mockQuery = vi.fn().mockResolvedValue([[{ result: 1 }], []]);
    const mockRelease = vi.fn();
    const mockGetConnection = vi.fn().mockResolvedValue({
        query: mockQuery,
        release: mockRelease,
    });

    return {
        default: {
            createPool: vi.fn().mockReturnValue({
                getConnection: mockGetConnection,
                end: vi.fn().mockResolvedValue(undefined),
            }),
        },
    };
});

import pool from "./db";

describe("db", () => {
    afterAll(async () => {
        await pool.end();
    });

    it("crée un pool de connexions MySQL", () => {
        expect(pool).toBeDefined();
        expect(pool.getConnection).toBeDefined();
    });

    it("obtient une connexion depuis le pool", async () => {
        const connection = await pool.getConnection();
        expect(connection).toBeDefined();
        connection.release();
        expect(connection.release).toHaveBeenCalled();
    });

    it("exécute une requête via la connexion", async () => {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT 1 AS result");
        expect(rows).toEqual([{ result: 1 }]);
        connection.release();
    });
});
