import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useAdminAuth } from "./AdminAuthProvider";
import "./css/Navbar.css";

const Navbar: React.FC = () => {
  const { member, logout } = useAuth();
  const { isAdmin, adminName, adminLogin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-inner">

        {/* 로고 */}
        <Link to="/" className="navbar-logo">
          GeoulA
        </Link>

        {/* 메뉴 탭 */}
        <ul className="navbar-menu">
          <li>  <Link to="/skinanalysis">피부 분석</Link>  </li>
          <li>  <Link to="/recommend">제품 추천</Link>  </li>
          <li>  <Link to="/HospitalSearch">병원 약국 찾기</Link>  </li>
          <li>  <Link to="/MedicalRecord">진료 기록</Link>   </li>
          <li>  <Link to="/SkinRank">피부 랭킹</Link>  </li>
          <li>  <Link to="/board">커뮤니티</Link>  </li>

        </ul>

        {/* 로그인 영역 */}
        <div className="navbar-auth">
          {member ? (
            <>
              <Link to="/MyPage" className="welcome-text">
                {member?.nickname}님
              </Link>

              <button onClick={handleLogout} className="auth-link">
                로그아웃
              </button>
            </>
          ) : (
            isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="welcome-text">
                  관리자 {adminName}님
                </Link>

                <button onClick={adminLogout} className="auth-link">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-link">
                  로그인
                </Link>

                <Link to="/signup" className="auth-link">
                  회원가입
                </Link>
              </>
          ))}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;