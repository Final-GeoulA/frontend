import React, { useEffect, useRef, useState } from "react";
import "./style/MapComponent.css";

declare global {
  interface Window {
    kakao: any;
  }
}

const MapComponent: React.FC = () => {

  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const currentMarkerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {

    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

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

  }, []);

  const initMap = () => {
    const container = document.getElementById("map");
    if (!container) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 3
    };

    const map = new window.kakao.maps.Map(container, options);
    mapRef.current = map;
    infoWindowRef.current = new window.kakao.maps.InfoWindow({
      zIndex: 1
    });

    moveToCurrentLocation();
  };

  const moveToCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS를 지원하지 않는 브라우저입니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const locPosition = new window.kakao.maps.LatLng(lat, lng);
      const map = mapRef.current;

      map.setCenter(locPosition);

      if (currentMarkerRef.current) {
        currentMarkerRef.current.setMap(null);
      }

      const marker = new window.kakao.maps.Marker({
        map: map,
        position: locPosition
      });

      currentMarkerRef.current = marker;
    });
  };

  const createBookmarkMarker = () => {

    const imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    const imageSize = new window.kakao.maps.Size(24, 35);

    return new window.kakao.maps.MarkerImage(imageSrc, imageSize);
  };

  const drawMarkers = (data: any[], bookmarkState: any) => {
    const map = mapRef.current;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();

    data.forEach((place: any, index:number) => {

      const position = new window.kakao.maps.LatLng(place.y, place.x);

      const marker = new window.kakao.maps.Marker({
        map: map,
        position: position,
        image: bookmarkState[place.id] ? createBookmarkMarker() : undefined
      });

      window.kakao.maps.event.addListener(marker, "click", () => {

        const content = `
          <div style="padding:8px;font-size:13px;">
            <b>${place.place_name}</b><br/>
            ${place.address_name}
          </div>
        `;

        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(map, marker);

      });

      markersRef.current.push(marker);
      bounds.extend(position);

    });
    map.setBounds(bounds);
  };

  const searchPlaces = () => {
    if (!keyword.trim()) return;
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);
        drawMarkers(data, bookmarks);
      }
    });
  };

  const moveToPlace = (place:any, index:number) => {

    const map = mapRef.current;
    const position = new window.kakao.maps.LatLng(place.y, place.x);

    map.setCenter(position);
    map.setLevel(3);

    const marker = markersRef.current[index];

    const content = `
      <div style="padding:8px;font-size:13px;">
        <b>${place.place_name}</b><br/>
        ${place.address_name}
      </div>
    `;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(map, marker);

  };

  const toggleBookmark = (placeId: string) => {
    setBookmarks((prev) => {
      const updated = {
        ...prev,
        [placeId]: !prev[placeId]
      };

      drawMarkers(places, updated);

      return updated;
    });
  };

  return (
    <div className="map-layout">
      <h4 className="search-title">병원·약국찾기</h4>
      <p className="">병원과 약국을 검색하고 원하는 장소를 저장하세요</p>
      <div className="map-wrapper">
        {/* 왼쪽 패널 */}
        <div className="sidebar">
          <div className="sidebar-header">
            GeoulA
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="병원, 약국 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchPlaces();
              }}
            />

            <button onClick={searchPlaces}>
              🔍
            </button>

          </div>

          <div className="result-list">

            {places.map((place, index) => (

              <div
                key={place.id}
                className="result-item"
                onClick={()=>moveToPlace(place,index)}
              >

                <div className="place-header">
                  <div className="place-name">
                    {index + 1}. {place.place_name}
                  </div>

                  <div
                    className="bookmark"
                    onClick={(e)=>{
                      e.stopPropagation();
                      toggleBookmark(place.id);
                    }}
                  >
                    {bookmarks[place.id] ? "♥" : "♡"}
                  </div>
                </div>

                <div className="place-address">
                  {place.address_name}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 지도 */}
        <div id="map"></div>
      </div>

      {/* 현재 위치 버튼 */}
      <div className="gps-btn" onClick={moveToCurrentLocation}>
        현재 위치
      </div>
    </div>
  );
};

export default MapComponent;