import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider";

const TEAL = "#5BC8BF";
const TEAL_LIGHT = "#e8f8f7";
const TEAL_BORDER = "#a8e0db";

const Login: React.FC = () => {
	const { login, checkLogin } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPw, setShowPw] = useState(false);

	// ---------- 일반 로그인 ----------
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const result = await login(email, password);
			if (result === "success") {
				alert("로그인되었습니다.");
				navigate("/", { replace: true });
			} else {
				alert("아이디/비밀번호 오류");
			}
		} catch (err) {
			console.error("handleLogin error:", err);
			alert("로그인 중 오류가 발생했습니다.");
		}
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
					<h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", marginBottom: 32, letterSpacing: "-0.5px" }}>로그인</h1>

					{/* Email */}
					<div style={{ marginBottom: 20 }}>
						<label style={{ fontSize: 14, fontWeight: 600, color: "#333", display: "block", marginBottom: 8 }}>이메일</label>
						<input
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="이메일을 입력하세요"
							style={{
								width: "100%", padding: "14px 16px", fontSize: 15,
								border: `1.5px solid ${TEAL}`, borderRadius: 10,
								outline: "none", boxSizing: "border-box", color: "#333",
								background: "#fff"
							}}
						/>
					</div>

					{/* Password */}
					<div style={{ marginBottom: 28 }}>
						<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
							<label style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>비밀번호</label>
							<span style={{ fontSize: 14, color: TEAL, cursor: "pointer", fontWeight: 600 }}>Forgot？</span>
						</div>
						<div style={{ position: "relative" }}>
							<input
								type={showPw ? "text" : "password"}
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder="Enter your password"
								style={{
									width: "100%", padding: "14px 48px 14px 16px", fontSize: 15,
									border: "1.5px solid #e0e0e0", borderRadius: 10,
									outline: "none", boxSizing: "border-box", color: "#333",
									background: "#fff"
								}}
							/>
							<button
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

					{/* Button */}
					<div style={{display:'flex', justifyContent:'space-between'}}>
						<button onClick={handleLogin} style={{
							width: "48%", padding: "15px", background: TEAL,
							color: "#fff", border: "none", borderRadius: 10,
							fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: "0.5px",
							marginBottom: 20
						}}>
							로그인
						</button>
						<button style={{
							width: "48%", padding: "15px", background: TEAL,
							color: "#fff", border: "none", borderRadius: 10,
							fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: "0.5px",
							marginBottom: 20
						}}>
							패스워드리스 로그인
						</button>
					</div>
					<p style={{ textAlign: "center", fontSize: 14, color: "#888", margin: 0 }}>
						아직 계정이 없으신가요?{" "}
						<span style={{ color: TEAL, fontWeight: 700, cursor: "pointer" }}>회원가입</span>
					</p>
				</div>
			</div>
		</div>
	);
};
export default Login;

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
