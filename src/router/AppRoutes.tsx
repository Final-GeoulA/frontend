import React from "react";

import Mypage from "../contents/Mypage/MyPage";
import { Route, Routes } from "react-router-dom";
import SkinInfo from "../contents/SkinInfo/SkinInfo";



import Login from "../contents/Login/Login";
import SignUp from "../contents/SignUp/SignUp";


import FindID from "../contents/Login/Find";

import BoardList from "../contents/Board/Board";


import Recommend from "../contents/Recommend/Recommend";
import MainPage from "../contents/MainPage/MainPage";
import Search from "../contents/Search/Search";
import Board from "../contents/Board/Board";
import Boarddetail from "../contents/Board/Boarddetail";
import Recommenddetail from "../contents/Recommend/Recommenddetail";


const AppRoutes: React.FC = () => {
  const routeList = [

    // 홈 화면
    { path: "/", element: <MainPage /> },


    // 피부 백과 화면
    { path: "/skininfo", element: <SkinInfo /> },

    //병원 약국 찾기 화면
    { path: "/search", element: <Search /> },

    //제품추천
    { path: '/recommend', element: <Recommend /> },
    { path: '/recommenddetail', element: <Recommenddetail /> },


    { path: "/board", element: <Board /> },
    { path: "/boarddetail", element: <Boarddetail /> },

    

    { path: "/mypage", element: <Mypage /> },

    { path: "/login", element: <Login /> },
    { path: "/Find", element: <FindID /> },
    { path: "/signup", element: <SignUp /> },


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
