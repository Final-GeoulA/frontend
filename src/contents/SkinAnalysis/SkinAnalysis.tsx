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
									onClick={button_pic_upload}
									style={{
										flex: 1, padding: "16px", fontSize: 16, fontWeight: 600,
										border: `2px solid ${TEAL}`, borderRadius: 12,
										background: "#fff", color: TEAL, cursor: "pointer"
									}}
								>
									사진을 업로드 하세요
								</button>
								<button
									onClick={button_camera_on}
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
