import React from "react";
import { useNavigate } from "react-router-dom";
import "./style/SkinResult.css";

const resultData = [
  { name: "여드름", percent: 40 },
  { name: "염증성", percent: 30 },
  { name: "아토피", percent: 20 },
  { name: "건선", percent: 10 },
];

const SkinResult: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="result-page">
      <div className="result-card">

        <h1 className="result-title">피부 분석 결과</h1>

        <img
          src="/image/SkinRank/skin5.jpg"
          alt="결과 이미지"
          className="result-image"
        />

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

        <button
          className="result-button"
          onClick={() => navigate("/skinanalysis")}
        >
          다시 진단하기
        </button>

      </div>
    </div>
  );
};

export default SkinResult;