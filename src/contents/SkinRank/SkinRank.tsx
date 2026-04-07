import React, { useState, useEffect } from "react";
import "./style/SkinRank.css";

interface SkinItem {
  id: number;
  image: string;
  name: string;
  win: number;
  lose: number;
}

const shuffle = (array: SkinItem[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const SkinRank: React.FC = () => {
  const [initialData, setInitialData] = useState<SkinItem[]>([]);
  const [rankMap, setRankMap] = useState<any>({});
  const [roundSize, setRoundSize] = useState<number | null>(null);
  const [currentList, setCurrentList] = useState<SkinItem[]>([]);
  const [nextRound, setNextRound] = useState<SkinItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ranking, setRanking] = useState<SkinItem[]>([]);
  const [showRanking, setShowRanking] = useState(false);

  // 랭킹 가져오기
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACK_END_URL}/api/vote/rank`)
      .then((res) => res.json())
      .then((data) => {
        console.log("rank data:", data);

        const map: any = {};
        data.forEach((item: any) => {
          map[item.userId] = item;
        });

        setRankMap(map);
      })
      .catch((err) => console.error("rank fetch 에러:", err));
  }, []);

  //이미지 + 랭킹 결합 
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACK_END_URL}/api/skinImg/list`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("skinImg data:", data);

        if (data.success && data.list) {
          const mapped = data.list.map((item: any) => {
            const rank = rankMap[item.userSkinImgId];

            return {
              id: item.userSkinImgId,
              // 이미지 경로 안전 처리
              image: item.img.startsWith("http")
                ? item.img
                : `${process.env.REACT_APP_BACK_END_URL}${item.img}`,
              name: item.nickname,
              win: rank ? rank.winCount : 0,
              lose: rank ? rank.loseCount : 0,
            };
          });

          setInitialData(mapped);
        }
      })
      .catch((err) => console.error("fetch 에러:", err));
  }, [rankMap]);

  const getWinRate = (item: SkinItem) => {
    const total = item.win + item.lose;
    if (total === 0) return 0;
    return Number(((item.win / total) * 100).toFixed(2));
  };

  const startGame = (size: number) => {
    const shuffled = shuffle(initialData);
    const selected = shuffled.slice(0, Math.min(size, shuffled.length));

    setCurrentList(selected);
    setRoundSize(selected.length);
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
    // 서버 저장
    fetch(`${process.env.REACT_APP_BACK_END_URL}/api/vote/do`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `winnerId=${winner.id}&loserId=${loser.id}`,
    });

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

  // 시작 화면
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

          {initialData.length === 0 && <p>이미지 불러오는 중...</p>}

          <div className="hero-card">
            <div className="hero-text-box">
              <div className="hero-mini-tag">Real User Skin Vote</div>
              <p className="rank-info">한 번의 선택으로 만드는 피부 랭킹</p>
              <p>
                두 피부 중 더 좋아 보이는 쪽을 선택해 주세요. <br />
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

  // 랭킹 화면
  if (showRanking) {
    const finalRanking = [...initialData].sort((a, b) => {
      return getWinRate(b) - getWinRate(a);
    });

    return (
      <div className="worldcup-page">
        <div className="worldcup-container">
          <div className="hero-badge">Final Ranking</div>
          <h2>최종 랭킹</h2>

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

  // 우승 화면
  if (currentList.length === 1) {
    return (
      <div className="worldcup-page">
        <div className="worldcup-container">
          <div className="hero-badge">Winner</div>
          <h2>최종 우승</h2>

          <div className="winner-box">
            <img
              src={currentList[0].image}
              alt={currentList[0].name}
              className="winner-img"
            />

            <div className="winner-name">{currentList[0].name}</div>

            <div className="winner-actions">
              <button onClick={() => setShowRanking(true)}>
                랭킹 보기
              </button>
              <button onClick={resetGame}>다시 하기</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 진행 화면
  const left = currentList[currentIndex];
  const right = currentList[currentIndex + 1];

  return (
    <div className="worldcup-page">
      <div className="worldcup-container">
        <div className="hero-badge">Round of {currentList.length}</div>
        <h2>{currentList.length}강</h2>

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