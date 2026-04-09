import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";

interface AdminAuthContextProps {
    isAdmin: boolean;
    facePass: boolean;
    adminToken: string | null;
    adminName: string | null;
    adminRole: string | null;
    adminLogin: (username: string, token: string) => void;
    adminLogout: () => void;
    faceValdiate: () => void;
}

interface TokenPayload {
    role: string;
    sub: string;
    exp: number;
    iat: number;
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
    const [adminToken, setAdminToken] = useState<string | null>(() => {
        const token = localStorage.getItem("token");
        if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return token;
    });
    const [adminName, setAdminName] = useState<string | null>(() => localStorage.getItem("username"));
    const [adminRole, setAdminRole] = useState<string | null>(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode<TokenPayload>(token);
                localStorage.setItem("role", decoded.role);
                return decoded.role;
            } catch { return null; }
        }
        return null;
    });
    const [isAdmin, setIsAdmin] = useState<boolean>(() => !!localStorage.getItem("token"));
    const [facePass, setFacePass] = useState(false);

    const adminLogin = (username: string, token: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        try {
            const decoded = jwtDecode<TokenPayload>(token);
            setAdminRole(decoded.role);
            localStorage.setItem("role", decoded.role);
        } catch (error) {
            console.log("디코딩 오류: ", error);
        }
        setAdminToken(token);
        setAdminName(username);
        setIsAdmin(true);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    };

    const faceValdiate = () => {
        setFacePass(true);
    };

    const adminLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setAdminToken(null);
        setAdminName(null);
        setAdminRole(null);
        setIsAdmin(false);
        setFacePass(false);
        delete axios.defaults.headers.common["Authorization"];
    };

    return (
        <AdminContext.Provider value={{ isAdmin, adminToken, adminName, adminRole, facePass, faceValdiate, adminLogin, adminLogout }}>
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