import React from "react";
import { Check, MessageCircle, RotateCcw, Send, X } from "lucide-react";

import type { Decision } from "../types";

interface NotationPanelProps {
    currentDecision: Decision;
    notationComment: string;
    onDecision: (decision: Exclude<Decision, null>) => void;
    onNotationCommentChange: (value: string) => void;
    onPublish: () => void;
}

interface DecisionButtonProps {
    label: React.ReactNode;
    decision: Exclude<Decision, null>;
    isActive: boolean;
    baseClass: string;
    activeClass: string;
    hoverClass: string;
    onClick: (d: Exclude<Decision, null>) => void;
}

const DecisionButton = ({
    label,
    decision,
    isActive,
    baseClass,
    activeClass,
    hoverClass,
    onClick,
}: DecisionButtonProps): React.JSX.Element => {
    return (
        <button
            type="button"
            onClick={() => onClick(decision)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[9px] border font-display text-[0.82rem] font-extrabold transition-all ${baseClass} ${hoverClass} ${isActive ? activeClass : ""} h-10`}
        >
            {label}
        </button>
    );
};

const NotationPanel = ({
    currentDecision,
    notationComment,
    onDecision,
    onNotationCommentChange,
    onPublish,
}: NotationPanelProps): React.JSX.Element => {
    return (
        <div className="border-t border-white/7 bg-surface px-5 py-3 pb-3.5">
            {/* Decision buttons */}
            <div className="mb-2.5 flex gap-2">
                <DecisionButton
                    label={<><Check size={14} /><span>Valider</span></>}
                    decision="valide"
                    isActive={currentDecision === "valide"}
                    baseClass="bg-aurora/10 border-aurora/35 text-aurora"
                    activeClass="bg-aurora text-deep-sky shadow-[0_4px_20px_rgba(78,255,206,0.35)] -translate-y-px"
                    hoverClass="hover:bg-aurora hover:text-deep-sky hover:shadow-[0_4px_20px_rgba(78,255,206,0.35)] hover:-translate-y-px"
                    onClick={onDecision}
                />
                <DecisionButton
                    label={<><RotateCcw size={14} /><span>À revoir</span></>}
                    decision="aRevoir"
                    isActive={currentDecision === "aRevoir"}
                    baseClass="bg-solar/8 border-solar/30 text-solar"
                    activeClass="bg-solar/20 -translate-y-px"
                    hoverClass="hover:bg-solar/20"
                    onClick={onDecision}
                />
                <DecisionButton
                    label={<><X size={14} /><span>Refuser</span></>}
                    decision="refuse"
                    isActive={currentDecision === "refuse"}
                    baseClass="bg-coral/8 border-coral/28 text-coral"
                    activeClass="bg-coral/20 -translate-y-px"
                    hoverClass="hover:bg-coral/20"
                    onClick={onDecision}
                />
                <DecisionButton
                    label={<><MessageCircle size={14} /><span>Discuter</span></>}
                    decision="discuter"
                    isActive={currentDecision === "discuter"}
                    baseClass="bg-lavande/8 border-lavande/28 text-lavande"
                    activeClass="bg-lavande/20 -translate-y-px"
                    hoverClass="hover:bg-lavande/18"
                    onClick={onDecision}
                />
            </div>

            {/* Comment + publish */}
            <div className="flex items-end gap-2.5">
                <div className="flex-1">
                    <div className="mb-1.5 text-[0.65rem] text-mist">
                        Mon commentaire (visible par tout le jury)
                    </div>
                    <textarea
                        value={notationComment}
                        onChange={(e) => onNotationCommentChange(e.target.value)}
                        placeholder="Votre avis sur ce film..."
                        rows={2}
                        className="w-full resize-none rounded-[8px] border border-white/10 bg-white/4 px-3 py-2 font-sans text-[0.82rem] text-white-soft outline-none placeholder:text-mist/50 focus:border-aurora/35 min-h-[60px] max-h-[100px]"
                    />
                </div>
                <button
                    type="button"
                    onClick={onPublish}
                    className="self-end flex items-center gap-1.5 whitespace-nowrap rounded-[9px] bg-aurora px-4 py-2 font-display text-[0.82rem] font-extrabold text-deep-sky transition-opacity hover:opacity-90"
                >
                    <Send size={14} />
                    Publier
                </button>
            </div>
        </div>
    );
};

export default NotationPanel;
