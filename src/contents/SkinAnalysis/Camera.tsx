import React, { useRef } from 'react'
import Webcam from 'react-webcam';

const Camera: React.FC = () => {
	const webcamRef = useRef<Webcam>(null);

	return (
		<div>
			<Webcam
				audio={false}
				ref={webcamRef}
				screenshotFormat='image/jpeg'
				width={570}
				height={480}
				onUserMedia={() => { console.log('카메라 동작') }}
				onUserMediaError={(err) => { console.log("카메라 연결 실패 :", err) }}
			/>
		</div>
	)
}

export default Camera
