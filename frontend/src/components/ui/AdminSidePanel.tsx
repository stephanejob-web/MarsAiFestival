import React from "react";
import { Link } from "react-router-dom";

const AdminSidePanel = (): React.JSX.Element => {
    return (
        <div className="h-full flex flex-col bg-zinc-900 text-zinc-300 p-6">
            <div className="mb-10 text-center">
                <h1 className="text-xl font-bold text-white tracking-tight">Mars AI Festival</h1>
                <p className="text-xs text-emerald-500 font-medium uppercase tracking-widest mt-1">
                    Hello Admin
                </p>
            </div>

            <nav className="flex-1 space-y-8">
                <div>
                    <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">
                        Contenu Principal
                    </h2>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                to="/admin"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 hover:text-white transition-all group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                                <span>Utilisateurs</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/films"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 hover:text-white transition-all group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-emerald-500 transition-colors" />
                                <span>Assignations films</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/jury"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 hover:text-white transition-all group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-emerald-500 transition-colors" />
                                <span>Phases & Dates</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/realisator"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 hover:text-white transition-all group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-emerald-500 transition-colors" />
                                <span>Selection & Votes</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">
                        Configuration
                    </h2>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                to="/admin/tags"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 hover:text-white transition-all group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-emerald-500 transition-colors" />
                                <span>Awards & Sponsors</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/site"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 hover:text-white transition-all group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-emerald-500 transition-colors" />
                                <span>Administration site</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="pt-6 border-t border-zinc-800">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-red-900/20 hover:text-red-400 transition-all font-medium text-sm">
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidePanel;
