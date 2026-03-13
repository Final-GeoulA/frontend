import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './style/MainPage.css'
import { Link } from 'react-router-dom';

const MainPage: React.FC = () => {

  const [openFaQIndex, setOpenFaQIndex] = useState<number | null>(null)
  const navigate = useNavigate();
  const faqData = [
    {
      question: "피부 분석 기능 업데이트 안내",
      answer: "새로운 AI 모델을 통해 피부 상태 분석 정확도가 향상되었습니다."
    },
    {
      question: "서비스 점검 안내",
      answer: "정기 점검 시간 동안 일부 기능이 제한될 수 있습니다."
    },
    {
      question: "서비스 점검 안내",
      answer: "서버 안정화를 위한 서비스 점검이 진행됩니다."
    },
    {
      question: "피부 변화 통계 기능 업데이트",
      answer: "사용자의 피부 변화 통계 기능이 추가되었습니다."
    },
    {
      question: "저장한 병원/약국, 제품은 어디서 확인할 수 있나요?",
      answer: "문의 주신 내용은 마이페이지에서 확인 가능합니다."
    }
  ]

  const toggleFAQ = (index:number) => {
    setOpenFaQIndex(openFaQIndex === index ? null : index)
  }

  return (
    <div className="skin-container">
      {/* 상단 이미지 추가 */}
      <section className="skin-top">
        <div className="top-text">
          <h1>내 피부 사진으로</h1>
          <h1 className="highlight">피부 상태를 분석해보세요</h1>
          <p>Analyze your skin from a simple face scan</p>
          <Link to='/skinanalysis' className="scan-btn">Scan My Skin</Link>
        </div>

        <div className="top-image">
          <img src="/image/Main/skincare.png" alt="skincare" />
        </div>
      </section>

      {/* 과정 설명 */}
      <section className="skin-steps">
        <div className="step">
          <span className="step-label">Step 1</span>
          <p className='step-info-text'>사진 업로드 후 피부 진단</p>
          <img src="/image/Main/main01.png" alt="step1" className='step-img1'/>
        </div>

        <div className="step">
          <span className="step-label">Step 2</span>
          <p className='step-info-text'>챗봇을 통해 피부 제품 추천</p>
          <img src="/image/Main/main02.png" alt="step2" className='step-img2' />
        </div>

        <div className="step">
          <span className="step-label">Step 3</span>
          <p className='step-info-text'>피부과 검색 및 병원 저장</p>
          <img src="/image/Main/main03.png" alt="step3" className='step-img3' />
        </div>
      </section>


      {/* 서비스 의견 */}
      <section className="skin-opinion">
        <p className='service-title'>💡 여러분의 의견을 들려주세요</p>

        <div className="opinion-grid">
          <div 
            className="opinion-card green"
            onClick={() => navigate("/ServiceQuestion?q=question")}
            style={{cursor:"pointer"}}
          >
            서비스에 궁금한 점이 있어요
            <img src="/image/Main/opinion01.png" className='opinion-img' />
          </div>

          <div 
            className="opinion-card yellow"
            onClick={() => navigate("/ServiceQuestion?q=add")}
            style={{cursor:"pointer"}}
          >
            이런 기능도 만들어 주세요
            <img src="/image/Main/opinion02.png" className='opinion-img' />
          </div>

          <div 
            className="opinion-card purple"
            onClick={() => navigate("/ServiceQuestion?q=feedback")}
            style={{cursor:"pointer"}}
          >
            이런 점이 불편해요
            <img src="/image/Main/opinion03.png" className='opinion-img' />
          </div>

          <div 
            className="opinion-card blue"
            onClick={() => navigate("/ServiceQuestion?q=bug")}
            style={{cursor:"pointer"}}
          >
            이런 오류가 있어요
            <img src="/image/Main/opinion04.png" className='opinion-img' />
          </div>

        </div>
      </section>

    {/* FAQ */}
    <section className="skin-faq">
      <h2>FAQS</h2>
      {faqData.map((faq, index) => (
        <div key={index} className="faq-item">

          <div className="faq-question" onClick={() => toggleFAQ(index)}>
            <span>{faq.question}</span>
            <span className={`arrow ${openFaQIndex === index ? "open" : ""}`}>V</span>
          </div>

          {openFaQIndex === index && (
            <div className="faq-answer">
              {faq.answer}
            </div>
          )}

        </div>
      ))}
    </section>

      {/* Chatbot Button */}
      <div 
        className="chatbot-btn"
        onClick={() => navigate("")}
      >
        <img src="/image/Main/chat.png" alt="chatbot"/>
      </div>

    </div>
  );
};

export default MainPage