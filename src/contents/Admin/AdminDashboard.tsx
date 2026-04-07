import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchUserList(page);
  }, [page]);

  const fetchUserList = (page: number) => {
    axios.post(`${process.env.REACT_APP_BACK_ADMIN_URL}/api/user/info`, {
      params: {
        page: page,
        size
      },
    }).then(response => {
      console.log(response.data.content);
      setUserList(response.data.content);
      setTotalPages(response.data.total_pages)
    })
      .catch(error => {
        console.error('오류', error)
      })
  }
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  // 임시 더미 데이터 (나중에 81번 포트 JWT로 받아올 데이터들)
  const stats = [
    { label: "총 회원 수", value: "1,284", increase: "+12%" },
    { label: "신규 가입 (오늘)", value: "42", increase: "+5%" },
    { label: "신규 게시글", value: "315", increase: "+18%" },
    { label: "신고 접수", value: "3", increase: "-2%", isDanger: true },
  ];

  // const recentUsers = [
  //     { id: 1, email: "user01@test.com", name: "김철수", status: "활성", date: "2026-04-03" },
  //     { id: 2, email: "hello_world@test.com", name: "이영희", status: "대기", date: "2026-04-03" },
  //     { id: 3, email: "hacker99@test.com", name: "박지성", status: "정지", date: "2026-04-02" },
  //     { id: 4, email: "admin_tester@test.com", name: "홍길동", status: "활성", date: "2026-04-01" },
  // ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: BG_COLOR, fontFamily: "'Pretendard', sans-serif" }}>

      {/* 1. 사이드바 (Sidebar) */}
      <aside style={{
        width: "260px", backgroundColor: "#fff", borderRight: "1px solid #e5e7eb",
        display: "flex", flexDirection: "column", padding: "24px 0"
      }}>
        <div style={{ padding: "0 24px", marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: TEAL, margin: 0, letterSpacing: "-0.5px" }}>
            GeoulA Admin
          </h2>
        </div>

        <nav style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          <SidebarItem icon={<HomeIcon />} label="대시보드" active />
          <SidebarItem icon={<UsersIcon />} label="회원 관리" />
          <SidebarItem icon={<DocumentIcon />} label="게시물 관리" />
          <SidebarItem icon={<SettingsIcon />} label="시스템 설정" />
        </nav>

        <div style={{ padding: "0 16px" }}>
          <button style={{
            width: "100%", padding: "12px", background: "#fef2f2", color: "#dc2626",
            border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            <LogoutIcon /> 로그아웃
          </button>
        </div>
      </aside>

      {/* 2. 메인 콘텐츠 영역 */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* 상단 헤더 */}
        <header style={{
          height: 72, backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb",
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px"
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: 0 }}>대시보드 개요</h1>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              padding: "6px 12px", backgroundColor: "#e8f8f7", color: TEAL,
              borderRadius: 20, fontSize: 13, fontWeight: 700
            }}>
              👑 최고 관리자
            </div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#e5e7eb", cursor: "pointer" }} />
          </div>
        </header>

        {/* 대시보드 본문 */}
        <div style={{ padding: 32, overflowY: "auto" }}>

          {/* 상태 카드 (KPI) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 32 }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{
                backgroundColor: "#fff", padding: 24, borderRadius: 16,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
              }}>
                <p style={{ fontSize: 14, color: TEXT_GRAY, margin: "0 0 8px 0", fontWeight: 500 }}>{stat.label}</p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                  <h3 style={{ fontSize: 28, fontWeight: 700, color: TEXT_DARK, margin: 0 }}>{stat.value}</h3>
                  <span style={{ fontSize: 13, fontWeight: 600, color: stat.isDanger ? "#dc2626" : TEAL, marginBottom: 4 }}>
                    {stat.increase}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 최근 가입 유저 테이블 */}
          <div style={{
            backgroundColor: "#fff", borderRadius: 16, padding: "24px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, margin: 0 }}>최근 가입 유저</h3>
              <span style={{ fontSize: 13, color: TEAL, fontWeight: 600, cursor: "pointer" }}>전체 보기 &rarr;</span>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left" }}>
                  <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>ID</th>
                  <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>이메일</th>
                  <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>이름</th>
                  <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>성별</th>
                  <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>가입일</th>
                </tr>
              </thead>
              <tbody>
                {userList.map(user => (
                  <tr key={user.user_id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_DARK, fontWeight: 500 }}>#{user.user_id}</td>
                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_GRAY }}>{user.email}</td>
                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_DARK }}>{user.nickname}</td>
                    <td style={{ padding: "16px 8px" }}>
                      <span style={{
                        padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                        backgroundColor: user.gender === "남자" ? "#dcfce7" : user.gender === "여자" ? "#fee2e2" : "#f3f4f6"
                      }}>
                        {user.gender}
                      </span>
                    </td>
                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_GRAY }}>{user.udate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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