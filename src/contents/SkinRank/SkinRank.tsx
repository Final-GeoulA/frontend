import React, { useState } from "react";
import "./style/SkinRank.css";

interface SkinItem {
  id: number;
  image: string;
  score: number;
  votes: number;
}

const initialData: SkinItem[] = [
  { id: 1, image: "/image/SkinRank/skin1.jpeg", score: 82, votes: 120 },
  { id: 2, image: "/image/SkinRank/skin2.jpeg", score: 76, votes: 98 },
  { id: 3, image: "/image/SkinRank/skin3.jpeg", score: 90, votes: 210 },
  { id: 4, image: "/image/SkinRank/skin4.jpeg", score: 68, votes: 45 },
  { id: 5, image: "/image/SkinRank/skin1.jpeg", score: 82, votes: 120 },
  { id: 6, image: "/image/SkinRank/skin2.jpeg", score: 76, votes: 98 },
  { id: 7, image: "/image/SkinRank/skin3.jpeg", score: 90, votes: 210 },
  { id: 8, image: "/image/SkinRank/skin4.jpeg", score: 68, votes: 45 }
];

const SkinRank: React.FC = () => {
  const [data, setData] = useState<SkinItem[]>(initialData);
  const [votedIds, setVotedIds] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);

  const handleVote = (id: number) => {
    // 이미 투표했으면 막기
    if (votedIds.includes(id)) return;

    // 투표수 +1
    const updated = data.map((item) =>
      item.id === id ? { ...item, votes: item.votes + 1 } : item
    );

    setData(updated);
    setVotedIds([...votedIds, id]);

    // 토스트 표시
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="skin-rank-container">
      <h2 className="title">피부 랭킹</h2>

      {/* 토스트 */}
      {showToast && <div className="toast">✔ 투표 완료!</div>}

      <div className="grid">
        {data.map((item) => (
          <div key={item.id} className="card">
            <img src={item.image} alt="skin" />

            <div className="overlay">
              <div className="info">
                <span>⭐ {item.score}</span>
                <span>👍 {item.votes}</span>
              </div>

              <button
                className="vote-btn"
                disabled={votedIds.includes(item.id)}
                onClick={() => handleVote(item.id)}
              >
                {votedIds.includes(item.id) ? "투표 완료" : "투표하기"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkinRank;