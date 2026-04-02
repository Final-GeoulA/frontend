import React, { useEffect, useState } from 'react'
import { useAuth } from "../../components/AuthProvider";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ChangePassword: React.FC = () => {
    const { member } = useAuth();
    const navigate = useNavigate();
    const [showPw, setShowPw] = useState(false);
    const [showConfirmedPw, setShowConfirmedPw] = useState(false);
    const [pwVal, setPwVal] = useState("");
    const [pwConfirmedVal, setPwConfirmedVal] = useState("");
    const [match, setMatch] = useState(false);
    const [blank, setBlank] = useState(false);

    useEffect(() => {
        if (pwVal === "" || pwConfirmedVal === "") {
            setBlank(true);
        }
        if (pwVal !== "" && pwConfirmedVal !== "") {
            setBlank(false);
        }
    }, [pwVal, pwConfirmedVal])

    useEffect(() => {
        if (!blank && pwVal === pwConfirmedVal) {
            setMatch(true);
        }
        if (!blank && pwVal !== pwConfirmedVal) {
            setMatch(false);
        }
    }, [pwVal, pwConfirmedVal])

    const changePassword = async () => {
        if (match === true && blank === false) {
            try {
                const res = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/user/updatePassword`,
                    {
                        email: member?.email,
                        password: pwVal
                    }, { withCredentials: true }
                );
                console.log(res)
                alert("비밀번호가 성공적으로 변경되었습니다.")
                navigate("/MyPage/skinreport");
            } catch (error) {
                console.log(error);
                alert("비밀번호 변경 중 오류 발생")
            }
        }
    };


    return (
        <div className="find-wrapper">
            <h2 className="find-title">비밀번호 변경</h2>

            <div className="find-card">

                {/* 2. 새 비밀번호 입력 */}
                <div className="find-field" style={{ marginTop: '24px' }}>
                    <label className="find-label">새 비밀번호</label>
                    <div className="find-input-row" style={{ position: "relative" }}>
                        <input
                            type={showPw ? 'text' : 'password'}
                            className="find-input"
                            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                            value={pwVal}
                            onChange={e => setPwVal(e.target.value)}
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

                {/* 3. 새 비밀번호 확인 */}
                <div className="find-field" style={{ marginTop: '16px' }}>
                    <label className="find-label">새 비밀번호 확인</label>
                    <div className="find-input-row" style={{ position: "relative" }}>
                        <input
                            type={showConfirmedPw ? 'text' : 'password'}
                            className="find-input"
                            placeholder="새로운 비밀번호를 다시 한 번 입력하세요"
                            value={pwConfirmedVal}
                            onChange={e => setPwConfirmedVal(e.target.value)}
                        />
                        <button
                            onClick={() => setShowConfirmedPw(!showConfirmedPw)}
                            style={{
                                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                                background: "none", border: "none", cursor: "pointer", padding: 0,
                                color: "#aaa", display: "flex", alignItems: "center"
                            }}
                        >
                            {showConfirmedPw ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>

                {/* 안내 메시지 (에러일 때는 error 클래스, 성공일 때는 success 클래스 적용) */}
                {
                    (!pwVal || !pwConfirmedVal) ?
                        (<></>) :
                        (match ?
                            <p className="find-message success">
                                비밀번호가 일치합니다.
                            </p> :
                            <p className="find-message error">
                                새 비밀번호가 일치하지 않습니다.
                            </p>)
                }

                {/* 제출 버튼 */}
                <button
                    type="button"
                    onClick={changePassword}
                    className="find-submit-btn"
                    disabled={match === false || blank === true}
                    style={{ marginTop: '32px' }}
                >
                    비밀번호 변경 완료
                </button>
            </div>
        </div>
    )
}

export default ChangePassword

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