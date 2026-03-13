import React, { RefObject, useState } from 'react'
const TEAL = "#5BC8BF";

const Upload: React.FC<any> = ({ fileRef }: { fileRef: RefObject<HTMLInputElement | null> }) => {
	const [uploaded, setUploaded] = useState<string | null>(null);
	const [dragging, setDragging] = useState(false);

	const handleFile = (file: any) => {
		if (!file) return;
		const url = URL.createObjectURL(file);
		setUploaded(url);
	};

	const handleDrop = (e: any) => {
		e.preventDefault();
		setDragging(false);
		const file = e.dataTransfer.files[0];
		handleFile(file);
	};


	return (
		<div>
			<h1 style={{ fontSize: 30, fontWeight: 800, color: "#111", marginBottom: 12, letterSpacing: "-0.5px" }}>
				사진을 업로드 하세요
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

			{/* 주의 아이콘 3개 */}
			<img src='/image/skinanalysis/image.png' style={{ maxWidth: 400, display: 'block', margin: '0 auto', gap: 48, marginBottom: 48 }} />

			{/* 드래그 업로드 영역 (업로드 시 미리보기) */}
			{uploaded ? (
				<div style={{ textAlign: "center", marginBottom: 36 }}>
					<img
						src={uploaded}
						alt="업로드된 사진"
						style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 12, objectFit: "cover" }}
					/>
					<p
						style={{ marginTop: 12, fontSize: 13, color: TEAL, cursor: "pointer", fontWeight: 600 }}
						onClick={() => setUploaded(null)}
					>
						다시 선택하기
					</p>
				</div>
			) : (
				<div
					onDragOver={e => { e.preventDefault(); setDragging(true); }}
					onDragLeave={() => setDragging(false)}
					onDrop={handleDrop}
					onClick={() => fileRef.current?.click()}
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
						ref={fileRef}
						type="file"
						accept="image/*"
						style={{ display: "none" }}
						onChange={e => handleFile(e.target.files?.[0])}
					/>
				</div>
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