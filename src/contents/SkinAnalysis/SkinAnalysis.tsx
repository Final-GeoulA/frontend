import { useState, useRef } from "react";
import restricted from './image.png';
const TEAL = "#5BC8BF";

const SkinAnalysis: React.FC = () => {
	const [uploaded, setUploaded] = useState<string|null>(null);
	const [dragging, setDragging] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	const handleFile = (file:any) => {
		if (!file) return;
		const url = URL.createObjectURL(file);
		setUploaded(url);
	};

	const handleDrop = (e:any) => {
		e.preventDefault();
		setDragging(false);
		const file = e.dataTransfer.files[0];
		handleFile(file);
	};

	return (
		<div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
			{/* Navbar */}
			<nav style={{
				display: "flex", alignItems: "center", justifyContent: "space-between",
				padding: "0 48px", height: 64, background: "#fff",
				borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 10
			}}>
				<div style={{ display: "flex", alignItems: "center", gap: 40 }}>
					<Logo />
					{["피부백과", "병원·약국 찾기", "제품 추천", "커뮤니티"].map(m => (
						<span key={m} style={{ fontSize: 15, color: "#333", cursor: "pointer", fontWeight: 500 }}>{m}</span>
					))}
				</div>
				<UserIcon />
			</nav>

			{/* Teal hero background */}
			<div style={{ background: TEAL, padding: "64px 48px 80px" }}>
				<div style={{ maxWidth: 900, margin: "0 auto" }}>
					{/* Card */}
					<div style={{
						background: "#fff", borderRadius: 20, padding: "48px 56px",
						boxShadow: "0 8px 40px rgba(0,0,0,0.12)"
					}}>
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
						{/* <div style={{ display: "flex", justifyContent: "center", gap: 48, marginBottom: 48 }}> */}
						<img src={restricted} style={{ maxWidth: 600,display: 'block', margin: '0 auto', gap: 48, marginBottom: 48 }} />

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

						{/* 버튼 2개 */}
						<div style={{ display: "flex", gap: 20 }}>
							<button
								onClick={() => fileRef.current?.click()}
								style={{
									flex: 1, padding: "16px", fontSize: 16, fontWeight: 600,
									border: `2px solid ${TEAL}`, borderRadius: 12,
									background: "#fff", color: TEAL, cursor: "pointer"
								}}
							>
								사진을 업로드 하세요
							</button>
							<button style={{
								flex: 1, padding: "16px", fontSize: 16, fontWeight: 600,
								border: `2px solid ${TEAL}`, borderRadius: 12,
								background: TEAL, color: "#fff", cursor: "pointer"
							}}>
								셀카 찍기
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default SkinAnalysis

function CautionIcon({ children, label }:{ children:any, label:string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 96, height: 96, borderRadius: "50%",
        border: "2px solid #ccc",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", background: "#fafafa"
      }}>
        {children}
        {/* 대각선 금지 선 */}
        <svg style={{ position: "absolute", inset: 0 }} width="96" height="96" viewBox="0 0 96 96">
          <line x1="20" y1="20" x2="76" y2="76" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function MaskIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#aaa" strokeWidth="2">
      <path d="M10 22 C10 16 16 12 26 12 C36 12 42 16 42 22 L42 30 C42 36 36 40 26 40 C16 40 10 36 10 30 Z" />
      <path d="M10 24 C6 24 4 26 4 28 C4 30 6 32 10 32" />
      <path d="M42 24 C46 24 48 26 48 28 C48 30 46 32 42 32" />
      <path d="M18 22 Q26 28 34 22" strokeLinecap="round" />
    </svg>
  );
}

function GlassesIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#aaa" strokeWidth="2">
      <rect x="5" y="18" width="18" height="14" rx="7" />
      <rect x="29" y="18" width="18" height="14" rx="7" />
      <line x1="23" y1="25" x2="29" y2="25" />
      <line x1="5" y1="25" x2="2" y2="23" />
      <line x1="47" y1="25" x2="50" y2="23" />
    </svg>
  );
}

function MakeupIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#aaa" strokeWidth="2">
      <ellipse cx="26" cy="28" rx="10" ry="14" />
      <rect x="22" y="12" width="8" height="6" rx="2" />
      <line x1="26" y1="18" x2="26" y2="14" />
      <path d="M20 36 Q26 42 32 36" strokeLinecap="round" />
    </svg>
  );
}

function UploadIcon({ color }:{ color:string }) {
  return (
    <svg width="48" height="48" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
    </svg>
  );
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <polygon points="14,2 26,9 26,19 14,26 2,19 2,9" fill={TEAL} opacity="0.8" />
        <polygon points="14,6 22,11 22,18 14,23 6,18 6,11" fill="#fff" opacity="0.5" />
      </svg>
      <span style={{ fontSize: 18, fontWeight: 800, color: "#222", letterSpacing: "-0.5px" }}>GeoulA</span>
    </div>
  );
}

function UserIcon() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%", background: "#e8f8f7",
      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
    }}>
      <svg width="20" height="20" fill="none" stroke={TEAL} strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}
