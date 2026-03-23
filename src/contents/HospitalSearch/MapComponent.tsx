// user_id=2로 고정
// 추후 로그인 기능 연동 후 실제 로그인 사용자 ID(user_id)로 변경 예정

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

  const initMap = async () => {
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

    await moveToCurrentLocation();

    const { bookmarkMap, savedPlaces } = await loadBookmarks();
    const medicalPlaces = await loadMedicalPlacesOnly();
    const merged = dedupePlaces([...savedPlaces, ...medicalPlaces]);

    setBookmarks(bookmarkMap);
    setPlaces(merged);
    drawMarkers(merged, bookmarkMap);
  };

  const createCurrentLocationMarker = () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <circle cx="18" cy="18" r="10" fill="#ff3b30" stroke="white" stroke-width="4"/>
      </svg>
    `;

    const imageSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    const imageSize = new window.kakao.maps.Size(36, 36);
    const imageOption = { offset: new window.kakao.maps.Point(18, 18) };

    return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
  };

  const createBookmarkMarker = () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
        <path d="M18 0C8 0 0 8 0 18c0 12 18 30 18 30s18-18 18-30C36 8 28 0 18 0z"
              fill="#35c4ae" stroke="white" stroke-width="2"/>

        <!-- 하트 icon -->
        <path d="M18 24
                C16 22, 11 18.5, 11 15
                C11 12.5, 13 11, 15.5 11
                C17 11, 18 12, 18.8 13.2
                C19.6 12, 20.6 11, 22.1 11
                C24.6 11, 26.6 12.5, 26.6 15
                C26.6 18.5, 21.6 22, 19.6 24
                Z"
              fill="white"/>
      </svg>
    `;
    const imageSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    const imageSize = new window.kakao.maps.Size(30, 38);
    const imageOption = { offset: new window.kakao.maps.Point(14, 34) };

    return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
  };

  const createHospitalMarker = () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
        <path d="M18 0C8 0 0 8 0 18c0 12 18 30 18 30s18-18 18-30C36 8 28 0 18 0z"
              fill="#fc944f" stroke="white" stroke-width="2"/>
        <rect x="15" y="10" width="6" height="16" rx="1" fill="white"/>
        <rect x="10" y="15" width="16" height="6" rx="1" fill="white"/>
      </svg>
    `;

    const imageSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    const imageSize = new window.kakao.maps.Size(24, 32);
    const imageOption = { offset: new window.kakao.maps.Point(12, 32) };

    return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
  };

  const createPharmacyMarker = () => {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 36 48">
      <path d="M18 0C8 0 0 8 0 18c0 12 18 30 18 30s18-18 18-30C36 8 28 0 18 0z"
            fill="#9780fd" stroke="white" stroke-width="2"/>
      <!-- 알약 icon -->
      <g transform="rotate(-45 18 18)">
        <rect x="10" y="14" width="16" height="8" rx="4" fill="white"/>
        <line x1="18" y1="14" x2="18" y2="22" stroke="#9780fd" stroke-width="2"/>
      </g>
    </svg>
  `;
    const imageSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    const imageSize = new window.kakao.maps.Size(24, 32);
    const imageOption = { offset: new window.kakao.maps.Point(12, 32) };

    return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
  };

  const moveToCurrentLocation = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        alert("GPS를 지원하지 않는 브라우저입니다.");
        resolve();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const locPosition = new window.kakao.maps.LatLng(lat, lng);
          const map = mapRef.current;

          if (!map) {
            resolve();
            return;
          }

          map.setCenter(locPosition);

          if (currentMarkerRef.current) {
            currentMarkerRef.current.setMap(null);
          }

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: locPosition,
            image: createCurrentLocationMarker()
          });

          currentMarkerRef.current = marker;
          resolve();
        },
        () => {
          resolve();
        }
      );
    });
  };

  const getMarkerImage = (place: any, bookmarkState: any) => {
    if (bookmarkState[place.id]) {
      return createBookmarkMarker();
    }

    if (place.type === "hospital") {
      return createHospitalMarker();
    }

    if (place.type === "pharmacy") {
      return createPharmacyMarker();
    }

    return undefined;
  };

  const drawMarkers = (data: any[], bookmarkState: any) => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (!data || data.length === 0) return;

    const bounds = new window.kakao.maps.LatLngBounds();

    data.forEach((place: any) => {
      const position = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: position,
        image: getMarkerImage(place, bookmarkState)
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        const categoryText =
          place.type === "hospital" ? "병원"
            : place.type === "pharmacy" ? "약국"
            : "";

        const content = `
          <div style="padding:8px;font-size:13px;">
            <b>${place.place_name}</b><br/>
            ${place.address_name}
            ${categoryText ? `<br/><span style="color:#666;">${categoryText}</span>` : ""}
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

  const dedupePlaces = (data: any[]) => {
    const placeMap = new Map();

    data.forEach((place) => {
      placeMap.set(String(place.id), place);
    });

    return Array.from(placeMap.values());
  };

  const loadBookmarks = async () => {
    try {
      const response = await fetch(
        "http://localhost/geoulA/api/hospital/bookmarks?userId=2"
      );

      if (!response.ok) {
        throw new Error("북마크 조회 실패");
      }

      const data = await response.json();
      console.log("서버 북마크 데이터:", data);

      const bookmarkMap: { [key: string]: boolean } = {};

      const savedPlaces = data.map((hospital: any) => {
        bookmarkMap[String(hospital.placeId)] = true;

        return {
          id: String(hospital.placeId),
          place_name: hospital.name,
          address_name: hospital.address,
          y: String(hospital.lat),
          x: String(hospital.lon),
          type: hospital.name?.includes("약국") ? "pharmacy" : "hospital"
        };
      });

      return { bookmarkMap, savedPlaces };
    } catch (error) {
      console.error(error);
      return { bookmarkMap: {}, savedPlaces: [] };
    }
  };

  const loadMedicalPlacesOnly = async () => {
    const map = mapRef.current;
    if (!map) return [];

    const ps = new window.kakao.maps.services.Places(map);

    const searchByCategory = (categoryCode: string) => {
      return new Promise<any[]>((resolve) => {
        ps.categorySearch(
          categoryCode,
          (data: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              resolve(data);
            } else {
              resolve([]);
            }
          },
          { useMapBounds: true }
        );
      });
    };

    const hospitalData = (await searchByCategory("HP8")).map((place) => ({
      ...place,
      type: "hospital"
    }));

    const pharmacyData = (await searchByCategory("PM9")).map((place) => ({
      ...place,
      type: "pharmacy"
    }));

    return dedupePlaces([...hospitalData, ...pharmacyData]);
  };

  const searchPlaces = async () => {
    if (!keyword.trim()) return;

    const { bookmarkMap } = await loadBookmarks();
    const ps = new window.kakao.maps.services.Places();

    const searchConfigs = [
      { keyword: `${keyword} 병원`, type: "hospital" },
      { keyword: `${keyword} 약국`, type: "pharmacy" },
      { keyword: `${keyword} 피부과`, type: "hospital" }
    ];

    const searchOne = (searchKeyword: string, type: string) => {
      return new Promise<any[]>((resolve) => {
        ps.keywordSearch(searchKeyword, (data: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            resolve(
              data.map((place: any) => ({
                ...place,
                type
              }))
            );
          } else {
            resolve([]);
          }
        });
      });
    };

    const results = await Promise.all(
      searchConfigs.map((item) => searchOne(item.keyword, item.type))
    );

    const merged = dedupePlaces(results.flat());

    setPlaces(merged);
    setBookmarks(bookmarkMap);
    drawMarkers(merged, bookmarkMap);
  };

  const moveToPlace = (place: any, index: number) => {
    const map = mapRef.current;
    if (!map) return;

    const position = new window.kakao.maps.LatLng(place.y, place.x);

    map.setCenter(position);
    map.setLevel(3);

    const marker = markersRef.current[index];

    const categoryText =
      place.type === "hospital" ? "병원"
        : place.type === "pharmacy" ? "약국"
        : "";

    const content = `
      <div style="padding:8px;font-size:13px;">
        <b>${place.place_name}</b><br/>
        ${place.address_name}
        ${categoryText ? `<br/><span style="color:#666;">${categoryText}</span>` : ""}
      </div>
    `;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(map, marker);
  };

  const toggleBookmark = async (place: any) => {
    try {
      const isBookmarked = bookmarks[place.id];
      let response;

      if (isBookmarked) {
        response = await fetch(
          `http://localhost/geoulA/api/hospital/delete?placeId=${place.id}&userId=2`,
          {
            method: "DELETE"
          }
        );
      } else {
        response = await fetch(
          "http://localhost/geoulA/api/hospital/save?userId=2",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              placeId: place.id,
              name: place.place_name,
              address: place.address_name,
              lat: parseFloat(place.y),
              lon: parseFloat(place.x)
            })
          }
        );
      }

      if (!response.ok) {
        throw new Error("북마크 처리 실패");
      }

      const { bookmarkMap, savedPlaces } = await loadBookmarks();
      const merged = dedupePlaces(
        places.map((p) => {
          const saved = savedPlaces.find((sp: any) => String(sp.id) === String(p.id));
          return saved ? { ...p, type: saved.type || p.type } : p;
        })
      );

      setBookmarks(bookmarkMap);
      setPlaces(merged);
      drawMarkers(merged, bookmarkMap);
    } catch (error) {
      console.error(error);
      alert("북마크 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="map-layout">
      <h4 className="search-title">병원·약국찾기</h4>
      <p className="search-info">병원과 약국을 검색하고 원하는 장소를 저장하세요</p>

      <div className="map-wrapper">
        <div className="sidebar">
          <div className="sidebar-header">GeoulA</div>

          <div className="search-box">
            <input
              type="text"
              placeholder="지역명 또는 병원·약국 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchPlaces();
              }}
            />
            <button onClick={searchPlaces}>🔍</button>
          </div>

          <div className="result-list">
            {places.map((place, index) => (
              <div
                key={place.id}
                className="result-item"
                onClick={() => moveToPlace(place, index)}
              >
                <div className="place-header">
                  <div className="place-name">
                    {index + 1}. {place.place_name}
                  </div>

                  <div
                    className="bookmark"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(place);
                    }}
                  >
                    {bookmarks[place.id] ? "♥" : "♡"}
                  </div>
                </div>

                <div className="place-address">{place.address_name}</div>
              </div>
            ))}
          </div>
        </div>

        <div id="map"></div>
      </div>

      <div
        className="gps-btn"
        onClick={async () => {
          await moveToCurrentLocation();

          const { bookmarkMap, savedPlaces } = await loadBookmarks();
          const medicalPlaces = await loadMedicalPlacesOnly();
          const merged = dedupePlaces([...savedPlaces, ...medicalPlaces]);

          setBookmarks(bookmarkMap);
          setPlaces(merged);
          drawMarkers(merged, bookmarkMap);
        }}
      >
        현재 위치
      </div>
    </div>
  );
};

export default MapComponent;