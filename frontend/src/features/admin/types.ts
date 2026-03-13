export interface AdminNavItem {
    label: string;
    to: string;
    indicator: string;
}

export interface AdminNavCategory {
    category: string;
    items: AdminNavItem[];
}
