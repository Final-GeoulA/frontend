import React, { useState } from "react";

const SkinInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState("여드름");

  const renderContent = () => {
    switch (activeTab) {
      case "여드름":
        return (
          <div>
            <h2>여드름</h2>
            <img src="/image/Skininfo/여드름.jpg" />
            <p>피지선의 과도한 분비와 모공 막힘으로 발생하며, 스트레스나 호르몬 변화에 따라 악화될 수 있습니다.
              꾸준한 세안과 관리, 필요 시 피부과 치료를 병행하면 개선이 가능합니다.</p>
          </div>
        );
      case "염증성":
        return (
          <div>
            <h2>염증성</h2>
            <img src="/image/Skininfo/염증성.png" />
            <p>바이러스·세균·곰팡이 등 다양한 원인으로 피부에 염증이 생깁니다.
              붉은 반점, 부종, 가려움, 진물 등의 증상이 동반될 수 있으며, 원인에 따라 적절한 치료가 필요합니다.</p>
          </div>
        );
      case "건선":
        return (
          <div>
            <h2>건선</h2>
            <img src="/image/Skininfo/건선.jpg" />
            <p>면역체계의 이상으로 인해 피부세포가 빠르게 증식하면서 은백색의 각질이 생깁니다.
              만성 질환이지만 꾸준한 보습, 자외선 관리, 전문 치료로 증상 완화를 도모할 수 있습니다.</p>
          </div>
        );
      case "아토피":
        return (
          <div>
            <h2>아토피</h2>
            <img src="/image/Skininfo/아토피.jpg" />
            <p>유전적 요인과 환경적 자극으로 인해 가려움과 염증이 반복되는 만성 습진 질환입니다.
              피부 장벽 강화와 보습 유지, 알레르기 유발 요인 회피가 중요한 관리 방법입니다.

            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>피부 백과</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around", // 💡 네브바 버튼 간격 균등 분배
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          padding: "15px 0",
          borderRadius: "8px",
          marginBottom: "25px",
        }}
      >
        {["여드름", "염증성", "건선", "아토피"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: "0 1 20%", // 각 버튼이 일정한 폭 비율 차지
              maxWidth: "150px",
              padding: "12px 0",
              border: activeTab === tab ? "3px solid #5ddbc8" : "1px solid #ccc",
              backgroundColor: activeTab === tab ? "#5ddbc8" : "white",
              color: activeTab === tab ? "#333" : "#333",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontWeight: "bold",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fafafa",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default SkinInfo;
