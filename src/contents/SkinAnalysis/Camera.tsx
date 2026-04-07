import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam';
import axios from 'axios';

const TEAL = "#5BC8BF";

interface PredictionResult {
	predicted_class: string;
	confidence: number;
	scores: Record<string, number>;
}

interface CameraProps {
	onUploadDone?: (imgUrl: string, prediction: PredictionResult) => void;
}

const Camera: React.FC<CameraProps> = ({ onUploadDone }) => {
	const webcamRef = useRef<Webcam>(null);
	const [captured, setCaptured] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadDone, setUploadDone] = useState(false);

	const capture = () => {
		const screenshot = webcamRef.current?.getScreenshot();
		if (screenshot) setCaptured(screenshot);
	};

	const retake = () => {
		setCaptured(null);
		setUploadDone(false);
	};

	const upload = async () => {
		if (!captured) return;
		setUploading(true);
		try {
			// base64 -> Blob
			const res = await fetch(captured);
			const blob = await res.blob();
			const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });

			// Spring 저장 + Django 분석 동시 요청
			const springForm = new FormData();
			springForm.append('file', file);

			const djangoForm = new FormData();
			djangoForm.append('image', file);

			const [springRes, djangoRes] = await Promise.all([
				axios.post(
					`${process.env.REACT_APP_BACK_END_URL}/api/skinImg/upload`,
					springForm,
					{ withCredentials: true }
				),
				axios.post(
					`${process.env.REACT_APP_DJANGO_END_URL}/api/skin/predict/`,
					djangoForm
				),
			]);

			if (!springRes.data.success) {
				alert(springRes.data.message || '이미지 저장에 실패했습니다.');
				return;
			}
			if (!djangoRes.data.success) {
				alert('피부 분석에 실패했습니다.');
				return;
			}

			const scores = djangoRes.data.scores ?? {};
			await axios.post(
				`${process.env.REACT_APP_BACK_END_URL}/api/skinAnalysis/save`,
				{
					userSkinImgId: springRes.data.userSkinImgId,
					diseaseAtopy:  Math.round((scores['아토피']  ?? 0) * 10),
					diseaseDry:    Math.round((scores['건선']    ?? 0) * 10),
					diseasePimple: Math.round((scores['여드름']  ?? 0) * 10),
					diseaseInflam: Math.round((scores['염증성']  ?? 0) * 10),
				},
				{ withCredentials: true }
			);

			setUploadDone(true);
			onUploadDone?.(springRes.data.imgUrl, djangoRes.data);
		} catch (e) {
			alert('업로드에 실패했습니다.');
		} finally {
			setUploading(false);
		}
	};

	if (error) {
		return (
			<div style={{ textAlign: 'center', padding: '48px 0', marginBottom: 36 }}>
				<p style={{ fontSize: 16, color: '#e05', fontWeight: 600, marginBottom: 12 }}>
					카메라에 접근할 수 없습니다.
				</p>
				<p style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>
					<strong>localhost:3000</strong>으로 접속하거나,<br />
					Chrome 설정에서 해당 주소를 안전한 출처로 추가해 주세요.
				</p>
				<p style={{ fontSize: 13, color: '#aaa', marginTop: 12 }}>오류: {error}</p>
			</div>
		);
	}

	if (captured) {
		return (
			<div style={{ textAlign: 'center', marginBottom: 36 }}>
				<img
					src={captured}
					alt="촬영된 사진"
					style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 12, objectFit: 'cover' }}
				/>
				{uploadDone ? (
					<p style={{ marginTop: 16, fontSize: 15, color: TEAL, fontWeight: 600 }}>
						저장 완료!
					</p>
				) : (
					<div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
						<button
							onClick={retake}
							style={{
								padding: '10px 28px', fontSize: 15, fontWeight: 600,
								border: `2px solid ${TEAL}`, borderRadius: 30,
								background: '#fff', color: TEAL, cursor: 'pointer'
							}}
						>
							다시 찍기
						</button>
						<button
							onClick={upload}
							disabled={uploading}
							style={{
								padding: '10px 28px', fontSize: 15, fontWeight: 600,
								border: 'none', borderRadius: 30,
								background: TEAL, color: '#fff', cursor: uploading ? 'not-allowed' : 'pointer',
								opacity: uploading ? 0.7 : 1
							}}
						>
							{uploading ? '저장 중...' : '분석하기'}
						</button>
					</div>
				)}
			</div>
		);
	}

	return (
		<div style={{ paddingBottom: '36px', position: 'relative' }}>
			<Webcam
				audio={false}
				ref={webcamRef}
				screenshotFormat='image/jpeg'
				width='100%'
				height={450}
				videoConstraints={{ facingMode: 'user' }}
				onUserMedia={() => setError(null)}
				onUserMediaError={(err) => {
					const msg = err instanceof Error ? err.message : String(err);
					setError(msg);
				}}
			/>

			<svg
				style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '450px', pointerEvents: 'none' }}
				viewBox="0 0 640 480"
			>
				<defs>
					<mask id="faceMask">
						<rect width="100%" height="100%" fill="white" />
						<ellipse cx="320" cy="220" rx="110" ry="140" fill="black" />
					</mask>
				</defs>
				<rect width="100%" height="100%" fill="rgba(0,0,0,0.45)" mask="url(#faceMask)" />
				<ellipse cx="320" cy="220" rx="110" ry="140"
					fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
				<path d="M230 88 L200 88 L200 118" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
				<path d="M410 88 L440 88 L440 118" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
				<path d="M230 352 L200 352 L200 322" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
				<path d="M410 352 L440 352 L440 322" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
				<text x="320" y="420" textAnchor="middle" fill="white" fontSize="15">
					얼굴을 맞춰주세요
				</text>
			</svg>

			<div style={{ position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)' }}>
				<button
					onClick={capture}
					style={{
						padding: '12px 40px', fontSize: 16, fontWeight: 700,
						background: TEAL, color: '#fff',
						border: 'none', borderRadius: 30, cursor: 'pointer',
						boxShadow: '0 4px 16px rgba(91,200,191,0.4)',
						whiteSpace: 'nowrap'
					}}
				>
					촬영하기
				</button>
			</div>
		</div>
	);
};

export default Camera;
