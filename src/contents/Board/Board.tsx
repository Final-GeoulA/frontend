import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Board.css";
import { Link, useLocation } from "react-router-dom";

interface Post {
  board_skin_id: number;
  title: string;
  nickname: string;
  bdate: string;
  hit: number;
  textemotion:String;
}

const Board = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [searchType, setSearchType] = useState("2"); // 1:작성자, 2:제목, 3:내용
  const [searchValue, setSearchValue] = useState("");
  const fetchList = (
    page: number,
    sType = searchType,
    sValue = searchValue
  ) => {
    axios
      .get(`${process.env.REACT_APP_BACK_END_URL}/board/skin/list`, {
        params: { cPage: page, searchType: sType, searchValue: sValue },
        withCredentials: true,
      })
      .then((res) => {
        setPosts(res.data.data);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
        setStartPage(res.data.startPage);
        setEndPage(res.data.endPage);
      })
      .catch((err) => console.error(err));
  };
  console.log(posts)
  useEffect(() => {
    fetchList(1);
  }, []);

  const handleSearch = () => {
    fetchList(1);
  };

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="community-container">
      <div className="community-header">
        <h2 className="commynity-title">커뮤니티</h2>

        <div className="community-controls">
          <input
            className="search"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="2">제목</option>
            <option value="1">작성자</option>
            <option value="3">내용</option>
          </select>
        </div>
      </div>

      <table className="community-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
            <th>감정분석</th>
          </tr>
        </thead>

        <tbody>
          {posts.map((post) => (
            <tr key={post.board_skin_id}>
              <td className="title">
                <Link to={`/boarddetail/${post.board_skin_id}`}>
                  {post.title}
                </Link>
              </td>
              <td>{post.nickname}</td>
              <td>{post.bdate}</td>
              <td>{post.hit}</td>
              <td>{post.textemotion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage <= 1}
          onClick={() => fetchList(currentPage - 1)}
        >
          {"<"}
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={p === currentPage ? "active" : ""}
            onClick={() => fetchList(p)}
          >
            {p}
          </button>
        ))}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => fetchList(currentPage + 1)}
        >
          {">"}
        </button>
      </div>

      <div className="write-btn-wrap">
        <button className="write-btn">
          <Link to="/board/form" className="write-btn">
            글쓰기
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Board;
