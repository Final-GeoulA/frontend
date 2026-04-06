import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../components/AuthProvider";
import styles from "./ProductPayment.module.css";

const ProductPaymentSuccess: React.FC = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { member } = useAuth();
	const [status, setStatus] = useState<"loading" | "success" | "fail">("loading");

	useEffect(() => {
		const confirm = async () => {
			const paymentKey = searchParams.get("paymentKey");
			const orderId = searchParams.get("orderId");
			const amount = Number(searchParams.get("amount"));
			const prodid = Number(searchParams.get("prodid"));
			const qty = Number(searchParams.get("qty"));

			try {
				const res = await axios.post(
					`${process.env.REACT_APP_BACK_END_URL}/payment/confirm`,
					{ paymentKey, orderId, amount, prodid, qty },
					{ withCredentials: true }
				);

				if (res.data === "success") {
					setStatus("success");
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
		<div className={styles.wrapper}>
			<div className={styles.card}>
				{status === "loading" && (
					<p className={styles.errorMsg}>결제 확인 중...</p>
				)}
				{status === "success" && (
					<>
						<p style={{ fontSize: 48, margin: "0 0 16px" }}>✅</p>
						<p style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 8 }}>
							결제가 완료되었습니다!
						</p>
						<p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>
							주문하신 상품이 곧 배송됩니다.
						</p>
						<button className={styles.payBtn} onClick={() => navigate("/recommend")}>
							쇼핑 계속하기
						</button>
						<button className={styles.cancelBtn} onClick={() => navigate("/")}>
							홈으로
						</button>
					</>
				)}
				{status === "fail" && (
					<>
						<p style={{ fontSize: 48, margin: "0 0 16px" }}>❌</p>
						<p style={{ fontSize: 20, fontWeight: 700, color: "#e05c5c", marginBottom: 8 }}>
							결제 승인에 실패했습니다.
						</p>
						<p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>
							다시 시도해주세요.
						</p>
						<button className={styles.payBtn} onClick={() => navigate(-1)}>
							다시 시도
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default ProductPaymentSuccess;
