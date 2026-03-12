import { Request, Response } from "express";
import { uploadFileToS3 } from "../services/s3.service";

export const submitFilm = async (req: Request, res: Response): Promise<void> => {
    const dossierNum = "MAI-2026-" + String(Math.floor(Math.random() * 90000) + 10000);

    const files = req.files as Record<string, Express.Multer.File[]>;
    const urls: Record<string, string> = {};

    // eslint-disable-next-line no-console
    console.log("📋 Données formulaire reçues :", req.body);
    // eslint-disable-next-line no-console
    console.log(
        "📁 Fichiers reçus :",
        Object.fromEntries(
            Object.entries(files ?? {}).map(([field, arr]) => [
                field,
                arr.map((f) => ({ name: f.originalname, size: f.size, mimetype: f.mimetype })),
            ]),
        ),
    );

    try {
        for (const field of ["video", "subtitleFR", "subtitleEN"]) {
            const fileArr = files?.[field];
            if (fileArr && fileArr.length > 0) {
                const file = fileArr[0];
                const filename = `${dossierNum}-${field}-${file.originalname}`;
                urls[field] = await uploadFileToS3(file.buffer, filename, file.mimetype);
            }
        }

        res.status(201).json({
            success: true,
            dossierNum,
            message: "Dépôt reçu avec succès",
            files: urls,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'upload S3",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
