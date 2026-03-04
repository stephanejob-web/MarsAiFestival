import type React from "react";
import useDepotForm from "../hooks/useDepotForm";
import FormSidebar from "./FormSidebar";
import SuccessScreen from "./SuccessScreen";
import Step1Profil from "./steps/Step1Profil";
import Step2Film from "./steps/Step2Film";
import Step3IA from "./steps/Step3IA";
import Step4Confirmation from "./steps/Step4Confirmation";

const STEP_NEXT_LABELS: Record<number, string> = {
    1: "Étape suivante — Le Film →",
    2: "Étape suivante — Fiche IA →",
    3: "Étape suivante — Confirmation →",
};

const renderStep = (form: ReturnType<typeof useDepotForm>): React.JSX.Element => {
    switch (form.currentStep) {
        case 1:
            return (
                <Step1Profil
                    data={form.data.step1}
                    errors={form.errors}
                    onChange={form.updateStep1}
                />
            );
        case 2:
            return (
                <Step2Film
                    data={form.data.step2}
                    errors={form.errors}
                    onChange={form.updateStep2}
                />
            );
        case 3:
            return (
                <Step3IA data={form.data.step3} errors={form.errors} onChange={form.updateStep3} />
            );
        case 4:
            return (
                <Step4Confirmation
                    data={form.data}
                    errors={form.errors}
                    onChange={form.updateStep4}
                />
            );
        default:
            return (
                <Step1Profil
                    data={form.data.step1}
                    errors={form.errors}
                    onChange={form.updateStep1}
                />
            );
    }
};

const DepotForm = (): React.JSX.Element => {
    const form = useDepotForm();

    if (form.isSuccess) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
                <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-slate-950/90 backdrop-blur border-b border-white/10">
                    <div className="font-black text-xl tracking-tight">
                        mars
                        <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                            AI
                        </span>
                    </div>
                    <a
                        href="/"
                        className="text-sm text-slate-400 hover:text-slate-100 transition-colors"
                    >
                        ← Retour
                    </a>
                </header>
                <main className="flex-1 flex items-center justify-center">
                    <SuccessScreen response={form.response} />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-slate-950/90 backdrop-blur border-b border-white/10">
                <div className="font-black text-xl tracking-tight">
                    mars
                    <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                        AI
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Brouillon sauvegardé automatiquement
                    </div>
                    <a
                        href="/"
                        className="text-sm text-slate-400 hover:text-slate-100 transition-colors"
                    >
                        ← Retour
                    </a>
                </div>
            </header>

            {/* Page content */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0 max-w-7xl mx-auto w-full px-4 py-8 lg:px-8 lg:gap-10">
                {/* Sidebar */}
                <div className="hidden lg:block">
                    <div className="sticky top-24">
                        <FormSidebar currentStep={form.currentStep} />
                    </div>
                </div>

                {/* Step content */}
                <div className="flex flex-col gap-8">
                    {/* Mobile step indicator */}
                    <div className="flex items-center gap-1.5 lg:hidden">
                        {[1, 2, 3, 4].map((n) => (
                            <div
                                key={n}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                    n <= form.currentStep ? "bg-cyan-400" : "bg-white/10"
                                }`}
                            />
                        ))}
                        <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">
                            {form.currentStep} / 4
                        </span>
                    </div>

                    {/* Step panel */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 lg:p-8">
                        {renderStep(form)}
                    </div>

                    {/* Error on submit */}
                    {form.errors.submit && (
                        <p role="alert" className="text-sm text-red-400 text-center">
                            {form.errors.submit}
                        </p>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between gap-4">
                        {form.currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={form.goPrev}
                                className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 text-slate-400 text-sm font-medium transition-colors hover:border-white/30 hover:text-slate-100"
                            >
                                ← Retour
                            </button>
                        ) : (
                            <div />
                        )}

                        {form.currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={form.goNext}
                                className="inline-flex items-center gap-2 bg-cyan-400 text-slate-950 px-7 py-3 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                            >
                                {STEP_NEXT_LABELS[form.currentStep] ?? "Suivant →"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={form.handleSubmit}
                                disabled={form.isLoading}
                                className="inline-flex items-center gap-2.5 bg-yellow-300 text-slate-950 px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(253,224,71,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                            >
                                {form.isLoading ? (
                                    <>
                                        <span className="w-4 h-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin" />
                                        Envoi en cours…
                                    </>
                                ) : (
                                    "🎬 Soumettre mon film"
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DepotForm;
