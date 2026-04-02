import { useState,useEffect } from "react";
import axios from "axios";
import "./Board.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider";

const BoardForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [textemotion, setTextemotion] = useState("");
  const [file, setFile] = useState<File | null>(null);

  //게시판 수정 로직
  
  const location = useLocation();
  const Edit = location.state && location.state.data;
  useEffect(() => {
    if(location.state != null){
      setTitle(location.state.data.title);
      setContent(location.state.data.content);
      setFile(location.state.data.imgn);
    }   
  },[]);
 

  const navigate = useNavigate();
  const { member } = useAuth();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    try {
      const res = await axios.post(
        `http://192.168.0.252:9001/text_emotion/Board_emotion`,
        {
          content: content,
        }
      );
      console.log("감정 분석 결과", res.data);
      const result = res.data;
      const emotionLabel =
        result.positive > result.negative ? "긍정😁" : "부정😟";

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("writer", member?.nickname ?? "익명");
      formData.append("textemotion", emotionLabel);
      if (file) {
        formData.append("mfile", file);
      }
      if(Edit){
        formData.append("board_skin_id",location.state.data.board_skin_id)
        await axios.post(   
        `${process.env.REACT_APP_BACK_END_URL}/board/skin/update`,
        formData,
        { withCredentials: true }
        );
      }
      else{
        await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/board/skin/add`,
        formData,
        { withCredentials: true }
      );
      }   
       navigate("/board")  
    } catch (error) {
      console.error(error);
      alert("처리중 오류 발생");
    }
  };
  // 글쓰기 수정 함수
  
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
        <button
          className="submit-btn"
          value={textemotion}
          onClick={handleSubmit}
        >
          업로드
        </button>
      </div>
    </div>
  );
};

export default BoardForm;
