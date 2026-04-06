import React, { createContext, useContext, useEffect, useState } from 'react'

interface AdminAuthContextProps {
    isAdmin: boolean;
    adminToken: string | null;
    adminName: string | null;
    adminLogin: (username: string, token: string) => void;
    adminLogout: () => void;
}

const AdminContext = createContext<AdminAuthContextProps | null>(null);

export const AdminAuthProvider:React.FC<{ children:React.ReactNode }> = ({
    children,
}) => {
    const [adminToken,setAdminToken] = useState<string | null>(null);
    const [adminName,setAdminName] = useState<string | null>(null);
    const [isAdmin,setIsAdmin] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedName = localStorage.getItem("username");
        if (savedToken) {
            setAdminToken(savedToken);
            setAdminName(savedName);
            setIsAdmin(true);
        }
    },[])

    const adminLogin = (username: string, token:string) => {
        localStorage.setItem("token",token);
        localStorage.setItem("username",username);
        setAdminToken(token);
        setAdminName(username);
        setIsAdmin(true);
    };

    const adminLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setAdminToken(null);
        setAdminName(null);
        setIsAdmin(false);
    };

    return (
        <AdminContext.Provider value={{ isAdmin, adminToken, adminName, adminLogin, adminLogout}}>
            { children }
        </AdminContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminContext);
    if (!context)
        throw new Error ("AdminProvider 안에서만 사용해야 합니다.");
    return context;
};