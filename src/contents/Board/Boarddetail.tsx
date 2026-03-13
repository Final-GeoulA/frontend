import React, { useState } from 'react'
import { Navbar } from 'react-bootstrap'
import style from './board.module.css'
import { Link } from 'react-router-dom'



interface BoardVO {
  num:number;
  title:string;
  writer:string;
  content:string;
  imgn?:string;
  hit?:number;
  reip?:string;
  bdate?:string;
  mfile:File |null;
}


const Boarddetail: React.FC = () => {
    // const [comment, setComment] = useState<BoardVO|null>(null);
  return (
     <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        {/* 본문 카드 */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", marginBottom: 16, overflow: "hidden" }}>
          {/* 제목 영역 */}
          <div style={{ padding: "32px 36px 24px", borderBottom: "1px solid #f0f0f0" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 20px", letterSpacing: "-0.3px" }}>
              노스카나 엄청 짱이에요~!
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#333" }}>user1234</p>
                <p style={{ margin: 0, fontSize: 13, color: "#aaa" }}>2026.03.01 · 조회 51</p>
              </div>
            </div>
          </div>
        {/* 본문 */}
         <div style={{ padding: "32px 36px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <div style={{
                width: 360, height: 240, background: "#f5e8e8", borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#ccc", fontSize: 14
              }}>
                <img src="/image/noscana.jpg" 
                    alt="노스카나" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>
            </div>
            <div style={{ fontSize: 15, color: "#444", lineHeight: 1.9, textAlign: "center" }}>
              <p>이렇게 비교하니까 확실히 달라진 게 보이더라구요.</p>
              <p>제가 노스카나 겔을 사용하면서<br />알게된 정보를 알려드릴게여 ㅎ_ㅎ</p>
              <p>여드름 상처가 아물고 사용해줘야하구요<br />흉터부분에 완전 흡수될 때까지<br />하루에 여러번 발라주는 게 좋아요</p>
              <p>팁을 주자면, 저녁에 자기전 바르고<br />반창고 같은 걸로 밀봉해주면 더욱 효과를 볼 수 있어요.<br />수분이 날라가지 않도록 해주는게 나름 팁이더라구요. ㅎ</p>
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
            <p style={{ margin: 0, fontSize: 14, color: "#444", paddingLeft: 48 }}>저는 그렇게 생각 안 합니다 !</p>
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

export default Boarddetail