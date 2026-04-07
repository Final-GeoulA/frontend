import React, { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";

interface AdminAuthContextProps {
    isAdmin: boolean;
    adminToken: string | null;
    adminName: string | null;
    adminRole: string | null;
    adminLogin: (username: string, token: string) => void;
    adminLogout: () => void;
}

interface TokenPayload {
    role: string;
    sub: string;
    exp: number;
    iat: number;
}

const AdminContext = createContext<AdminAuthContextProps | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [adminToken, setAdminToken] = useState<string | null>(null);
    const [adminName, setAdminName] = useState<string | null>(null);
    const [adminRole, setAdminRole] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedName = localStorage.getItem("username");

        if (savedToken) {
            try {
                const decoded = jwtDecode<TokenPayload>(savedToken);
                const role = decoded.role;
                console.log("전체 데이터: ", decoded);
                console.log("권한: ", role);
                localStorage.setItem("role", role);
                setAdminRole(role);
                setAdminToken(savedToken);
                setAdminName(savedName);
                setIsAdmin(true);
            } catch (error) {
                console.log("디코딩 오류: ", error);
            }
        }
    }, [])

    const adminLogin = (username: string, token: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        setAdminToken(token);
        setAdminName(username);
        setIsAdmin(true);
    };

    const adminLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setAdminToken(null);
        setAdminName(null);
        setAdminRole(null);
        setIsAdmin(false);
    };

    return (
        <AdminContext.Provider value={{ isAdmin, adminToken, adminName, adminRole, adminLogin, adminLogout }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminContext);
    if (!context)
        throw new Error("AdminProvider 안에서만 사용해야 합니다.");
    return context;
};