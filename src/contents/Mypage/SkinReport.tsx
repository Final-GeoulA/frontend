import React, { useEffect, useState, useRef } from 'react';
import {
    BarElement, CategoryScale, Chart as ChartJS, ArcElement, Tooltip, Legend, Title, ChartOptions,
    LineElement, LinearScale, PointElement, registerables,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style/skinreport.css'; // ★ CSS 파일 임포트 추가!
import { ko } from "date-fns/locale";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartData {
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string | string[]; borderWidth: number; tension: number;}[];
}

const formatDate = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
};

// 강제 onClick 주입을 제거하고 react-datepicker가 주는 기본 onClick만 받도록 수정
const CalendarIconInput = React.forwardRef<HTMLDivElement, any>(
    ({ onClick }, ref) => (
        <div
            onClick={onClick}
            ref={ref}
            style={{
                width: '28px', height: '28px', border: '1px dashed #57c7b6',
                borderRadius: '4px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', fontSize: '12px',
                color: '#57c7b6', backgroundColor: '#fff'
            }}
        >
            img
        </div>
    )
);
CalendarIconInput.displayName = 'CalendarIconInput';

const SkinReport: React.FC = () => {
    // 확정된 실제 선택 날짜
    const [startDate, setStartDate] = useState<Date | null>(new Date('2026-02-13'));
    const [endDate, setEndDate] = useState<Date | null>(new Date('2026-02-18'));
    const before = 'img/before.png'
    const after = 'img/after.png'

    // 달력 팝업 안에서 움직일 임시 날짜
    const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
    const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

    // ★ 팝업 닫기를 외부에서 제어하기 위한 ref 생성
    const startDatePickerRef = useRef<DatePicker>(null);
    const endDatePickerRef = useRef<DatePicker>(null);

    const [lineData, setLineData] = useState<ChartData | null>(null);
    const labels = ['2026.01.13.', '2026.01.16.', '2026.01.20.', '2026.01.29.', '2026.02.10', '2026.02.14'];
    const data = [0, 1.7, 8, 2, 6.2, 4.3];

    const optionsLine: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        layout: {
            padding: { top: 40, right: 20, left: 10, bottom: 10 } // 드롭다운과 겹치지 않게 위쪽 여백 확보
        },
        plugins: {
            legend: { display: false },
            title: { display: false }, // 제목은 박스 바깥에 있으므로 숨김
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            x: {
                grid: { display: false }, // 세로 격자선 숨김
                border: { display: true, color: '#b3b3cc' }, // X축 하단 선 색상
                ticks: { color: '#888', font: { size: 12 } }
            },
            y: {
                grid: { display: false }, // 가로 격자선 숨김
                border: { display: true, color: '#b3b3cc' }, // Y축 좌측 선 색상
                ticks: { color: '#888', stepSize: 2, font: { size: 12 } },
                min: 0,
                max: 8
            }
        },
        elements: {
            point: {
                radius: 0, // 평소에는 꺾이는 점 숨김 (레퍼런스 동일)
                hoverRadius: 6, // 마우스 올렸을 때만 표시
            }
        }
    };

    useEffect(() => {
        setLineData({
            labels: labels,
            datasets: [{
                label: '건수',
                data: data,
                borderColor: '#12c2e9', // 레퍼런스와 비슷한 쨍한 하늘색
                borderWidth: 3, // 선 굵게
                tension: 0, // 곡선 없이 직선으로 이어지게
            }]
        })
    }, []);

    // 공통 커스텀 헤더 렌더링
    const renderCustomHeader = (
        { date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }: any,
        onCancel: () => void,
        onSet: () => void
    ) => (
        <div style={{ padding: '15px 15px 5px 15px', backgroundColor: 'white', borderRadius: '12px 12px 0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span onClick={onCancel} style={{ color: '#4da6ff', cursor: 'pointer', fontSize: '15px' }}>취소</span>
                <span onClick={onSet} style={{ color: '#007aff', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}>날짜 확정</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#007aff', fontSize: '16px', fontWeight: '500' }}>
                    {`${date.getFullYear()}년 ${date.toLocaleString('ko-KR', { month: 'long' })}`}
                </span>
                <div>
                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} style={{ border: 'none', background: 'none', color: '#007aff', fontSize: '18px', cursor: 'pointer', padding: '0 8px' }}>{'<'}</button>
                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} style={{ border: 'none', background: 'none', color: '#007aff', fontSize: '18px', cursor: 'pointer', padding: '0 8px' }}>{'>'}</button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <h2 style={{ fontWeight: 'bold', color: '#1a1a3a', marginBottom: '20px' }}>피부 변화 리포트</h2>
            <div style={{
                position: 'relative', // 드롭다운을 이 박스 기준으로 띄우기 위함
                width: '65%', // 화면을 넓게 쓰도록 수정 (원하시면 줄여도 됩니다)
                height: '400px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 8px 30px rgba(20, 20, 50, 0.08)', // 부드럽고 넓은 그림자
                marginBottom: '40px'
            }}>
                
                {/* 우측 상단 드롭다운 (Absolute Positioning) */}
                <div style={{ position: 'absolute', top: '25px', right: '30px', zIndex: 10 }}>
                    <div className="btn-group">
                        <button type="button" className="btn dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false"
                            style={{ 
                                backgroundColor: '#f4f4f5', 
                                border: 'none',
                                color: '#333',
                                padding: '8px 20px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>
                            전체
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" style={{ border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                            <li><a className="dropdown-item" href="#">전체</a></li>
                            <li><a className="dropdown-item" href="#" style={{ color: '#aaa' }}>여드름</a></li>
                            <li><a className="dropdown-item" href="#" style={{ color: '#aaa' }}>염증성</a></li>
                            <li><a className="dropdown-item" href="#" style={{ color: '#aaa' }}>건선</a></li>
                            <li><a className="dropdown-item" href="#" style={{ color: '#aaa' }}>아토피</a></li>
                        </ul>
                    </div>
                </div>

                {/* 차트 컴포넌트 */}
                <Line data={lineData || { datasets: [] }} options={optionsLine} />
            </div>
                            
            <h2 style={{ fontWeight: 'bold', color: '#1a1a3a', marginBottom: '20px' }}>피부 상태 변화</h2>
            <div style={{ width: '65%' }}>
                <div style={{ display: 'flex', border: '1px solid #ced4da', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px', height: '50px' }}>
                    
                    {/* Start Date 영역 */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 15px' }}>
                        <span style={{ color: startDate ? '#333' : '#adb5bd', fontSize: '15px' }}>
                            {startDate ? formatDate(startDate) : 'Start date'}
                        </span>
                        <div style={{ width: '28px', height: '28px' }}>
                            <DatePicker
                                ref={startDatePickerRef}
                                selected={tempStartDate}
                                onChange={(date: Date | null) => setTempStartDate(date)}
                                onCalendarOpen={() => setTempStartDate(startDate)} // 달력이 열릴 때 확정 날짜로 셋팅
                                shouldCloseOnSelect={false} // 날짜 클릭해도 안 닫힘
                                calendarClassName="custom-datepicker"
                                formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                                renderCustomHeader={(props) => renderCustomHeader(props, 
                                    () => startDatePickerRef.current?.setOpen(false), // Cancel 시 닫기만 함
                                    () => { setStartDate(tempStartDate); startDatePickerRef.current?.setOpen(false); } // Set 시 확정 후 닫기
                                )}
                                locale={ko}
                                dateFormat="yyyy년 MM월 dd일"
                                customInput={<CalendarIconInput />}
                                popperPlacement="bottom-end"
                            />
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#f0f4f5', display: 'flex', alignItems: 'center', padding: '0 20px', color: '#6c757d' }}>➔</div>

                    {/* End Date 영역 */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 15px' }}>
                        <span style={{ color: endDate ? '#333' : '#adb5bd', fontSize: '15px' }}>
                            {endDate ? formatDate(endDate) : 'End date'}
                        </span>
                        <div style={{ width: '28px', height: '28px' }}>
                            <DatePicker
                                ref={endDatePickerRef}
                                selected={tempEndDate}
                                onChange={(date: Date | null) => setTempEndDate(date)}
                                onCalendarOpen={() => setTempEndDate(endDate)}
                                shouldCloseOnSelect={false}
                                minDate={startDate || undefined}
                                calendarClassName="custom-datepicker"
                                formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                                renderCustomHeader={(props) => renderCustomHeader(props, 
                                    () => endDatePickerRef.current?.setOpen(false),
                                    () => { setEndDate(tempEndDate); endDatePickerRef.current?.setOpen(false); }
                                )}
                                locale={ko}
                                dateFormat="yyyy년 MM월 dd일"
                                customInput={<CalendarIconInput />}
                                popperPlacement="bottom-end"
                            />
                        </div>
                    </div>

                </div>

                {/* 이미지 비교 영역 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '20px', fontWeight: 'bold' }}>{formatDate(startDate)}</h3>
                        <div style={{ backgroundColor: '#f4f4f4', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                            <span style={{ color: '#aaa' }}>
                                <img src={before} width='100%' height='300px' alt={`${formatDate(endDate)} 사진`} style={{ objectFit: 'cover' }} />
                            </span>
                        </div>
                    </div>
                    <div style={{ fontSize: '40px', color: '#57c7b6', margin: '0 20px', fontWeight: 'bold' }}>〉</div>
                    <div style={{ flex: 1, border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '20px', fontWeight: 'bold' }}>{formatDate(endDate)}</h3>
                        <div style={{ backgroundColor: '#f4f4f4', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                            <span style={{ color: '#aaa' }}>
                                <img src={after} width='100%' height='300px' alt={`${formatDate(endDate)} 사진`} style={{ objectFit: 'cover' }} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkinReport;