import React, { useState } from "react";
import "./style/SkinRank.css";

interface SkinItem {
  id: number;
  image: string;
}

const initialData: SkinItem[] = [
  { id: 1, image: "/image/SkinRank/skin1.jpeg" },
  { id: 2, image: "/image/SkinRank/skin2.jpeg" },
  { id: 3, image: "/image/SkinRank/skin3.jpeg" },
  { id: 4, image: "/image/SkinRank/skin4.jpeg" },
  { id: 5, image: "/image/SkinRank/skin1.jpeg" },
  { id: 6, image: "/image/SkinRank/skin2.jpeg" },
  { id: 7, image: "/image/SkinRank/skin3.jpeg" },
  { id: 8, image: "/image/SkinRank/skin4.jpeg" },
  { id: 9, image: "/image/SkinRank/skin1.jpeg" },
  { id: 10, image: "/image/SkinRank/skin2.jpeg" },
  { id: 11, image: "/image/SkinRank/skin3.jpeg" },
  { id: 12, image: "/image/SkinRank/skin4.jpeg" },
  { id: 13, image: "/image/SkinRank/skin1.jpeg" },
  { id: 14, image: "/image/SkinRank/skin2.jpeg" },
  { id: 15, image: "/image/SkinRank/skin3.jpeg" },
  { id: 16, image: "/image/SkinRank/skin4.jpeg" },
  { id: 17, image: "/image/SkinRank/skin1.jpeg" },
  { id: 18, image: "/image/SkinRank/skin2.jpeg" },
  { id: 19, image: "/image/SkinRank/skin3.jpeg" },
  { id: 20, image: "/image/SkinRank/skin4.jpeg" },
  { id: 21, image: "/image/SkinRank/skin1.jpeg" },
  { id: 22, image: "/image/SkinRank/skin2.jpeg" },
  { id: 23, image: "/image/SkinRank/skin3.jpeg" },
  { id: 24, image: "/image/SkinRank/skin4.jpeg" },
  { id: 25, image: "/image/SkinRank/skin1.jpeg" },
  { id: 26, image: "/image/SkinRank/skin2.jpeg" },
  { id: 27, image: "/image/SkinRank/skin3.jpeg" },
  { id: 28, image: "/image/SkinRank/skin4.jpeg" },
  { id: 29, image: "/image/SkinRank/skin1.jpeg" },
  { id: 30, image: "/image/SkinRank/skin2.jpeg" },
  { id: 31, image: "/image/SkinRank/skin3.jpeg" },
  { id: 32, image: "/image/SkinRank/skin4.jpeg" }
];

const shuffle = (array: SkinItem[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const SkinRank: React.FC = () => {
  const [roundSize, setRoundSize] = useState<number | null>(null);
  const [currentList, setCurrentList] = useState<SkinItem[]>([]);
  const [nextRound, setNextRound] = useState<SkinItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ranking, setRanking] = useState<SkinItem[]>([]);
  const [showRanking, setShowRanking] = useState(false);

  // 시작
  const startGame = (size: number) => {
    const shuffled = shuffle(initialData);
    const selected = shuffled.slice(0, size);

    setCurrentList(selected);
    setRoundSize(size);
    setNextRound([]);
    setCurrentIndex(0);
    setRanking([]);
    setShowRanking(false);
  };

  const handleSelect = (winner: SkinItem, loser: SkinItem) => {
    const updatedNext = [...nextRound, winner];

    // 탈락자 기록
    setRanking((prev) => [loser, ...prev]);

    if (currentIndex + 2 < currentList.length) {
      setNextRound(updatedNext);
      setCurrentIndex(currentIndex + 2);
    } else {
      setCurrentList(updatedNext);
      setNextRound([]);
      setCurrentIndex(0);
    }
  };

  // 👉 시작 화면
  if (!roundSize) {
    return (
      <div className="worldcup-container">
        <h2>피부 월드컵</h2>
        <p>라운드를 선택하세요</p>

        <div className="round-select">
          <button onClick={() => startGame(32)}>32강</button>
          <button onClick={() => startGame(16)}>16강</button>
          <button onClick={() => startGame(8)}>8강</button>
        </div>
      </div>
    );
  }

  // 👉 랭킹 화면
  if (showRanking) {
    const finalRanking = [currentList[0], ...ranking];

    return (
      <div className="worldcup-container">
        <h2>최종 랭킹</h2>

        <div className="ranking-list">
          {finalRanking.map((item, index) => (
            <div key={item.id} className="ranking-item">
              <span className="rank">{index + 1}위</span>
              <img src={item.image} alt="rank" />
            </div>
          ))}
        </div>

        <button className="restart-btn" onClick={() => setRoundSize(null)}>
          처음으로
        </button>
      </div>
    );
  }

  // 👉 우승 화면
  if (currentList.length === 1) {
    return (
      <div className="worldcup-container">
        <h2>최종 우승</h2>

<div className="winner-box">
  <img src={currentList[0].image} className="winner-img" />

  <div className="winner-actions">
    <button className="rank-btn" onClick={() => setShowRanking(true)}>
      랭킹 보기
    </button>

    <button className="restart-btn" onClick={() => setRoundSize(null)}>
      다시 하기
    </button>
  </div>
</div>
      </div>
    );
  }

  const left = currentList[currentIndex];
  const right = currentList[currentIndex + 1];
  const currentRound = currentList.length;

  return (
    <div className="worldcup-container">
      <h2>{currentRound}강</h2>
      <p>
        {currentIndex / 2 + 1} / {currentRound / 2} 경기
      </p>

      <div className="battle">
        <div className="card" onClick={() => handleSelect(left, right)}>
          <img src={left.image} alt="left" />
        </div>

        <div className="vs">VS</div>

        <div className="card" onClick={() => handleSelect(right, left)}>
          <img src={right.image} alt="right" />
        </div>
      </div>
    </div>
  );
};

export default SkinRank;