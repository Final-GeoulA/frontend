/*
설치한 모듈
yarn add react-icons
*/
import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci"; // 돋보기 아이콘
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { IoHeartOutline, IoHeart } from "react-icons/io5"; //하트 아이콘
import { Link } from 'react-router-dom';

const Gallery: React.FC = () => {
  const [selectedSort, setSelectedSort] = useState('상품명');
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  // 그리드형식 
  const products = [
    { id: 1, name: "넘버즈인 1번 수딩세럼", brand: "넘버즈인", img: "/image/Recommend/numbuzin.jpg", heart: false },
    { id: 2, name: "파티온 트러블 크림", brand: "파티온", img: "/image/Recommend/fation.jpg", heart: false },
    { id: 3, name: "바이오가 바디워시", brand: "바이오가", img: "/image/Recommend/biorga.png", heart: false },
    { id: 4, name: "이지덤 스팟패치", brand: "이지덤", img: "/image/Recommend/easyderm.png", heart: false }
  ]
  // Dropdown 영역
  const sortOptions = [
    { id: 'name', label: '상품명' },
    { id: 'brand', label: '브랜드' },
    { id: 'ingre', label: '성분' }
  ];
  //아이콘 영역
  const SearchIcon = CiSearch as any;
  const HeartIcon = IoHeart as any;
  const EmptyheartIcon = IoHeartOutline as any;
  const [heart, setHeart] = useState(false);
  // 기존 products 더미데이터를 초기값
  const [productList, setProductList] = useState(products);
  //하트 클릭 핸들러 함수
  const toggleHeart = (id: number) => {
    setProductList(prev => prev.map(item => item.id === id ? { ...item, heart: !item.heart } : item))
  }
  return (
    <div className="container py-4" style={{ maxWidth: '1100px' }}>
      {/* --- 상단 컨트롤 영역 --- */}
      <div className="row align-items-center gy-3 mb-4">
        <div className="col-12 col-md-auto">
          <h4 className="mb-0" style={{ fontWeight: '700', letterSpacing: '-0.5px' }}>제품 추천</h4>
          <small>Products</small>
        </div>
        <div className="col-12 col-md d-flex flex-column flex-sm-row justify-content-md-end gap-2">
          <div style={{ position: 'relative', flex: '1', maxWidth: '280px' }}>
            <SearchIcon style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#999' }} />
            <input type="text" placeholder="Search products..." style={{ width: '100%', padding: '10px 10px 10px 42px', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#f8f9fa', fontSize: '14px', outline: 'none' }} />
          </div>
          <div className="dropdown">
            <button className="btn dropdown-toggle shadow-sm w-100" type="button" data-bs-toggle="dropdown" style={{ minWidth: '160px', borderRadius: '12px', padding: '10px 15px', fontSize: '14px', backgroundColor: '#f8f9fa', border: '1px solid #eee', textAlign: 'left' }}>
              <span className="text-muted me-1">Sort by:</span>
              <strong>{selectedSort}</strong>
            </button>
            <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2 w-100" style={{ borderRadius: '12px', padding: '8px' }}>
              {sortOptions.map((option) => (
                <li key={option.id}>
                  <button className="dropdown-item py-2" type="button" style={{ borderRadius: '8px', fontSize: '14px' }} onClick={() => setSelectedSort(option.label)}>{option.label}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <hr style={{ borderTop: '1px solid #eee', margin: '0 0 30px 0' }} />

      {/* --- 제품 리스트 영역 --- */}
      <div className="row g-4 mb-5">
        {productList.map((item) => (
          <div key={item.id} className="col-6 col-md-4 col-lg-3">
            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <Link to="/recommenddetail">
                {/* 이미지 영역 */}
                <div style={{ width: '100%', height: '200px', backgroundColor: '#f8f9fa', overflow: 'hidden' }}>
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                {/* 텍스트 정보 영역 */}
                <div className="card-body p-3">
                  <p className="text-muted mb-1" style={{ fontSize: '12px' }}>{item.brand}</p>
                  <div className='d-flex justify-content-between'>
                    <h6 className="card-title mb-2" style={{ fontWeight: '600' }}>{item.name}</h6>
                    {/* 하트 아이콘 버튼 */}
                    <button
                      onClick={() => toggleHeart(item.id)}
                      style={{

                        border: 'none',
                        background: 'none',
                        padding: '0',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        marginTop: '-2px' // 텍스트 높이와 시각적으로 맞추기 위한 미세 조정
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                    >
                      {item.heart ? (
                        <HeartIcon style={{ color: '#ff4d4f', fontSize: '22px' }} />
                      ) : (
                        <EmptyheartIcon style={{ color: '#ccc', fontSize: '22px' }} />
                      )}
                    </button>
                  </div>


                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '11px', color: 'gray' }}>사용자 좋아요 수가 많은 순으로 정렬된 결과입니다.</p>
      {/* --- 페이지네이션 영역 --- */}
      <nav aria-label="Page navigation" className="d-flex justify-content-center justify-content-md-end mt-5">
        <ul className="pagination gap-1" style={{ border: 'none', marginBottom: 0 }}>
          {/* 이전 버튼 */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link shadow-sm text-center"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{
                borderRadius: '10px',
                border: '1px solid #eee',
                color: '#666',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              &lt;
            </button>
          </li>

          {/* 페이지 번호 */}
          {[1, 2, 3, 4, 5].map((pageNum) => (
            <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
              <button
                className="page-link shadow-sm"
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  borderRadius: '10px',
                  border: '1px solid #eee',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  backgroundColor: currentPage === pageNum ? '#333' : '#fff',
                  color: currentPage === pageNum ? '#fff' : '#666',
                  borderColor: currentPage === pageNum ? '#333' : '#eee',
                }}
              >
                {pageNum}
              </button>
            </li>
          ))}

          {/* 다음 버튼 */}
          <li className={`page-item ${currentPage === 5 ? 'disabled' : ''}`}>
            <button
              className="page-link shadow-sm text-center"
              onClick={() => setCurrentPage(prev => Math.min(5, prev + 1))}
              style={{
                borderRadius: '10px',
                border: '1px solid #eee',
                color: '#666',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              &gt;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Gallery;

