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

// 피부 진단
import SkinAnalysis from "../contents/SkinAnalysis/SkinAnalysis";
import SkinResult from '../contents/SkinAnalysis/SkinResult';

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
import SkinReport from "../contents/Mypage/SkinReport";
import Chat from "../contents/MainPage/Chat";
import PasswordlessReg from "../contents/Login/PasswordlessReg";
import LoginLog from "../contents/Login/LoginLog";

// 진료 관리
import MedicalRecord from "../contents/MedicalRecord/MedicalRecord";
import MedicalRecordModal from "../contents/MedicalRecord/MedicalRecordModal";
import MedicalRecordUpload from "../contents/MedicalRecord/MedicalRecordUpload";

// 피부 랭킹
import SkinRank from "../contents/SkinRank/SkinRank";
import RequireAuth from "../components/RequireAuth";
import ChangePassword from "../contents/Mypage/ChangePassword";

// 결제
import Payment from "../contents/Payment/Payment";
import PaymentSuccess from "../contents/Payment/PaymentSuccess";
import ProductPayment from "../contents/Payment/ProductPayment";
import ProductPaymentSuccess from "../contents/Payment/ProductPaymentSuccess";
import JWTLogin from "../contents/Login/JWTLogin";
import AdminDashboard from "../contents/Admin/AdminDashboard";
import { elements } from "chart.js";

const AppRoutes: React.FC = () => {
  const routeList = [
    // 홈 화면
    { path: "/", element: <MainPage /> },

    // 피부 진단
    { path: "/skinanalysis", element: <RequireAuth><SkinAnalysis /></RequireAuth> },
    { path: "/skinresult", element: <RequireAuth><SkinResult /></RequireAuth> },

    // 서비스 문의
    { path: "/ServiceQuestion", element: <ServiceQuestion /> },

    //병원 약국 찾기 화면
    { path: "/HospitalSearch", element: <HospitalSearch /> },

    //제품추천
    { path: "/recommend", element: <RequireAuth><Recommend /></RequireAuth> },
    { path: "/recommenddetail/:prodid", element: <Recommenddetail /> },

    // 커뮤니티
    {path: "/board",element: (<RequireAuth><Board /></RequireAuth>),},
    { path: "/boarddetail/:num", element: <RequireAuth><Boarddetail /></RequireAuth> },
    { path: "/board/form", element: <RequireAuth><BoardForm /></RequireAuth> },

    // 진료 관리
    { path: "/MedicalRecord", element: <RequireAuth><MedicalRecord/></RequireAuth>},
    { path: "/MedicalRecordUpload", element: <RequireAuth><MedicalRecordUpload/></RequireAuth>},

    // 피부 랭킹
    { path: "/SkinRank", element: <RequireAuth><SkinRank /></RequireAuth> },

    // 결제 (프리미엄)
    { path: "/payment", element: <RequireAuth><Payment /></RequireAuth> },
    { path: "/payment/success", element: <PaymentSuccess /> },

    // 결제 (제품 구매)
    { path: "/product-payment", element: <RequireAuth><ProductPayment /></RequireAuth> },
    { path: "/product-payment/success", element: <RequireAuth><ProductPaymentSuccess /></RequireAuth> },

    // 로그인과 회원가입
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/login/pwl", element: <Passwordless /> },
    { path: "/signup/pwl", element: <PasswordlessReg /> },
    { path: "/admin/facelogin", element: <AdminLogin /> },
    { path: "/admin/login", element: <JWTLogin />},
    { path: "/find", element: <FindID /> },

    // 관리자
    { path: "/admin/dashboard", element: <AdminDashboard /> }

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
        <Route path="recommend" element={<Recommend likedOnly />} />
        <Route path="board" element={<Board />} />
        <Route path="loginlog" element={<LoginLog/>}/>
        <Route path="changepassword" element={<ChangePassword />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
