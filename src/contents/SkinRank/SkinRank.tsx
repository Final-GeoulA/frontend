import React, { useState } from "react";
import "./style/SkinRank.css";

interface SkinItem {
  id: number;
  image: string;
  name: string;
  win: number;
  lose: number;
}

const initialData: SkinItem[] = [
  { id: 1, image: "/image/SkinRank/skin1.jpeg", name: "피부1", win: 0, lose: 0 },
  { id: 2, image: "/image/SkinRank/skin2.jpeg", name: "피부2", win: 0, lose: 0 },
  { id: 3, image: "/image/SkinRank/skin3.jpeg", name: "피부3", win: 0, lose: 0 },
  { id: 4, image: "/image/SkinRank/skin4.jpeg", name: "피부4", win: 0, lose: 0 },
  { id: 5, image: "/image/SkinRank/skin1.jpeg", name: "피부5", win: 0, lose: 0 },
  { id: 6, image: "/image/SkinRank/skin2.jpeg", name: "피부6", win: 0, lose: 0 },
  { id: 7, image: "/image/SkinRank/skin3.jpeg", name: "피부7", win: 0, lose: 0 },
  { id: 8, image: "/image/SkinRank/skin4.jpeg", name: "피부8", win: 0, lose: 0 },
  { id: 9, image: "/image/SkinRank/skin1.jpeg", name: "피부9", win: 0, lose: 0 },
  { id: 10, image: "/image/SkinRank/skin2.jpeg", name: "피부10", win: 0, lose: 0 },
  { id: 11, image: "/image/SkinRank/skin3.jpeg", name: "피부11", win: 0, lose: 0 },
  { id: 12, image: "/image/SkinRank/skin4.jpeg", name: "피부12", win: 0, lose: 0 },
  { id: 13, image: "/image/SkinRank/skin1.jpeg", name: "피부13", win: 0, lose: 0 },
  { id: 14, image: "/image/SkinRank/skin2.jpeg", name: "피부14", win: 0, lose: 0 },
  { id: 15, image: "/image/SkinRank/skin3.jpeg", name: "피부15", win: 0, lose: 0 },
  { id: 16, image: "/image/SkinRank/skin4.jpeg", name: "피부16", win: 0, lose: 0 },
  { id: 17, image: "/image/SkinRank/skin1.jpeg", name: "피부17", win: 0, lose: 0 },
  { id: 18, image: "/image/SkinRank/skin2.jpeg", name: "피부18", win: 0, lose: 0 },
  { id: 19, image: "/image/SkinRank/skin3.jpeg", name: "피부19", win: 0, lose: 0 },
  { id: 20, image: "/image/SkinRank/skin4.jpeg", name: "피부20", win: 0, lose: 0 },
  { id: 21, image: "/image/SkinRank/skin1.jpeg", name: "피부21", win: 0, lose: 0 },
  { id: 22, image: "/image/SkinRank/skin2.jpeg", name: "피부22", win: 0, lose: 0 },
  { id: 23, image: "/image/SkinRank/skin3.jpeg", name: "피부23", win: 0, lose: 0 },
  { id: 24, image: "/image/SkinRank/skin4.jpeg", name: "피부24", win: 0, lose: 0 },
  { id: 25, image: "/image/SkinRank/skin1.jpeg", name: "피부25", win: 0, lose: 0 },
  { id: 26, image: "/image/SkinRank/skin2.jpeg", name: "피부26", win: 0, lose: 0 },
  { id: 27, image: "/image/SkinRank/skin3.jpeg", name: "피부27", win: 0, lose: 0 },
  { id: 28, image: "/image/SkinRank/skin4.jpeg", name: "피부28", win: 0, lose: 0 },
  { id: 29, image: "/image/SkinRank/skin1.jpeg", name: "피부29", win: 0, lose: 0 },
  { id: 30, image: "/image/SkinRank/skin2.jpeg", name: "피부30", win: 0, lose: 0 },
  { id: 31, image: "/image/SkinRank/skin3.jpeg", name: "피부31", win: 0, lose: 0 },
  { id: 32, image: "/image/SkinRank/skin4.jpeg", name: "피부32", win: 0, lose: 0 },
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

  const getWinRate = (item: SkinItem) => {
    const total = item.win + item.lose;
    if (total === 0) return 0;
    return Number(((item.win / total) * 100).toFixed(2));
  };

  const startGame = (size: number) => {
    const shuffled = shuffle(
      initialData.map((item) => ({
        ...item,
        win: 0,
        lose: 0,
      }))
    );

    const selected = shuffled.slice(0, size);

    setCurrentList(selected);
    setRoundSize(size);
    setNextRound([]);
    setCurrentIndex(0);
    setRanking([]);
    setShowRanking(false);
  };

  const resetGame = () => {
    setRoundSize(null);
    setCurrentList([]);
    setNextRound([]);
    setCurrentIndex(0);
    setRanking([]);
    setShowRanking(false);
  };

  const handleSelect = (winner: SkinItem, loser: SkinItem) => {
    const winnerUpdated = { ...winner, win: winner.win + 1 };
    const loserUpdated = { ...loser, lose: loser.lose + 1 };

    const updatedNext = [...nextRound, winnerUpdated];
    setRanking((prev) => [loserUpdated, ...prev]);

    if (currentIndex + 2 < currentList.length) {
      setNextRound(updatedNext);
      setCurrentIndex(currentIndex + 2);
    } else {
      setCurrentList(updatedNext);
      setNextRound([]);
      setCurrentIndex(0);
    }
  };

  if (!roundSize) {
    return (
      <div className="worldcup-page">
        <div className="worldcup-container">
          <div className="hero-badge">Skin Tournament</div>

          <p className="skin-worldcup">피부 월드컵</p>

          <p className="hero-title-text">더 좋아 보이는 피부에 투표하세요</p>

          <p className="hero-subtext">
            유저들의 피부 사진을 비교하며 더 건강하고 좋아 보이는 피부를
            선택하는 토너먼트입니다.
          </p>

          <div className="hero-card">
            <div className="hero-text-box">
              <div className="hero-mini-tag">Real User Skin Vote</div>
              <p className="rank-info">한 번의 선택으로 만드는 피부 랭킹</p>
              <p>
                두 피부 중 더 좋아 보이는 쪽을 선택해 주세요.    <br/>
                선택 결과를 바탕으로 최종 피부 랭킹이 완성됩니다.
              </p>
            </div>

            <div className="worldcup-image">
              <img src="/image/SkinRank/vote.png" alt="피부 월드컵 이미지" />
            </div>
          </div>

          <div className="round-buttons">
            <button onClick={() => startGame(32)}>32강</button>
            <button onClick={() => startGame(16)}>16강</button>
            <button onClick={() => startGame(8)}>8강</button>
          </div>
        </div>
      </div>
    );
  }

  if (showRanking) {
    const finalRanking = [currentList[0], ...ranking];

    return (
      <div className="worldcup-page">
        <div className="worldcup-container">
          <div className="hero-badge">Final Ranking</div>
          <h2>최종 랭킹</h2>
          <p className="hero-subtext">
            유저 투표 결과를 바탕으로 선정된 피부 랭킹입니다.
          </p>

          <div className="ranking-list">
            {finalRanking.map((item, index) => (
              <div key={item.id} className="ranking-item">
                <div className="rank">{index + 1}</div>

                <img src={item.image} alt={item.name} className="rank-img" />

                <div className="info">
                  <span className="name">{item.name}</span>
                  <span className="percent">{getWinRate(item)}%</span>

                  <div className="bar">
                    <div
                      className="fill"
                      style={{ width: `${getWinRate(item)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={resetGame}>처음으로</button>
        </div>
      </div>
    );
  }

  if (currentList.length === 1) {
    return (
      <div className="worldcup-page">
        <div className="worldcup-container">
          <div className="hero-badge">Winner</div>
          <h2>최종 우승</h2>
          <p className="hero-subtext">
            가장 많은 선택을 받은 피부가 최종 우승으로 선정되었습니다.
          </p>

          <div className="winner-box">
            <img
              src={currentList[0].image}
              alt={currentList[0].name}
              className="winner-img"
            />

            <div className="winner-name">{currentList[0].name}</div>

            <div className="winner-actions">
              <button onClick={() => setShowRanking(true)}>랭킹 보기</button>
              <button onClick={resetGame}>다시 하기</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const left = currentList[currentIndex];
  const right = currentList[currentIndex + 1];

  return (
    <div className="worldcup-page">
      <div className="worldcup-container">
        <div className="hero-badge">Round of {currentList.length}</div>
        <h2>{currentList.length}강</h2>
        <p className="hero-subtext">
          더 좋아 보이는 피부를 선택해 다음 라운드로 진출시켜 주세요.
        </p>

        <div className="battle">
          <div className="card" onClick={() => handleSelect(left, right)}>
            <img src={left.image} alt={left.name} />
            <div className="card-name">{left.name}</div>
          </div>

          <div className="vs">VS</div>

          <div className="card" onClick={() => handleSelect(right, left)}>
            <img src={right.image} alt={right.name} />
            <div className="card-name">{right.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinRank;