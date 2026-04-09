import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TEAL = "#5BC8BF";

const PasswordlessReg: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isWaiting, setIsWaiting] = useState(false); // 승인 대기 상태 여부
    const [showPw, setShowPw] = useState(false);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [qr, setQr] = useState<string | undefined>(undefined); // QR 이미지 URL
    const [waitTime, setWaitTime] = useState<number>(0); // 등록/승인 대기 시간
    const [isJoined, setIsJoined] = useState<boolean>(false); // Passwordless에 등록된 사용자 여부
    const [plStep, setPlStep] = useState<"NONE" | "REGISTER" | "WAIT_APPROVE">("NONE");
    const registerIntervalRef = useRef<number | null>(null); // QR 등록 여부
    const approveIntervalRef = useRef<number | null>(null); // 모바일 승인
    const url = 'http://43.203.153.169/geoulA'
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        return () => {
            stopPolling();
        };
    }, []);

    useEffect(() => {
        if (!email) return;
        const checkJoin = async () => {
            const form = new URLSearchParams();
            form.append("url", "isApUrl");
            form.append("params", `email=${email}&userId=${email}&QRReg=T`);
            const resp = await axios.post(
                `${process.env.REACT_APP_BACK_END_URL}/pwl/passwordlessCallApi`, form,
                { withCredentials: true }
            );
            if (resp?.data?.data?.exist) {
                setIsJoined(true);
            }
        };
        checkJoin();
    }, []);

    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    };

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    useEffect(() => inputRef.current?.focus(), []);

    const joinPasswordless = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            alert("이메일을 입력하세요.");
            inputRef.current?.focus();
            return;
        }
        if (!password) {
            alert("비밀번호를 입력하세요.");
            inputRef.current?.focus();
            return;
        }
        try {
            // 토큰 발급
            const requestData = {
                email: email,
                userId: email,
                password: password
            };

            const tokenResp = await axios.post(
                `${process.env.REACT_APP_BACK_END_URL}/pwl/passwordlessManageCheck`,
                requestData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            // 토큰 발급 여부 조회
            console.log("tokenResp: ", tokenResp.data.result);
            // 서버 result: "OK" 여부 확인
            if (!tokenResp?.data) {
                alert("토큰 응답이 없음");
                return;
            }
            // 오류 검증
            if (tokenResp.data.result !== "OK") {
                alert("토큰 발급 실패: " + JSON.stringify(tokenResp.data));
                return;
            }

            // 토큰 저장
            const serverToken = tokenResp.data.PasswordlessToken;
            console.log("serverToken:", serverToken);

            // joinApUrl 호출 (QR 생성 요청) - token 반드시 포함
            const joinForm = new URLSearchParams();
            joinForm.append("url", "joinApUrl");
            joinForm.append("params", `email=${email}&userId=${email}&token=${serverToken}`);

            const joinResp = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/pwl/passwordlessCallApi`,
                joinForm, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                withCredentials: true,
            });
            console.log("joinResp:", joinResp);

            // 응답 검사: 서버는 result === "OK" 와 data 로 응답함
            if (!joinResp?.data) {
                alert("QR 생성 응답이 없습니다. 콘솔 확인.");
                return;
            }

            const joinResult = joinResp.data.result;
            const joinOk = joinResult === "OK" || joinResult === "ok" || joinResult === true || joinResult === "true";
            const qrData = joinResp.data.data?.qr ?? undefined;
            const terms = Number(joinResp.data.data?.terms ?? joinResp.data.terms ?? 60);
            if (!joinOk) {
                // 상세 원인 보여주기
                alert("QR 생성 실패: " + JSON.stringify(joinResp.data));
                return;
            }

            // 성공: QR 표시 및 폴링 시작
            setQr(qrData);
            setPlStep("REGISTER");
            setWaitTime(terms);
            alert("QR 생성 성공. 모바일 앱으로 스캔하세요.");
            // isApUrl 폴링 (기존 타이머 정리)
            if (registerIntervalRef.current) {
                clearInterval(registerIntervalRef.current);
                registerIntervalRef.current = null;
            }

            let remaining = terms; //폴링용 시간
            registerIntervalRef.current = window.setInterval(async () => { //1초마다 서버에 QR이 등록되었는지 확인
                try {
                    //isApUrl 로 QR등록 여부 확인
                    const isForm = new URLSearchParams();
                    isForm.append("url", "isApUrl");
                    // 서버 코드에서 QRReg=T 체크를 사용하므로 포함
                    isForm.append("params", `email=${email}&userId=${email}&QRReg=T`);

                    const isResp = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/pwl/passwordlessCallApi`,
                        isForm, {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        withCredentials: true,
                    });
                    //OK,true 일때 정상응답이니 등록여부판단
                    if (isResp?.data && (isResp.data.result === "OK" || isResp.data.result === true)) {
                        const exist = !!isResp.data.data?.exist;
                        if (exist) {
                            alert("등록 완료되었습니다.");
                            setQr(undefined); //등록됐으니 qr숨기기
                            setIsJoined(true);
                            if (registerIntervalRef.current) { //폴링 초기화
                                clearInterval(registerIntervalRef.current);
                                registerIntervalRef.current = null;
                            }
                            navigate("/login/pwl");
                            // 등록완료되면 자동으로 모바일요청 --> 승인/취소 가능하게끔
                            return;
                        }
                    } else {
                        console.log("isResp:", isResp);
                    }

                    // 남은 시간 감소 및 만료 처리
                    remaining = remaining - 1;
                    setWaitTime(remaining);
                    if (remaining <= 0) {
                        alert("등록 시간이 만료되었습니다.");
                        setQr(undefined);
                        if (registerIntervalRef.current) {
                            clearInterval(registerIntervalRef.current);
                            registerIntervalRef.current = null;
                        }
                        
                    }
                } catch (err) {
                    //예외 발생시 폴링 초기화 및 QR 숨김
                    console.error("isApUrl polling error:", err);
                    if (registerIntervalRef.current) {
                        clearInterval(registerIntervalRef.current);
                        registerIntervalRef.current = null;
                    }
                    setQr(undefined);
                }
            }, 1000); // 1초간격으로 폴링
        } catch (error) {

        }
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 64px)", padding: "40px 16px" }}>
                <div style={{
                    background: "#fff", borderRadius: 16, padding: "48px 52px",
                    width: "100%", maxWidth: 480,
                    boxShadow: "4px 4px 24px rgba(0,0,0,0.08), -2px -2px 12px rgba(0,0,0,0.04)",
                    textAlign: "center"
                }}>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111", marginBottom: 12, letterSpacing: "-0.5px" }}>
                        패스워드리스 등록
                    </h1>
                    <p style={{ fontSize: 15, color: "#666", marginBottom: 36, wordBreak: "keep-all" }}>
                        비밀번호 없이 스마트폰 앱의 알림을 통해 안전하게 로그인하세요.
                    </p>
                    {plStep === 'NONE' ? (
                        <form onSubmit={joinPasswordless}>
                            {/* Email */}
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <label style={{ fontSize: 14, fontWeight: 600, color: "#333", display: "block", marginBottom: 8 }}>이메일</label>
                                </div>
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

                            <button type="submit" style={{
                                width: "100%", padding: "15px", background: TEAL,
                                color: "#fff", border: "none", borderRadius: 10,
                                fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: "0.5px",
                                marginBottom: 20
                            }}>
                                인증 알림 보내기
                            </button>
                        </form>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeIn 0.5s ease-in-out" }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#333", marginBottom: 16 }}>
                                모바일 앱으로 아래 QR 코드를 스캔하세요.
                            </h2>

                            {/* QR 이미지 출력 (백엔드에서 Base64로 넘어올 경우를 대비한 처리) */}
                            {qr && (
                                <img
                                    src={qr.startsWith("data:image") ? qr : `data:image/png;base64,${qr}`}
                                    alt="QR Code"
                                    style={{ width: 200, height: 200, marginBottom: 20, border: "1px solid #eee", borderRadius: 8, padding: 8 }}
                                />
                            )}

                            {/* 남은 시간 표시 (MM:SS 포맷팅) */}
                            <p style={{ fontSize: 22, fontWeight: 700, color: "#E53E3E", marginBottom: 24 }}>
                                남은 시간: {Math.floor(waitTime / 60)}분 {String(waitTime % 60).padStart(2, '0')}초
                            </p>

                            {/* 취소하고 돌아가기 버튼 */}
                            <button
                                type="button"
                                onClick={() => {
                                    setPlStep("NONE");
                                    setQr(undefined);
                                    // 기존에 돌고 있던 폴링 멈추기
                                    if (registerIntervalRef.current) {
                                        clearInterval(registerIntervalRef.current);
                                        registerIntervalRef.current = null;
                                    }
                                }}
                                style={{
                                    padding: "12px 24px", background: "#f1f1f1", color: "#555",
                                    border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer"
                                }}
                            >
                                취소하고 돌아가기
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PasswordlessReg

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
