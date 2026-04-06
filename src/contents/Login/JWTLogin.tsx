import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./actions/authActions";
import { useAdminAuth } from "../../components/AdminAuthProvider";
import { useAuth } from "../../components/AuthProvider";

const TEAL = "#5BC8BF";
const TEAL_LIGHT = "#e8f8f7";
const TEAL_BORDER = "#a8e0db";

const JWTLogin: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const { isAdmin, adminName, adminLogin } = useAdminAuth();
    const { member, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAdmin) {
            navigate("/");
        }
    });


    // ---------- 관리자 로그인 (JWT) ----------
    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: JWT 로그인 로직 구현
        const res = login(username, password);
        const token = localStorage.getItem('token')!;
        console.log(res);
        console.log("관리자 로그인 시도:", username, password);
        adminLogin(username, token);
        console.log(`로그인 됨: ${username}, ${token}`);
        if (member !== null) {
            logout();
        }
        alert(`${username} 님, 환영합니다.`)
        navigate("/")
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
            {/* Main */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 64px)", padding: "40px 16px" }}>
                <div style={{
                    background: "#fff", borderRadius: 16, padding: "48px 52px",
                    width: "100%", maxWidth: 480,
                    boxShadow: "4px 4px 24px rgba(0,0,0,0.08), -2px -2px 12px rgba(0,0,0,0.04)"
                }}>

                    {/* 상단 타이틀 영역 */}
                    <div style={{ marginBottom: 32 }}>
                        {/* 1차 얼굴 인증 성공 뱃지/안내 */}
                        <div style={{
                            display: "inline-block", padding: "4px 10px", background: "#e8f8f7",
                            color: TEAL, fontSize: 13, fontWeight: 700, borderRadius: 20, marginBottom: 12
                        }}>
                            ✓ 얼굴 인증 완료
                        </div>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "-0.5px" }}>
                            관리자 로그인
                        </h1>
                        <p style={{ fontSize: 14, color: "#666", marginTop: 8, wordBreak: "keep-all" }}>
                            안전한 접근을 위해 관리자 계정 정보를 입력해주세요.
                        </p>
                    </div>

                    {/* Username (Admin ID) */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 14, fontWeight: 600, color: "#333", display: "block", marginBottom: 8 }}>아이디</label>
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="관리자 아이디를 입력하세요"
                            style={{
                                width: "100%", padding: "14px 16px", fontSize: 15,
                                border: `1.5px solid ${TEAL}`, borderRadius: 10,
                                outline: "none", boxSizing: "border-box", color: "#333",
                                background: "#fff"
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <label style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>비밀번호</label>
                        </div>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPw ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                style={{
                                    width: "100%", padding: "14px 48px 14px 16px", fontSize: 15,
                                    border: "1.5px solid #e0e0e0", borderRadius: 10,
                                    outline: "none", boxSizing: "border-box", color: "#333",
                                    background: "#fff"
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                style={{
                                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                                    background: "none", border: "none", cursor: "pointer", padding: 0,
                                    color: "#aaa", display: "flex", alignItems: "center"
                                }}
                            >
                                {showPw ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button onClick={handleAdminLogin} style={{
                        width: "100%", padding: "16px", background: TEAL,
                        color: "#fff", border: "none", borderRadius: 10,
                        fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: "0.5px",
                        marginBottom: 24, transition: "background 0.2s"
                    }}>
                        로그인
                    </button>

                    {/* 일반 로그인 복귀 링크 */}
                    <div style={{ textAlign: "center" }}>
                        <Link to="/login" style={{ fontSize: 14, color: "#888", textDecoration: "none", fontWeight: 500 }}>
                            일반 로그인으로 돌아가기
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default JWTLogin;

// Icons
function EyeIcon() {
    return (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}