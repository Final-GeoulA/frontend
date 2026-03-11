import React from "react";
import { useSearchParams } from "react-router-dom";
import "./ServiceQuestion.css";

const ServiceQuestion: React.FC = () => {

  const [searchParams] = useSearchParams();
  const type = searchParams.get("q");

  const titleMap:any = {
    question: "서비스에 궁금한 점이 있어요",
    add: "이런 기능도 만들어 주세요",
    feedback: "이런 점이 불편해요",
    bug: "이런 오류가 있어요"
  };

  const title = titleMap[type || "question"];

  return (
    <div className="write-container">
      <p className="service-title">{title}</p>

      <input
        className="title-input"
        defaultValue={title}
        placeholder="제목을 입력해주세요"
      />

      <textarea
        className="content-input"
        placeholder="내용을 입력해주세요"
      />

      <div className="write-bottom">
        <button className="submit-btn">
          등록
        </button>
      </div>

    </div>
  );
};

export default ServiceQuestion;