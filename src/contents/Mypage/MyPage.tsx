import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import './style/MyPage.css';

const MyPage: React.FC = () => {
  return (
    <div className="mypage-wrapper">

      {/* 왼쪽 탭바 */}
      <aside className="sidebar">
        <div className="profile">
          <div className="profile-img"></div>
          <p>user123님</p>
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