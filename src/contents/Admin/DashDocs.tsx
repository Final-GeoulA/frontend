import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { useAdminAuth } from '../../components/AdminAuthProvider';
import "./style/dash.css"

const TEAL = "#5BC8BF";
const TEXT_DARK = "#111827";
const TEXT_GRAY = "#6b7280";

interface BoardInfo {
    board_skin_id: number;
    title: string;
    writer: string;
    hit: number;
    elike: number;
    bdate: string;
}

const DashDocs: React.FC = () => {
    const [postList, setPostList] = useState<BoardInfo[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const { isAdmin, adminRole, adminName } = useAdminAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        fetchPostList(page, searchValue);
    }, [page, searchValue]);

    const fetchPostList = (cPage: number, title: string) => {
        axios.get(`${process.env.REACT_APP_BACK_END_URL}/board/skin/list`, {
            params: { cPage, title },
            withCredentials: true,
        }).then(response => {
            setPostList(response.data.data);
            setTotalPages(response.data.totalPages);
            setTotal(response.data.totalItems);
        }).catch(error => console.error('오류', error));
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

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
                    <div style={{
                        padding: "6px 12px", backgroundColor: "#e8f8f7", color: TEAL,
                        borderRadius: 20, fontSize: 13, fontWeight: 700
                    }}>
                        {adminRole === "SUPERADMIN" ? "👑 " : ""}{adminName} 님
                    </div>
                </div>
            </header>

            {/* 게시물 관리 본문 */}
            <div style={{ padding: 32, overflowY: "auto", flex: 1 }}>

                {/* 검색 영역 */}
                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24
                }}>
                    <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <input
                                type="text"
                                placeholder="제목으로 검색"
                                value={searchValue}
                                onChange={e => { setSearchValue(e.target.value); setPage(1); }}
                                style={{
                                    padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
                                    fontSize: 14, width: 240, outline: "none"
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* 게시물 테이블 카드 */}
                <div style={{
                    backgroundColor: "#fff", borderRadius: 16, padding: "24px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, margin: 0 }}>전체 게시물 목록</h3>
                        <span style={{ fontSize: 13, color: TEXT_GRAY, fontWeight: 500 }}>총 {total}개</span>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left" }}>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>ID</th>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>제목</th>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>작성자</th>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>조회수</th>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>좋아요</th>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600 }}>작성일</th>
                                <th style={{ padding: "12px 8px", fontSize: 13, color: TEXT_GRAY, fontWeight: 600, textAlign: "center" }}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {postList?.map(post => (
                                <tr key={post.board_skin_id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background-color 0.2s" }} className="hover-row">
                                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_DARK, fontWeight: 500 }}>#{post.board_skin_id}</td>
                                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_DARK, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</td>
                                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_GRAY }}>{post.writer}</td>
                                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_GRAY }}>{post.hit}</td>
                                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_GRAY }}>{post.elike}</td>
                                    <td style={{ padding: "16px 8px", fontSize: 14, color: TEXT_GRAY }}>{post.bdate}</td>
                                    <td style={{ padding: "16px 8px", textAlign: "center" }}>
                                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm("정말 삭제하시겠습니까?")) {
                                                        axios.get(`${process.env.REACT_APP_BACK_END_URL}/board/skin/del`, {
                                                            params: { num: post.board_skin_id },
                                                            withCredentials: true,
                                                        }).then(() => fetchPostList(page, searchValue))
                                                          .catch(error => console.error(error));
                                                    }
                                                }}
                                                style={{
                                                    padding: "6px 12px", border: "1px solid #fecaca", backgroundColor: "#fef2f2",
                                                    borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#dc2626", cursor: "pointer"
                                                }}>
                                                삭제
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
                                display: "flex", alignItems: "center", gap: "8px",
                                listStyle: "none", padding: 0, margin: 0
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
