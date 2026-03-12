import React from "react";
import "../features/formulaire/formulaire.css";
import useFormDepot from "../features/formulaire/hooks/useFormDepot";
import FormHeader from "../features/formulaire/components/FormHeader";
import FormSidebar from "../features/formulaire/components/FormSidebar";
import Step1Profile from "../features/formulaire/components/Step1Profile";
import Step2Film from "../features/formulaire/components/Step2Film";
import Step3AI from "../features/formulaire/components/Step3AI";
import Step4Confirm from "../features/formulaire/components/Step4Confirm";
import SuccessScreen from "../features/formulaire/components/SuccessScreen";
import VerificationEmail from "../features/formulaire/components/VerificationEmail";

const Formulaire = (): React.JSX.Element => {
    const form = useFormDepot();

    if (form.submissionState === "verifying") {
        return (
            <VerificationEmail
                defaultEmail={form.formData.email}
                onSendOtp={form.sendOtp}
                onVerify={form.verifyOtp}
                onConfirm={form.confirmVerification}
            />
        );
    }

    if (form.submissionState === "success") {
        return (
            <div className="min-h-screen bg-deep-sky text-white-soft">
                <FormHeader />
                <SuccessScreen
                    dossierNum={form.dossierNum}
                    email={form.formData.email}
                    prenom={form.formData.prenom}
                    titre={form.formData.titre}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-deep-sky text-white-soft">
            <FormHeader />

            <div className="max-w-300 mx-auto px-5 py-6 flex gap-8 items-start max-[860px]:flex-col">
                {/* Sidebar */}
                <FormSidebar
                    currentStep={form.currentStep}
                    maxUnlocked={form.maxUnlocked}
                    onGoStep={form.goToStep}
                />

                {/* Main content */}
                <div className="flex-1 min-w-0 bg-white/2.5 border border-white/7 rounded-2xl p-7 max-[860px]:p-5">
                    {form.currentStep === 1 && (
                        <Step1Profile
                            formData={form.formData}
                            errors={form.errors}
                            onChange={form.updateField}
                            onNext={form.nextStep}
                            validateAge={form.validateAge}
                        />
                    )}

                    {form.currentStep === 2 && (
                        <Step2Film
                            formData={form.formData}
                            errors={form.errors}
                            videoFile={form.videoFile}
                            uploadProgress={form.uploadProgress}
                            onChange={form.updateField}
                            onVideoSelect={(file) => form.setVideoFile(file)}
                            onVideoReset={form.resetVideo}
                            setUploadProgress={form.setUploadProgress}
                            setVideoValid={form.setVideoValid}
                            onPrev={form.prevStep}
                            onNext={form.nextStep}
                        />
                    )}

                    {form.currentStep === 3 && (
                        <Step3AI
                            formData={form.formData}
                            errors={form.errors}
                            subtitleFR={form.subtitleFR}
                            subtitleEN={form.subtitleEN}
                            onChange={form.updateField}
                            onSubtitleFR={(file) => form.setSubtitleFR(file)}
                            onSubtitleEN={(file) => form.setSubtitleEN(file)}
                            onPrev={form.prevStep}
                            onNext={form.nextStep}
                        />
                    )}

                    {form.currentStep === 4 && (
                        <Step4Confirm
                            formData={form.formData}
                            videoValid={form.videoValid}
                            subtitleFR={form.subtitleFR}
                            subtitleEN={form.subtitleEN}
                            rgpdChecked={form.rgpdChecked}
                            submissionState={form.submissionState}
                            onToggleRgpd={form.toggleRgpd}
                            onPrev={form.prevStep}
                            onSubmit={form.submitForm}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Formulaire;
