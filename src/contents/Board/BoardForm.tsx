import React from "react";
import "./Board.css";

const BoardForm = () => {
  return (
    <div className="write-container">

      <h2>커뮤니티 글쓰기</h2>

      <input
        className="title-input"
        placeholder="제목을 입력해주세요"
      />

      <textarea
        className="content-input"
        placeholder="내용을 입력해주세요"
      />

      <div className="write-bottom">

        <button className="upload-img">
          📷 사진 첨부
        </button>

        <button className="submit-btn">
          업로드
        </button>

      </div>

    </div>
  );
};

export default BoardForm;