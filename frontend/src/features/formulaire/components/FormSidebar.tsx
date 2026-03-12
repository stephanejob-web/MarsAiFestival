import React from "react";
import { useTranslation } from "react-i18next";
import StepsNav from "./StepsNav";
import RulesBlock from "./RulesBlock";

interface FormSidebarProps {
    currentStep: number;
    maxUnlocked: number;
    onGoStep: (step: number) => void;
}

const FormSidebar = ({
    currentStep,
    maxUnlocked,
    onGoStep,
}: FormSidebarProps): React.JSX.Element => {
    const { t } = useTranslation();

    return (
        <aside className="form-sidebar-sticky sticky top-[88px]">
            <div className="mb-8">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-aurora mb-2">
                    {t("form.sidebar.overline")}
                </div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight leading-tight mb-2.5">
                    {t("form.sidebar.title")}
                </h1>
                <p className="text-sm text-mist leading-relaxed">
                    {t("form.sidebar.theme")}
                </p>
            </div>

            <StepsNav currentStep={currentStep} maxUnlocked={maxUnlocked} onGoStep={onGoStep} />
            <RulesBlock />
        </aside>
    );
};

export default FormSidebar;
