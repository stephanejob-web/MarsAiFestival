import { Request, Response } from "express";
import {
    uploadFileToS3,
    deleteFileFromS3,
    extractS3Key,
    getPresignedVideoUrl,
} from "../services/s3.service";
import { sendRealisateurEmail } from "../services/realisator-email.service";
import { uploadVideoToYoutube } from "../services/youtube.service";
import { insertRealisator } from "../repositories/realisator.repository";
import {
    insertFilm,
    getFilms,
    getFilmById,
    updateFilmStatut,
    updatePosterImg,
    deleteFilm,
} from "../repositories/film.repository";
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
    const sanitizeName = (name: string): string =>
        name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");

    try {
        for (const field of ["poster", "video", "subtitleFR", "subtitleEN"]) {
            const fileArr = files?.[field];
            if (fileArr && fileArr.length > 0) {
                const file = fileArr[0];
                const filename = `${dossierNum}/${field}-${sanitizeName(file.originalname)}`;
                // Poster images are public (displayed on the site); other files remain private
                const isPublic = field === "poster";
                urls[field] = await uploadFileToS3(file.buffer, filename, file.mimetype, isPublic);
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
            poster_img: urls["poster"] ?? null,
            video_url: urls["video"] ?? null,
            subtitle_fr_url: urls["subtitleFR"] ?? null,
            subtitle_en_url: urls["subtitleEN"] ?? null,
            creative_workflow: body.intention || null,
            tech_stack: body.outils || null,
            duration: body.duration ? Math.round(Number(body.duration)) : null,
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

    // ── Étape 4 : Email de confirmation au réalisateur (non bloquant) ──────────
    const realisatorName = `${body.prenom ?? ""} ${body.nom ?? ""}`.trim();
    const realisatorEmail = body.email ?? "";
    const filmTitle = body.titre ?? dossierNum;
    if (realisatorEmail) {
        sendRealisateurEmail(
            realisatorEmail,
            realisatorName,
            filmTitle,
            "Confirmation de réception de votre film",
            `Nous avons bien reçu votre dépôt pour le film "${filmTitle}".\n\nVotre numéro de dossier est : ${dossierNum}\n\nNous examinerons votre film dans les meilleurs délais et vous recontacterons prochainement.\n\nMerci de votre participation au marsAI Festival 2026 !`,
        ).catch((err) => {
            // eslint-disable-next-line no-console
            console.error("⚠️ Échec envoi email confirmation réalisateur :", err);
        });
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
    const validStatuts = [
        "to_review",
        "valide",
        "arevoir",
        "refuse",
        "in_discussion",
        "asked_to_modify",
        "soumis",
        "selectionne",
        "finaliste",
    ] as const;

    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    if (!statut || !validStatuts.includes(statut as (typeof validStatuts)[number])) {
        res.status(400).json({
            success: false,
            message: `statut doit être parmi : ${validStatuts.join(", ")}`,
        });
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

// ── DELETE /api/films/:id ──────────────────────────────────────────────────────
export const deleteFilmById = async (req: Request, res: Response): Promise<void> => {
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

        // Delete S3 files (non-blocking errors — DB deletion takes priority)
        const s3Fields = ["video_url", "subtitle_fr_url", "subtitle_en_url"] as const;
        await Promise.allSettled(
            s3Fields
                .map((field) => film[field] as string | null)
                .filter((url): url is string => !!url)
                .map((url) => {
                    const key = extractS3Key(url);
                    return key ? deleteFileFromS3(key) : Promise.resolve();
                }),
        );

        const deleted = await deleteFilm(id);
        if (!deleted) {
            res.status(404).json({ success: false, message: "Film introuvable." });
            return;
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression du film.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── POST /api/films/:id/email — Envoyer un email au réalisateur ───────────────
export const emailRealisateur = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }

    const { subject, message } = req.body as { subject?: string; message?: string };
    if (!subject?.trim() || !message?.trim()) {
        res.status(400).json({ success: false, message: "Sujet et message sont requis." });
        return;
    }

    try {
        const film = await getFilmById(id);
        if (!film) {
            res.status(404).json({ success: false, message: "Film introuvable." });
            return;
        }

        const realisatorName =
            `${String(film.first_name ?? "")} ${String(film.last_name ?? "")}`.trim();
        const email = String(film.realisator_email ?? "");
        if (!email) {
            res.status(400).json({ success: false, message: "Aucun email pour ce réalisateur." });
            return;
        }

        await sendRealisateurEmail(
            email,
            realisatorName,
            String(film.original_title ?? ""),
            subject.trim(),
            message.trim(),
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'envoi de l'email.",
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

// ── GET /api/films/:id/video-url — URL pré-signée pour lire la vidéo ──────────
export const getVideoUrl = async (req: Request, res: Response): Promise<void> => {
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
        const videoUrl = film.video_url as string | null;
        if (!videoUrl) {
            res.status(404).json({ success: false, message: "Aucune vidéo pour ce film." });
            return;
        }
        const key = extractS3Key(videoUrl);
        if (!key) {
            res.status(400).json({ success: false, message: "URL vidéo invalide." });
            return;
        }
        const signedUrl = await getPresignedVideoUrl(key, 3600);
        res.json({ success: true, url: signedUrl });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la génération de l'URL vidéo.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── PATCH /api/films/:id/poster — Uploader / remplacer l'affiche ──────────────
export const uploadPoster = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }

    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const file = files?.["poster"]?.[0] ?? (req.file as Express.Multer.File | undefined);
    if (!file) {
        res.status(400).json({ success: false, message: "Aucune image fournie." });
        return;
    }

    try {
        const film = await getFilmById(id);
        if (!film) {
            res.status(404).json({ success: false, message: "Film introuvable." });
            return;
        }

        const sanitize = (name: string): string =>
            name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");

        const dossierNum = film.dossier_num as string;
        const filename = `${dossierNum}/poster-${sanitize(file.originalname)}`;
        const url = await uploadFileToS3(file.buffer, filename, file.mimetype, true);

        await updatePosterImg(id, url);
        res.json({ success: true, poster_img: url });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'upload de l'affiche.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
