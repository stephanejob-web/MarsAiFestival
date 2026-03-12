import { useState, useCallback } from "react";
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
    subtitleFR: File | null;
    subtitleEN: File | null;
    rgpdChecked: boolean[];
    submissionState: SubmissionState;
    dossierNum: string;
    otpEmail: string;
    youtubeWarning: string;

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

const useFormDepot = (): UseFormDepotReturn => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [maxUnlocked, setMaxUnlocked] = useState<number>(1);
    const [formData, setFormData] = useState<FormDepotData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<FormDepotErrors>({});
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoDuration, setVideoDuration] = useState<number | null>(null);
    const [videoValid, setVideoValid] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [subtitleFR, setSubtitleFR] = useState<File | null>(null);
    const [subtitleEN, setSubtitleEN] = useState<File | null>(null);
    const [rgpdChecked, setRgpdChecked] = useState<boolean[]>([false, false, false]);
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

            if (step === 1) {
                if (!formData.prenom.trim()) newErrors.prenom = "Champ requis";
                if (!formData.nom.trim()) newErrors.nom = "Champ requis";
                if (!formData.dob) newErrors.dob = "Champ requis";
                else if (!validateAge(formData.dob))
                    newErrors.dob = "Vous devez avoir 18 ans révolus à la date de dépôt";
                if (!formData.metier.trim()) newErrors.metier = "Champ requis";
                if (!formData.email.trim()) newErrors.email = "Champ requis";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                    newErrors.email =
                        "Adresse email invalide — vérifiez le format (ex : vous@domaine.com)";
                if (!formData.mobile.trim()) newErrors.mobile = "Numéro de mobile requis";
                if (!formData.rue.trim()) newErrors.rue = "Champ requis";
                if (!formData.cp.trim()) newErrors.cp = "Champ requis";
                if (!formData.ville.trim()) newErrors.ville = "Champ requis";
                if (!formData.pays) newErrors.pays = "Sélectionnez votre pays";
            }

            if (step === 2) {
                if (!formData.titre.trim()) newErrors.titre = "Champ requis";
                if (!formData.titreEn.trim()) newErrors.titreEn = "Champ requis";
                if (!formData.langue) newErrors.langue = "Sélectionnez la langue du film";
                if (!formData.synopsis.trim()) newErrors.synopsis = "Champ requis";
                if (!formData.synopsisEn.trim()) newErrors.synopsisEn = "English synopsis required";
                if (!videoFile) newErrors.video = "Fichier vidéo requis";
                if (!formData.intention.trim())
                    newErrors.intention = "La note d'intention est requise";
                if (!formData.outils.trim()) newErrors.outils = "Les outils utilisés sont requis";
            }

            if (step === 3) {
                if (!formData.iaImg.trim()) newErrors.iaImg = "Champ requis";
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        },
        [formData, videoFile, subtitleFR, subtitleEN, validateAge],
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

    const confirmVerification = useCallback(async (email: string): Promise<void> => {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, String(value));
        });
        if (videoFile) data.append("video", videoFile);
        if (subtitleFR) data.append("subtitleFR", subtitleFR);
        if (subtitleEN) data.append("subtitleEN", subtitleEN);

        const result = await apiFetchForm<{ dossierNum: string; youtubeWarning?: string }>("/api/films", data);
        setOtpEmail(email);
        setDossierNum(result.dossierNum);
        if (result.youtubeWarning) setYoutubeWarning(result.youtubeWarning);
        setSubmissionState("success");
    }, [formData, videoFile, subtitleFR, subtitleEN]);

    return {
        currentStep,
        maxUnlocked,
        formData,
        errors,
        videoFile,
        videoDuration,
        videoValid,
        uploadProgress,
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
