import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import './style/MyPage.css';
import { useAuth } from "../../components/AuthProvider";

const MyPage: React.FC = () => {
  const {member} = useAuth()
  const navigate = useNavigate();
  return (
    <div className="mypage-wrapper">

      {/* 왼쪽 탭바 */}
      <aside className="sidebar">
        <div className="profile">
          <p className="profile-nickname">{member?.nickname}</p>
          <span className={`grade-badge ${member?.user_grade_id === 2 ? "grade-premium" : "grade-normal"}`}>
            {member?.user_grade_id === 2 ? "프리미엄" : "일반"}
          </span>
          {member?.user_grade_id !== 2 && (
            <button className="upgrade-btn" onClick={() => navigate("/payment")}>프리미엄 결제</button>
          )}
        </div>

        <nav className="menu">
          <NavLink to="skinreport">피부 변화 리포트</NavLink>
          <NavLink to="savedhospitals">저장한 병원</NavLink>
          <NavLink to="recommend">저장한 제품</NavLink>
          <NavLink to="board">내가 쓴 게시글</NavLink>
        </nav>
      </aside>

      {/* 오른쪽 컴포넌트 */}
      <main className="content">
        <Outlet />
      </main>

    </div>
  );
};

export default MyPage;