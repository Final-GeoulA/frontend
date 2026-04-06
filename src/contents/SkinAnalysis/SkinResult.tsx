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

  // 가장 높은 비율 데이터 찾기
  const topResult = resultData.reduce((prev, current) =>
    current.percent > prev.percent ? current : prev
  );

  return (
    <div className="result-page">
      <div className="result-card">
        <h1 className="result-title">피부 분석 결과</h1>

        <img
          src="/image/SkinRank/skin5.jpg"
          alt="결과 이미지"
          className="result-image"
        />

        <p className="result-guide">
          현재 분석 결과, <span className="highlight">{topResult.name}</span> 가능성이
          가장 높게 나타났어요.  <br/>
          누적된 피부 측정 기록을 통해 나의 피부 변화를 확인해보세요.
        </p>

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