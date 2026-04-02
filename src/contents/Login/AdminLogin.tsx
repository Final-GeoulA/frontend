import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { useAuth } from "../../components/AuthProvider";

const TEAL = "#5BC8BF";
const TEAL_LIGHT = "#e8f8f7";
const TEAL_BORDER = "#a8e0db";

interface FaceCompareResult {
    success: boolean;
    similarity: number;
    result: string;
    admin_name: string;
    bbox: number[];
    message?: string;
}

const AdminLogin: React.FC = () => {
    // 카메라 동작
    const webcamRef = useRef<Webcam>(null);
    const [countdown, setCountdown] = useState<number | null>(null); //카운트 다운 저장할 useState
    const [captured, setCaptured] = useState<boolean>(false); //캡쳐
    const [result, setResult] = useState<FaceCompareResult | null>(null); //axios로 받은 결과를 저장할 useState

    const startCountdown = () => {
        if (countdown !== null) return;
        let counter = 5;
        setCountdown(counter)
        const interval = setInterval(() => {
            counter -= 1
            setCountdown(counter);
            // counter의 값이 0이라면 멈추게 하자.
            if (counter === 0) {
                clearInterval(interval);//인터벌을 종료
                capture();
                setCountdown(null);
            }
        }, 1000);
    }

    //webcam에서 장치가 활성화 될 때 동작
    const capture = useCallback(() => {
        if (!webcamRef.current) return;
        //스크린 샷을 찍은 값
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            //Djnago 서버로 이미지를 전송
            sendToServer(imageSrc);
        }
    }, []);

    const sendToServer = async (imageSrc: string) => {
        try {
            //이미지 주소값 
            const res = await fetch(imageSrc);
            //서버로 전송할 때 바이너리 형태 => blob 바이너리 객체 
            const blob = await res.blob();
            const formData = new FormData();
            //서버로 전송할 때 post방식으로 바이너리 파일인 이미지 한장을 보내겠다
            formData.append('image', blob, 'capture.jpg');
            const response = await axios.post<FaceCompareResult>(
                `${process.env.REACT_DJANGO_URL}/api/recogface/compare_face`,
                formData
            );
            setResult(response.data);
            setCaptured(true);
        } catch (error) {
            console.error("에러!", error);
        }
    }

    // 로그인 동작
    const { login, checkLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loginAsAdmin = async () => {
            if (result !== null && result.result === 'ok') {
                const currentEmail = result.admin_name;
                const currentPassword = 'admin';
                setResult(null);
                try {
                    const loginresult = await login(currentEmail, currentPassword);
                    if (loginresult === 'success') {
                        // 0.8초 대기 후 실행
                            alert(`${currentEmail} 관리자님, 로그인되었습니다`);
                            navigate('/', { replace: true });

                    } else {
                        alert('로그인 실패');
                    }
                } catch (error) {
                    console.error('오류 발생', error);
                }
            }
        };
        loginAsAdmin();
    }, [result, login, navigate]);

    return (
        <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
            {/* 결과창 등장 애니메이션을 위한 스타일 태그 */}
            <style>
                {`
                    @keyframes slideFadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 64px)", padding: "40px 16px" }}>
                <div style={{
                    background: "#fff", borderRadius: 16, padding: "48px 52px",
                    width: "100%", maxWidth: 720,
                    boxShadow: "4px 4px 24px rgba(0,0,0,0.08), -2px -2px 12px rgba(0,0,0,0.04)"
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ marginBottom: '30px', color: '#333' }}>관리자 로그인</h1>

                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Webcam audio={false} ref={webcamRef}
                                screenshotFormat='image/jpeg'
                                width={480} height={360}
                                style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                onUserMediaError={(error) => console.error("웹캠 로드 에러:", error)}
                            />
                            {/* ROI 가이드라인 */}
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%',
                                width: '200px', height: '270px',
                                border: `3px dashed ${TEAL}`,
                                borderRadius: '20px',
                                transform: 'translate(-50%, -50%)',
                                opacity: 0.8
                            }}></div>

                            {/* 카운트다운 오버레이 */}
                            {countdown !== null && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    background: 'rgba(0,0,0,0.4)', borderRadius: '12px',
                                    color: '#fff', fontSize: '80px', fontWeight: 'bold'
                                }}>
                                    {countdown}
                                </div>
                            )}
                        </div>

                        {/* 스크린샷 찍는 버튼 */}
                        <div style={{ marginTop: '24px' }}>
                            <button onClick={() => startCountdown()}
                                disabled={countdown !== null}
                                style={{
                                    width: "480px", maxWidth: "100%", padding: "16px",
                                    background: countdown !== null ? '#ccc' : TEAL,
                                    color: "#fff", border: "none", borderRadius: 12,
                                    fontSize: 18, fontWeight: 700, cursor: countdown !== null ? 'not-allowed' : 'pointer',
                                    letterSpacing: "0.5px", transition: 'background 0.3s'
                                }}>
                                {countdown !== null ? '촬영 중...' : '얼굴 인증 시작'}
                            </button>
                        </div>

                        {/* 개선된 결과 출력 영역 */}
                        {result && (
                            <div style={{
                                marginTop: '30px',
                                padding: '24px',
                                borderRadius: '12px',
                                background: result.success
                                    ? (result.result === 'ok' ? TEAL_LIGHT : '#fff0f0')
                                    : '#fff0f0',
                                border: `1px solid ${result.success
                                    ? (result.result === 'ok' ? TEAL_BORDER : '#ffcdd2')
                                    : '#ffcdd2'}`,
                                animation: 'slideFadeIn 0.5s ease-out',
                                width: '480px',
                                maxWidth: '100%',
                                margin: '30px auto 0'
                            }}>
                                {result.success ? (
                                    <>
                                        <h2 style={{
                                            margin: '0 0 12px 0',
                                            color: result.result === 'ok' ? '#20857a' : '#d32f2f',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}>
                                            {result.result === 'ok' ? '✅ 인증 성공' : '❌ 인증 실패'}
                                        </h2>

                                        {result.result === 'ok' ? (
                                            <p style={{ margin: '0 0 16px 0', color: '#444', fontSize: '16px' }}>
                                                <b>{result.admin_name}</b> 관리자님, 환영합니다.
                                            </p>
                                        ) : (
                                            <p style={{ margin: '0 0 16px 0', color: '#444', fontSize: '16px' }}>
                                                등록된 관리자와 일치하지 않습니다.
                                            </p>
                                        )}0

                                        {/* 유사도 프로그레스 바 */}
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px', color: '#666' }}>
                                                <span>얼굴 유사도</span>
                                                <span style={{ fontWeight: 'bold', color: result.result === 'ok' ? TEAL : '#d32f2f' }}>
                                                    {(result.similarity * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div style={{ background: '#e0e0e0', borderRadius: '8px', height: '12px', width: '100%', overflow: 'hidden' }}>
                                                <div style={{
                                                    background: result.result === 'ok' ? TEAL : '#d32f2f',
                                                    width: `${Math.min(Math.max(result.similarity * 100, 0), 100)}%`,
                                                    height: '100%',
                                                    borderRadius: '8px',
                                                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }} />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // 얼굴 감지 실패 또는 마스크 착용 시
                                    <>
                                        <h2 style={{
                                            margin: '0 0 12px 0', color: '#d32f2f',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}>
                                            ⚠️ 인식 오류
                                        </h2>
                                        <p style={{ margin: 0, color: '#555', fontSize: '16px', lineHeight: '1.5' }}>
                                            {result.message || "얼굴을 인식하지 못했습니다."}
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin