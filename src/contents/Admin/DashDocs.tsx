import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { useAdminAuth } from '../../components/AdminAuthProvider';

const TEAL = "#5BC8BF";
const BG_COLOR = "#f4f7f8";
const TEXT_DARK = "#111827";
const TEXT_GRAY = "#6b7280";

const DashDocs: React.FC = () => {
    const [searchValue, setSearchValue] = useState("");
    const totalPages = 10;
    const page = 1;
    const userList: any[] = [];
    const { isAdmin, adminRole, adminName } = useAdminAuth();
    const handlePageChange = (pageNum: number) => { };
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
        }
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* 상단 헤더 */}
            <header style={{
                height: 72, backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px",
                flexShrink: 0
            }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: 0 }}>게시물 관리</h1>

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

            {/* 회원 관리 본문 */}
            <div style={{ padding: 32, overflowY: "auto", flex: 1 }}>

                {/* 상단 검색 및 필터 영역 (회원관리에 필수적인 요소 추가) */}
                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24
                }}>
                    <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <input
                                type="text"
                                placeholder="제목 또는 내용으로 검색"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                style={{
                                    padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
                                    fontSize: 14, width: 240, outline: "none"
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* 전체 유저 테이블 카드 */}
                <div style={{
                    backgroundColor: "#fff", borderRadius: 16, padding: "24px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, margin: 0 }}>전체 회원 목록</h3>
                        <span style={{ fontSize: 13, color: TEXT_GRAY, fontWeight: 500 }}>총 1,284명</span>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left" }}>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>ID</th>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>이메일</th>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>이름</th>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>성별</th>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>등급</th>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>가입일</th>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600, textAlign: "center" }}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList?.map(user => (
                                <tr key={user.user_id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background-color 0.2s" }} className="hover-row">
                                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_DARK, fontWeight: 500 }}>#{user.user_id}</td>
                                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_GRAY }}>{user.email}</td>
                                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_DARK }}>{user.nickname}</td>
                                    <td style={{ padding: "16px 8px" }}>
                                        <span style={{
                                            padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                                            backgroundColor: user.gender === "남자" ? "#56c1ff" : user.gender === "여자" ? "#fee2e2" : "#f3f4f6",
                                            color: user.gender === "남자" ? "#4c5e72" : user.gender === "여자" ? "#991b1b" : "#374151"
                                        }}>
                                            {user.gender}
                                        </span>
                                    </td>
                                    <td style={{ padding: "16px 8px" }}>
                                        <span style={{
                                            padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                                            backgroundColor: user.user_grade_id === 1 ? "#cecece" : user.user_grade_id === 2 ? "#f5eb68" : "#cecece",
                                            color: user.user_grade_id === 1 ? "#313131" : user.user_grade_id === 2 ? "#313131" : "#313131"
                                        }}>
                                            {user.user_grade_id === 1 ? '무료회원' : '유료회원'}
                                        </span>
                                    </td>
                                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_GRAY }}>{user.udate}</td>
                                    <td style={{ padding: "16px 8px", textAlign: "center" }}>
                                        {/* 관리 액션 버튼들 */}
                                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                            <button style={{
                                                padding: "6px 12px", border: "1px solid #e5e7eb", backgroundColor: "#fff",
                                                borderRadius: 6, fontSize: 12, fontWeight: 600, color: TEXT_DARK, cursor: "pointer"
                                            }}>
                                                수정
                                            </button>
                                            <button style={{
                                                padding: "6px 12px", border: "1px solid #fecaca", backgroundColor: "#fef2f2",
                                                borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#dc2626", cursor: "pointer"
                                            }}>
                                                정지
                                            </button>
                                        </div>
                                    </td>
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

export default DashDocs