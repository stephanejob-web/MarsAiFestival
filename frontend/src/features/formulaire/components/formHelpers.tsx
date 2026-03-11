import React from "react";
import type { FormDepotErrors } from "../types";

interface FormFieldErrorProps {
    errors: FormDepotErrors;
    field: string;
    className?: string;
}

export const FormFieldError = ({
    errors,
    field,
    className = "",
}: FormFieldErrorProps): React.JSX.Element | null => {
    if (!errors[field]) return null;
    return (
        <div className={`text-[0.72rem] text-coral flex items-center gap-1.5 ${className}`}>
            {errors[field]}
        </div>
    );
};
