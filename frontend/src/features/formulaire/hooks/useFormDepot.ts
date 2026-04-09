import { useState, useCallback, useEffect } from "react";
import type { FormDepotData, FormDepotErrors, SubmissionState } from "../types";
import { INITIAL_FORM_DATA, VIDEO_MIN_DURATION, VIDEO_MAX_DURATION } from "../constants";
import { apiFetchForm, apiFetch } from "../../../services/api";

interface UseFormDepotReturn {
    currentStep: number;
    maxUnlocked: number;
    formData: FormDepotData;
    errors: FormDepotErrors;
    videoFile: File | null;
    videoDuration: number | null;
    videoValid: boolean;
    uploadProgress: number;
    posterFile: File | null;
    setPosterFile: (file: File | null) => void;
    subtitleFR: File | null;
    subtitleEN: File | null;
    rgpdChecked: boolean[];
    submissionState: SubmissionState;
    dossierNum: string;
    otpEmail: string;
    youtubeWarning: string;

    saveConsent: boolean | null;
    hasSavedData: boolean;
    restoreDismissed: boolean;
    acceptSaveConsent: () => void;
    refuseSaveConsent: () => void;
    restoreSavedData: () => void;
    dismissRestore: () => void;

    setCurrentStep: (step: number) => void;
    goToStep: (step: number) => void;
    nextStep: () => boolean;
    prevStep: () => void;
    updateField: (field: keyof FormDepotData, value: string | boolean) => void;
    setVideoFile: (file: File | null) => void;
    setVideoDuration: (duration: number | null) => void;
    setVideoValid: (valid: boolean) => void;
    setUploadProgress: (progress: number) => void;
    setSubtitleFR: (file: File | null) => void;
    setSubtitleEN: (file: File | null) => void;
    toggleRgpd: (index: number) => void;
    submitForm: () => void;
    sendOtp: (email: string) => Promise<void>;
    verifyOtp: (email: string, code: string) => Promise<boolean>;
    confirmVerification: (email: string) => Promise<void>;
    validateAge: (dob: string) => boolean;
    validateStep: (step: number) => boolean;
    videoDurationStatus: (seconds: number) => "ok" | "warn" | "err";
    resetVideo: () => void;
}

const LS_CONSENT_KEY = "marsai_save_consent";
const LS_DATA_KEY = "marsai_realisator_data";

const STEP1_FIELDS: (keyof FormDepotData)[] = [
    "civilite",
    "prenom",
    "nom",
    "dob",
    "metier",
    "email",
    "tel",
    "mobile",
    "rue",
    "cp",
    "ville",
    "pays",
    "youtube",
    "instagram",
    "linkedin",
    "facebook",
    "xtwitter",
    "discovery",
    "newsletter",
];

const readConsent = (): boolean | null => {
    const val = localStorage.getItem(LS_CONSENT_KEY);
    if (val === "true") return true;
    return null;
};

const readSavedData = (): Partial<FormDepotData> | null => {
    try {
        const raw = localStorage.getItem(LS_DATA_KEY);
        return raw ? (JSON.parse(raw) as Partial<FormDepotData>) : null;
    } catch {
        return null;
    }
};

