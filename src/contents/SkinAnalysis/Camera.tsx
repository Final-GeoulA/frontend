import React, { useRef } from 'react'
import Webcam from 'react-webcam';

const Camera: React.FC = () => {
	const webcamRef = useRef<Webcam>(null);

	return (
		<div style={{paddingBottom: '36px'}}>
			<Webcam
				audio={false}
				ref={webcamRef}
				screenshotFormat='image/jpeg'
				width='100%'
				height={450}
				onUserMedia={() => { console.log('카메라 동작') }}
				onUserMediaError={(err) => { console.log("카메라 연결 실패 :", err) }}
			/>
		</div>
	)
}

export default Camera
