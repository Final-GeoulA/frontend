import React, { useState } from 'react'
import { Navbar } from 'react-bootstrap'
import style from './board.module.css'
import { Link } from 'react-router-dom'
interface RecommandItem {
  num: number;
  title: string;
  writer: string;
  nickname: string;
  contents: string;
  reip: string;
  hit: string;
  elike: string;
  gdate: string;
  getImgvo: string[] | null;
}

const Recommenddetail: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
      <Navbar  />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>

        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0, letterSpacing: "-0.5px" }}>제품 추천</h1>
            <p style={{ fontSize: 14,  fontWeight: 600, margin: "4px 0 0" }}>Products</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              border: "1.5px solid #e0e0e0", borderRadius: 10,
              padding: "8px 14px", background: "#fff"
            }}>
              
              <input
                // value={search}
                // onChange={e => setSearch(e.target.value)}
                placeholder="Search"
                style={{ border: "none", outline: "none", fontSize: 14, color: "#333", width: 160 }}
              />
            </div>
            <div style={{ position: "relative" }}>
              <select
                // value={sort}
                // onChange={e => setSort(e.target.value)}
                style={{
                  border: "1.5px solid #e0e0e0", borderRadius: 10,
                  padding: "9px 36px 9px 14px", fontSize: 14, color: "#333",
                  background: "#fff", cursor: "pointer", outline: "none", appearance: "none"
                }}
              >
                {["상품명", "브랜드", "인기순"].map(o => <option key={o}>{o}</option>)}
              </select>
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#aaa", fontSize: 12 }}>▼</span>
            </div>
          </div>
        </div>

        {/* 상품 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap:10, marginBottom: 32 }}>
             
            <div style={{ cursor: "pointer", borderRadius: 12, overflow: "hidden", background: "#fff", border: "1px solid #eee", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.10)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
            >
              {/* 이미지 영역 */}
              <div style={{ position: "relative", height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ padding: "20px 10px" }}>
                    <img src="/image/noscana.jpg" 
                                    alt="노스카나" 
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                /></span>
                <button
                  
                  style={{
                    position: "absolute", bottom: 10, right: 10,
                    background: "none", border: "none", cursor: "pointer", padding: 0
                  }}
                >
                  
                </button>
              </div>
              {/* 텍스트 */}
              <div style={{ padding: "12px 14px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888", fontWeight: 500 }}>제조사</p>
                <p>동아제약</p>
                <p style={{ margin: 0, fontSize: 13, color: "#333", lineHeight: 1.5, display: "-webkit-box", 
                    WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>상품명</p>
                <p>노스카나 겔 크림</p>
              </div></div>
              
           
            {/* 2. 텍스트 영역 (나머지 3칸을 합쳐서 차지) */}
           
            <div style={{ 
                gridColumn: "span 3", // 핵심: 3개의 열을 병합
                fontSize: 15, 
                color: "#444", 
                lineHeight: 1.9, 
                textAlign: "left", // 텍스트 양이 많아지므로 center보다 left가 가독성이 좋을 수 있습니다
                padding: "10px" 
            }}>
             <div style={{ cursor: "pointer", borderRadius: 12, overflow: "hidden", background: "#fff", border: "1px solid #eee", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.10)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            
            <div style={{ padding: "15px 14px" }}>
            
            <p>제가 노스카나 겔을 사용하면서<br />알게된 정보를 알려드릴게여 ㅎ_ㅎ</p>
            <p>여드름 상처가 아물고 사용해줘야하구요<br />흉터부분에 완전 흡수될 때까지<br />하루에 여러번 발라주는 게 좋아요</p>
           
            </div>
            {/* 전성분 보기 버튼 */}
              <button
                // onClick={() => setShowIngredients(!showIngredients)}
                style={{
                  padding: "9px 20px", color: "#fff",
                  border: "none", borderRadius: 8, fontSize: 14,
                  fontWeight: 600, cursor: "pointer", marginBottom: 20
                }}
              >
                전성분 보기
              </button>

              {/* 전성분 박스 */}
              
                <div style={{
                  background: "#f8fffe", border: "1px solid #d0f0ed",
                  borderRadius: 10, padding: "16px 20px",
                  fontSize: 13, color: "#555", lineHeight: 1.8
                }}>
                  {/* {INGREDIENTS} */}
                정제수, 1,2-헥산다이올, 다이프로필렌글라이콜, 프로판다이올, 부틸렌글라이콜, 글리세린, 감초뿌리추출물, 약모밀추출물, 카보머, 병풀추출물, 하이드록시에틸셀룰로오스, 알지닌, 알란토인, 다이소듐이디티에이, 하수오전초추출물, 베타인, 히아신스전초추출물, 판테놀, 알바수련꽃추출물
                </div>
              
            </div>
            </div>
        </div>

       {/* 댓글 */}
        
          <div style={{
            background: "#fff", borderRadius: 14, border: "1px solid #eee",
            padding: "20px 28px", marginBottom: 12
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              {/* <Avatar color={c.avatar} letter={c.author[0]} /> */}
              <span style={{ fontWeight: 600, fontSize: 15, color: "#222" }}>thinktoy</span>
              <span style={{ fontSize: 13, color: "#aaa" }}>2026.03.11</span>
              
              <div style={{ marginLeft: "auto", fontSize: 12, color: "red" }}>
              <img src={`/image/elike.png` }
              style={{ width: '30px', height: 'auto' }} alt='elike'/>33</div>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "#444", paddingLeft: 48 }}>제 피부에 안 맞아요!</p>
          </div>
        {/* 댓글 입력 */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "20px 28px", marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", 
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              {/* <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg> */}
            </div>
            <span style={{ fontWeight: 600, fontSize: 15, color: "#333" }}>Comment</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input
            //   value={comment}
            //   onChange={e => setComment(e.target.value)}
              placeholder="댓글을 남겨보세요."
              style={{
                flex: 1, padding: "12px 16px", fontSize: 14,
                border: "1.5px solid #e0e0e0", borderRadius: 10,
                outline: "none", color: "#333"
              }}
            />
            <button style={{
              color: "#fff", border: "none",
              borderRadius: 10, padding: "0 22px",
              fontSize: 14, fontWeight: 600, cursor: "pointer"
            }}>
              등록하기
            </button>
          </div>
          <div style={{ textAlign: 'center'}}>
           
            <Link to="/community/boardlist" className={style.button} style={{ margin: 5 ,fontSize:12 }} >목록</Link>
            <button className={style.button} style={{ margin: 5, fontSize:12 }}  >삭제</button>
            </div>
           

          </div>
      </div>
    </div>
  )
}

export default Recommenddetail