import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashDocs from "./DashDocs";
import DashHome from "./DashHome";
import DashMember from "./DashMember";
import { useAdminAuth } from '../../components/AdminAuthProvider';

const TEAL = "#5BC8BF";
const BG_COLOR = "#f4f7f8";
const TEXT_DARK = "#111827";
const TEXT_GRAY = "#6b7280";

interface UserInfo {
  user_id: number;
  email: string;
  nickname: string;
  gender: string;
  udate: string;
}

const AdminDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState(1);
  const navigate = useNavigate();
  const { isAdmin, adminRole, adminName } = useAdminAuth();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, []);

  const contentMap: Record<number, React.ReactNode> = {
    1: <DashHome />,
    2: <DashMember />,
    3: <DashDocs />,
    // 4: <SystemSettings />,
  };

  useEffect(() => {
    console.log('dd:', activeMenu);
  }, [activeMenu]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: BG_COLOR, fontFamily: "'Pretendard', sans-serif" }}>

      {/* 1. 사이드바 (Sidebar) */}
      <aside style={{
        width: "260px", backgroundColor: "#fff", borderRight: "1px solid #e5e7eb",
        display: "flex", flexDirection: "column", padding: "24px 0"
      }}>
        <div style={{ padding: "0 24px", marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: TEAL, margin: 0, letterSpacing: "-0.5px" }}>
            GeoulA 관리자 페이지
          </h2>
        </div>

        <nav style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          <ul onClick={e => setActiveMenu(1)}><SidebarItem icon={<HomeIcon />} label="대시보드" active={activeMenu === 1} /></ul>
          <ul onClick={e => setActiveMenu(2)}><SidebarItem icon={<UsersIcon />} label="회원 관리" active={activeMenu === 2} /></ul>
          <ul onClick={e => setActiveMenu(3)}><SidebarItem icon={<DocumentIcon />} label="게시물 관리" active={activeMenu === 3} /></ul>
          {/* <Link><SidebarItem icon={<DocumentIcon />} label="게시물 관리" /></Link>
          <Link><SidebarItem icon={<SettingsIcon />} label="시스템 설정" /></Link> */}
        </nav>
      </aside>
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {contentMap[activeMenu]}
      </main>
    </div>
  );
};

export default AdminDashboard;


// ---------- 사이드바 아이템 컴포넌트 ----------
const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
    backgroundColor: active ? TEAL : "transparent",
    color: active ? "#fff" : TEXT_GRAY,
    borderRadius: 8, cursor: "pointer",
    fontWeight: active ? 600 : 500,
    transition: "all 0.2s"
  }}>
    {icon}
    <span style={{ fontSize: 15 }}>{label}</span>
  </div>
);


// ---------- SVG 아이콘 모음 ----------
function HomeIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><path d="M9 22V12h6v10"></path></svg>; }
function UsersIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>; }
function DocumentIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>; }
function SettingsIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path></svg>; }
function LogoutIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>; }