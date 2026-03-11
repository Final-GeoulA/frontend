import React from "react";
import "./Board.css";
import { Link } from "react-router-dom";

const Board = () => {
  const posts = [
    { id: 1, title: "트러블 피부에 잘 맞았던 제품 공유", writer: "YkYkh", date: "2026.02.25", views: 31 },
    { id: 2, title: "요즘 갑자기 올라오는 트러블 원인", writer: "Yahoo", date: "2026.02.24", views: 25 },
    { id: 3, title: "트러블 피부에 잘 맞았던 제품 공유", writer: "Microsoft", date: "2026.02.25", views: 31 },
  ];

  return (
    <div className="community-container">

      <div className="community-header">
        <h2>커뮤니티</h2>

        <div className="community-controls">
          <input className="search" placeholder="Search" />
          <select>
            <option>Sort by : 제목</option>
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
          </tr>
        </thead>

        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="title">{post.title}</td>
              <td>{post.writer}</td>
              <td>{post.date}</td>
              <td>{post.views}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button>{"<"}</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>{">"}</button>
      </div>

      <div className="write-btn-wrap">
        <button className="write-btn">
            <Link to="/board/form" className="write-btn">글쓰기</Link>
            </button>
      </div>

    </div>
  );
};

export default Board;