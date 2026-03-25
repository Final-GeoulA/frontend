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
                "http://192.168.0.45:9001/api/recogface/compare_face",
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
                try {
                    const loginresult = await login(currentEmail,currentPassword);
                    if (loginresult === 'success') {
                        alert(`${result.admin_name} 관리자님, 로그인되었습니다`);
                        navigate('/', { replace:true });
                    } else {
                        alert('로그인 실패');
                    }
                } catch (error) {
                    console.error('오류 발생', error);
                }
            }
        };
        loginAsAdmin();
    },[result, login, navigate]);    

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Face Compare</h1>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <Webcam audio={false} ref={webcamRef}
                    screenshotFormat='image/jpeg'
                    width={480} height={360}
                    style={{ borderRadius: '8px' }}
                />
                {/* ROI */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    width: '200px', height: '270px',
                    border: '2px solid red',
                    transform: 'translate(-50%, -50%)'
                }}></div>

                {/* 카운트 다운 */}
                {countdown !== null && (
                    <div
                        style={{
                            position: 'absolute', top: '5px', left: '150%',
                            transform: 'translateX(-50%)',
                            fontSize: '48px', color: 'blue'
                        }}
                    >{countdown}</div>)}
            </div>

            {/*  스크린샷을 찍는 버튼이 되겠다. */}
            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={() => startCountdown()}
                    disabled={countdown !== null}
                    style={{ padding: '10px 20px', fontSize: '18px' }}
                >
                    얼굴 비교 시작
                </button>
            </div>

            {result && (
                <div style={{ marginTop: '20px' }}>
                    <h2>결과: {result.result}</h2>
                    <p>Similarity: {result.similarity}</p>
                    <p>BBox: [{result.bbox.join(', ')}]</p>
                </div>
            )}
        </div>
    )
}

export default AdminLogin