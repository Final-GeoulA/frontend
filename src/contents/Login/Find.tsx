import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider";
import "./style/FindAccount.css";
import axios from "axios";

const Find: React.FC = () => {
  const { login, checkLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwVerified, setPwVerified] = useState(false); // 이메일 인증 완료 여부
  const [code, setCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [mailSent, setMailSent] = useState(false);

  const [loading, setLoading] = useState(false);

  // 공통: 이메일 존재 여부/인증 요청 (실제 API로 교체)
  const mockCheckEmail = async (email: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/emailCheckPw`,
        {
          email: email
        }, { withCredentials: true }
      );
      if (res.data === 0) {
        setMailSent(true);
        alert("메일이 전송되었습니다.");
      }
      const exists = email === "ictmankwon@naver.com"; // 데모용
      return exists;
    } finally {
      setLoading(false);
    }
  };

  // 코드 일치 여부 검증
  const mockCheckCode = async (email: string, code: string) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/emailCheck/certification`,
        {
          email: email,
          code: code
        }, { withCredentials: true }
      );
      if (res.data.success) {
        setCodeVerified(true);
        const result = true;
        return result;
      } else {
        setCodeVerified(false);
        const result = false;
        return result;
      }

    } catch (error) {
      console.log("코드 검증 중 오류 발생" + error);
    }
  };

  // 난수 비밀번호로 변경 후 로그인
  const updatePwLogin = async () => {
    try {
      const temppw = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/temppw`,
        { withCredentials: true });
      return temppw.data;
    } catch (error) {
      console.log(error);
    }
  }

  /* ---------- 비밀번호 찾기 ---------- */
  const handleVerifyPwEmail = async () => {
    if (!email.trim()) {
      setMessage("이메일을 입력해주세요.");
      return;
    }

    const exists = await mockCheckEmail(email);
    if (!exists) {
      setPwVerified(false);
      setMessage("등록되지 않은 이메일입니다. 다시 확인해주세요.");
      return;
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setMessage("코드를 입력해주세요.");
      return;
    }

    const exact = await mockCheckCode(email, code);
    if (!exact) {
      setMessage("잘못된 코드입니다.");
      return;
    } else {
      setMessage("올바른 코드입니다.")
      const temppw = await updatePwLogin();
      try {
        const res = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/user/updatePassword`,
          {
            email: email,
            password: temppw
          }, { withCredentials: true }
        );
        // 임시 비번으로 로그인시킨 뒤 버튼으로 즉시 변경창으로 유도
        if (res.data === 'ok') {
          const loginres = await login(email, temppw);
          console.log(loginres);
        };
        alert("임시 비밀번호로 변경되었습니다. 보안을 위해, 즉시 비밀번호를 수정해주세요!");
        navigate("/MyPage/ChangePassword");
      } catch {
        alert("비밀번호 재설정 중 오류 발생");
      }
    };
  }
  return (
    <div className="find-wrapper">
      <h2 className="find-title">비밀번호 찾기</h2>
      <div className="find-card">
        <div className="find-field">
          {!mailSent ?
            <label className="find-label">이메일</label>
            : <label className="find-label">인증코드</label>
          }

          {!mailSent ?
            <div className="find-input-row">
              <input
                type="email"
                className="find-input"
                placeholder="아이디(이메일)를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pwVerified}
              />
              <button
                type="button"
                className="find-check-btn"
                onClick={handleVerifyPwEmail}
                disabled={loading || pwVerified || !email}
              >
                {pwVerified
                  ? "발송 완료"
                  : loading
                    ? "발송 중..."
                    : "인증 코드 받기"}
              </button>
            </div>
            :
            <div className="find-input-row">
              <input
                type="text"
                className="find-input"
                placeholder="발송된 인증 코드를 입력하세요"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              // disabled={pwVerified}
              />
              <button
                type="button"
                className="find-check-btn"
                onClick={handleVerifyCode}
                disabled={loading || codeVerified || !email}
              >
                {codeVerified ? "인증 완료" : "코드 입력"}
              </button>
            </div>
          }
        </div>

        {message && (
          <p className={`find-message ${codeVerified ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Find;
