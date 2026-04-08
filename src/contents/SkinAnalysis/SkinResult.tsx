import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style/SkinResult.css";

const SkinResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { imgUrl?: string; prediction?: any; emotion?: string } | null;
  const imgUrl = state?.imgUrl;
  const prediction = state?.prediction;
  const emotion = state?.emotion;
  const dictEmotion = {
    'Happiness': '😊',
    'Sadness': '😢',
    'Anger': '😠',
    'Fear': '😨',
    'Surprise': '😲',
    'Neutral': '😐',
    'Contempt': '😨',
    'Disgust': '🤢',
  };

  const resultData: { name: string; percent: number }[] = prediction?.scores
    ? Object.entries(prediction.scores).map(([name, percent]) => ({
      name,
      percent: Number(percent),
    })).sort((a, b) => b.percent - a.percent)
    : [];

  const topName = prediction?.predicted_class ?? "";
  const topConfidence = prediction?.confidence ?? 0;

  return (
    <div className="result-page">
      <div className="result-card">
        <h1 className="result-title">피부 분석 결과</h1>

        <img
          src={imgUrl || "/image/SkinRank/skin5.jpg"}
          alt="결과 이미지"
          className="result-image"
        />
        <div>
          <span className="result-emotion" style={{ fontSize: "2.5rem" }}>{dictEmotion[emotion as keyof typeof dictEmotion]}</span>
        </div>
        
        <div>
          <p className="result-guide">
            현재 분석 결과, <span className="highlight">{topName}</span> 가능성이
            가장 높게 나타났어요. ({topConfidence}%)<br />
            누적된 피부 측정 기록을 통해 나의 피부 변화를 확인해보세요.
          </p>
        </div>

        <div className="result-list">
          {resultData.map((item) => (
            <div key={item.name} className="result-item">
              <span className="result-name">{item.name}</span>

              <div className="result-bar">
                <div
                  className="result-fill"
                  style={{ width: `${item.percent}%` }}
                />
              </div>

              <span className="result-percent">{item.percent}%</span>
            </div>
          ))}
        </div>

        <div className="result-button-group">
          <button
            className="result-button report-button"
            onClick={() => navigate("/MyPage/skinreport")}
          >
            피부 진단 리포트 확인하러 가기
          </button>

          <button
            className="result-button retry-button"
            onClick={() => navigate("/skinanalysis")}
          >
            다시 진단하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkinResult;