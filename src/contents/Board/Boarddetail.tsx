import React, { useState, useEffect } from 'react'
import axios from 'axios'
import style from './board.module.css'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/AuthProvider'
import {useAdminAuth} from '../../components/AdminAuthProvider'

interface BoardSkinVO {
  board_skin_id: number;
  title: string;
  writer: string;
  content: string;
  imgn: string;
  hit?: number;
  elike?: number;
  reip?: string;
  bdate?: string;
  role:string;
}

interface BoardSkinCommVO {
  board_skin_comm_id: number;
  board_skin_id: number;
  unickname: string;
  ucontent: string;
  elike?: number;
  bcdate?: string;
}

const Boarddetail: React.FC = () => {
  const { num } = useParams<{ num: string }>();
  const navigate = useNavigate();
  const { member } = useAuth();
  const {isAdmin} = useAdminAuth();
  const [post, setPost] = useState<BoardSkinVO | null>(null);
  const [comments, setComments] = useState<BoardSkinCommVO[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commPage, setCommPage] = useState(1);
  const [commTotalPages, setCommTotalPages] = useState(1);

  useEffect(() => {
    // 게시글 상세 조회
    axios
      .get(`${process.env.REACT_APP_BACK_END_URL}/board/skin/detail`, {
        params: { num },
        withCredentials: true,
      })
      .then((res) => setPost(res.data))
      .catch((err) => console.error(err));

    fetchComments(1);
  }, [num]);

  const fetchComments = (page: number) => {
    axios
      .get(`${process.env.REACT_APP_BACK_END_URL}/board/skin/commlist`, {
        params: { board_skin_id: num, cPage: page },
        withCredentials: true,
      })
      .then((res) => {
        setComments(res.data.data);
        setCommPage(res.data.currentPage);
        setCommTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  const handleDeletePost = () => {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
    axios
      .get(`${process.env.REACT_APP_BACK_END_URL}/board/skin/del`, {
        params: { num },
        withCredentials: true,
      })
      .then(() => navigate("/board"))
      .catch((err) => console.error(err));
  };

  const handleElike = () => {
    axios
      .post(`${process.env.REACT_APP_BACK_END_URL}/board/skin/elike`, null, {
        params: { num },
        withCredentials: true,
      })
      .then(() => {
        setPost((prev) => prev ? { ...prev, elike: (prev.elike ?? 0) + 1 } : prev);
      });
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    axios
      .post(
        `${process.env.REACT_APP_BACK_END_URL}/board/skin/commadd`,
        {
          board_skin_id: Number(num),
          unickname: member?.nickname ?? "익명",
          ucontent: commentText,
        },
        { withCredentials: true }
      )
      .then(() => {
        setCommentText("");
        fetchComments(1);
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteComment = (comm: BoardSkinCommVO) => {
    axios
      .post(
        `${process.env.REACT_APP_BACK_END_URL}/board/skin/delcomm`,
        { board_skin_comm_id: comm.board_skin_comm_id, board_skin_id: comm.board_skin_id },
        { withCredentials: true }
      )
      .then(() => fetchComments(commPage))
      .catch((err) => console.error(err));
  };

  if (!post) return <div style={{ padding: 48, textAlign: "center" }}>로딩 중...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        {/* 본문 카드 */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", marginBottom: 16, overflow: "hidden" }}>
          {/* 제목 영역 */}
          <div style={{ padding: "32px 36px 24px", borderBottom: "1px solid #f0f0f0" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 20px", letterSpacing: "-0.3px" }}>
              {post.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#333" }}>{post.writer}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#aaa" }}>{post.bdate} · 조회 {post.hit}</p>
              </div>
              <button
                onClick={handleElike}
                style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                <img src="/image/elike.png" style={{ width: 28, height: "auto" }} alt="elike" />
                <span style={{ fontSize: 14, color: "#e55" }}>{post.elike ?? 0}</span>
              </button>
            </div>
          </div>
          {/* 본문 */}
          <div style={{ padding: "32px 36px" }}>
            {post.imgn && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                <div style={{ width: 360, height: 240, borderRadius: 12, overflow: "hidden" }}>
                  <img
                    src={`${process.env.REACT_APP_BACK_END_URL}/imagefile/${post.imgn}`}
                    alt={post.imgn}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
            <div
              style={{ fontSize: 15, color: "#444", lineHeight: 1.9 }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        {/* 댓글 목록 */}
        {comments.map((c) => (
          <div
            key={c.board_skin_comm_id}
            style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "20px 28px", marginBottom: 12 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: "#222" }}>{c.unickname}</span>
              <span style={{ fontSize: 13, color: "#aaa" }}>{c.bcdate}</span>
              {(member?.nickname === c.unickname || isAdmin === true) && (
                <button
                  onClick={() => handleDeleteComment(c)}
                  style={{ marginLeft: "auto", background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 12 }}
                >
                  삭제
                </button>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "#444", paddingLeft: 4 }}>{c.ucontent}</p>
          </div>
        ))}

        {/* 댓글 페이징 */}
        {commTotalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            {Array.from({ length: commTotalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => fetchComments(p)}
                style={{ fontWeight: p === commPage ? 700 : 400, cursor: "pointer" }}>
                {p}
              </button>
            ))}
          </div>
        )}

        {/* 댓글 입력 */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "20px 28px", marginTop: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#333" }}>Comment</span>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
              placeholder="댓글을 남겨보세요."
              style={{ flex: 1, padding: "12px 16px", fontSize: 14, border: "1.5px solid #e0e0e0", borderRadius: 10, outline: "none", color: "#333" }}
            />
            <button
              onClick={handleSubmitComment}
              style={{ background: "#50CDBA", color: "#fff", border: "none", borderRadius: 10, padding: "0 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              등록하기
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/board" className={style.button} style={{ margin: 5, fontSize: 12 }}>목록</Link>
    
            {(member?.nickname === post.writer || isAdmin === true) && (
              <>
              <Link to="/board/form" state={{data:post}} className={style.button} style={{ margin: 5, fontSize: 12 }}>수정</Link>
              <button className={style.button} onClick={handleDeletePost} style={{ margin: 5, fontSize: 12,border:"none" }}>삭제</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boarddetail;
