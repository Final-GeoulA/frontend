import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
//사용자 정보 타입
interface Member {
    nickname: string;
    email: string;
    num: number;
}
//컨텍스트 타입
interface AuthContextProps {
    member: Member | null;
    checkLogin: () => void;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<'success' | 'fail' | 'error'>;
    logout: () => void;
    updateMemberName: (name: string) => void;
    updateMemberEmail: (email: string) => void;
}
//컨텍스트 생성
const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [member, setMember] = useState<Member | null>(null);
    const checkLogin = async () => {
        //withCredentials:true server와의 session통신
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/login/session`, {
                withCredentials: true
            });
            console.log("세션 응답:", res.data);

            if (res.data?.email) {
                setMember({
                    num: res.data.num,  
                    email: res.data.email,
                    nickname: res.data.nickname
                });
            } else {
                setMember(null);
            }
        } catch (error) {
            setMember(null);
        }
    }
    const login = async (email: string, password: string): Promise<'success' | 'fail' | 'error'> => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/login/dologin`, { email, password }, { withCredentials: true })

            if (res.data === 'success') {

                //로그인 성공 후, 상태정보를 불러오는 메서드를 호출
                await checkLogin();
                return 'success';
            } else {
                return 'fail';
            }
        } catch (error) {
            return 'error'
        }
    }
    const logout = async () => {
        await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/login/dologout`, { withCredentials: true });
        setMember(null);
    }
    //렌더링시 useEffect를 사용해서 초기화
    useEffect(() => { checkLogin(); }, []);

    const updateMemberName = (nickname: string) => {
        setMember(prev => (prev ? { ...prev, nickname } : prev));
    }
    const updateMemberEmail = (email: string) => {
        setMember(prev => (prev ? { ...prev, email } : prev));
    }
    const isLoggedIn = member !== null;
    return (
        <AuthContext.Provider value={{ member, isLoggedIn, checkLogin, login, logout, updateMemberName, updateMemberEmail }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth은 LoginProvider 안에서만 사용해야 합니다.");
    return context;
};



