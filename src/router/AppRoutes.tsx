import React from "react";
import { Route, Routes, Navigate  } from "react-router-dom";

// 로그인, 회원가입
import Login from "../contents/Login/Login";
import SignUp from "../contents/SignUp/SignUp";
import FindID from "../contents/Login/Find";

// 메인 페이지
import MainPage from "../contents/MainPage/MainPage";
import ServiceQuestion from "../contents/MainPage/ServiceQuestion";

// 피부 백과
import SkinInfo from "../contents/SkinInfo/SkinInfo";

// 커뮤니티
import Board from "../contents/Board/Board";
import BoardForm from "../contents/Board/BoardForm";
import Boarddetail from "../contents/Board/Boarddetail";

// 제품 추천
import Recommend from "../contents/Recommend/Recommend";
import Recommenddetail from "../contents/Recommend/Recommenddetail";

// 병원. 약국 찾기
import Search from "../contents/Search/Search";

// 마이페이지
import Mypage from "../contents/Mypage/MyPage";
import SkinAnalysis from "../contents/SkinAnalysis/SkinAnalysis";
import SkinReport from "../contents/Mypage/SkinReport";
import Chat from "../contents/MainPage/Chat";

const AppRoutes: React.FC = () => {


  
  const routeList = [

    // 홈 화면
    { path: "/", element: <MainPage /> },

    // 촬영 or 사진 업로드
    { path: "/skinanalysis", element: <SkinAnalysis /> },

    // 서비스 문의
    { path: "/ServiceQuestion", element: <ServiceQuestion /> },

    // 피부 백과 화면
    { path: "/skininfo", element: <SkinInfo /> },

    //병원 약국 찾기 화면
    { path: "/search", element: <Search /> },

    //제품추천
    { path: '/recommend', element: <Recommend /> },
    { path: '/recommenddetail', element: <Recommenddetail /> },

    // 커뮤니티
    
    { path: "/board", element: <Board /> },
    { path: "/boarddetail", element: <Boarddetail /> },
    { path: "/board/form", element: <BoardForm /> },

	// 로그인과 회원가입
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },

	// 불명
    { path: "/Find", element: <FindID /> },

    
  ];

return (
  <Routes>

    {/* 기존 routeList */}
    {routeList.map((route, idx) => (
      <Route key={idx} {...route} />
    ))}

    {/* 마이페이지 Layout */}
    <Route path="/mypage" element={<Mypage />}>

      {/* 첫 화면 → skinreport */}
      <Route index element={<Navigate to="skinreport" replace />} />

      <Route path="skinreport" element={<SkinReport />} />
      <Route path="savedhospitals" element={<Search />} />
      <Route path="recommend" element={<Recommend />} />
      <Route path="board" element={<Board />} />

    </Route>

  </Routes>
);
};

export default AppRoutes;
