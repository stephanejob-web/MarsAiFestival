import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const decodeJwt = (token: string): { role?: string } | null => {
    try {
        return JSON.parse(atob(token.split(".")[1])) as { role?: string };
    } catch {
        return null;
    }
};

const ProtectedJuryRoute = (): React.JSX.Element => {
    const token = localStorage.getItem("jury_token");
    const payload = token ? decodeJwt(token) : null;

    if (!payload || !payload.role) {
        return <Navigate to="/jury" replace />;
    }

    return <Outlet />;
};

export default ProtectedJuryRoute;
