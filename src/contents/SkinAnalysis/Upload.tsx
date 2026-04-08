import React, { RefObject, useState } from 'react'
import axios from 'axios';

const TEAL = "#5BC8BF";

interface UploadProps {
	props: RefObject<HTMLInputElement | null>;
	onUploadDone?: (imgUrl: string, prediction: any, emotion: string) => void;
}

const Upload: React.FC<UploadProps> = ({ props, onUploadDone }) => {
	const [uploaded, setUploaded] = useState<string | null>(null);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [dragging, setDragging] = useState(false);
	const [uploading, setUploading] = useState(false);

	const handleFile = (file: File) => {
		if (!file) return;
		const url = URL.createObjectURL(file);
		setUploaded(url);
		setUploadedFile(file);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragging(false);
		const file = e.dataTransfer.files[0];
		if (file) handleFile(file);
	};

	const handleAnalyze = async () => {
		if (!uploadedFile) {
			alert('사진을 먼저 선택해주세요.');
			return;
		}
		setUploading(true);
		try {
			const springForm = new FormData();
			springForm.append('file', uploadedFile);

			const djangoForm = new FormData();
			djangoForm.append('image', uploadedFile);

			const djangoForm_emotion = new FormData();			//	감정분석용 폼 추가
			djangoForm_emotion.append('image', uploadedFile);

			const [springRes, djangoRes, djangoRes_emotion] = await Promise.all([	
				axios.post(
					`${process.env.REACT_APP_BACK_END_URL}/api/skinImg/upload`,
					springForm,
					{ withCredentials: true }
				),
				axios.post(
					`${process.env.REACT_APP_DJANGO_END_URL}/api/skin/predict/`,
					djangoForm
				),
				axios.post(										//	감정분석용 axios 추가
					`${process.env.REACT_APP_DJANGO_END_URL}/api/imgemotion/predict/`,
					djangoForm_emotion
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
			if (!djangoRes_emotion.data.success) {
				alert('감정 분석에 실패했습니다.');
				return;
			}

			await axios.post(									//	감정분석 저장용 axios 추가
				`${process.env.REACT_APP_BACK_END_URL}/api/emotionAnalysis/save`,
				{
					imgId: springRes.data.userSkinImgId,		// springRes.data.userSkinImgId << 테이블 Primary Key 값
					imgname: uploadedFile.name,
					emotion: djangoRes_emotion.data.emotion,
				},
				{ withCredentials: true }
			);

			onUploadDone?.(springRes.data.imgUrl, djangoRes.data, djangoRes_emotion.data.emotion);

		} catch (e) {
			alert('업로드에 실패했습니다.');
		} finally {
			setUploading(false);
		}
	};

	return (
		<div>
			<h1 style={{ fontSize: 30, fontWeight: 800, color: "#111", marginBottom: 12, letterSpacing: "-0.5px" }}>
				사진을 촬영하세요
			</h1>
			<p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 4 }}>
				한 장의 사진으로 피부 상태를 분석해 드립니다.
			</p>
			<p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 32 }}>
				분석 결과를 바탕으로 맞춤 제품과 관리 방법을 안내해 드립니다.
			</p>

			<h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 6 }}>
				또는 사진을 직접 업로드하세요.
			</h2>
			<p style={{ fontSize: 14, color: "#777", marginBottom: 32 }}>
				정확한 분석을 위해 아래 사항을 확인해주세요.
			</p>

			<img src='/image/skinanalysis/image.png' style={{ maxWidth: 400, display: 'block', margin: '0 auto', gap: 48, marginBottom: 48 }} />

			{uploaded ? (
				<div style={{ textAlign: "center", marginBottom: 36 }}>
					<img
						src={uploaded}
						alt="업로드된 사진"
						style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 12, objectFit: "cover" }}
					/>
					<p
						style={{ marginTop: 12, fontSize: 13, color: TEAL, cursor: "pointer", fontWeight: 600 }}
						onClick={() => { setUploaded(null); setUploadedFile(null); }}
					>
						다시 선택하기
					</p>
				</div>
			) : (
				<div
					onDragOver={e => { e.preventDefault(); setDragging(true); }}
					onDragLeave={() => setDragging(false)}
					onDrop={handleDrop}
					onClick={() => props.current?.click()}
					style={{
						border: `2px dashed ${dragging ? TEAL : "#d0d0d0"}`,
						borderRadius: 14,
						padding: "32px",
						textAlign: "center",
						cursor: "pointer",
						background: dragging ? "#e8f8f7" : "#fafafa",
						marginBottom: 36,
						transition: "all 0.2s"
					}}
				>
					<UploadIcon color={dragging ? TEAL : "#bbb"} />
					<p style={{ marginTop: 12, fontSize: 14, color: "#aaa" }}>
						클릭하거나 사진을 여기로 드래그하세요
					</p>
					<input
						ref={props}
						type="file"
						accept="image/*"
						style={{ display: "none" }}
						onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
					/>
				</div>
			)}

			{uploaded && (
				<button
					onClick={handleAnalyze}
					disabled={uploading}
					style={{
						width: '100%',
						padding: '14px',
						fontSize: 16,
						fontWeight: 700,
						background: uploading ? '#aaa' : TEAL,
						color: '#fff',
						border: 'none',
						borderRadius: 30,
						cursor: uploading ? 'not-allowed' : 'pointer',
						marginBottom: 16
					}}
				>
					{uploading ? '저장 중...' : '피부 분석하기'}
				</button>
			)}
		</div>
	)
}
export default Upload

function UploadIcon({ color }: { color: string }) {
	return (
		<svg width="48" height="48" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
			<polyline points="16 16 12 12 8 16" />
			<line x1="12" y1="12" x2="12" y2="21" />
			<path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
		</svg>
	);
}
