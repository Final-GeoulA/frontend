/*
설치한 모듈
yarn add react-icons
*/
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../../components/AuthProvider";
import styles from './Recommend.module.css';

const SearchIcon = CiSearch as React.ElementType;
const HeartIcon = IoHeart as React.ElementType;
const EmptyHeart = IoHeartOutline as React.ElementType;

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

interface Page {
  totalItems: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  currentPage: number;
  data: Product[];
}

const Gallery: React.FC<{ likedOnly?: boolean }> = ({ likedOnly }) => {
	const userinfo = useAuth()
	const [category, setCategory] = useState<string>('스킨/토너');
	const [selectedSearchOpt, setSelectedSearchOpt] = useState<string>('상품명');	//검색 타입
	const [search, setSearch] = useState<string>('');						//검색 키워드
	const [hovered, setHovered] = useState<number | null>(null);
	const [Content, setContent] = useState<Page>({
		totalItems: 0,
		totalPages: 1,
		startPage: 1,
		endPage: 1,
		currentPage: 1,
		data: []
	});

	const getPage = async (cat: string, page: number, search: string) => {
		try {
			let url = `${process.env.REACT_APP_BACK_END_URL}/board/product/list?cPage=${page}`;
			if (likedOnly && userinfo.member) {
				url += `&liked=true&id=${userinfo.member.user_id}`;
			} else {
				url += `&category=${cat}`;
				if (userinfo.member) url += `&id=${userinfo.member.user_id}`;
			}
			if (search !== '') url += `&type=${selectedSearchOpt}&keyword=${search}`;
			const res = await axios.get(url);
			setContent(res.data);
		} catch (e) {
		}
	};

	useEffect(() => { getPage(category, 1, ''); }, [userinfo.member]);

	const toggleHeart = async (id: number, hearted: number, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!userinfo.member) {
			alert("로그인이 필요합니다.");
			return;
		}
		const endpoint = hearted === 1 ? 'unheart' : 'heart';
		try {
			await axios.get(
				`${process.env.REACT_APP_BACK_END_URL}/board/product/${endpoint}?prodid=${id}&userid=${userinfo.member.user_id}`
			);
			await getPage(category, Content.currentPage, search);
		} catch (err) {
			console.error("하트 처리 실패", err);
		}
	};

  const sortOptions = [
    { id: "name", label: "상품명" },
    { id: "brand", label: "브랜드" },
    { id: "ingre", label: "성분" },
  ];

  const menuItems = [
    { id: 1, label: "스킨/토너", value: "스킨/토너" },
    { id: 2, label: "에센스/세럼/앰플", value: "에센스/세럼/앰플" },
    { id: 3, label: "크림", value: "크림" },
    { id: 4, label: "로션", value: "로션" },
    { id: 5, label: "미스트/오일", value: "미스트/오일" },
    { id: 6, label: "스킨케어세트", value: "스킨케어세트" },
  ];

  // 페이지네이션 범위
  const totalPages = Content.totalPages;
  const pageNums: (number | string)[] = [];
  const start = Content.startPage || 1;
  const end = Math.min(Content.endPage || 5, totalPages);
  for (let i = start; i <= end; i++) pageNums.push(i);
  if (end < totalPages) {
    pageNums.push("...");
    pageNums.push(totalPages);
  }

	return (
		<div style={{
			maxWidth: 1100,
			margin: '0 auto',
			padding: '40px 24px 64px',
			fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
		}}>
		{!likedOnly && <div style={{ float: "left", width: "141px", marginRight: "49px" }}>
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
						<button onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)} onClick={() => { setCategory('스킨/토너'); setSearch(''); getPage('스킨/토너', 1, '') }}
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
						<button onMouseEnter={() => setHovered(2)} onMouseLeave={() => setHovered(null)} onClick={() => { setCategory('에센스/세럼/앰플'); getPage('에센스/세럼/앰플', 1, '') }}
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
						<button onMouseEnter={() => setHovered(3)} onMouseLeave={() => setHovered(null)} onClick={() => { setCategory('크림'); getPage('크림', 1, '') }}
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
						<button onMouseEnter={() => setHovered(4)} onMouseLeave={() => setHovered(null)} onClick={() => { setCategory('로션'); getPage('로션', 1, '') }}
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
						<button onMouseEnter={() => setHovered(5)} onMouseLeave={() => setHovered(null)} onClick={() => { setCategory('미스트/오일'); getPage('미스트/오일', 1, '') }}
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
						<button onMouseEnter={() => setHovered(6)} onMouseLeave={() => setHovered(null)} onClick={() => { setCategory('스킨케어세트'); getPage('스킨케어세트', 1, '') }}
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
			</div>}

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
						{likedOnly ? '좋아요한 제품' : '제품 추천'}
					</h4>
					<small style={{ color: TEAL, fontWeight: 600, fontSize: 13 }}>{likedOnly ? 'My Favorites' : 'Products'}</small>
				</div>

				{/* 우: 검색 + 정렬 */}
				<div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
					{/* 검색 */}
					<div style={{ position: 'relative' }}>
						<input
							value={search}
							onChange={e => setSearch(e.target.value)}
							onKeyDown={e => { if (e.key === 'Enter') getPage(category, 1, search); }}
							placeholder="Search"
							style={{
								padding: '9px 14px 9px 14px',
								borderRadius: 12,
								border: '1.5px solid #E8EAEA',
								background: '#FAFBFB',
								fontSize: 14,
								color: '#333',
								outline: 'none',
								width: 200,
							}}
						/>
							<SearchIcon onClick={() => getPage(category, 1, search)} style={{
								cursor: 'pointer',
								position: 'absolute', right: 12, top: '50%',
								transform: 'translateY(-50%)', fontSize: 18, color: '#aaa'
							}} />
					</div>

          <div className={styles.selectWrapper}>
            <select
              value={selectedSearchOpt}
              onChange={(e) => setSelectedSearchOpt(e.target.value)}
              className={styles.sortSelect}
            >
              {sortOptions.map((o) => (
                <option key={o.id} value={o.label}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}>▼</span>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

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
									onClick={e => toggleHeart(item.product_id, item.hearted, e)}
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
									{item.hearted === 1
										? <HeartIcon style={{ color: '#FF4D6A', fontSize: 18 }} />
										: <EmptyHeart style={{ color: '#bbb', fontSize: 18 }} />
									}
								</button>
							</div>

              {/* 텍스트 */}
              <div className={styles.productInfo}>
                <p className={styles.productBrand}>{item.brand}</p>
                <p className={styles.productName}>{item.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 정렬 안내 */}
      <p className={styles.sortNote}>
        사용자 좋아요 수가 많은 순으로 정렬된 결과입니다.
      </p>

			{/* ── 페이지네이션 ── */}
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
				{/* 이전 */}
				<PagBtn
					label="‹"
					disabled={Content.currentPage === 1}
					active={false}
					onClick={() => { getPage(category, Content.currentPage - 1, ''); }}
				/>

				{pageNums.map((p, i) =>
					typeof p === 'number' ? (
						<PagBtn
							key={i}
							label={String(p)}
							active={p === Content.currentPage}
							onClick={() => { getPage(category, p, ''); }}
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
					onClick={() => { getPage(category, Content.currentPage + 1, ''); }}
				/>
			</div>
		</div>
	);
};

/* ── 페이지 버튼 ── */
const PagBtn: React.FC<{
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}> = ({ label, active, disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`${styles.pagBtn}${active ? ` ${styles.active}` : ""}`}
  >
    {label}
  </button>
);

export default Gallery;
