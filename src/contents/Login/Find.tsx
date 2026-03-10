import React, { useState } from "react";

const Find: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"id" | "password">("id");

  // 아이디 찾기 상태
  const [emailForId, setEmailForId] = useState("");
  const [idMessage, setIdMessage] = useState<string | null>(null);
  const [idError, setIdError] = useState(false);

  // 비밀번호 찾기 상태
  const [pwEmail, setPwEmail] = useState("");
  const [pwVerified, setPwVerified] = useState(false); // 이메일 인증 완료 여부
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pwError, setPwError] = useState(false);

  const [loading, setLoading] = useState(false);

  // 공통: 이메일 존재 여부/인증 요청 (실제 API로 교체)
  const mockCheckEmail = async (email: string) => {
    setLoading(true);
    try {
      // const res = await fetch("/api/auth/check-email", { ... });
      // const data = await res.json();
      const exists = email === "test@example.com"; // 데모용
      return exists;
    } finally {
      setLoading(false);
    }
  };

  /* ---------- 아이디 찾기 ---------- */
  const handleCheckIdEmail = async () => {
    if (!emailForId.trim()) {
      setIdError(true);
      setIdMessage("이메일을 입력해주세요.");
      return;
    }

    const exists = await mockCheckEmail(emailForId);
    if (exists) {
      setIdError(false);
      setIdMessage("등록된 이메일입니다.");
    } else {
      setIdError(true);
      setIdMessage("등록되지 않은 이메일입니다. 다시 확인해주세요.");
    }
  };

  const handleSubmitId = (e: React.FormEvent) => {
    e.preventDefault();
    handleCheckIdEmail();
  };

  /* ---------- 비밀번호 찾기 ---------- */
  const handleVerifyPwEmail = async () => {
    if (!pwEmail.trim()) {
      setPwError(true);
      setPwMessage("이메일을 입력해주세요.");
      return;
    }

    const exists = await mockCheckEmail(pwEmail);
    if (!exists) {
      setPwVerified(false);
      setPwError(true);
      setPwMessage("등록되지 않은 이메일입니다. 다시 확인해주세요.");
      return;
    }

    // 백엔드 연결 후 실제 이메일 인증 로직 넣기
    setPwVerified(true);
    setPwError(false);
    setPwMessage("이메일 인증이 완료되었습니다."); // 임시 처리
  };

  const handleSubmitPw = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pwVerified) {
      setPwError(true);
      setPwMessage("먼저 이메일 인증을 완료해주세요.");
      return;
    }
    if (!pw || !pwConfirm) {
      setPwError(true);
      setPwMessage("변경할 비밀번호를 모두 입력해주세요.");
      return;
    }
    if (pw !== pwConfirm) {
      setPwError(true);
      setPwMessage("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    // TODO: 실제 비밀번호 변경 API 호출
    setPwError(false);
    setPwMessage("비밀번호가 성공적으로 변경되었습니다.");
  };

  return (
    <div className="find-wrapper">
      <h2 className="find-title">아이디 | 비밀번호 찾기</h2>

      <div className="find-card">
        {/* 탭 */}
        <div className="find-tabs">
          <button
            type="button"
            className={`find-tab ${activeTab === "id" ? "active" : ""}`}
            onClick={() => setActiveTab("id")}
          >
            아이디 찾기
          </button>
          <button
            type="button"
            className={`find-tab ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            비밀번호 찾기
          </button>
        </div>

        {/* 아이디 찾기 탭 내용 */}
        {activeTab === "id" && (
          <form onSubmit={handleSubmitId}>
            <div className="find-field">
              <label className="find-label">이메일</label>
              <div className="find-input-row">
                <input
                  type="email"
                  className="find-input"
                  placeholder="이메일을 입력하세요"
                  value={emailForId}
                  onChange={(e) => setEmailForId(e.target.value)}
                />
                <button
                  type="button"
                  className="find-check-btn"
                  onClick={handleCheckIdEmail}
                  disabled={loading}
                >
                  {loading ? "확인 중..." : "이메일 확인"}
                </button>
              </div>
              {idMessage && (
                <p className={`find-message ${idError ? "error" : "success"}`}>
                  {idMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="find-submit-btn"
              disabled={loading}
            >
              아이디 찾기
            </button>
          </form>
        )}

        {/* 비밀번호 찾기 탭 내용 */}
        {activeTab === "password" && (
          <form onSubmit={handleSubmitPw}>
            {/* 아이디(이메일) + 인증 */}
            <div className="find-field">
              <label className="find-label">아이디(이메일)</label>
              <div className="find-input-row">
                <input
                  type="email"
                  className="find-input"
                  placeholder="아이디(이메일)을 입력하세요"
                  value={pwEmail}
                  onChange={(e) => setPwEmail(e.target.value)}
                />
                <button
                  type="button"
                  className="find-check-btn"
                  onClick={handleVerifyPwEmail}
                  disabled={loading}
                >
                  {pwVerified
                    ? "인증 완료"
                    : loading
                    ? "발송 중..."
                    : "이메일 인증"}
                </button>
              </div>
            </div>

            {/* 새 비밀번호 */}
            <div className="find-field">
              <label className="find-label">새 비밀번호</label>
              <input
                type="password"
                className="find-input"
                placeholder="새 비밀번호를 입력하세요"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
            </div>

            {/* 새 비밀번호 확인 */}
            <div className="find-field">
              <label className="find-label">새 비밀번호 확인</label>
              <input
                type="password"
                className="find-input"
                placeholder="새 비밀번호를 다시 입력하세요"
                value={pwConfirm}
                onChange={(e) => setPwConfirm(e.target.value)}
              />
            </div>

            {pwMessage && (
              <p className={`find-message ${pwError ? "error" : "success"}`}>
                {pwMessage}
              </p>
            )}

            <button
              type="submit"
              className="find-submit-btn"
              disabled={loading}
            >
              비밀번호 변경
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Find;
