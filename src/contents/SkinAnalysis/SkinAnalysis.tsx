import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Upload from "./Upload";
import Camera from "./Camera";
import "./style/SkinAnalysis.css";

const SkinAnalysis: React.FC = () => {
  const [cameraOn, setCameraOn] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const button_pic_upload = () => {
    setCameraOn(false);
    fileRef.current?.click();
  };

  const button_camera_on = () => {
    setCameraOn(true);
  };

  const goResultPage = (imgUrl: string) => {
    navigate("/skinresult", { state: { imgUrl } });
  };

  return (
    <div className="skin-analysis-page">
      <div className="skin-analysis-hero">
        <div className="skin-analysis-container">
          <div className="skin-analysis-card">
            <div>
              {cameraOn ? <Camera onUploadDone={goResultPage} /> : <Upload props={fileRef} onUploadDone={goResultPage} />}

              <div className="skin-analysis-button-row">
                <button
                  onClick={button_pic_upload}
                  className="skin-analysis-btn skin-analysis-btn-outline"
                >
                  파일 업로드
                </button>

                <button
                  onClick={button_camera_on}
                  className="skin-analysis-btn skin-analysis-btn-primary"
                >
                  셀카 찍기
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinAnalysis;