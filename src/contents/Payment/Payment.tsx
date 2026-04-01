import React from "react";
import { useNavigate } from "react-router-dom";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useAuth } from "../../components/AuthProvider";
import "./Payment.css";

const CLIENT_KEY = "test_ck_Gv6LjeKD8a69GovzeBz03wYxAdXy";
const AMOUNT = 9900;

const Payment: React.FC = () => {
  const { member } = useAuth();
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!member) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const tossPayments = await loadTossPayments(CLIENT_KEY);
    const payment = tossPayments.payment({ customerKey: String(member.user_id) });

    await payment.requestPayment({
      method: "CARD",
      amount: { currency: "KRW", value: AMOUNT },
      orderId: "order-" + Date.now(),
      orderName: "GeoulA 프리미엄",
      successUrl: window.location.origin + "/payment/success",
      failUrl: window.location.origin + "/payment/fail",
    });
  };

  return (
    <div className="payment-wrapper">
      <div className="payment-card">
        <h2 className="payment-title">프리미엄 업그레이드</h2>
        <ul className="payment-benefits">
          <li>피부 변화 리포트 무제한 열람</li>
          <li>AI 피부 분석 고급 기능 사용</li>
          <li>광고 없는 쾌적한 환경</li>
        </ul>
        <div className="payment-price">
          <span className="price-amount">9,900</span>원
        </div>
        <button className="payment-btn" onClick={handlePayment}>
          결제하기
        </button>
        <button className="payment-cancel-btn" onClick={() => navigate(-1)}>
          취소
        </button>
      </div>
    </div>
  );
};

export default Payment;
