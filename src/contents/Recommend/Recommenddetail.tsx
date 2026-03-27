import React, { useEffect, useState } from 'react'
import { Navbar } from 'react-bootstrap'
import style from './board.module.css'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

const TEAL = "#3BBFB2"
const TEAL_LIGHT = "#E8F7F6"

interface Product {
	product_id: 15,
	name: string,
	brand: string,
	category: string,
	ingredient: string,
	cost: string,
	hit: number,
	elike: number,
	image: string
}

interface Comment {
	user_id: number,
	user_name: string,
	content: string,
	elike: number,
	reip: string,
	bcdate: string
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
	const [expanded, setExpanded] = useState(false)
	const [comment, setComment] = useState("")
	const [product, setProduct] = useState<Product | null>(null)		//상품정보 저장(고정)
	const [comments, setComments] = useState<CommentPage>({			//댓글정보 저장(여러 페이지라 유동)
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
			const res = await axios.get(`${process.env.REACT_APP_IP_KTG}/geoulA/board/product/detail?prodid=${prodid}`);
			setProduct(res.data);
		} catch (e) {
		}
	}
	const getComments = async (commpage: number) => {
		try {
			const res = await axios.get(`${process.env.REACT_APP_IP_KTG}/geoulA/board/product/commlist?prodid=${prodid}&cPage=${commpage.toString()}`);
			setComments(res.data);
		} catch (e) {
		}
	}

	useEffect(() => { getPruduct(prodid); getComments(comments.currentPage); }, [comments.currentPage]);

	return (
		<div style={{
			minHeight: "100vh",
			background: "#F8F9FA",
			fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif"
		}}>
			<Navbar />

			<div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 64px" }}>

				{/* ── 헤더 ── */}
				<div style={{ marginBottom: 28 }}>
					<h1 style={{ fontSize: 26, fontWeight: 800, color: "#111", margin: 0 }}>제품 추천</h1>
					<p style={{ fontSize: 13, fontWeight: 600, color: TEAL, margin: "4px 0 0" }}>Products</p>
				</div>

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
						padding: "16px 12px"
					}}>
						<img
							src={product?.image}
							alt=""
							style={{ width: "100%", height: "auto", display: "block" }}
						/>
					</div>

					{/* 상품 정보 */}
					<div style={{ flex: 1, minWidth: 0 }}>
						<h2 style={{
							fontSize: 20, fontWeight: 800, color: "#111",
							margin: "0 0 8px", lineHeight: 1.4
						}}>
							{product?.name}
						</h2>

						<p style={{ fontSize: 13, color: "#666", margin: "0 0 16px", fontWeight: 500 }}>
							제조사: {product?.brand}
						</p>

						<button onClick={() => setExpanded(!expanded)}
							style={{
								background: TEAL, color: "#fff",
								border: "none", borderRadius: 20,
								padding: "7px 18px", fontSize: 13, fontWeight: 600,
								cursor: "pointer", marginBottom: 18
							}}>
							{expanded ? "성분숨기기" : "전성분보기"}
						</button>

						{/* 전성분 박스 */}
						<div style={{
							overflow: "hidden",
							maxHeight: expanded ? "none" : "77px",
							transition: "max-height 0.3s ease",
							background: "#F6FAFA",
							border: "1px solid #D8EDED",
							borderRadius: 10,
							padding: "14px 16px",
							fontSize: 12.5,
							color: "#555",
							lineHeight: 1.8
						}}>
							{product?.ingredient}
						</div>
					</div>
				</div>

				{/* ── 사용자 후기 ── */}
				<div style={{ marginBottom: 24 }}>
					<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
						<span style={{ fontSize: 17, fontWeight: 700, color: "#111" }}>사용자 후기</span>
						<span style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>후기 {comments.totalItems}개</span>
					</div>

					<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
						{comments.data?.map(c => (
							<div key={c.user_id} style={{
								background: "#fff",
								borderRadius: 14,
								border: "1.5px solid #EEF2F2",
								padding: "18px 22px"
							}}>
								<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
									<img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/test-account.png" alt="test-account"/>
									<span>{c.user_name}</span>
									<span style={{ fontSize: 12, color: "#bbb" }}>{c.bcdate}</span>
								</div>
								<p style={{ margin: 0, fontSize: 14, color: "#444", paddingLeft: 46 }}>{c.content}</p>
							</div>
						))}
					</div>
				</div>

				{/* ── 댓글 입력 ── */}
				<div style={{
					background: "#fff",
					borderRadius: 14,
					border: "1.5px solid #EEF2F2",
					padding: "20px 24px",
					marginBottom: 32
				}}>
					<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
						<div style={{
							width: 32, height: 32, borderRadius: "50%",
							background: TEAL_LIGHT, display: "flex",
							alignItems: "center", justifyContent: "center"
						}}>
							<svg width="16" height="16" fill="none" stroke={TEAL} strokeWidth="2" viewBox="0 0 24 24">
								<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
							</svg>
						</div>
						<span style={{ fontWeight: 700, fontSize: 15, color: "#333" }}>이 제품을 사용해보셨나요?</span>
					</div>

					<div style={{ display: "flex", gap: 10 }}>
						<input
							value={comment}
							onChange={e => setComment(e.target.value)}
							placeholder="해당 제품의 사용 후기를 남겨보세요."
							style={{
								flex: 1, padding: "12px 16px", fontSize: 14,
								border: "1.5px solid #E2EBEB", borderRadius: 10,
								outline: "none", color: "#333", background: "#FAFCFC"
							}}
						/>
						<button style={{
							background: TEAL, color: "#fff", border: "none",
							borderRadius: 10, padding: "0 22px",
							fontSize: 14, fontWeight: 600, cursor: "pointer",
							whiteSpace: "nowrap"
						}}>
							등록하기
						</button>
					</div>
				</div>

				{/* ── 페이지네이션 ── */}
				<div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
					{/* 이전 */}
					<button
						onClick={() => getComments(Math.max(comments.currentPage-1, 1))}
						style={pageBtn(false)}
					>‹</button>

					{pages().map((p, i) =>
						typeof p === "number" ? (
							<button
								key={i}
								onClick={() => getComments(p)}
								style={pageBtn(p === comments.currentPage)}
							>{p}</button>
						) : (
							<span key={i} style={{ fontSize: 14, color: "#aaa", padding: "0 4px" }}>…</span>
						)
					)}

					{/* 다음 */}
					<button
						onClick={() => getComments(Math.min(comments.currentPage+1, comments.totalPages))}
						style={pageBtn(false)}
					>›</button>
				</div>

				{/* 목록/삭제 */}
				<div style={{ textAlign: "center", marginTop: 24 }}>
					<Link to="/community/boardlist" className={style.button} style={{ margin: 5, fontSize: 12 }}>목록</Link>
					<button className={style.button} style={{ margin: 5, fontSize: 12 }}>삭제</button>
				</div>

			</div>
		</div>
	)
}

function pageBtn(active: boolean): React.CSSProperties {
	return {
		width: 34, height: 34, borderRadius: 8,
		border: active ? `1.5px solid ${TEAL}` : "1.5px solid #E2E8E8",
		background: active ? TEAL : "#fff",
		color: active ? "#fff" : "#555",
		fontWeight: active ? 700 : 500,
		fontSize: 14, cursor: "pointer",
		display: "flex", alignItems: "center", justifyContent: "center"
	}
}

export default Recommenddetail
