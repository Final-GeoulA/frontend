import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useAuth } from "../../components/AuthProvider";
import styles from "./ProductPayment.module.css";

const CLIENT_KEY = "test_ck_Gv6LjeKD8a69GovzeBz03wYxAdXy";
const TEAL = "#3BBFB2";

interface Product {
	product_id: number;
	name: string;
	brand: string;
	category: string;
	ingredient: string;
	cost: string;
	hit: number;
	elike: number;
	image: string;
	hearted: number;
}

interface LocationState {
	product: Product;
	quantity: number;
}

const ProductPayment: React.FC = () => {
	const { member } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const state = location.state as LocationState | null;

	const [quantity, setQuantity] = useState(state?.quantity ?? 1);

	if (!state?.product) {
		return (
			<div className={styles.wrapper}>
				<div className={styles.card}>
					<p className={styles.errorMsg}>상품 정보가 없습니다.</p>
					<button className={styles.cancelBtn} onClick={() => navigate(-1)}>
						돌아가기
					</button>
				</div>
			</div>
		);
	}

	const { product } = state;
	const unitPrice = Number(product.cost.replace(/,/g, ""));
	const totalPrice = unitPrice * quantity;

	const handlePayment = async () => {
		if (!member) {
			alert("로그인이 필요합니다.");
			navigate("/login");
			return;
		}

		try {
			const tossPayments = await loadTossPayments(CLIENT_KEY);
			const payment = tossPayments.payment({ customerKey: String("userid-"+member.user_id) });

			await payment.requestPayment({
				method: "CARD",
				amount: { currency: "KRW", value: totalPrice },
				orderId: `prod-${product.product_id}-${Date.now()}`,
				orderName: product.name,
				successUrl: `${window.location.origin}/product-payment/success?prodid=${product.product_id}&qty=${quantity}`,
				failUrl: `${window.location.origin}/product-payment?fail=true`,
			});
		} catch (err) {
			console.error("결제 요청 실패", err);
		}
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<h2 className={styles.title}>주문 / 결제</h2>
				<p className={styles.subtitle}>Order & Payment</p>

				{/* 상품 정보 */}
				<div className={styles.productSection}>
					<div className={styles.productImageBox}>
						<img src={product.image} alt={product.name} className={styles.productImage} />
					</div>
					<div className={styles.productInfo}>
						<span className={styles.categoryBadge}>{product.category}</span>
						<h3 className={styles.productName}>{product.name}</h3>
						<p className={styles.productBrand}>{product.brand}</p>
						<p className={styles.productPrice}>{unitPrice.toLocaleString()}원</p>
					</div>
				</div>

				<hr className={styles.divider} />

				{/* 수량 조절 */}
				<div className={styles.quantitySection}>
					<span className={styles.sectionLabel}>수량</span>
					<div className={styles.quantityControl}>
						<button
							className={styles.qtyBtn}
							onClick={() => setQuantity(q => Math.max(1, q - 1))}
						>
							−
						</button>
						<span className={styles.qtyValue}>{quantity}</span>
						<button
							className={styles.qtyBtn}
							onClick={() => setQuantity(q => q + 1)}
						>
							+
						</button>
					</div>
				</div>

				<hr className={styles.divider} />

				{/* 결제 금액 요약 */}
				<div className={styles.summarySection}>
					<div className={styles.summaryRow}>
						<span>상품 금액</span>
						<span>{unitPrice.toLocaleString()}원</span>
					</div>
					<div className={styles.summaryRow}>
						<span>수량</span>
						<span>{quantity}개</span>
					</div>
					<div className={styles.summaryRow}>
						<span>배송비</span>
						<span className={styles.freeShipping}>무료</span>
					</div>
					<div className={`${styles.summaryRow} ${styles.totalRow}`}>
						<span>총 결제 금액</span>
						<span className={styles.totalPrice}>{totalPrice.toLocaleString()}원</span>
					</div>
				</div>

				{/* 결제 버튼 */}
				<button className={styles.payBtn} onClick={handlePayment}>
					{totalPrice.toLocaleString()}원 결제하기
				</button>
				<button className={styles.cancelBtn} onClick={() => navigate(-1)}>
					취소
				</button>
			</div>
		</div>
	);
};

export default ProductPayment;
