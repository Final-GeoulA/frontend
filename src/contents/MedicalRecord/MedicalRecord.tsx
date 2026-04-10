import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style/MedicalRecord.css';
import MedicalRecordModal from './MedicalRecordModal';
import { useAuth } from '../../components/AuthProvider';

type RecordItem = {
  medicalRecordId?: number;
  date: string;
  hospital: string;
  amount: number;
  memo?: string;
};

type CalendarCell = {
  day: number;
  fullDate: string;
  records: RecordItem[];
};

const MedicalRecord: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, member } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCell, setSelectedCell] = useState<CalendarCell | null>(null);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleAddRecord = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    navigate('/MedicalRecordUpload');
  };

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACK_END_URL}/api/medical-record/list`,
          {
            withCredentials: true,
          }
        );

        if (res.data?.success === false) {
          console.error(res.data.message);
          setRecords([]);
          return;
        }

        const mappedRecords: RecordItem[] = res.data.map((item: any) => ({
          medicalRecordId: item.medicalRecordId,
          date: item.paymentDate,
          hospital: item.hospitalName,
          amount: item.price,
          memo: item.memo,
        }));

        setRecords(mappedRecords);
      } catch (error) {
        console.error('진료 기록 조회 실패:', error);
      }
    };

    fetchMedicalRecords();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthLabel = `${year}.${String(month + 1).padStart(2, '0')}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthlyTotal = useMemo(() => {
    return records
      .filter((item) => {
        const recordDate = new Date(item.date);
        return (
          recordDate.getFullYear() === year &&
          recordDate.getMonth() === month
        );
      })
      .reduce((sum, item) => sum + item.amount, 0);
  }, [records, year, month]);

  const groupedRecords = useMemo(() => {
    const map: Record<string, RecordItem[]> = {};
    records.forEach((item) => {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    });
    return map;
  }, [records]);

  const calendarCells = useMemo(() => {
    const cells: (CalendarCell | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= lastDate; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        day,
        fullDate: dateStr,
        records: groupedRecords[dateStr] || [],
      });
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [firstDay, lastDate, year, month, groupedRecords]);

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  if (isLoggedIn && member?.user_grade_id !== 2) {
    return (
      <div className="medical-record-page">
        <div className="medical-record-card">
          <div className="premium-only-box">
            <p className="premium-only-title">프리미엄 회원 전용 기능</p>
            <p className="premium-only-desc">
              진료 기록 캘린더는 프리미엄 회원만 이용할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-record-page">
      <div className="medical-record-card">
        <div className="medical-record-header">
          <div>
            <p className="medical-record-subtitle">진료 기록과 비용을 달력으로 확인해보세요</p>
            <h2 className="medical-record-title">진료 기록 캘린더</h2>
          </div>

          <div className="medical-record-nav-wrap">
            <div className="medical-record-nav">
              <button className="month-btn" onClick={prevMonth}>
                &#10094;
              </button>
              <span className="month-label">{monthLabel}</span>
              <button className="month-btn" onClick={nextMonth}>
                &#10095;
              </button>
            </div>

            <button
              className="medical-record-add-btn"
              onClick={handleAddRecord}
            >
              + 기록 추가
            </button>
          </div>
        </div>

        <div className="medical-record-summary">
          <div className="medical-record-summary-card">
            <span className="summary-label">이번 달 진료비 합계</span>
            <strong className="summary-value">{monthlyTotal.toLocaleString()}원</strong>
          </div>
        </div>

        <div className="calendar-weekdays">
          {weekDays.map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarCells.map((cell, idx) => (
            <div
              key={idx}
              className={`calendar-cell ${cell ? '' : 'empty-cell'} ${
                cell && cell.records.length > 0 ? 'clickable' : ''
              }`}
              onClick={() => {
                if (cell && cell.records.length > 0) setSelectedCell(cell);
              }}
            >
              {cell && (
                <>
                  <div className="date-number">{cell.day}</div>

                  <div className="record-list">
                    {cell.records.slice(0, 2).map((record, index) => (
                      <div key={index} className="record-item">
                        <span className="record-hospital">{record.hospital}</span>
                        <span className="record-amount">
                          {record.amount.toLocaleString()}원
                        </span>
                      </div>
                    ))}

                    {cell.records.length > 2 && (
                      <div className="more-records">+ {cell.records.length - 2}건 더보기</div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <MedicalRecordModal
        isOpen={!!selectedCell}
        onClose={() => setSelectedCell(null)}
        selectedDate={selectedCell?.fullDate || ''}
        records={selectedCell?.records || []}
      />

      {showLoginPopup && (
        <div className="login-popup-overlay">
          <div className="login-popup">
            <p className="login-popup-text">로그인 후 이용 가능한 기능입니다.</p>
            <div className="login-popup-buttons">
              <button
                className="login-popup-confirm"
                onClick={() => navigate('/login')}
              >
                로그인하러 가기
              </button>
                            <button
                className="login-popup-cancel"
                onClick={() => setShowLoginPopup(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecord;