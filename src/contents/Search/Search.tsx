// Search.tsx
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}



const Search: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const mapInstanceRef = useRef<any>(null);



  useEffect(() => {
    // 이미 로드되어 있으면 바로 사용
    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    // 스크립트 동적 추가
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=836d89a37130cf3be86c76f8b6848b19&autoload=false&libraries=services";
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        initMap();
      });
    };
    document.head.appendChild(script);

    // 컴포넌트 unmount 시 정리 (선택)
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    const container = document.getElementById("map") as HTMLDivElement;
    if (!container) return;

    const options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);
    mapInstanceRef.current = map;
  };

  const searchPlaces = () => {
    if (!keyword.trim() || !mapInstanceRef.current) return;

    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(keyword, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 마커 생성
        data.forEach((place: any) => {
          const marker = new window.kakao.maps.Marker({
            position: place.latlng,
            map: mapInstanceRef.current,
          });
        });
      }
    });
  };


  return (


    <div style={{
      position: "relative",
      width: "80%",
      height: "100vh"
    }}> <div style={{
      width: "300px",
      padding: "20px",
      background: "white",
      boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
      height: "100vh",
      overflowY: "auto"
    }}>
      <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>병원·약국 찾기</h2>
        <p style={{ margin: "0 0 20px 0", color: "#666", fontSize: "14px" }}>
          병원과 약국을 검색하고 원하는 장소를 저장하세요
        </p>


        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="병원, 약국 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px"
            }}
            onKeyPress={(e) => e.key === 'Enter' && searchPlaces()}
          />
          <button
            onClick={searchPlaces}
            style={{
              padding: "12px 20px",
              background: "#ffe400",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            검색
          </button>
        </div>
      </div>
      <div
        id="map"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-30.5%, -50%)",  // ← 핵심!
          width: "80%",
          height: "80%"
        }}
      />
    </div>
  );
};

export default Search;
