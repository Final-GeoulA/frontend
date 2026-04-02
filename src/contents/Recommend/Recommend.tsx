/*
설치한 모듈
yarn add react-icons
*/
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Recommend.module.css";

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
  const [category, setCategory] = useState<string>("스킨/토너");
  const [selectedSearchOpt, setSelectedSearchOpt] = useState<string>("상품명");
  const [search, setSearch] = useState<string>("");
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [Content, setContent] = useState<Page>({
    totalItems: 0,
    totalPages: 1,
    startPage: 1,
    endPage: 1,
    currentPage: 1,
    data: [],
  });

  const getPage = async (category: string, page: number) => {
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_BACK_END_URL
        }/board/product/list?category=${category}&cPage=${page}${
          search === "" ? "" : `&type=${selectedSearchOpt}&keyword=${search}`
        }`
      );
      setContent(res.data);
    } catch (e) {
      // 서버 미연결 시 더미 데이터
    }
  };

  useEffect(() => {
    getPage(category, 1);
  }, []);

  const toggleHeart = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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

  const SearchIcon = CiSearch as any;
  const HeartIcon = IoHeart as any;
  const EmptyHeart = IoHeartOutline as any;

  return (
    <div className={styles.pageWrapper}>
      {/* ── 사이드바 ── */}
      <div className={styles.sidebar}>
        <p className={styles.sidebarTitle}>스킨케어</p>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <button
                className={styles.menuBtn}
                onClick={() => {
                  setCategory(item.value);
                  getPage(item.value, 1);
                }}
              >
                <span className={styles.menuAccent} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── 헤더 ── */}
      <div className={styles.header}>
        <div>
          <h4 className={styles.headerTitle}>제품 추천</h4>
          <small className={styles.headerSubtitle}>Products</small>
        </div>

        {/* 검색 + 정렬 */}
        <div className={styles.searchArea}>
          <div className={styles.searchWrapper}>
            <SearchIcon className={styles.searchIcon} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className={styles.searchInput}
            />
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
      <div className={styles.productGrid}>
        {Content.data.map((item) => (
          <Link
            key={item.product_id}
            to={`/recommenddetail/${item.product_id}`}
            className={styles.productLink}
          >
            <div className={styles.productCard}>
              {/* 이미지 */}
              <div className={styles.productImageWrapper}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.productImage}
                />
                {/* 하트 버튼 */}
                <button
                  onClick={(e) => toggleHeart(item.product_id, e)}
                  className={styles.heartBtn}
                >
                  {likedIds.has(item.product_id) ? (
                    <HeartIcon style={{ color: "#FF4D6A", fontSize: 18 }} />
                  ) : (
                    <EmptyHeart style={{ color: "#bbb", fontSize: 18 }} />
                  )}
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
      <div className={styles.pagination}>
        <PagBtn
          label="‹"
          disabled={Content.currentPage === 1}
          active={false}
          onClick={() => getPage(category, Content.currentPage - 1)}
        />

        {pageNums.map((p, i) =>
          typeof p === "number" ? (
            <PagBtn
              key={i}
              label={String(p)}
              active={p === Content.currentPage}
              onClick={() => getPage(category, p)}
            />
          ) : (
            <span key={i} className={styles.pagDots}>
              …
            </span>
          )
        )}

        <PagBtn
          label="›"
          disabled={Content.currentPage === totalPages}
          active={false}
          onClick={() => getPage(category, Content.currentPage + 1)}
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
