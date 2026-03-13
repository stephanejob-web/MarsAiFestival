import { Link } from "react-router-dom";
import { ADMIN_NAV_LINKS, ADMIN_LABELS } from "../constants";
import type { AdminNavCategory, AdminNavItem } from "../types";

const AdminSidePanel = (): React.JSX.Element => {
    return (
        <div className="h-full flex flex-col bg-zinc-900 text-zinc-300 p-6 font-primary">
            <div className="mb-10 text-center">
                <h1 className="text-xl font-bold text-white tracking-tight">
                    {ADMIN_LABELS.TITLE}
                </h1>
                <p className="text-xs text-emerald-500 font-medium uppercase tracking-widest mt-1">
                    {ADMIN_LABELS.HELLO_ADMIN}
                </p>
            </div>

            <nav className="flex-1 space-y-8">
                {ADMIN_NAV_LINKS.map((category: AdminNavCategory) => (
                    <div key={category.category}>
                        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">
                            {category.category}
                        </h2>
                        <ul className="space-y-1">
                            {category.items.map((item: AdminNavItem) => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 hover:text-white transition-all group"
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${item.indicator} group-hover:bg-emerald-500 group-hover:scale-125 transition-all`}
                                        />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="pt-6 border-t border-zinc-800">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-red-900/20 hover:text-red-400 transition-all font-medium text-sm">
                    <span>{ADMIN_LABELS.LOGOUT}</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidePanel;
