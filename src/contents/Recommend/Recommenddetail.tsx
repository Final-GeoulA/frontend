import React, { useEffect, useState } from "react";
import { Navbar } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./Recommenddetail.module.css";

const TEAL = "#3BBFB2";

interface Product {
  product_id: 15;
  name: string;
  brand: string;
  category: string;
  ingredient: string;
  cost: string;
  hit: number;
  elike: number;
  image: string;
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
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<CommentPage>({
    totalItems: 0,
    totalPages: 0,
    startPage: 1,
    endPage: 0,
    currentPage: 1,
    data: [],
  });

  const pages = () => {
    const arr: (number | string)[] = [];
    for (let page = comments.startPage; page <= comments.endPage; page++) {
      arr.push(page);
    }
    return arr;
  };

  const getPruduct = async (prodid: string | undefined) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/board/product/detail?prodid=${prodid}`
      );
      setProduct(res.data);
    } catch (e) {}
  };

  const getComments = async (commpage: number) => {
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_BACK_END_URL
        }/board/product/commlist?prodid=${prodid}&cPage=${commpage.toString()}`
      );
      setComments(res.data);
    } catch (e) {}
  };

  useEffect(() => {
    getPruduct(prodid);
    getComments(comments.currentPage);
  }, [comments.currentPage]);

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <div className={styles.container}>
        {/* ── 헤더 ── */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>제품 추천</h1>
          <p className={styles.pageSubtitle}>Products</p>
        </div>

        {/* ── 상품 카드 ── */}
        <div className={styles.productCard}>
          {/* 이미지 */}
          <div className={styles.productImageWrapper}>
            <img src={product?.image} alt="" className={styles.productImage} />
          </div>

          {/* 상품 정보 */}
          <div className={styles.productInfo}>
            <h2 className={styles.productName}>{product?.name}</h2>
            <p className={styles.productBrand}>제조사: {product?.brand}</p>

            <button
              onClick={() => setExpanded(!expanded)}
              className={styles.ingredientBtn}
            >
              {expanded ? "성분숨기기" : "전성분보기"}
            </button>

            {/* 전성분 박스 - maxHeight는 동적 값이므로 인라인 유지 */}
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

        {/* ── 댓글 입력 ── */}
        <div className={styles.commentSection}>
          <div className={styles.commentHeader}>
            <div className={styles.commentIconWrapper}>
              <svg
                width="16"
                height="16"
                fill="none"
                stroke={TEAL}
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <span className={styles.commentTitle}>
              이 제품을 사용해보셨나요?
            </span>
          </div>

          <div className={styles.commentInputRow}>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="해당 제품의 사용 후기를 남겨보세요."
              className={styles.commentInput}
            />
            <button className={styles.commentSubmitBtn}>등록하기</button>
          </div>
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

        {/* 목록/삭제 */}
        <div className={styles.footerActions}>
          <Link to="/community/boardlist" className={styles.actionBtn}>
            목록
          </Link>
          <button className={styles.actionBtn}>삭제</button>
        </div>
      </div>
    </div>
  );
};

export default Recommenddetail;
