import React, { useState } from "react";
import { X } from "lucide-react";
import type { AdminJuryMember } from "../types";

interface AssignDistributionModalProps {
    juryMembers: AdminJuryMember[];
    totalUnassigned: number;
    isDistributing: boolean;
    onClose: () => void;
    onCustomDistribute: (allocations: { juryId: number; count: number }[]) => Promise<void>;
}

const AVATAR_GRADIENTS = [
    "from-aurora to-lavande",
    "from-coral to-lavande",
    "from-solar to-aurora",
    "from-lavande to-coral",
    "from-aurora to-solar",
    "from-coral to-solar",
];

const AssignDistributionModal = ({
    juryMembers,
    totalUnassigned,
    isDistributing,
    onClose,
    onCustomDistribute,
}: AssignDistributionModalProps): React.JSX.Element => {
    const [allocations, setAllocations] = useState<Record<number, number>>(() => {
        const base = juryMembers.length > 0 ? Math.floor(totalUnassigned / juryMembers.length) : 0;
        return Object.fromEntries(juryMembers.map((j) => [j.id, base]));
    });

    const totalAllocated = Object.values(allocations).reduce((s, v) => s + v, 0);
    const isOverBudget = totalAllocated > totalUnassigned;

    const handleSliderChange = (juryId: number, value: number): void => {
        setAllocations((prev) => ({ ...prev, [juryId]: value }));
    };

    const handleConfirm = async (): Promise<void> => {
        const list = Object.entries(allocations).map(([id, count]) => ({
            juryId: Number(id),
            count,
        }));
        await onCustomDistribute(list);
        onClose();
    };

    const handleEqualize = (): void => {
        const perJury =
            juryMembers.length > 0 ? Math.floor(totalUnassigned / juryMembers.length) : 0;
        setAllocations(Object.fromEntries(juryMembers.map((j) => [j.id, perJury])));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex w-full max-w-lg flex-col rounded-2xl border border-white/10 bg-surface shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
                    <div>
                        <h2 className="font-display text-[1.05rem] font-extrabold text-white-soft">
                            Distribution des films
                        </h2>
                        <p className="mt-0.5 text-[0.75rem] text-mist">
                            {totalUnassigned} film{totalUnassigned !== 1 ? "s" : ""} non-assigné
                            {totalUnassigned !== 1 ? "s" : ""} · {juryMembers.length} juré
                            {juryMembers.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-mist/50 transition-all hover:bg-white/8 hover:text-white-soft"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Jury list */}
                <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
                    {juryMembers.length === 0 ? (
                        <p className="py-6 text-center text-[0.82rem] text-mist">
                            Aucun juré actif disponible.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-5">
                            {juryMembers.map((jury, idx) => (
                                <li key={jury.id} className="flex flex-col gap-2">
                                    {/* Juré identity */}
                                    <div className="flex items-center gap-3">
                                        {jury.profil_picture ? (
                                            <img
                                                src={jury.profil_picture}
                                                alt={`${jury.first_name} ${jury.last_name}`}
                                                className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
                                            />
                                        ) : (
                                            <div
                                                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[0.75rem] font-bold text-deep-sky ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]}`}
                                            >
                                                {jury.first_name[0]}
                                                {jury.last_name[0]}
                                            </div>
                                        )}
                                        <span className="text-[0.88rem] font-semibold text-white-soft">
                                            {jury.first_name} {jury.last_name}
                                        </span>
                                        <span className="ml-auto flex-shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[0.75rem] font-bold tabular-nums text-aurora">
                                            {allocations[jury.id] ?? 0}
                                        </span>
                                    </div>

                                    {/* Slider — positionné sur totalUnassigned, valeur clampée au budget restant */}
                                    <input
                                        type="range"
                                        min={0}
                                        max={totalUnassigned}
                                        value={allocations[jury.id] ?? 0}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const requested = Number(e.target.value);
                                            const remaining = totalUnassigned - totalAllocated;
                                            const clamped = Math.min(
                                                requested,
                                                (allocations[jury.id] ?? 0) + remaining,
                                            );
                                            handleSliderChange(jury.id, clamped);
                                        }}
                                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-aurora"
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
                    {/* Total counter */}
                    <span
                        className={`text-[0.78rem] font-semibold tabular-nums ${isOverBudget ? "text-coral" : "text-aurora"}`}
                    >
                        {totalAllocated} / {totalUnassigned} films a répartir
                        {isOverBudget && " — dépassement"}
                    </span>

                    <div className="flex items-center gap-2">
                        {/* Assign all — kept in corner as requested */}
                        <button
                            type="button"
                            onClick={handleEqualize}
                            disabled={isDistributing || totalUnassigned === 0}
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.75rem] font-semibold text-mist transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white-soft disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            {isDistributing ? "En cours…" : "Assigner équitablement"}
                        </button>

                        {/* Confirm custom distribution */}
                        <button
                            type="button"
                            onClick={() => void handleConfirm()}
                            disabled={isDistributing || isOverBudget || totalAllocated === 0}
                            className="rounded-lg border border-aurora/25 bg-aurora/[0.07] px-3 py-1.5 text-[0.75rem] font-semibold text-aurora transition-all hover:border-aurora/50 hover:bg-aurora/15 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            {isDistributing ? "En cours…" : "Confirmer la distribution"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignDistributionModal;
