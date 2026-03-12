import React from "react";
import { useTranslation } from "react-i18next";

const RulesBlock = (): React.JSX.Element => {
    const { t } = useTranslation();
    const rulesData = t("form.rules.items", { returnObjects: true }) as Record<string, { label: string; value: string }>;
    const rules = Object.values(rulesData);

    return (
        <div className="bg-surface border border-white/5 rounded-xl px-4 py-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-mist mb-3">
                {t("form.rules.title")}
            </h4>
            <div className="flex flex-col gap-2">
                {rules.map((rule) => (
                    <div
                        key={rule.label}
                        className="flex items-start gap-2 text-xs text-mist leading-relaxed"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-aurora shrink-0 mt-1.5" />
                        <span>
                            {rule.label} <strong className="text-white-soft">{rule.value}</strong>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RulesBlock;
