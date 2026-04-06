import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './Recommenddetail.module.css'
import axios from 'axios'
import { useAuth } from '../../components/AuthProvider'
import { IoHeartOutline, IoHeart } from "react-icons/io5"

const TEAL = "#3BBFB2";
const TEAL_LIGHT = "#E8F7F6";

const HeartIcon = IoHeart as React.ElementType;
const EmptyHeart = IoHeartOutline as React.ElementType;

interface Product {
	product_id: number,
	name: string,
	brand: string,
	category: string,
	ingredient: string,
	cost: string,
	hit: number,
	elike: number,
	image: string,
	hearted: number
}

interface Comment {
	user_id: number;
	user_name: string;
	content: string;
	elike: number;
	reip: string;
	bcdate: string;
}

interface CommentPage {
  totalItems: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  currentPage: number;
  data: Comment[];
}

const Recommenddetail: React.FC = () => {
	const { prodid } = useParams<string>();
	const { member } = useAuth();
	const navigate = useNavigate();
	const [expanded, setExpanded] = useState(false)
	const [quantity, setQuantity] = useState(1)
	const [comment, setComment] = useState("")
	const [product, setProduct] = useState<Product | null>(null)
	const [similarList, setSimilarList] = useState<Product[]>([])
	const [comments, setComments] = useState<CommentPage>({
		totalItems: 0,
		totalPages: 0,
		startPage: 1,
		endPage: 0,
		currentPage: 1,
		data: []
	});

	const pages = () => {
		const arr: (number | string)[] = []
		for (let page = comments.startPage; page <= comments.endPage; page++) {
			arr.push(page)
		}
		return arr
	}

	const getPruduct = async (prodid: string | undefined) => {
		try {
			let url = `${process.env.REACT_APP_BACK_END_URL}/board/product/detail?prodid=${prodid}`;
			if (member) url += `&userid=${member.user_id}`;
			const res = await axios.get(url);
			setProduct(res.data);
		} catch (e) {
		}
	}

	const toggleHeart = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!member) { alert("로그인이 필요합니다."); return; }
		if (!product) return;
		const endpoint = product.hearted === 1 ? 'unheart' : 'heart';
		try {
			await axios.get(
				`${process.env.REACT_APP_BACK_END_URL}/board/product/${endpoint}?prodid=${product.product_id}&userid=${member.user_id}`
			);
			await getPruduct(prodid);
		} catch (err) {
			console.error("하트 처리 실패", err);
		}
	};

	const getComments = async (commpage: number) => {
		try {
			const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/board/product/commlist?prodid=${prodid}&cPage=${commpage.toString()}`);
			setComments(res.data);
		} catch (e) {
		}
	}

	const getSimilar = async (category: string, prodid: string) => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_BACK_END_URL}/board/product/similar?category=${encodeURIComponent(category)}&prodid=${prodid}`
			);
			setSimilarList(res.data);
		} catch (e) {}
	};

	const submitComment = async () => {
		if (!member) { alert("로그인이 필요합니다."); return; }
		if (!comment.trim()) { alert("내용을 입력해주세요."); return; }
		try {
			await axios.post(
				`${process.env.REACT_APP_BACK_END_URL}/board/product/commadd`,
				{ product_id: Number(prodid), user_id: member.user_id, user_name: member.nickname, content: comment },
				{ withCredentials: true }
			);
			setComment("");
			getComments(1);
		} catch (e) {
			console.error("댓글 등록 실패", e);
		}
	};

	useEffect(() => { getPruduct(prodid); getComments(1); }, [prodid, member]);
	useEffect(() => { if (product?.category && prodid) getSimilar(product.category, prodid); }, [product?.category, prodid]);

	return (
		<div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 64px" }}>
			<div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
				{/* ── 좌측 본문 ── */}
				<div style={{ flex: 1, minWidth: 0 }}>

					{/* ── 상품 카드 ── */}
					<div style={{
						background: "#fff",
						borderRadius: 18,
						border: "1.5px solid #E8EEEE",
						padding: "28px 32px",
						marginBottom: 32,
						display: "flex",
						gap: 28,
						alignItems: "flex-start"
					}}>
						{/* 이미지 */}
						<div style={{
							width: 220, flexShrink: 0,
							borderRadius: 12, overflow: "hidden",
							background: "#F0FAFA",
							display: "flex", alignItems: "center", justifyContent: "center",
							padding: "16px 12px",
							position: "relative"
						}}>
							<img
								src={product?.image}
								alt=""
								style={{ width: "100%", height: "auto", display: "block" }}
							/>
							<button
								onClick={toggleHeart}
								style={{
									position: 'absolute', bottom: 10, right: 10,
									background: 'rgba(255,255,255,0.85)',
									border: 'none', borderRadius: '50%',
									width: 32, height: 32,
									display: 'flex', alignItems: 'center', justifyContent: 'center',
									cursor: 'pointer', backdropFilter: 'blur(4px)',
									transition: 'transform 0.2s',
								}}
								onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
								onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
							>
								{product?.hearted === 1
									? <HeartIcon style={{ color: '#FF4D6A', fontSize: 18 }} />
									: <EmptyHeart style={{ color: '#bbb', fontSize: 18 }} />
								}
							</button>
						</div>

						{/* 상품 정보 */}
						<div style={{ flex: 1, minWidth: 0 }}>
							<span style={{
								display: "inline-block",
								background: TEAL_LIGHT, color: TEAL,
								fontSize: 11, fontWeight: 700,
								padding: "3px 10px", borderRadius: 20,
								marginBottom: 10
							}}>
								{product?.category}
							</span>

							<h2 style={{
								fontSize: 20, fontWeight: 800, color: "#111",
								margin: "0 0 6px", lineHeight: 1.4
							}}>
								{product?.name}
							</h2>

							<p style={{ fontSize: 13, color: "#666", margin: "0 0 10px", fontWeight: 500 }}>
								제조사: {product?.brand}
							</p>

							<p style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: "0 0 14px" }}>
								{product?.cost ? `${Number(product.cost.replace(/,/g, "")).toLocaleString()}원` : '가격 미정'}
							</p>

							<div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
								<span style={{ fontSize: 12, color: "#888" }}>
									👁 조회 {product?.hit?.toLocaleString() ?? 0}
								</span>
								<span style={{ fontSize: 12, color: "#888" }}>
									♥ 좋아요 {product?.elike?.toLocaleString() ?? 0}
								</span>
							</div>

							{/* 수량 선택 + 구매 */}
							<div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18 }}>
								<div style={{
									display: "flex", alignItems: "center",
									border: "1.5px solid #E2E8E8", borderRadius: 10, overflow: "hidden"
								}}>
									<button onClick={() => setQuantity(q => Math.max(1, q - 1))}
										style={{
											width: 34, height: 36, border: "none", background: "#FAFBFB",
											fontSize: 16, cursor: "pointer", color: "#555"
										}}>−</button>
									<span style={{
										width: 40, textAlign: "center", fontSize: 14, fontWeight: 600,
										borderLeft: "1px solid #E2E8E8", borderRight: "1px solid #E2E8E8",
										lineHeight: "36px"
									}}>{quantity}</span>
									<button onClick={() => setQuantity(q => q + 1)}
										style={{
											width: 34, height: 36, border: "none", background: "#FAFBFB",
											fontSize: 16, cursor: "pointer", color: "#555"
										}}>+</button>
								</div>
								<span style={{ fontSize: 13, color: "#666", fontWeight: 500 }}>
									합계: <b style={{ color: "#111", fontSize: 15 }}>
										{product?.cost ? `${(Number(product.cost.replace(/,/g, "")) * quantity).toLocaleString()}원` : '-'}
									</b>
								</span>
							</div>

							<div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
								<button
									onClick={() => {
										if (!member) { alert("로그인이 필요합니다."); return; }
										navigate(`/product-payment`, { state: { product, quantity } });
									}}
									style={{
										flex: 1, background: TEAL, color: "#fff",
										border: "none", borderRadius: 10,
										padding: "12px 0", fontSize: 15, fontWeight: 700,
										cursor: "pointer", transition: "background 0.15s"
									}}
									onMouseEnter={e => e.currentTarget.style.background = "#2FA89C"}
									onMouseLeave={e => e.currentTarget.style.background = TEAL}
								>
									구매하기
								</button>
							</div>

							<button
								onClick={() => setExpanded(!expanded)}
								className={styles.ingredientBtn}
							>
								{expanded ? "성분 숨기기" : "전성분 보기"}
							</button>

							<div
								className={styles.ingredientBox}
								style={{ maxHeight: expanded ? "none" : "77px" }}
							>
								{product?.ingredient}
							</div>
						</div>
					</div>

					{/* ── 사용자 후기 ── */}
					<div className={styles.reviewsSection}>
						<div className={styles.reviewsHeader}>
							<span className={styles.reviewsTitle}>사용자 후기</span>
							<span className={styles.reviewsCount}>
								후기 {comments.totalItems}개
							</span>
						</div>

						<div className={styles.reviewsList}>
							{comments.data?.map((c) => (
								<div key={c.user_id} className={styles.reviewCard}>
									<div className={styles.reviewCardHeader}>
										<img
											width="30"
											height="30"
											src="https://img.icons8.com/ios-glyphs/30/test-account.png"
											alt="test-account"
										/>
										<span>{c.user_name}</span>
										<span className={styles.reviewDate}>{c.bcdate}</span>
									</div>
									<p className={styles.reviewContent}>{c.content}</p>
								</div>
							))}
						</div>
					</div>

					{/* 댓글 입력 */}
					<div className={styles.commentInputRow}>
						<input
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && submitComment()}
							placeholder="해당 제품의 사용 후기를 남겨보세요."
							className={styles.commentInput}
						/>
						<button onClick={submitComment} className={styles.commentSubmitBtn}>
							등록하기
						</button>
					</div>

					{/* ── 페이지네이션 ── */}
					<div className={styles.pagination}>
						<button
							onClick={() => getComments(Math.max(comments.currentPage - 1, 1))}
							className={styles.pagBtn}
						>
							‹
						</button>

						{pages().map((p, i) =>
							typeof p === "number" ? (
								<button
									key={i}
									onClick={() => getComments(p)}
									className={`${styles.pagBtn}${
										p === comments.currentPage ? ` ${styles.active}` : ""
									}`}
								>
									{p}
								</button>
							) : (
								<span key={i} className={styles.pagDots}>
									…
								</span>
							)
						)}

						<button
							onClick={() =>
								getComments(
									Math.min(comments.currentPage + 1, comments.totalPages)
								)
							}
							className={styles.pagBtn}
						>
							›
						</button>
					</div>

				</div>{/* 좌측 본문 끝 */}

				{/* ── 우측 유사 제품 사이드바 ── */}
				<div style={{
					width: 240, flexShrink: 0,
					position: "sticky", top: 80,
					display: "flex", flexDirection: "column", gap: 14
				}}>
					<div style={{
						background: "#fff", borderRadius: 14,
						border: "1.5px solid #E8EEEE", padding: "18px 16px"
					}}>
						<h3 style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: "0 0 14px" }}>
							비슷한 제품
						</h3>
						{similarList.length === 0 && (
							<p style={{ fontSize: 13, color: "#aaa", textAlign: "center", margin: "20px 0" }}>
								유사 제품이 없습니다
							</p>
						)}
						<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
							{similarList.map(item => (
								<div
									key={item.product_id}
									onClick={() => navigate(`/recommenddetail/${item.product_id}`)}
									style={{
										display: "flex", gap: 10, alignItems: "center",
										cursor: "pointer", padding: 8, borderRadius: 10,
										transition: "background 0.15s",
									}}
									onMouseEnter={e => e.currentTarget.style.background = "#F0FAFA"}
									onMouseLeave={e => e.currentTarget.style.background = "transparent"}
								>
									<div style={{
										width: 56, height: 56, flexShrink: 0,
										borderRadius: 10, overflow: "hidden",
										background: "#F6F8F8",
										display: "flex", alignItems: "center", justifyContent: "center"
									}}>
										<img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
									</div>
									<div style={{ flex: 1, minWidth: 0 }}>
										<p style={{
											fontSize: 13, fontWeight: 600, color: "#222",
											margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
										}}>
											{item.name}
										</p>
										<p style={{ fontSize: 11, color: "#888", margin: "2px 0 0" }}>
											{item.brand}
										</p>
										<p style={{ fontSize: 11, color: TEAL, margin: "2px 0 0", fontWeight: 600 }}>
											♥ {item.elike}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

			</div>{/* flex 컨테이너 끝 */}
		</div>
	)
}

export default Recommenddetail;
