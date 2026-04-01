import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../components/AuthProvider";
import "./Payment.css";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkLogin } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "fail">("loading");

  useEffect(() => {
    const confirm = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = Number(searchParams.get("amount"));

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BACK_END_URL}/payment/confirm`,
          { paymentKey, orderId, amount },
          { withCredentials: true }
        );

        if (res.data === "success") {
          // 세션 재조회해서 grade 업데이트
          await checkLogin();
          setStatus("success");
          setTimeout(() => navigate("/mypage"), 2000);
        } else {
          setStatus("fail");
        }
      } catch {
        setStatus("fail");
      }
    };

    confirm();
  }, []);

  return (
    <div className="payment-wrapper">
      <div className="payment-card">
        {status === "loading" && <p className="payment-msg">결제 확인 중...</p>}
        {status === "success" && (
          <>
            <p className="payment-msg success">결제가 완료되었습니다!</p>
            <p className="payment-sub">잠시 후 마이페이지로 이동합니다.</p>
          </>
        )}
        {status === "fail" && (
          <>
            <p className="payment-msg fail">결제 승인에 실패했습니다.</p>
            <button className="payment-btn" onClick={() => navigate("/payment")}>
              다시 시도
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
