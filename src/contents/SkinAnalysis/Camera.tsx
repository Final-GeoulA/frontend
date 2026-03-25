import React, { useRef } from 'react'
import Webcam from 'react-webcam';

const Camera: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const capture = () => {
    const image = webcamRef.current?.getScreenshot();
    console.log(image);
  };

  return (
    <div style={{ paddingBottom: '36px', position: 'relative' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat='image/jpeg'
        width='100%'
        height={450}
        onUserMedia={() => { console.log('카메라 동작') }}
        onUserMediaError={(err) => { console.log("카메라 연결 실패 :", err) }}
      />

      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '450px', pointerEvents: 'none' }}
        viewBox="0 0 640 480"
      >
        <defs>
          <mask id="faceMask">
            <rect width="100%" height="100%" fill="white"/>
            <ellipse cx="320" cy="220" rx="110" ry="140" fill="black"/>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.45)" mask="url(#faceMask)"/>
        {/* 타원 흐릿하게 */}
        <ellipse cx="320" cy="220" rx="110" ry="140"
          fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        {/* 코너 브라켓 4개 */}
        <path d="M230 88 L200 88 L200 118" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M410 88 L440 88 L440 118" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M230 352 L200 352 L200 322" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M410 352 L440 352 L440 322" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <text x="320" y="420" textAnchor="middle" fill="white" fontSize="15">
          얼굴을 맞춰주세요
        </text>
      </svg>

      <button onClick={capture}>촬영(함수만 구현상태)</button>
    </div>
  );
};

export default Camera
