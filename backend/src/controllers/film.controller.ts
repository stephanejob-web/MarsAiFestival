import { Request, Response } from "express";
import { uploadFileToS3 } from "../services/s3.service";
import { uploadVideoToYoutube } from "../services/youtube.service";

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
        // Upload S3 (vidéo + sous-titres)
        for (const field of ["video", "subtitleFR", "subtitleEN"]) {
            const fileArr = files?.[field];
            if (fileArr && fileArr.length > 0) {
                const file = fileArr[0];
                const filename = `${dossierNum}-${field}-${file.originalname}`;
                urls[field] = await uploadFileToS3(file.buffer, filename, file.mimetype);
            }
        }

        // Upload YouTube en mode privé
        const videoArr = files?.["video"];
        if (videoArr && videoArr.length > 0) {
            const video = videoArr[0];
            const titre = (req.body as Record<string, string>).titre ?? dossierNum;
            const synopsis = (req.body as Record<string, string>).synopsis ?? "";
            const description = `Dossier : ${dossierNum}\n\n${synopsis}`;
            urls["youtube"] = await uploadVideoToYoutube(
                video.buffer,
                titre,
                description,
                video.mimetype,
            );
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
            message: "Erreur lors de l'upload",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
