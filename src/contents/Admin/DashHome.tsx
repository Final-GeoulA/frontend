import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/dash.css"
import { useAdminAuth } from "../../components/AdminAuthProvider";

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

const DashHome: React.FC = () => {
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [newMember, setNewMember] = useState(0);
  const [paid, setPaid] = useState(0);
  const { isAdmin, adminRole, adminName } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserList(page);
  }, [page]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, []);

  const fetchUserList = (page: number) => {
    axios.post(`${process.env.REACT_APP_BACK_ADMIN_URL}/api/user/info`, {}, {
      params: {
        page: page
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

  useEffect(() => {
    try {
      const total = axios.post(`${process.env.REACT_APP_BACK_ADMIN_URL}/api/user/member/total`).then(data => setTotal(data.data));
      const newMember = axios.post(`${process.env.REACT_APP_BACK_ADMIN_URL}/api/user/member/new`).then(data => setNewMember(data.data));
      const paid = axios.post(`${process.env.REACT_APP_BACK_ADMIN_URL}/api/user/member/paid`).then(data => setPaid(data.data));
    } catch (error) {
      console.error(error);
    }
  }, [])
  // 임시 더미 데이터 (나중에 81번 포트 JWT로 받아올 데이터들)
  const stats = [
    { label: "총 회원 수", value: total },
    { label: "신규 가입 (오늘)", value: newMember },
    { label: "유료 회원 수", value: paid },
    { label: "신고 접수", value: "3", isDanger: true },
  ];
  return (
    <div>
      {/* 상단 헤더 */}
      <header style={{
        height: 72, backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px"
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: 0 }}>대시보드 개요</h1>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {
            (adminRole === "SUPERADMIN") ?
              <div style={{
                padding: "6px 12px", backgroundColor: "#e8f8f7", color: TEAL,
                borderRadius: 20, fontSize: 13, fontWeight: 700
              }}>
                👑 최고 관리자 {adminName} 님
              </div> :
              <div style={{
                padding: "6px 12px", backgroundColor: "#e8f8f7", color: TEAL,
                borderRadius: 20, fontSize: 13, fontWeight: 700
              }}>
                일반 관리자 {adminName} 님
              </div>
          }
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
          <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
            <nav>
              <ul style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                listStyle: "none",
                padding: 0,
                margin: 0
              }}>
                {[...Array(totalPages || 0)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === page;

                  return (
                    <li key={i}>
                      <button
                        className={`page-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashHome

