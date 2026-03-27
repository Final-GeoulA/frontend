/*
설치한 모듈
yarn add react-icons
*/
import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { Link } from 'react-router-dom';
import axios from 'axios';

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
}

interface Page {
	totalItems: number;
	totalPages: number;
	startPage: number;
	endPage: number;
	currentPage: number;
	data: Product[];
}

const Gallery: React.FC = () => {
	const [category, setCategory] = useState<string>('스킨/토너');
	const [selectedSearchOpt, setSelectedSearchOpt] = useState<string>('상품명');	//검색 타입
	const [search, setSearch] = useState<string>('');						//검색 키워드
	const [hovered, setHovered] = useState<number | null>(null);
	const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
	const [Content, setContent] = useState<Page>({
		totalItems: 0,
		totalPages: 1,
		startPage: 1,
		endPage: 1,
		currentPage: 1,
		data: []
	});

	const getPage = async (category:string,page: number) => {
		try {
			const res = await axios.get(`${process.env.REACT_APP_IP_KTG}/geoulA/board/product/list?category=${category}&cPage=${page}${search === '' ? '' : `&type=${selectedSearchOpt}&keyword=${search}`}`);
			setContent(res.data);
		} catch (e) {
			// 서버 미연결 시 더미 데이터
		}
	};

	useEffect(() => { getPage(category, 1); }, []);

	const toggleHeart = (id: number, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setLikedIds(prev => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const sortOptions = [
		{ id: 'name', label: '상품명' },
		{ id: 'brand', label: '브랜드' },
		{ id: 'ingre', label: '성분' },
	];

	// 페이지네이션 범위
	const totalPages = Content.totalPages;
	const pageNums: (number | string)[] = [];
	const start = Content.startPage || 1;
	const end = Math.min(Content.endPage || 5, totalPages);
	for (let i = start; i <= end; i++) pageNums.push(i);
	if (end < totalPages) { pageNums.push('...'); pageNums.push(totalPages); }

	const SearchIcon = CiSearch as any;
	const HeartIcon = IoHeart as any;
	const EmptyHeart = IoHeartOutline as any;

	return (
		<div style={{
			maxWidth: 1100,
			margin: '0 auto',
			padding: '40px 24px 64px',
			fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
		}}>
			<div style={{ float: "left", width: "141px", marginRight: "49px" }}>
				{/* 타이틀 */}
				<p
					style={{
						marginBottom: "32px",
						fontSize: "28px",
						lineHeight: "1.3",
						letterSpacing: "-1.3px",
						fontWeight: "700",
						color: "#111",
						wordBreak: "keep-all",
					}}
				>
					스킨케어
				</p>

				{/* 메뉴 리스트 */}
				<ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
					<li key={1} style={{ borderBottom: "1px solid #efefef" }}>
						<button onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)} onClick={() => {setCategory('스킨/토너'); getPage('스킨/토너', 1)}}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: "6px",
								padding: "11px 0",
								textDecoration: "none",
								color: hovered === 1 ? "#111" : "#555",
								fontSize: "13px",
								letterSpacing: "-0.3px",
								fontWeight: hovered === 1 ? "600" : "400",
								transition: "color 0.15s, font-weight 0.15s",
							}}
						>
							{/* 호버 시 좌측 액센트 바 */}
							<span
								style={{
									display: "inline-block",
									width: "2px",
									height: "11px",
									borderRadius: "2px",
									background: "#111",
									opacity: hovered === 1 ? 1 : 0,
									transition: "opacity 0.15s",
									flexShrink: 0,
								}}
							/>
							스킨/토너
						</button>
					</li>
					<li key={2} style={{ borderBottom: "1px solid #efefef" }}>
						<button onMouseEnter={() => setHovered(2)} onMouseLeave={() => setHovered(null)} onClick={() => {setCategory('에센스/세럼/앰플'); getPage('에센스/세럼/앰플', 1)}}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: "6px",
								padding: "11px 0",
								textDecoration: "none",
								color: hovered === 2 ? "#111" : "#555",
								fontSize: "13px",
								letterSpacing: "-0.3px",
								fontWeight: hovered === 2 ? "600" : "400",
								transition: "color 0.15s, font-weight 0.15s",
							}}
						>
							{/* 호버 시 좌측 액센트 바 */}
							<span
								style={{
									display: "inline-block",
									width: "2px",
									height: "11px",
									borderRadius: "2px",
									background: "#111",
									opacity: hovered === 2 ? 1 : 0,
									transition: "opacity 0.15s",
									flexShrink: 0,
								}}
							/>
							에센스/세럼/앰플
						</button>
					</li>
					<li key={3} style={{ borderBottom: "1px solid #efefef" }}>
						<button onMouseEnter={() => setHovered(3)} onMouseLeave={() => setHovered(null)} onClick={() => {setCategory('크림'); getPage('크림', 1)}}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: "6px",
								padding: "11px 0",
								textDecoration: "none",
								color: hovered === 3 ? "#111" : "#555",
								fontSize: "13px",
								letterSpacing: "-0.3px",
								fontWeight: hovered === 3 ? "600" : "400",
								transition: "color 0.15s, font-weight 0.15s",
							}}
						>
							{/* 호버 시 좌측 액센트 바 */}
							<span
								style={{
									display: "inline-block",
									width: "2px",
									height: "11px",
									borderRadius: "2px",
									background: "#111",
									opacity: hovered === 3 ? 1 : 0,
									transition: "opacity 0.15s",
									flexShrink: 0,
								}}
							/>
							크림
						</button>
					</li>
					<li key={4} style={{ borderBottom: "1px solid #efefef" }}>
						<button onMouseEnter={() => setHovered(4)} onMouseLeave={() => setHovered(null)} onClick={() => {setCategory('로션'); getPage('로션', 1)}}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: "6px",
								padding: "11px 0",
								textDecoration: "none",
								color: hovered === 4 ? "#111" : "#555",
								fontSize: "13px",
								letterSpacing: "-0.3px",
								fontWeight: hovered === 4 ? "600" : "400",
								transition: "color 0.15s, font-weight 0.15s",
							}}
						>
							{/* 호버 시 좌측 액센트 바 */}
							<span
								style={{
									display: "inline-block",
									width: "2px",
									height: "11px",
									borderRadius: "2px",
									background: "#111",
									opacity: hovered === 4 ? 1 : 0,
									transition: "opacity 0.15s",
									flexShrink: 0,
								}}
							/>
							로션
						</button>
					</li>
					<li key={5} style={{ borderBottom: "1px solid #efefef" }}>
						<button onMouseEnter={() => setHovered(5)} onMouseLeave={() => setHovered(null)} onClick={() => {setCategory('미스트/오일'); getPage('미스트/오일', 1)}}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: "6px",
								padding: "11px 0",
								textDecoration: "none",
								color: hovered === 5 ? "#111" : "#555",
								fontSize: "13px",
								letterSpacing: "-0.3px",
								fontWeight: hovered === 5 ? "600" : "400",
								transition: "color 0.15s, font-weight 0.15s",
							}}
						>
							{/* 호버 시 좌측 액센트 바 */}
							<span
								style={{
									display: "inline-block",
									width: "2px",
									height: "11px",
									borderRadius: "2px",
									background: "#111",
									opacity: hovered === 5 ? 1 : 0,
									transition: "opacity 0.15s",
									flexShrink: 0,
								}}
							/>
							미스트/오일
						</button>
					</li>
					<li key={6} style={{ borderBottom: "1px solid #efefef" }}>
						<button onMouseEnter={() => setHovered(6)} onMouseLeave={() => setHovered(null)} onClick={() => {setCategory('스킨케어세트'); getPage('스킨케어세트', 1)}}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: "6px",
								padding: "11px 0",
								textDecoration: "none",
								color: hovered === 6 ? "#111" : "#555",
								fontSize: "13px",
								letterSpacing: "-0.3px",
								fontWeight: hovered === 6 ? "600" : "400",
								transition: "color 0.15s, font-weight 0.15s",
							}}
						>
							{/* 호버 시 좌측 액센트 바 */}
							<span
								style={{
									display: "inline-block",
									width: "2px",
									height: "11px",
									borderRadius: "2px",
									background: "#111",
									opacity: hovered === 6 ? 1 : 0,
									transition: "opacity 0.15s",
									flexShrink: 0,
								}}
							/>
							스킨케어세트
						</button>
					</li>
				</ul>
			</div>

			{/* ── 헤더 ── */}
			<div style={{
				display: 'flex',
				alignItems: 'flex-start',
				justifyContent: 'space-between',
				flexWrap: 'wrap',
				gap: 12,
				marginBottom: 32,
			}}>
				{/* 좌: 타이틀 */}
				<div>
					<h4 style={{ fontWeight: 800, margin: 0, fontSize: 22, letterSpacing: '-0.5px', color: '#111' }}>
						제품 추천
					</h4>
					<small style={{ color: TEAL, fontWeight: 600, fontSize: 13 }}>Products</small>
				</div>

				{/* 우: 검색 + 정렬 */}
				<div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
					{/* 검색 */}
					<div style={{ position: 'relative' }}>
						<SearchIcon style={{
							position: 'absolute', left: 12, top: '50%',
							transform: 'translateY(-50%)', fontSize: 18, color: '#aaa'
						}} />
						<input
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder="Search"
							style={{
								padding: '9px 14px 9px 38px',
								borderRadius: 12,
								border: '1.5px solid #E8EAEA',
								background: '#FAFBFB',
								fontSize: 14,
								color: '#333',
								outline: 'none',
								width: 200,
							}}
						/>
					</div>

					{/* 정렬 드롭다운 */}
					<div style={{ position: 'relative' }}>
						<select
							value={selectedSearchOpt}
							onChange={e => setSelectedSearchOpt(e.target.value)}
							style={{
								padding: '9px 36px 9px 14px',
								borderRadius: 12,
								border: '1.5px solid #E8EAEA',
								background: '#FAFBFB',
								fontSize: 14,
								color: '#333',
								outline: 'none',
								appearance: 'none',
								cursor: 'pointer',
								minWidth: 150,
							}}
						>
							{sortOptions.map(o => (
								<option key={o.id} value={o.label}>{o.label}</option>
							))}
						</select>
						<span style={{
							position: 'absolute', right: 12, top: '50%',
							transform: 'translateY(-50%)', pointerEvents: 'none',
							color: '#aaa', fontSize: 11
						}}>▼</span>
					</div>
				</div>
			</div>

			<hr style={{ borderTop: '1.5px solid #F0F0F0', margin: '0 0 28px' }} />

			{/* ── 제품 그리드 ── */}
			<div style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(4, 1fr)',
				gap: 20,
				marginBottom: 16,
			}}>
				{Content.data.map(item => (
					<Link
						key={item.product_id}
						to={`/recommenddetail/${item.product_id}`}
						style={{ textDecoration: 'none', color: 'inherit' }}
					>
						<div style={{
							borderRadius: 18,
							background: '#fff',
							border: '1.5px solid #F0F2F2',
							overflow: 'hidden',
							transition: 'box-shadow 0.2s, transform 0.2s',
							cursor: 'pointer',
						}}
							onMouseEnter={e => {
								(e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.09)';
								(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
							}}
							onMouseLeave={e => {
								(e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
								(e.currentTarget as HTMLDivElement).style.transform = 'none';
							}}
						>
							{/* 이미지 */}
							<div style={{
								position: 'relative',
								width: '100%', height: 190,
								background: '#F6F8F8',
								overflow: 'hidden',
							}}>
								<img
									src={item.image}
									alt={item.name}
									style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								/>
								{/* 하트 버튼 */}
								<button
									onClick={e => toggleHeart(item.product_id, e)}
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
									{likedIds.has(item.product_id)
										? <HeartIcon style={{ color: '#FF4D6A', fontSize: 18 }} />
										: <EmptyHeart style={{ color: '#bbb', fontSize: 18 }} />
									}
								</button>
							</div>

							{/* 텍스트 */}
							<div style={{ padding: '12px 14px 16px' }}>
								<p style={{ margin: '0 0 4px', fontSize: 12, color: '#999', fontWeight: 500 }}>
									{item.brand}
								</p>
								<p style={{
									margin: 0, fontSize: 13, fontWeight: 600, color: '#222',
									lineHeight: 1.5,
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden',
								}}>
									{item.name}
								</p>
							</div>
						</div>
					</Link>
				))}
			</div>

			{/* 정렬 안내 */}
			<p style={{ fontSize: 11, color: '#aaa', margin: '4px 0 40px' }}>
				사용자 좋아요 수가 많은 순으로 정렬된 결과입니다.
			</p>

			{/* ── 페이지네이션 ── */}
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
				{/* 이전 */}
				<PagBtn
					label="‹"
					disabled={Content.currentPage === 1}
					active={false}
					onClick={() => { getPage(category, Content.currentPage - 1); }}
				/>

				{pageNums.map((p, i) =>
					typeof p === 'number' ? (
						<PagBtn
							key={i}
							label={String(p)}
							active={p === Content.currentPage}
							onClick={() => { getPage(category, p); }}
						/>
					) : (
						<span key={i} style={{ fontSize: 14, color: '#bbb', padding: '0 2px' }}>…</span>
					)
				)}

				{/* 다음 */}
				<PagBtn
					label="›"
					disabled={Content.currentPage === totalPages}
					active={false}
					onClick={() => { getPage(category, Content.currentPage + 1); }}
				/>
			</div>
		</div>
	);
};

/* ── 페이지 버튼 ── */
const PagBtn: React.FC<{ label: string; active: boolean; disabled?: boolean; onClick: () => void; }> = ({ label, active, disabled, onClick }) => (
	<button
		disabled={disabled}
		onClick={onClick}
		style={{
			width: 38, height: 38,
			borderRadius: 10,
			border: active ? `1.5px solid ${TEAL}` : '1.5px solid #E2E8E8',
			background: active ? TEAL : '#fff',
			color: active ? '#fff' : disabled ? '#ccc' : '#555',
			fontWeight: active ? 700 : 500,
			fontSize: 14, cursor: disabled ? 'default' : 'pointer',
			display: 'flex', alignItems: 'center', justifyContent: 'center',
			transition: 'all 0.15s',
		}}
	>
		{label}
	</button>
);

export default Gallery;
