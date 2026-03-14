import { Request, Response } from "express";
import { uploadFileToS3 } from "../services/s3.service";
import { uploadVideoToYoutube } from "../services/youtube.service";
import { insertRealisator } from "../repositories/realisator.repository";
import { insertFilm, getFilms, getFilmById, updateFilmStatut } from "../repositories/film.repository";
import { getVotesSummary } from "../repositories/vote.repository";

// ── POST /api/films ────────────────────────────────────────────────────────────
export const submitFilm = async (req: Request, res: Response): Promise<void> => {
    const dossierNum = "MAI-2026-" + String(Math.floor(Math.random() * 90000) + 10000);
    const body = req.body as Record<string, string>;
    const files = req.files as Record<string, Express.Multer.File[]>;
    const urls: Record<string, string> = {};

    // eslint-disable-next-line no-console
    console.log("📋 Données formulaire reçues :", body);
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

    // ── Étape 1 : Upload S3 (bloquant) ────────────────────────────────────────
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
        const titre = body.titre ?? dossierNum;
        const prenom = body.prenom ?? "";
        const nom = body.nom ?? "";
        const pays = body.pays ?? "";
        const synopsis = body.synopsis ?? "";

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
            // eslint-disable-next-line no-console
            console.error("⚠️ Échec upload YouTube (dossier validé) :", dossierNum, err);
            youtubeWarning =
                "La mise en ligne YouTube est temporairement indisponible — votre film est bien enregistré sur nos serveurs.";
        }
    }

    // ── Étape 3 : Persistance en base de données ───────────────────────────────
    try {
        const realisatorId = await insertRealisator({
            gender: body.civilite ?? "",
            first_name: body.prenom ?? "",
            last_name: body.nom ?? "",
            birth_date: body.dob ?? "",
            email: body.email ?? "",
            profession: body.metier || null,
            phone: body.tel || null,
            mobile_phone: body.mobile ?? "",
            street: body.rue ?? "",
            postal_code: body.cp ?? "",
            city: body.ville ?? "",
            country: body.pays ?? "",
            youtube: body.youtube || null,
            instagram: body.instagram || null,
            linkedin: body.linkedin || null,
            facebook: body.facebook || null,
            xtwitter: body.xtwitter || null,
            how_did_you_know_us: body.discovery || null,
            newsletter: body.newsletter === "true",
        });

        await insertFilm({
            realisator_id: realisatorId,
            dossier_num: dossierNum,
            original_title: body.titre ?? "",
            english_title: body.titreEn || null,
            language: body.langue ?? "",
            tags: body.tags || null,
            original_synopsis: body.synopsis || null,
            english_synopsis: body.synopsisEn || null,
            video_url: urls["video"] ?? null,
            subtitle_fr_url: urls["subtitleFR"] ?? null,
            subtitle_en_url: urls["subtitleEN"] ?? null,
            creative_workflow: body.intention || null,
            tech_stack: body.outils || null,
            ia_class: body.iaClass === "hybrid" ? "hybrid" : "full",
            ia_image: body.iaImg === "true",
            ia_son: body.iaSon === "true",
            ia_scenario: body.iaScenario === "true",
            ia_post: body.iaPost === "true",
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("❌ Erreur insertion BDD :", err);
        res.status(500).json({
            success: false,
            message: "Fichiers enregistrés mais erreur lors de la sauvegarde du dossier.",
            error: err instanceof Error ? err.message : String(err),
        });
        return;
    }

    res.status(201).json({
        success: true,
        dossierNum,
        message: "Dépôt reçu avec succès",
        files: urls,
        ...(youtubeWarning && { youtubeWarning }),
    });
};

// ── PATCH /api/films/:id — Mettre à jour le statut d'un film (admin) ──────────
export const patchFilm = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { statut } = req.body as { statut?: string };
    const validStatuts = ["to_review", "valide", "arevoir", "refuse", "in_discussion", "asked_to_modify"] as const;

    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    if (!statut || !validStatuts.includes(statut as (typeof validStatuts)[number])) {
        res.status(400).json({ success: false, message: `statut doit être parmi : ${validStatuts.join(", ")}` });
        return;
    }

    try {
        const updated = await updateFilmStatut(id, statut as (typeof validStatuts)[number]);
        if (!updated) {
            res.status(404).json({ success: false, message: "Film introuvable." });
            return;
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du film.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/films/stats — Synthèse votes par film (admin Sélection) ──────────
export const filmsStats = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getVotesSummary();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des stats.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/films ─────────────────────────────────────────────────────────────
export const listFilms = async (_req: Request, res: Response): Promise<void> => {
    try {
        const films = await getFilms();
        res.json({ success: true, data: films });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des films.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/films/:id ─────────────────────────────────────────────────────────
export const showFilm = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    try {
        const film = await getFilmById(id);
        if (!film) {
            res.status(404).json({ success: false, message: "Film introuvable." });
            return;
        }
        res.json({ success: true, data: film });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du film.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
