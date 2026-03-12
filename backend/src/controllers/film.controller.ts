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

    // ── Étape 1 : Upload S3 (critique — bloquant) ─────────────────────────────
    try {
        for (const field of ["video", "subtitleFR", "subtitleEN"]) {
            const fileArr = files?.[field];
            if (fileArr && fileArr.length > 0) {
                const file = fileArr[0];
                const filename = `${dossierNum}-${field}-${file.originalname}`;
                urls[field] = await uploadFileToS3(file.buffer, filename, file.mimetype);
            }
        }
    } catch (err) {
        // S3 échoue → dépôt impossible
        res.status(500).json({
            success: false,
            message: "Échec de l'enregistrement du fichier. Vérifiez votre connexion et réessayez.",
            error: err instanceof Error ? err.message : String(err),
        });
        return;
    }

    // ── Étape 2 : Upload YouTube (non bloquant) ────────────────────────────────
    let youtubeWarning: string | undefined;
    const videoArr = files?.["video"];
    if (videoArr && videoArr.length > 0) {
        const video = videoArr[0];
        const body = req.body as Record<string, string>;
        const titre = body.titre ?? dossierNum;
        const prenom = body.prenom ?? "";
        const nom = body.nom ?? "";
        const pays = body.pays ?? "";
        const synopsis = body.synopsis ?? "";

        // Titre YouTube : "[marsAI 2026] MAI-2026-XXXXX — Titre du film (Prénom Nom)"
        const ytTitle = `[marsAI 2026] ${dossierNum} — ${titre}${prenom || nom ? ` (${[prenom, nom].filter(Boolean).join(" ")})` : ""}`;

        const description = [
            `Dossier : ${dossierNum}`,
            titre ? `Titre : ${titre}` : "",
            prenom || nom ? `Réalisateur : ${[prenom, nom].filter(Boolean).join(" ")}` : "",
            pays ? `Pays : ${pays}` : "",
            synopsis ? `\nSynopsis :\n${synopsis}` : "",
        ]
            .filter(Boolean)
            .join("\n");
        try {
            urls["youtube"] = await uploadVideoToYoutube(
                video.buffer,
                ytTitle,
                description,
                video.mimetype,
            );
        } catch (err) {
            // YouTube échoue → on log, le dépôt est quand même validé (S3 OK)
            // eslint-disable-next-line no-console
            console.error("⚠️ Échec upload YouTube (dossier validé) :", dossierNum, err);
            youtubeWarning =
                "La mise en ligne YouTube est temporairement indisponible — votre film est bien enregistré sur nos serveurs.";
        }
    }

    res.status(201).json({
        success: true,
        dossierNum,
        message: "Dépôt reçu avec succès",
        files: urls,
        ...(youtubeWarning && { youtubeWarning }),
    });
};
