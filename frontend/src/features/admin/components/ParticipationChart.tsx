import React from "react";
import type { AdminUser } from "../types";

interface ParticipationChartProps {
    users: AdminUser[];
}

const getBarColor = (pct: number): string => {
    if (pct >= 80) return "bg-aurora";
    if (pct >= 50) return "bg-solar";
    return "bg-coral";
};

const ParticipationChart = ({ users }: ParticipationChartProps): React.JSX.Element => {
    const juryUsers = users.filter((u) => u.role === "jury" && u.is_active);

    return (
        <div className="mb-6 rounded-xl border border-white/[0.05] bg-surface-2 p-5">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <div className="font-display text-[0.88rem] font-bold text-white-soft">
                        Participation des jurés
                    </div>
                    <div className="mt-0.5 text-[0.72rem] text-mist">
                        Films évalués vs non évalués par chaque membre du jury
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[0.65rem] text-mist">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-aurora" />≥ 80%
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-solar" />≥ 50%
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-coral" />
                        &lt; 50%
                    </span>
                </div>
            </div>

            {juryUsers.length === 0 ? (
                <div className="py-4 text-center text-[0.82rem] text-mist">Aucun juré actif</div>
            ) : (
                <div className="space-y-3">
                    {juryUsers.map((u) => {
                        const pct =
                            u.films_assigned > 0
                                ? Math.round((u.films_evaluated / u.films_assigned) * 100)
                                : 0;
                        return (
                            <div key={u.id}>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <span className="text-[0.82rem] text-white-soft">
                                        {u.first_name} {u.last_name}
                                    </span>
                                    <span className="font-mono text-[0.72rem] text-mist">
                                        {u.films_evaluated} / {u.films_assigned}
                                    </span>
                                </div>
                                <div className="h-[5px] overflow-hidden rounded-full bg-white/[0.06]">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${getBarColor(pct)}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ParticipationChart;
