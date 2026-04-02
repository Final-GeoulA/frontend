import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// 로그인, 회원가입
import Login from "../contents/Login/Login";
import SignUp from "../contents/SignUp/SignUp";
import FindID from "../contents/Login/Find";

import Passwordless from "../contents/Login/Passwordless"
import AdminLogin from "../contents/Login/AdminLogin";

// 메인 페이지
import MainPage from "../contents/MainPage/MainPage";
import ServiceQuestion from "../contents/MainPage/ServiceQuestion";

// 커뮤니티
import Board from "../contents/Board/Board";
import BoardForm from "../contents/Board/BoardForm";
import Boarddetail from "../contents/Board/Boarddetail";

// 제품 추천
import Recommend from "../contents/Recommend/Recommend";
import Recommenddetail from "../contents/Recommend/Recommenddetail";

// 병원. 약국 찾기
import HospitalSearch from "../contents/HospitalSearch/HospitalSearch";

// 마이페이지
import Mypage from "../contents/Mypage/MyPage";
import SkinAnalysis from "../contents/SkinAnalysis/SkinAnalysis";
import SkinReport from "../contents/Mypage/SkinReport";
import Chat from "../contents/MainPage/Chat";
import PasswordlessReg from "../contents/Login/PasswordlessReg";

// 진료 관리
import MedicalRecord from "../contents/MedicalRecord/MedicalRecord";
import MedicalRecordModal from "../contents/MedicalRecord/MedicalRecordModal";
import MedicalRecordUpload from "../contents/MedicalRecord/MedicalRecordUpload";

// 피부 랭킹
import SkinRank from "../contents/SkinRank/SkinRank";
import RequireAuth from "../components/RequireAuth";

// 결제
import Payment from "../contents/Payment/Payment";
import PaymentSuccess from "../contents/Payment/PaymentSuccess";

const AppRoutes: React.FC = () => {
  const routeList = [
    // 홈 화면
    { path: "/", element: <MainPage /> },

    // 촬영 or 사진 업로드
    { path: "/skinanalysis", element: <SkinAnalysis /> },

    // 서비스 문의
    { path: "/ServiceQuestion", element: <ServiceQuestion /> },

    //병원 약국 찾기 화면
    { path: "/HospitalSearch", element: <HospitalSearch /> },

    //제품추천
    { path: "/recommend", element: <Recommend /> },
    { path: "/recommenddetail/:prodid", element: <Recommenddetail /> },

    // 커뮤니티
    {
      path: "/board",
      element: (
        <RequireAuth>
          <Board />
        </RequireAuth>
      ),
    },
    { path: "/boarddetail/:num", element: <Boarddetail /> },
    { path: "/board/form", element: <BoardForm /> },

    // 진료 관리
    { path: "/MedicalRecord", element: <MedicalRecord/>},
    { path: "/MedicalRecordUpload", element: <MedicalRecordUpload/>},

    // 피부 랭킹
    { path: "/SkinRank", element: <SkinRank /> },

    // 결제
    { path: "/payment", element: <Payment /> },
    { path: "/payment/success", element: <PaymentSuccess /> },

    // 로그인과 회원가입
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/login/pwl", element: <Passwordless /> },
    { path: "/signup/pwl", element: <PasswordlessReg /> },
    { path: "/admin/login", element: <AdminLogin /> },

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
        <Route path="savedhospitals" element={<HospitalSearch />} />
        <Route path="recommend" element={<Recommend />} />
        <Route path="board" element={<Board />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
