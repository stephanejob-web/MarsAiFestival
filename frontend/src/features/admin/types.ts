export interface AdminNavItem {
    label: string;
    to: string;
    indicator: string;
}

export interface AdminNavCategory {
    category: string;
    items: AdminNavItem[];
}

export interface AdminUsersStatsData {
    adminCount: number;
    moderatorCount: number;
    deactivatedCount: number;
    totalCreatedCount: number;
}
