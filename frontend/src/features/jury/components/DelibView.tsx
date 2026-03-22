import React from "react";
import { Lock } from "lucide-react";

const DelibView = (): React.JSX.Element => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <Lock size={24} className="text-mist/50" />
            </div>
            <div className="text-center">
                <p className="text-[0.95rem] font-semibold text-white-soft/70">
                    Délibération verrouillée
                </p>
                <p className="mt-1 text-[0.78rem] text-mist/50">
                    Cette phase sera activée par l&apos;administrateur
                </p>
            </div>
        </div>
    );
};

export default DelibView;
