import React from "react";
import type { AdminUser } from "../types";

interface ParticipationChartProps {
    users: AdminUser[];
}

const R = 44;
const STROKE = 5;
const CX = 50;
const CY = 50;
const CIRC = 2 * Math.PI * R;

function getRingColor(pct: number): string {
    if (pct >= 80) return "#4EFFCE";
    if (pct >= 50) return "#F5E642";
    return "#FF6B6B";
}

function getTextColor(pct: number): string {
    if (pct >= 80) return "text-aurora";
    if (pct >= 50) return "text-solar";
    return "text-coral";
}

function getStatusLabel(pct: number, voted: number, total: number): string {
    if (total === 0) return "—";
    if (pct === 100) return "Complet";
    if (voted === 0) return "Pas commencé";
    return `${pct}%`;
}

const RingCard = ({ user }: { user: AdminUser }): React.JSX.Element => {
    const voted = user.films_evaluated;
    const total = user.films_assigned;
    const pct = total > 0 ? Math.round((voted / total) * 100) : 0;
    const color = getRingColor(pct);
    const done = (pct / 100) * CIRC;
    const left = CIRC - done;
    const glowId = `glow-${user.id}`;

    return (
        <div className="group flex min-w-[120px] flex-1 flex-col items-center gap-1.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-4 transition-all duration-150 hover:border-white/[0.10] hover:bg-white/[0.04]">
            {/* Ring + avatar */}
            <div className="relative h-[90px] w-[90px]">
                <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {/* Track */}
                    <circle
                        cx={CX}
                        cy={CY}
                        r={R}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={STROKE}
                    />
                    {/* Progress arc */}
                    {pct > 0 && (
                        <circle
                            cx={CX}
                            cy={CY}
                            r={R}
                            fill="none"
                            stroke={color}
                            strokeWidth={STROKE}
                            strokeDasharray={`${done} ${left}`}
                            strokeDashoffset={CIRC / 4}
                            strokeLinecap="round"
                            filter={`url(#${glowId})`}
                        />
                    )}
                </svg>

                {/* Avatar */}
                {user.profil_picture ? (
                    <img
                        src={user.profil_picture}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="absolute rounded-full object-cover"
                        style={{
                            inset: 10,
                            width: "calc(100% - 20px)",
                            height: "calc(100% - 20px)",
                        }}
                    />
                ) : (
                    <div
                        className="absolute flex items-center justify-center rounded-full bg-white/[0.06] font-display text-[0.75rem] font-black text-white/60"
                        style={{
                            inset: 10,
                            width: "calc(100% - 20px)",
                            height: "calc(100% - 20px)",
                        }}
                    >
                        {user.first_name[0]}
                        {user.last_name[0]}
                    </div>
                )}

                {/* % badge */}
                <div
                    className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 rounded-full border border-white/[0.10] bg-surface px-1.5 py-[1px] font-mono text-[0.58rem] font-bold whitespace-nowrap"
                    style={{ color }}
                >
                    {total > 0 ? `${pct}%` : "—"}
                </div>
            </div>

            {/* Name */}
            <div className="mt-2 text-center text-[0.78rem] font-bold text-white-soft">
                {user.first_name} {user.last_name}
            </div>

            {/* Description */}
            {user.jury_description && (
                <div className="text-center text-[0.65rem] text-mist opacity-70">
                    {user.jury_description}
                </div>
            )}

            {/* Status */}
            <div className={`text-[0.7rem] font-bold ${getTextColor(pct)}`}>
                {getStatusLabel(pct, voted, total)}
            </div>

            {/* Count */}
            <div className="font-mono text-[0.62rem] text-mist">
                {voted} / {total} films
            </div>
        </div>
    );
};

const ParticipationChart = ({ users }: ParticipationChartProps): React.JSX.Element => {
    const juryUsers = users.filter((u) => u.role === "jury" && u.is_active);

    return (
        <div className="mb-6 rounded-xl border border-white/[0.05] bg-surface-2 p-5">
            <div className="mb-5 flex items-start justify-between">
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
                <div className="flex flex-wrap gap-4">
                    {juryUsers.map((u) => (
                        <RingCard key={u.id} user={u} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParticipationChart;
