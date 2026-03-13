import React from "react";

interface JuryToastProps {
    message: string | null;
}

const JuryToast = ({ message }: JuryToastProps): React.JSX.Element => {
    return (
        <div
            className={`fixed bottom-20 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-2 rounded-[12px] border border-aurora/25 bg-surface-2 px-[22px] py-3 text-[0.82rem] text-aurora shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 ${
                message !== null
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-5 opacity-0"
            }`}
        >
            <span>✓</span>
            <span>{message ?? ""}</span>
        </div>
    );
};

export default JuryToast;
