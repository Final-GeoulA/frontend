import { useState } from "react";
import axios from "axios";
import "./Board.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider";

const BoardForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { member } = useAuth();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("writer", member?.nickname ?? "익명");
    if (file) {
      formData.append("mfile", file);
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/board/skin/add`,
        formData,
        { withCredentials: true }
      );
      navigate("/board");
    } catch (err) {
      console.error(err);
      alert("업로드에 실패했습니다.");
    }
  };

  return (
    <div className="write-container">
      <h2>커뮤니티 글쓰기</h2>

      <input
        className="title-input"
        placeholder="제목을 입력해주세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="content-input"
        placeholder="내용을 입력해주세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="write-bottom">
        <label className="upload-img" style={{ cursor: "pointer" }}>
          📷 사진 첨부
          {file && (
            <span style={{ marginLeft: 8, fontSize: 12 }}>{file.name}</span>
          )}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <button className="submit-btn" onClick={handleSubmit}>
          업로드
        </button>
      </div>
    </div>
  );
};

export default BoardForm;
