import { useState, useCallback } from "react";
import type { FormDepotData, FormDepotErrors, SubmissionState } from "../types";
import { INITIAL_FORM_DATA, VIDEO_MIN_DURATION, VIDEO_MAX_DURATION } from "../constants";

interface UseFormDepotReturn {
    currentStep: number;
    maxUnlocked: number;
    formData: FormDepotData;
    errors: FormDepotErrors;
    videoFile: File | null;
    videoValid: boolean;
    uploadProgress: number;
    subtitleFR: File | null;
    subtitleEN: File | null;
    rgpdChecked: boolean[];
    submissionState: SubmissionState;
    dossierNum: string;
    setCurrentStep: (step: number) => void;
    goToStep: (step: number) => void;
    nextStep: () => boolean;
    prevStep: () => void;
    updateField: (field: keyof FormDepotData, value: string | boolean) => void;
    setVideoFile: (file: File | null) => void;
    setVideoValid: (valid: boolean) => void;
    setUploadProgress: (progress: number) => void;
    setSubtitleFR: (file: File | null) => void;
    setSubtitleEN: (file: File | null) => void;
    toggleRgpd: (index: number) => void;
    submitForm: () => void;
    verifyOtp: (code: string) => boolean;
    confirmVerification: () => void;
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
    const [videoValid, setVideoValid] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [subtitleFR, setSubtitleFR] = useState<File | null>(null);
    const [subtitleEN, setSubtitleEN] = useState<File | null>(null);
    const [rgpdChecked, setRgpdChecked] = useState<boolean[]>([false, false, false]);
    const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
    const [dossierNum, setDossierNum] = useState<string>("");

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
                if (!subtitleFR) newErrors.subtitleFR = "Sous-titres français requis";
                if (!subtitleEN) newErrors.subtitleEN = "Sous-titres anglais requis";
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
        setVideoValid(false);
        setUploadProgress(0);
    }, []);

    const submitForm = useCallback((): void => {
        if (!rgpdChecked.every(Boolean)) return;
        if (!validateStep(4)) return;

        setSubmissionState("submitting");
        const num = "MAI-2026-" + String(Math.floor(Math.random() * 90000) + 10000);
        setDossierNum(num);

        setTimeout(() => {
            setSubmissionState("verifying");
        }, 1500);
    }, [rgpdChecked, validateStep]);

    const verifyOtp = useCallback((code: string): boolean => {
        return code === "123456";
    }, []);

    const confirmVerification = useCallback((): void => {
        setSubmissionState("success");
    }, []);

    return {
        currentStep,
        maxUnlocked,
        formData,
        errors,
        videoFile,
        videoValid,
        uploadProgress,
        subtitleFR,
        subtitleEN,
        rgpdChecked,
        submissionState,
        dossierNum,
        setCurrentStep,
        goToStep,
        nextStep,
        prevStep,
        updateField,
        setVideoFile,
        setVideoValid,
        setUploadProgress,
        setSubtitleFR,
        setSubtitleEN,
        toggleRgpd,
        submitForm,
        verifyOtp,
        confirmVerification,
        validateAge,
        validateStep,
        videoDurationStatus,
        resetVideo,
    };
};

export default useFormDepot;
