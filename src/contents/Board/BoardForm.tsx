import { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./Board.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import "@ckeditor/ckeditor5-build-decoupled-document/build/translations/ko.js";

const BoardForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [textemotion, setTextemotion] = useState("");
  const [file, setFile] = useState<File | null>(null);

  //게시판 수정 로직

  const location = useLocation();
  const Edit = location.state && location.state.data;
  useEffect(() => {
    if (location.state != null) {
      setTitle(location.state.data.title);
      setContent(location.state.data.content);
      setFile(location.state.data.imgn);
    }
  }, []);


  const navigate = useNavigate();
  const { member } = useAuth();
  const toolbarRef = useRef<HTMLDivElement>(null);

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleSubmit = async () => {
    const plainText = stripHtml(content);
    if (!title.trim() || !plainText.trim()) {
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
      if (Edit) {
        formData.append("board_skin_id", location.state.data.board_skin_id);
        await axios.post(
          `${process.env.REACT_APP_BACK_END_URL}/board/skin/update`,
          formData,
          { withCredentials: true }
        );
      }
      else {
        await axios.post(
          `${process.env.REACT_APP_BACK_END_URL}/board/skin/add`,
          formData,
          { withCredentials: true }
        );
        navigate("/board");
      }
    } catch (error) {
      console.error(error);
      alert("처리중 오류 발생");
    }
  };

  /** Document 빌드에 포함된 기능 위주로 툴바를 최대한 채움 (줄바꿈으로 여러 줄로 보이게) */
  const editorConfig = {
      language: "ko",
      placeholder: "내용을 입력해주세요 (글꼴·색·표·이미지·정렬 등 풀옵션)",
      toolbar: {
        shouldNotGroupWhenFull: true,
        items: [
          "heading",
          "|",
          "fontSize",
          "fontFamily",
          "|",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "|",
          "subscript",
          "superscript",
          "|",
          "alignment",
          "|",
          "numberedList",
          "bulletedList",
          "|",
          "outdent",
          "indent",
          "|",
          "link",
          "blockQuote",
          "insertTable",
          "imageUpload",
          "mediaEmbed",
          "|",
          "horizontalLine",
          "|",
          "undo",
          "redo",
        ],
      },
      heading: {
        options: [
          { model: "paragraph", title: "본문", class: "ck-heading_paragraph" },
          { model: "heading1", view: "h2", title: "제목 1", class: "ck-heading_heading1" },
          { model: "heading2", view: "h3", title: "제목 2", class: "ck-heading_heading2" },
          { model: "heading3", view: "h4", title: "제목 3", class: "ck-heading_heading3" },
        ],
      },
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
        ],
      },
    };

  return (
    <div className="write-container write-container--pro">
        <div className="write-pro-header">
          <h2>커뮤니티 글쓰기</h2>
          <span className="write-pro-badges">
            <span className="badge-pill">고급 편집기</span>
            <span className="badge-pill">Document 모드</span>
            <span className="badge-pill">표·이미지·동영상</span>
            <span className="badge-pill">글꼴·색상</span>
          </span>
        </div>

        <input
          className="title-input"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <p className="write-pro-hint">
          아래 툴바에서 서식·목록·표·이미지·링크·들여쓰기 등을 사용할 수 있습니다.
        </p>

        <div className="ck-busy-shell">
          <div ref={toolbarRef} className="ck-toolbar-host" />
          <div className="ck-editor-host">
            <CKEditor
              editor={DecoupledEditor as any}
              data={content}
              config={editorConfig as any}
              onReady={(editor: any) => {
                const host = toolbarRef.current;
                if (host && editor?.ui?.view?.toolbar?.element) {
                  host.innerHTML = "";
                  host.appendChild(editor.ui.view.toolbar.element);
                }
              }}
              onChange={(_event: unknown, editor: any) => {
                setContent(editor.getData());
              }}
            />
          </div>
        </div>

        <div className="write-bottom write-bottom--submit-only">
          <button type="button" className="submit-btn" onClick={handleSubmit}>
            업로드
          </button>
        </div>
      </div>
    );
};

export default BoardForm;