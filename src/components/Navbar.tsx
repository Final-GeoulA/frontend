import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Navbar: React.FC = () => {
  const { member, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = async () => {
    await logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const authLinkStyle: React.CSSProperties = {
    color: "black",
    fontSize: "13px",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textDecoration: "none",
  };
  return (

    
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      style={{ padding: "0 0 8px 0" }}
    >
      <div
        className="container-fluid"
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarScroll"
        >
          <ul
            className="navbar-nav mx-auto my-2 my-lg-0 navbar-nav-scroll"
            style={{
              maxHeight: "100px",
              display: "flex",
              justifyContent: "center",
              gap: "150px",
              fontSize: "20px",
            }}
          >
            <Link
            to="/"
            style={{ fontSize: "24px", textDecoration: "none", color: "black" }}
          >
            GeoulA
          </Link>


            <li className="nav-item">
              <Link className="nav-link" to="/skinInfo">
                피부 백과
              </Link>
            </li>

            <li className="nav-item dropdown">
              <Link className="nav-link" to="/search">
                병원 약국 찾기
              </Link>
            </li>

            <li className="nav-item dropdown">
             <Link className="nav-link" to="/recommend">
                제품추천
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/board">
                게시판
              </Link>
            </li>

            <li className="nav-item">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {member ? (
              <>
                <span style={{ fontSize: "13px" }}>
                  {member.nickname}님 환영합니다.
                </span>
                <button onClick={handleLogout} style={authLinkStyle}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={authLinkStyle}>
                  로그인
                </Link>
                <Link to="/signup" style={authLinkStyle}>
                  회원가입
                </Link>
              </>
            )}
          </div>
            

            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/MyPage">
                마이페이지
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
