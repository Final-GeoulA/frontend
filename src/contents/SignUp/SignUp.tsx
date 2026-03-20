// src/contents/Auth/SignUp.tsx
import React, { Component, ReactElement, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
interface UserForm {
	user_id: string,
	user_grade_id?: string,
	email: string,
	password: string,
	passwordConfirm: string,
	nickname: string,
	age: string,
	skin_type: string,
	user_coin?: string,
	gender: string,
}
const TEAL = "#5BC8BF";

const SignUp: React.FC = () => {
	const [form, setForm] = useState<UserForm>({
		user_id: '',
		email: '',
		password: '',
		passwordConfirm: '',
		nickname: '',
		age: '',
		skin_type: '',
		gender: '',
	});
	// 
	const [code, setCode] = useState('');
	const [emailMessage, setEmailMessage] = useState('');
	// const [idMessage, setIdMessage] = useState('');
	const [isEmailVerified, setIsEmailVerified] = useState(false);
	const navigate = useNavigate();

	// const [authCode, setAuthCode] = useState("");
	// const [password, setPassword] = useState("");
	// const [passwordConfirm, setPasswordConfirm] = useState("");
	// const [nickname, setNickname] = useState("");
	const [gender, setGender] = useState("");
	const [age, setAge] = useState("20대");
	const [skinType, setSkinType] = useState("복합성");
	const [showPw, setShowPw] = useState(false);
	const [showPwConfirm, setShowPwConfirm] = useState(false);

	const ageOptions = ["10대 이하", "20대", "30대", "40대", "50대", "60대 이상"];
	const skinOptions = ["지성", "건성", "복합성", "민감성", "잘 모르겠어요"];


	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};
	const emailCheck = async () => {
		try {
			const res = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/emailCheck`, { email: form.email });
			if (res.data === 0) {
				alert('사용 가능한 이메일 입니다.')
				alert('인증번호가 발송되었습니다.');
				setEmailMessage('인증번호가 발송되었습니다.');
				setIsEmailVerified(false);
			} else {
				setEmailMessage('이미 사용 중인 이메일입니다.');
			}
		} catch (err) {
			alert('이메일 인증중 오류 발생');
			console.error(err)
		}
	}
	const checkEmailCode = async () => {
		try {
			const res = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/emailCheck/certification`, {
				email: form.email, code: code
			});
			const result = res.data;
			if (result.success) {
				alert('이메일 인증 성공!');
				setIsEmailVerified(true);
			} else {
				if (result.reason === 'exceeded') {
					alert('3회 이상 인증번호를 틀려 더 이상 시도할 수 없습니다. \n다시 인증번호를 요청하세요');
				} else if (result.reason === 'expired') {
					alert('인증번호 유효시간이 만료되었습니다.\n다시 인증번호를 요청하세요.');
				} else if (result.reason === 'wrong') {
					alert('인증번호가 일치하지 않습니다.');
				}
			}
		} catch (err) {
			alert('인증번호 확인 오류');
			console.error(err);
		}
	}
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isEmailVerified === false) {
			alert('이메일 인증을 먼저하세요');
			return;
		}
		try {
			await axios.post(`${process.env.REACT_APP_BACK_END_URL}/user/signup`,
			{
			'email':form.email,
			'password': form.password,
			'age':form.age,
			'nickname':form.nickname,
			'skin_type': form.skin_type,
			'gender':form.gender
			},
			{
				headers:{"Content-Type": "application/json"}
			}
		)			
			alert("회원가입 완료")
			navigate('/')
		} catch (error) {
			console.error(error)
		}

	}
	// 	const idCheck = async () => {
	//     try {
	//       //기존 아이디와 겹치지 않는지 코드 코드 확인
	//       const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/user/idCheck?email=${form.email}`);
	//       if (res.data === 0) {
	//         alert("사용 가능한 이메일입니다.");
	//         setEmailMessage("사용 가능한 이메일입니다.");
	//       } else {
	//         setEmailMessage("이미 사용중인 이메일입니다.");
	//       }
	//     } catch (err) {
	//       alert("이메일 중복 확인 실패");
	//       console.error(err);
	//     }
	//   };


	return (
		<div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
			{/* Main */}
			<div style={{ display: "flex", justifyContent: "center", padding: "48px 16px" }}>
				<div style={{
					background: "#fff", borderRadius: 16, padding: "48px 52px",
					width: "100%", maxWidth: 680,
					boxShadow: "4px 4px 24px rgba(0,0,0,0.08), -2px -2px 12px rgba(0,0,0,0.04)"
				}}>
					<h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", marginBottom: 32, letterSpacing: "-0.5px" }}>회원가입</h1>

					{/* 이메일 */}
					<Field label="이메일">
						<div style={{ display: "flex", gap: 8 }}>
							<input
								type="email"
								name="email"
								onChange={handleChange}
								placeholder="이메일을 입력하세요"
								style={{
									flex: 1, padding: "13px 16px", fontSize: 15,
									border: `1.5px solid ${TEAL}`,
									borderRadius: 10, outline: "none", color: "#333",
									background: "#fff", height: 48, boxSizing: "border-box"
								}}
							/>
							<OutlineButton onClick={emailCheck}>중복 확인</OutlineButton>
						</div>
					</Field>

					{/* 인증 코드 */}
					<Field label="인증 코드">
						<div style={{ display: "flex", gap: 8 }}>
							<input
								onChange={e => setCode(e.target.value)}
								placeholder="Enter your Authentication code"
								style={{
									flex: 1, padding: "13px 16px", fontSize: 15,
									border: `1.5px solid "#e0e0e0"`,
									borderRadius: 10, outline: "none", color: "#333",
									background: "#fff", height: 48, boxSizing: "border-box"
								}}
							/>
							<OutlineButton onClick={checkEmailCode}>인증하기</OutlineButton>
						</div>
					</Field>

					{/* 비밀번호 */}
					<Field label="비밀번호">
						<PasswordInput value={form.password} onChange={((val: string) => setForm({ ...form, password: val })) as any} show={showPw} onToggle={() => setShowPw(!showPw)} />
					</Field>

					{/* 비밀번호 확인 */}
					<Field label="비밀번호 확인">
						<PasswordInput value={form.passwordConfirm} onChange={((val: string) => setForm({ ...form, passwordConfirm: val })) as any} show={showPwConfirm} onToggle={() => setShowPwConfirm(!showPwConfirm)} />
					</Field>

					{/* 닉네임 */}
					<Field label="닉네임">
						<input
							name="nickname"
							onChange={handleChange}
							placeholder="Enter your Nickname"
							style={{ ...inputStyle(false), width: "100%", boxSizing: "border-box" }}
						/>
					</Field>

					{/* 성별 */}
					<Field label="성별">
						<div style={{ display: "flex", gap: 24 }}>
							{["여성", "남성"].map(g => (
								<label
									key={g}
									// label 전체에 onClick을 걸면 글자를 눌러도 체크됩니다 (UX 향상)
									onClick={() => setForm({ ...form, gender: g })}
									style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 15, color: "#333" }}
								>
									<div
										style={{
											width: 20, height: 20, borderRadius: "50%",
											// 선택된 항목만 테두리 색상을 TEAL로 변경
											border: `2px solid ${form.gender === g ? TEAL : "#ccc"}`,
											display: "flex", alignItems: "center", justifyContent: "center",
											flexShrink: 0
										}}
									>
										{/* 선택된 항목일 때만 내부 점(Dot)을 보여줌 */}
										{form.gender === g && (
											<div style={{ width: 10, height: 10, borderRadius: "50%", background: TEAL }} />
										)}
									</div>
									{g}
								</label>
							))}
						</div>
					</Field>

					{/* 연령대 */}
					<Field label="연령대" sub="연령대 평균 피부 분석에 사용됩니다.">
						<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
							{ageOptions.map(a => (
								<Chip key={a} label={a} selected={form.age === a} onClick={() => setForm({...form,age:a})} />
							))}
						</div>
					</Field>

					{/* 피부 타입 */}
					<Field label="피부 타입" sub="피부 유형을 고려한 평균 분석에 사용됩니다.">
						<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
							{skinOptions.map(s => (
								<Chip key={s} label={s} selected={form.skin_type === s} onClick={() => setForm({...form,skin_type:s})} />
							))}
						</div>
					</Field>

					{/* 회원가입 버튼 */}
					<form onSubmit={handleSubmit}>
					<button type="submit"  style={{
						width: "100%", padding: "15px", background: TEAL,
						color: "#fff", border: "none", borderRadius: 10,
						fontSize: 16, fontWeight: 700, cursor: "pointer",
						marginTop: 8, marginBottom: 20, letterSpacing: "0.5px"
					}}>
						회원가입
					</button>
					</form>
					

					<p style={{ textAlign: "center", fontSize: 14, color: "#888", margin: 0 }}>
						이미 계정이 있으신가요?{" "}
						<span style={{ color: TEAL, fontWeight: 700, cursor: "pointer" }}>로그인</span>
					</p>
				</div>
			</div>
		</div>
	);
};
export default SignUp;

