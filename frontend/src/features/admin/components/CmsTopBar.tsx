import React from "react";
import { Link } from "react-router-dom";

const CmsTopBar = (): React.JSX.Element => {
    return (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
            <div className="flex items-center gap-2 text-[0.8rem] text-mist">
                <span className="h-2 w-2 shrink-0 rounded-full bg-aurora shadow-[0_0_8px_rgba(78,255,206,0.6)]"></span>
                <span className="text-[0.78rem] font-semibold text-aurora">Site en ligne</span>
                <span className="opacity-30">·</span>
                <span className="font-mono text-[0.75rem] text-mist">marsai.fr</span>
            </div>

            <Link
                to="/"
                target="_blank"
                className="flex items-center gap-1.5 rounded-lg border border-aurora/20 bg-aurora/10 px-3.5 py-1.5 font-display text-[0.78rem] font-bold text-aurora transition-all hover:border-aurora/40 hover:bg-aurora/15"
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
                    <circle cx="7" cy="7" r="2" fill="currentColor" />
                    <path
                        d="M1.5 7h2M10.5 7h2M7 1.5v2M7 10.5v2"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                    />
                </svg>
                Prévisualiser le site ↗
            </Link>
        </div>
    );
};

export default CmsTopBar;
