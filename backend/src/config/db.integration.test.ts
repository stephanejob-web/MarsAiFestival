import "dotenv/config";
import { describe, it, expect, afterAll } from "vitest";
import pool from "./db";

/**
 * Test d'intégration — vérifie que la connexion MySQL fonctionne.
 * Prérequis : backend/.env configuré avec les bonnes valeurs et MySQL lancé.
 * Lancer avec : npm run check
 */

afterAll(async () => {
    await pool.end();
});

describe("Connexion MySQL (intégration)", () => {
    it("se connecte à la base de données", async () => {
        const connection = await pool.getConnection();
        expect(connection).toBeDefined();
        connection.release();
    });
});
