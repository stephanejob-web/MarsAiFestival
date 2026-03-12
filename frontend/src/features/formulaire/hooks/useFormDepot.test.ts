import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import useFormDepot from "./useFormDepot";

describe("useFormDepot", () => {
    it("initialise au step 1 avec les valeurs par défaut", () => {
        const { result } = renderHook(() => useFormDepot());

        expect(result.current.currentStep).toBe(1);
        expect(result.current.maxUnlocked).toBe(1);
        expect(result.current.formData.prenom).toBe("");
        expect(result.current.submissionState).toBe("idle");
        expect(result.current.rgpdChecked).toEqual([false, false, false]);
    });

    it("met à jour un champ et efface l'erreur correspondante", () => {
        const { result } = renderHook(() => useFormDepot());

        act(() => {
            result.current.updateField("prenom", "Alice");
        });

        expect(result.current.formData.prenom).toBe("Alice");
    });

    it("valide l'âge minimum de 18 ans", () => {
        const { result } = renderHook(() => useFormDepot());

        const today = new Date();
        const minor = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
        const adult = new Date(today.getFullYear() - 19, today.getMonth(), today.getDate());

        expect(result.current.validateAge(minor.toISOString().split("T")[0])).toBe(false);
        expect(result.current.validateAge(adult.toISOString().split("T")[0])).toBe(true);
        expect(result.current.validateAge("")).toBe(false);
    });

    it("bloque le passage à l'étape 2 si les champs requis sont vides", () => {
        const { result } = renderHook(() => useFormDepot());

        act(() => {
            result.current.nextStep();
        });

        expect(result.current.currentStep).toBe(1);
        expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    });

    it("avance à l'étape 2 si les champs requis step 1 sont remplis", () => {
        const { result } = renderHook(() => useFormDepot());

        act(() => {
            result.current.updateField("prenom", "Alice");
            result.current.updateField("nom", "Dupont");
            result.current.updateField(
                "dob",
                new Date(new Date().getFullYear() - 25, 0, 1).toISOString().split("T")[0],
            );
            result.current.updateField("metier", "Réalisatrice");
            result.current.updateField("email", "alice@test.com");
            result.current.updateField("mobile", "+33612345678");
            result.current.updateField("rue", "12 rue test");
            result.current.updateField("cp", "13001");
            result.current.updateField("ville", "Marseille");
            result.current.updateField("pays", "FR");
        });

        act(() => {
            result.current.nextStep();
        });

        expect(result.current.currentStep).toBe(2);
        expect(result.current.maxUnlocked).toBe(2);
    });

    it("toggle RGPD correctement", () => {
        const { result } = renderHook(() => useFormDepot());

        act(() => {
            result.current.toggleRgpd(0);
        });

        expect(result.current.rgpdChecked).toEqual([true, false, false]);

        act(() => {
            result.current.toggleRgpd(0);
        });

        expect(result.current.rgpdChecked).toEqual([false, false, false]);
    });

    it("retourne le bon statut de durée vidéo", () => {
        const { result } = renderHook(() => useFormDepot());

        expect(result.current.videoDurationStatus(60)).toBe("ok");
        expect(result.current.videoDurationStatus(1)).toBe("ok");
        expect(result.current.videoDurationStatus(130)).toBe("ok");
        expect(result.current.videoDurationStatus(131)).toBe("err");
        expect(result.current.videoDurationStatus(200)).toBe("err");
    });

    it("goToStep ne permet pas de sauter à un step verrouillé", () => {
        const { result } = renderHook(() => useFormDepot());

        act(() => {
            result.current.goToStep(3);
        });

        expect(result.current.currentStep).toBe(1);
    });

    it("prevStep revient à l'étape précédente", () => {
        const { result } = renderHook(() => useFormDepot());

        act(() => {
            result.current.updateField("prenom", "Alice");
            result.current.updateField("nom", "Dupont");
            result.current.updateField(
                "dob",
                new Date(new Date().getFullYear() - 25, 0, 1).toISOString().split("T")[0],
            );
            result.current.updateField("metier", "Réalisatrice");
            result.current.updateField("email", "alice@test.com");
            result.current.updateField("mobile", "+33612345678");
            result.current.updateField("rue", "12 rue test");
            result.current.updateField("cp", "13001");
            result.current.updateField("ville", "Marseille");
            result.current.updateField("pays", "FR");
        });

        act(() => {
            result.current.nextStep();
        });

        expect(result.current.currentStep).toBe(2);

        act(() => {
            result.current.prevStep();
        });

        expect(result.current.currentStep).toBe(1);
    });

    it("resetVideo remet le fichier vidéo à null", () => {
        const { result } = renderHook(() => useFormDepot());
        const file = new File(["data"], "film.mp4", { type: "video/mp4" });

        act(() => {
            result.current.setVideoFile(file);
            result.current.setVideoValid(true);
            result.current.setUploadProgress(100);
        });

        expect(result.current.videoFile).toBe(file);

        act(() => {
            result.current.resetVideo();
        });

        expect(result.current.videoFile).toBeNull();
        expect(result.current.videoValid).toBe(false);
        expect(result.current.uploadProgress).toBe(0);
    });
});
