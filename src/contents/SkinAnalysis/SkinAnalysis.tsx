import { useState, useRef, ReactEventHandler } from "react";
import Upload from "./Upload";
import Camera from "./Camera";
const TEAL = "#5BC8BF";

const SkinAnalysis: React.FC = () => {
	const [cameraOn, setCameraOn] = useState<boolean>(false);
	const fileRef = useRef<HTMLInputElement>(null);

	const button_pic_upload = () => {
		setCameraOn(false)
		fileRef.current?.click()
	}

	const button_camera_on = () => {
		setCameraOn(true)
	}

	return (
		<div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
			{/* Teal hero background */}
			<div style={{ background: TEAL, padding: "64px 48px 80px" }}>
				<div style={{ maxWidth: 900, margin: "0 auto" }}>
					{/* Card */}
					<div style={{ background: "#fff", borderRadius: 20, padding: "48px 56px", boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
						<div>
							{cameraOn ? <Camera />:<Upload props={fileRef}/>}
							<div style={{ display: "flex", gap: 20 }}>
								<button
									onClick={() => button_pic_upload()}
									style={{
										flex: 1, padding: "16px", fontSize: 16, fontWeight: 600,
										border: `2px solid ${TEAL}`, borderRadius: 12,
										background: "#fff", color: TEAL, cursor: "pointer"
									}}
								>
									사진을 업로드 하세요
								</button>
								<button
									onClick={() => button_camera_on()}
									style={{
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
		</div>
	);
}
export default SkinAnalysis

function CautionIcon({ children, label }: { children: any, label: string }) {
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