const useFormDepot = (): UseFormDepotReturn => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [maxUnlocked, setMaxUnlocked] = useState<number>(1);
    const [formData, setFormData] = useState<FormDepotData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<FormDepotErrors>({});
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoDuration, setVideoDuration] = useState<number | null>(null);
    const [videoValid, setVideoValid] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [subtitleFR, setSubtitleFR] = useState<File | null>(null);
    const [subtitleEN, setSubtitleEN] = useState<File | null>(null);
    const [rgpdChecked, setRgpdChecked] = useState<boolean[]>([false, false, false]);
    const [saveConsent, setSaveConsent] = useState<boolean | null>(readConsent);
    const [hasSavedData, setHasSavedData] = useState<boolean>(() => readSavedData() !== null);
    const [restoreDismissed, setRestoreDismissed] = useState<boolean>(false);
    const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
    const [dossierNum, setDossierNum] = useState<string>("");
    const [otpEmail, setOtpEmail] = useState<string>("");
    const [youtubeWarning, setYoutubeWarning] = useState<string>("");

    const updateField = useCallback((field: keyof FormDepotData, value: string | boolean): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    // ── LocalStorage : consentement & restauration ────────────────────────────
    const acceptSaveConsent = useCallback((): void => {
        localStorage.setItem(LS_CONSENT_KEY, "true");
        setSaveConsent(true);
    }, []);

    const refuseSaveConsent = useCallback((): void => {
        // Ne pas persister le refus — la bannière réapparaîtra au prochain chargement
        setSaveConsent(false);
    }, []);

    const restoreSavedData = useCallback((): void => {
        const saved = readSavedData();
        if (!saved) return;
        setFormData((prev) => {
            const next = { ...prev };
            STEP1_FIELDS.forEach((field) => {
                if (saved[field] !== undefined) {
                    (next[field] as FormDepotData[typeof field]) = saved[
                        field
                    ] as FormDepotData[typeof field];
                }
            });
            return next;
        });
        setRestoreDismissed(true);
    }, []);

    const dismissRestore = useCallback((): void => {
        setRestoreDismissed(true);
    }, []);

    // Sauvegarde automatique — ne s'exécute que si au moins un champ a été modifié
    // (évite d'écraser les données existantes avec le formulaire vide au montage)
    useEffect(() => {
        if (saveConsent !== true) return;
        const hasData = STEP1_FIELDS.some((field) => formData[field] !== INITIAL_FORM_DATA[field]);
        if (!hasData) return;
        const dataToSave: Partial<FormDepotData> = {};
        STEP1_FIELDS.forEach((field) => {
            (dataToSave[field] as FormDepotData[typeof field]) = formData[field];
        });
        localStorage.setItem(LS_DATA_KEY, JSON.stringify(dataToSave));
        setHasSavedData(true);
    }, [saveConsent, formData]);

    const validateAge = useCallback((dob: string): boolean => {
        if (!dob) return false;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age >= 18;
    }, []);

    const validateStep = useCallback(
        (step: number): boolean => {
            const newErrors: FormDepotErrors = {};

            const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,}$/;
            const phoneRegex = /^[+\d][\d\s()\-.]{5,19}$/;
            const urlOrHandleRegex = /^(https?:\/\/[^\s]+|@[\w.-]{2,}|[\w.-]{2,})$/;

            const countDigits = (s: string): number => (s.match(/\d/g) ?? []).length;

            if (step === 1) {
                if (!formData.prenom.trim()) newErrors.prenom = "Champ requis";
                else if (!nameRegex.test(formData.prenom.trim()))
                    newErrors.prenom = "Prénom invalide (lettres uniquement, 2 caractères minimum)";

                if (!formData.nom.trim()) newErrors.nom = "Champ requis";
                else if (!nameRegex.test(formData.nom.trim()))
                    newErrors.nom = "Nom invalide (lettres uniquement, 2 caractères minimum)";

                if (!formData.dob) newErrors.dob = "Champ requis";
                else if (!validateAge(formData.dob))
                    newErrors.dob = "Vous devez avoir 18 ans révolus à la date de dépôt";

                if (!formData.metier.trim()) newErrors.metier = "Champ requis";
                else if (formData.metier.trim().length < 2)
                    newErrors.metier = "Métier invalide (2 caractères minimum)";

                if (!formData.email.trim()) newErrors.email = "Champ requis";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                    newErrors.email =
                        "Adresse email invalide — vérifiez le format (ex : vous@domaine.com)";

                if (formData.tel.trim()) {
                    if (!phoneRegex.test(formData.tel.trim()) || countDigits(formData.tel) < 7)
                        newErrors.tel = "Numéro de téléphone invalide (ex : +33 1 00 00 00 00)";
                }

                if (!formData.mobile.trim()) newErrors.mobile = "Numéro de mobile requis";
                else if (
                    !phoneRegex.test(formData.mobile.trim()) ||
                    countDigits(formData.mobile) < 7
                )
                    newErrors.mobile = "Numéro de mobile invalide (ex : +33 6 00 00 00 00)";

                if (!formData.rue.trim()) newErrors.rue = "Champ requis";
                else if (formData.rue.trim().length < 3)
                    newErrors.rue = "Adresse invalide (3 caractères minimum)";

                if (!formData.cp.trim()) newErrors.cp = "Champ requis";
                else if (!/^[a-zA-Z0-9\s-]{2,10}$/.test(formData.cp.trim()))
                    newErrors.cp = "Code postal invalide";

                if (!formData.ville.trim()) newErrors.ville = "Champ requis";
                else if (formData.ville.trim().length < 2) newErrors.ville = "Ville invalide";

                if (!formData.pays) newErrors.pays = "Sélectionnez votre pays";

                for (const social of [
                    "youtube",
                    "instagram",
                    "linkedin",
                    "facebook",
                    "xtwitter",
                ] as const) {
                    const val = formData[social].trim();
                    if (val && !urlOrHandleRegex.test(val))
                        newErrors[social] = "Format invalide (ex : @compte ou https://...)";
                }
            }

            if (step === 2) {
                if (!formData.titre.trim()) newErrors.titre = "Champ requis";
                if (!formData.titreEn.trim()) newErrors.titreEn = "Champ requis";
                if (!formData.langue) newErrors.langue = "Sélectionnez la langue du film";
                if (!formData.synopsis.trim()) newErrors.synopsis = "Champ requis";
                if (!formData.synopsisEn.trim()) newErrors.synopsisEn = "English synopsis required";
                if (!posterFile) newErrors.poster = "L'affiche du film est requise";
                if (!videoFile) newErrors.video = "Fichier vidéo requis";
                else if (!videoValid)
                    newErrors.video = "La vidéo dépasse la durée maximale autorisée (2 min 30 s)";
                if (!formData.intention.trim())
                    newErrors.intention = "La note d'intention est requise";
                if (!formData.outils.trim()) newErrors.outils = "Les outils utilisés sont requis";
            }

            if (step === 3) {
                if (!formData.iaImg) newErrors.iaImg = "Champ requis";
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        },
        [formData, posterFile, videoFile, videoValid, validateAge],
    );

    const goToStep = useCallback(
        (step: number): void => {
            if (step <= maxUnlocked) {
                setCurrentStep(step);
            }
        },
        [maxUnlocked],
    );

    const nextStep = useCallback((): boolean => {
        if (currentStep < 4 && validateStep(currentStep)) {
            const next = currentStep + 1;
            setMaxUnlocked((prev) => Math.max(prev, next));
            setCurrentStep(next);
            return true;
        }
        return false;
    }, [currentStep, validateStep]);

    const prevStep = useCallback((): void => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }, [currentStep]);

    const toggleRgpd = useCallback((index: number): void => {
        setRgpdChecked((prev) => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    }, []);

    const videoDurationStatus = useCallback((seconds: number): "ok" | "warn" | "err" => {
        if (seconds >= VIDEO_MIN_DURATION && seconds <= VIDEO_MAX_DURATION) return "ok";
        if (seconds < VIDEO_MIN_DURATION) return "warn";
        return "err";
    }, []);

    const resetVideo = useCallback((): void => {
        setVideoFile(null);
        setVideoDuration(null);
        setVideoValid(false);
        setUploadProgress(0);
    }, []);

    const submitForm = useCallback((): void => {
        if (!rgpdChecked.every(Boolean)) return;

        // eslint-disable-next-line no-console
        console.log("📋 Formulaire soumis :", {
            ...formData,
            video: videoFile
                ? { name: videoFile.name, size: videoFile.size, type: videoFile.type }
                : null,
            subtitleFR: subtitleFR ? { name: subtitleFR.name, size: subtitleFR.size } : null,
            subtitleEN: subtitleEN ? { name: subtitleEN.name, size: subtitleEN.size } : null,
        });

        setSubmissionState("verifying");
    }, [rgpdChecked, formData, videoFile, subtitleFR, subtitleEN]);

    const sendOtp = useCallback(async (email: string): Promise<void> => {
        await apiFetch("/api/otp/send", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    }, []);

    const verifyOtp = useCallback(async (email: string, code: string): Promise<boolean> => {
        try {
            await apiFetch("/api/otp/verify", {
                method: "POST",
                body: JSON.stringify({ email, code }),
            });
            return true;
        } catch {
            return false;
        }
    }, []);

    const confirmVerification = useCallback(
        async (email: string): Promise<void> => {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, String(value));
            });
            if (videoDuration !== null) data.append("duration", String(Math.round(videoDuration)));
            if (posterFile) data.append("poster", posterFile);
            if (videoFile) data.append("video", videoFile);
            if (subtitleFR) data.append("subtitleFR", subtitleFR);
            if (subtitleEN) data.append("subtitleEN", subtitleEN);

            const result = await apiFetchForm<{ dossierNum: string; youtubeWarning?: string }>(
                "/api/films",
                data,
            );
            setOtpEmail(email);
            setDossierNum(result.dossierNum);
            if (result.youtubeWarning) setYoutubeWarning(result.youtubeWarning);
            setSubmissionState("success");
        },
        [formData, videoDuration, posterFile, videoFile, subtitleFR, subtitleEN],
    );

    return {
        currentStep,
        maxUnlocked,
        formData,
        errors,
        saveConsent,
        hasSavedData,
        restoreDismissed,
        acceptSaveConsent,
        refuseSaveConsent,
        restoreSavedData,
        dismissRestore,
        videoFile,
        videoDuration,
        videoValid,
        uploadProgress,
        posterFile,
        setPosterFile,
        subtitleFR,
        subtitleEN,
        rgpdChecked,
        submissionState,
        dossierNum,
        otpEmail,
        youtubeWarning,
        setCurrentStep,
        goToStep,
        nextStep,
        prevStep,
        updateField,
        setVideoFile,
        setVideoDuration,
        setVideoValid,
        setUploadProgress,
        setSubtitleFR,
        setSubtitleEN,
        toggleRgpd,
        submitForm,
        sendOtp,
        verifyOtp,
        confirmVerification,
        validateAge,
        validateStep,
        videoDurationStatus,
        resetVideo,
    };
};

export default useFormDepot;
