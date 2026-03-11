import { Request, Response } from "express";

export const submitFilm = (req: Request, res: Response): void => {
    /* eslint-disable no-console */
    console.log("\n=== NOUVEAU DÉPÔT FILM ===");
    console.log("📋 Données formulaire:", req.body);
    console.log("📁 Fichiers reçus:", req.files);
    console.log("==========================\n");
    /* eslint-enable no-console */

    const dossierNum = "MAI-2026-" + String(Math.floor(Math.random() * 90000) + 10000);

    res.status(201).json({
        success: true,
        dossierNum,
        message: "Dépôt reçu avec succès",
    });
};
