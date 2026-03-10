import React from "react";
import { Link } from "react-router-dom";

const FormHeader = (): React.JSX.Element => {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-12 py-4 bg-deep-sky/95 border-b border-white/5 backdrop-blur-xl">
            <div className="font-display text-base font-extrabold">
                mars<span className="text-aurora">AI</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-mist">
                    <span className="save-dot" />
                    Brouillon sauvegardé automatiquement
                </div>
                <Link to="/" className="text-sm text-mist hover:text-white-soft transition-colors">
                    ← Retour
                </Link>
            </div>
        </header>
    );
};

export default FormHeader;
