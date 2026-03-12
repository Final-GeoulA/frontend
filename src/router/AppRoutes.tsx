import React from "react";

import Mypage from "../contents/Mypage/MyPage";
import { Route, Routes } from "react-router-dom";
import SkinInfo from "../contents/SkinInfo/SkinInfo";



import Login from "../contents/Login/Login";
import SignUp from "../contents/SignUp/SignUp";
import FindID from "../contents/Login/Find";

import MainPage from "../contents/MainPage/MainPage";
import ServiceQuestion from "../contents/MainPage/ServiceQuestion";

import BoardList from "../contents/Board/Board";


import Recommend from "../contents/Recommend/Recommend";
import Search from "../contents/Search/Search";
import Board from "../contents/Board/Board";

import Boarddetail from "../contents/Board/Boarddetail";
import Recommenddetail from "../contents/Recommend/Recommenddetail";
import BoardForm from "../contents/Board/BoardForm";
import SkinAnalysis from "../contents/SkinAnalysis/SkinAnalysis";

import SkinReport from "../contents/Mypage/SkinReport"

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


    { path: "/board", element: <Board /> },
    { path: "/boarddetail", element: <Boarddetail /> },
    { path: "/board/form", element: <BoardForm /> },


    { path: "/mypage", element: <Mypage /> },
    //피부 변화 리포트 화면
    { path: "/skinreport", element: <SkinReport /> },

	// 로그인과 회원가입
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },

	// 불명
    { path: "/Find", element: <FindID /> },
  ];

  return (
    <Routes>
      {routeList.map((route, idx) => (
        <Route key={idx} {...route} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