function Field({ label, sub, children }: { label: string, sub?: string, children: ReactElement }) {
	return (
		<div style={{ marginBottom: 20 }}>
			<label style={{ fontSize: 14, fontWeight: 600, color: "#333", display: "block", marginBottom: sub ? 4 : 8 }}>{label}</label>
			{sub && <p style={{ fontSize: 12, color: "#999", margin: "0 0 8px" }}>{sub}</p>}
			{children}
		</div>
	);
}

function PasswordInput({ value, onChange, show, onToggle }: { value: string, onChange: React.Dispatch<React.SetStateAction<string>>, show: boolean, onToggle: () => void }) {
	return (
		<div style={{ position: "relative" }}>
			<input
				type={show ? "text" : "password"}
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder="Enter your password"
				style={{ ...inputStyle(false), width: "100%", boxSizing: "border-box", paddingRight: 48 }}
			/>
			<button onClick={onToggle} style={{
				position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
				background: "none", border: "none", cursor: "pointer", padding: 0, color: "#aaa",
				display: "flex", alignItems: "center"
			}}>
				{show ? <EyeOffIcon /> : <EyeIcon />}
			</button>
		</div>
	);
}

function OutlineButton({ children, onClick }: { children: any, onClick?: any }) {
	return (
		<button
			onClick={onClick}
			style={{
				flexShrink: 0, padding: "0 16px", height: 48,
				border: `1.5px solid ${TEAL}`, borderRadius: 10,
				background: "#fff", color: TEAL, fontSize: 14,
				fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
			}}
		>
			{children}
		</button>
	);
}

function Chip({ label, selected, onClick }: { label: any, selected: any, onClick: any }) {
	return (
		<button
			onClick={onClick}
			style={{
				padding: "7px 16px", borderRadius: 20,
				border: `1.5px solid ${selected ? TEAL : "#ddd"}`,
				background: selected ? "#e8f8f7" : "#fff",
				color: selected ? TEAL : "#555",
				fontSize: 14, fontWeight: selected ? 600 : 400,
				cursor: "pointer"
			}}
		>
			{label}
		</button>
	);
}

function inputStyle(active: boolean) {
	return {
		flex: 1, padding: "13px 16px", fontSize: 15,
		border: `1.5px solid ${active ? TEAL : "#e0e0e0"}`,
		borderRadius: 10, outline: "none", color: "#333",
		background: "#fff", height: 48, boxSizing: "border-box"
	};
}

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

