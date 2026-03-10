import type { FormDepotErrors } from "../types";

export const getInputClass = (field: string, errors: FormDepotErrors): string => {
    const base =
        "w-full bg-white/4 border-[1.5px] rounded-[10px] px-3.5 py-3 font-body text-sm text-white-soft outline-none transition-all duration-200 placeholder:text-mist/45";
    const focus =
        "focus:border-aurora/45 focus:shadow-[0_0_0_3px_rgba(78,255,206,0.08)] focus:bg-aurora/2";
    const err = errors[field] ? "border-coral/50" : "border-white/9";
    return `${base} ${focus} ${err}`;
};
