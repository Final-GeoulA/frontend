import React, { useMemo, useState } from 'react';
import './style/MedicalRecord.css';
import MedicalRecordModal from './MedicalRecordModal';

type RecordItem = {
  date: string;
  hospital: string;
  amount: number;
};

type CalendarCell = {
  day: number;
  fullDate: string;
  records: RecordItem[];
};

const MedicalRecord: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCell, setSelectedCell] = useState<CalendarCell | null>(null);

  const records: RecordItem[] = [
    { date: '2026-03-08', hospital: '미사랑병원', amount: 12000 },
    { date: '2026-03-08', hospital: '연세의원', amount: 18000 },
    { date: '2026-03-09', hospital: '한빛피부과', amount: 25000 },
    { date: '2026-03-09', hospital: '새봄약국', amount: 8000 },
    { date: '2026-03-12', hospital: '고운의원', amount: 15000 },
    { date: '2026-03-15', hospital: '튼튼병원', amount: 32000 },
    { date: '2026-03-21', hospital: '미소약국', amount: 6500 },
    { date: '2026-03-27', hospital: '새봄병원', amount: 21000 },
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthLabel = `${year}.${String(month + 1).padStart(2, '0')}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

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

  return (
    <div className="medical-record-page">
      <div className="medical-record-card">
        <div className="medical-record-header">
          <div>
            <p className="medical-record-subtitle">진료 기록과 비용을 달력으로 확인해보세요</p>
            <h2 className="medical-record-title">진료 기록 캘린더</h2>
          </div>

          <div className="medical-record-nav">
            <button className="month-btn" onClick={prevMonth}>
              &#10094;
            </button>
            <span className="month-label">{monthLabel}</span>
            <button className="month-btn" onClick={nextMonth}>
              &#10095;
            </button>
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
              className={`calendar-cell ${cell ? '' : 'empty-cell'} ${cell && cell.records.length > 0 ? 'clickable' : ''}`}
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
                        <span className="record-amount">{record.amount.toLocaleString()}원</span>
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
    </div>
  );
};

export default MedicalRecord;