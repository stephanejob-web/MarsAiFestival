import React from "react";
import { NavLink } from "react-router-dom";
import { ADMIN_NAV_LINKS, ADMIN_LABELS } from "../constants";
import type { AdminNavCategory, AdminNavItem } from "../types";

const AdminSidePanel = (): React.JSX.Element => {
    return (
        <div className="flex h-full flex-col bg-surface overflow-hidden">
            {/* Logo */}
            <div className="border-b border-white/[0.05] px-[18px] py-5">
                <div className="font-display text-[1rem] font-extrabold tracking-[-0.02em] text-white-soft">
                    mars<span className="text-aurora">AI</span>
                </div>
                <div className="mt-0.5 text-[0.65rem] uppercase tracking-[0.08em] text-mist">
                    {ADMIN_LABELS.SUBTITLE}
                </div>
            </div>

            {/* Admin identity */}
            <div className="flex items-center gap-2.5 border-b border-white/[0.05] px-[18px] py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-solar to-aurora text-[0.75rem] font-black text-deep-sky">
                    AD
                </div>
                <div>
                    <div className="text-[0.82rem] font-semibold text-white-soft">
                        {ADMIN_LABELS.ADMIN_NAME}
                    </div>
                    <div className="mt-px text-[0.67rem] font-semibold uppercase tracking-[0.04em] text-aurora">
                        {ADMIN_LABELS.ADMIN_ROLE}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-[10px] py-3">
                {ADMIN_NAV_LINKS.map((category: AdminNavCategory) => (
                    <div key={category.category} className="mb-1">
                        <div className="px-2 pb-1.5 pt-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-mist opacity-55">
                            {category.category}
                        </div>
                        <ul>
                            {category.items.map((item: AdminNavItem) => (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        end={item.to === "/admin"}
                                        className={({ isActive }): string =>
                                            `mb-px flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.82rem] transition-all ${
                                                isActive
                                                    ? "bg-aurora/10 text-aurora"
                                                    : "text-mist hover:bg-white/[0.04] hover:text-white-soft"
                                            }`
                                        }
                                    >
                                        <span className="w-[17px] shrink-0 text-center">
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                        {item.count !== undefined && (
                                            <span className="ml-auto rounded-full bg-white/[0.06] px-[7px] py-0.5 font-mono text-[0.65rem] font-semibold text-mist">
                                                {item.count}
                                            </span>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Logout */}
            <div className="border-t border-white/[0.05] p-3">
                <button
                    type="button"
                    aria-label={ADMIN_LABELS.LOGOUT}
                    className="w-full rounded-lg px-3 py-2 text-left text-[0.82rem] text-coral/80 transition-all hover:bg-coral/[0.08] hover:text-coral"
                >
                    🔒 {ADMIN_LABELS.LOGOUT}
                </button>
            </div>
        </div>
    );
};

export default AdminSidePanel;
