import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider";

const TEAL = "#5BC8BF";

const PasswordlessLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isWaiting, setIsWaiting] = useState(false); // 승인 대기 상태 여부
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 컴포넌트 언마운트 시 폴링 멈춤 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // 2초 간격으로 서버에 승인 여부를 묻는 폴링 함수
  const startPolling = (targetEmail: string, sessionId: string) => {
    setIsWaiting(true);
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_END_URL}/pwl/passwordlessCallApi`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          credentials: "include",
          body: new URLSearchParams({
            url: "resultUrl",
            params: `email=${targetEmail}&userId=${targetEmail}&sessionId=${sessionId}`
          })
        });
        const res = await response.json();
        console.log("서버 폴링 응답:", res);
        if (res.data && res.data.auth === "Y") {
          // 승인 성공!
          stopPolling();
          setIsWaiting(false);
          alert("패스워드리스 로그인 성공! 환영합니다.");
          navigate("/", { replace: true }); // 메인 페이지로 이동
        } else if (res.data && res.data.auth === "W") {
          // 대기 중
          console.log("스마트폰 승인 대기 중...");
        } else {
          // 거절 또는 타임아웃
          stopPolling();
          setIsWaiting(false);
          alert("인증이 취소되었거나 시간이 초과되었습니다.");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000); // 2초 주기
  };

  // 인증 요청 버튼 클릭 시
  const handlePushRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      // 1. 일회용 토큰 발급 (5-1단계)
      const tokenRes = await fetch(`${process.env.REACT_APP_BACK_END_URL}/pwl/passwordlessCallApi`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          url: "getTokenForOneTimeUrl",
          params: `email=${email}&userId=${email}`
        })
      }).then(r => r.json());

      const oneTimeToken = tokenRes.oneTimeToken;
      if (!oneTimeToken) {
        alert("인증 토큰 발급에 실패했습니다. (기기 등록 여부를 확인하세요)");
        return;
      }

      // 2. 스마트폰으로 푸시 발송 (5-2단계)
      const pushRes = await fetch(`${process.env.REACT_APP_BACK_END_URL}/pwl/passwordlessCallApi`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: new URLSearchParams({
          url: "getSpUrl",
          params: `email=${email}&userId=${email}&token=${oneTimeToken}`
        })
      }).then(r => r.json());

      if (pushRes.result === true) {
        // 3. 발송 성공 시 폴링 시작
        const sessionId = pushRes.sessionId;
        startPolling(email, sessionId);
      } else {
        alert("푸시 알림 발송에 실패했습니다.");
      }
    } catch (err) {
      console.error("Push request error:", err);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

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
            패스워드리스 로그인
          </h1>
          <p style={{ fontSize: 15, color: "#666", marginBottom: 36, wordBreak: "keep-all" }}>
            비밀번호 없이 스마트폰 앱의 알림을 통해 안전하게 로그인하세요.
          </p>

          {!isWaiting ? (
            /* ----- 이메일 입력 및 인증 요청 화면 ----- */
            <form onSubmit={handlePushRequest}>
              <div style={{ marginBottom: 28, textAlign: "left" }}>
                <label htmlFor="email" style={{ fontSize: 14, fontWeight: 600, color: "#333", display: "block", marginBottom: 8 }}>이메일 계정</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="등록된 이메일을 입력하세요"
                  required
                  style={{
                    width: "100%", padding: "14px 16px", fontSize: 15,
                    border: `1.5px solid ${TEAL}`, borderRadius: 10,
                    outline: "none", boxSizing: "border-box", color: "#333",
                    background: "#fff"
                  }}
                />
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
            /* ----- 스마트폰 승인 대기 화면 ----- */
            <div style={{ padding: "20px 0" }}>
              <div style={{ marginBottom: 24 }}>
                {/* 대기 상태를 나타내는 간단한 애니메이션 효과 대체용 아이콘 */}
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 3s linear infinite" }}>
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
              </div>
              <h3 style={{ fontSize: 18, color: "#333", marginBottom: 12 }}>스마트폰을 확인해 주세요</h3>
              <p style={{ fontSize: 15, color: "#777", lineHeight: "1.5" }}>
                <strong>{email}</strong> 계정으로 <br/>
                인증 알림을 발송했습니다.<br/>
                앱에서 <strong>승인</strong>을 누르시면 자동으로 로그인됩니다.
              </p>
              
              <button 
                onClick={() => {
                  stopPolling();
                  setIsWaiting(false);
                }} 
                style={{
                  marginTop: 32, padding: "10px 20px", background: "#f1f1f1",
                  color: "#555", border: "none", borderRadius: 8,
                  fontSize: 14, fontWeight: 600, cursor: "pointer"
                }}
              >
                취소하고 뒤로가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordlessLogin;