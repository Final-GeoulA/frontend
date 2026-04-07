import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style/skinreport.css";
import { ko } from "date-fns/locale";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type SkinItem = {
  label: string;
  value: number;
};

type DailySkinReport = {
  date: string;
  items: SkinItem[];
  img: string;
};

const formatDate = (date: Date | null) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const CalendarIconInput = React.forwardRef<HTMLDivElement, any>(
  ({ onClick }, ref) => (
    <div onClick={onClick} ref={ref} className="calendar-icon-input">
      date
    </div>
  )
);
CalendarIconInput.displayName = "CalendarIconInput";

const SkinReport: React.FC = () => {
  const [skinReports, setSkinReports] = useState<DailySkinReport[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  const startDatePickerRef = useRef<DatePicker>(null);
  const endDatePickerRef = useRef<DatePicker>(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_END_URL}/api/skinAnalysis/report`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.list)) {
          const mapped: DailySkinReport[] = res.data.list.map((item: any) => ({
            date: item.bdate ?? item.created ?? "",
            img: item.img ?? "",
            items: [
              { label: "아토피",  value: Math.round((item.diseaseAtopy  ?? 0) / 10) },
              { label: "염증성",  value: Math.round((item.diseaseInflam ?? 0) / 10) },
              { label: "건선",    value: Math.round((item.diseaseDry    ?? 0) / 10) },
              { label: "여드름",  value: Math.round((item.diseasePimple ?? 0) / 10) },
            ].sort((a, b) => b.value - a.value),
          }));
          setSkinReports(mapped);
          setCurrentIndex(mapped.length > 0 ? mapped.length - 1 : 0);

          // 피부 상태 변화 기본 날짜: 가장 오래된 vs 가장 최근
          if (mapped.length >= 2) {
            setStartDate(new Date(mapped[0].date.replace(/\./g, "-")));
            setEndDate(new Date(mapped[mapped.length - 1].date.replace(/\./g, "-")));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const currentReport = skinReports[currentIndex];

  const availableDates = skinReports.map(
    (r) => new Date(r.date.replace(/\./g, "-"))
  );

  // 날짜로 가장 가까운 report 찾기
  const findImgByDate = (date: Date | null) => {
    if (!date || skinReports.length === 0) return "";
    const target = formatDate(date);
    const found = skinReports.find((r) => r.date === target);
    if (found) return found.img;
    // 날짜가 정확히 없으면 가장 가까운 것 반환
    return skinReports.reduce((prev, curr) => {
      const prevDiff = Math.abs(new Date(prev.date.replace(/\./g, "-")).getTime() - date.getTime());
      const currDiff = Math.abs(new Date(curr.date.replace(/\./g, "-")).getTime() - date.getTime());
      return currDiff < prevDiff ? curr : prev;
    }).img;
  };

  const chartData = currentReport
    ? {
        labels: currentReport.items.map((item) => item.label),
        datasets: [
          {
            label: "피부 비율",
            data: currentReport.items.map((item) => item.value),
            backgroundColor: ["#50CDBA", "#7EDCD0", "#A8E8E0", "#D4F5F1"],
            borderRadius: 6,
            barThickness: 14,
            categoryPercentage: 0.8,
            barPercentage: 0.9,
          },
        ],
      }
    : { labels: [], datasets: [] };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`,
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        grid: { color: "#eef2f4" },
        ticks: {
          callback: (value) => `${value}%`,
          color: "#888",
          font: { size: 11 },
        },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "#333",
          font: { size: 14 },
        },
        border: { display: false },
      },
    },
  };

  const renderCustomHeader = (
    {
      date,
      decreaseMonth,
      increaseMonth,
      prevMonthButtonDisabled,
      nextMonthButtonDisabled,
    }: any,
    onCancel: () => void,
    onSet: () => void
  ) => (
    <div className="datepicker-header">
      <div className="datepicker-header-top">
        <span onClick={onCancel} className="datepicker-cancel">취소</span>
        <span onClick={onSet} className="datepicker-confirm">날짜 확정</span>
      </div>
      <div className="datepicker-header-bottom">
        <span className="datepicker-current-month">
          {`${date.getFullYear()}년 ${date.toLocaleString("ko-KR", { month: "long" })}`}
        </span>
        <div>
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="datepicker-month-btn">{"<"}</button>
          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="datepicker-month-btn">{">"}</button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="skin-report-page">로딩 중...</div>;

  if (skinReports.length === 0) {
    return (
      <div className="skin-report-page">
        <h4 className="skin-report-page-title">피부 변화 리포트</h4>
        <p style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
          아직 피부 분석 기록이 없어요.
        </p>
      </div>
    );
  }

  return (
    <div className="skin-report-page">
      <h4 className="skin-report-page-title">피부 변화 리포트</h4>

      <div className="skin-report">
        <div className="skin-report-card">
          <div className="skin-report-header">
            <div className="skin-report-date-nav">
              <button
                className="date-nav-btn"
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                disabled={currentIndex === 0}
              >
                {"<"}
              </button>
              <span className="skin-report-date">{currentReport.date}</span>
              <button
                className="date-nav-btn"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                disabled={currentIndex === skinReports.length - 1}
              >
                {">"}
              </button>
            </div>

            <div className="skin-report-summary">
              현재 분석 결과,{" "}
              <span className="skin-report-summary-highlight">
                {currentReport.items[0]?.label}
              </span>{" "}
              가능성이 가장 높게 나타났어요.
            </div>
          </div>

          <div className="skin-report-body">
            {currentReport.img && (
              <div className="skin-report-image-wrap">
                <img
                  src={currentReport.img}
                  alt={`${currentReport.date} 피부 사진`}
                  className="skin-report-image"
                />
              </div>
            )}
            <div className="skin-report-chart-wrap">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="skin-report-legend">
            {currentReport.items.map((item) => (
              <div key={item.label} className="legend-row">
                <span className="legend-label">{item.label}</span>
                <span className="legend-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h4 className="skin-report-page-title">피부 상태 변화</h4>

      <div className="skin-state-section">
        <div className="date-range-bar">
          <div className="date-range-box">
            <span className={`date-range-text ${startDate ? "has-value" : ""}`}>
              {startDate ? formatDate(startDate) : "Start date"}
            </span>
            <div className="date-picker-icon-wrap">
              <DatePicker
                ref={startDatePickerRef}
                selected={tempStartDate}
                onChange={(date: Date | null) => setTempStartDate(date)}
                onCalendarOpen={() => setTempStartDate(startDate)}
                shouldCloseOnSelect={false}
                includeDates={availableDates}
                calendarClassName="custom-datepicker"
                formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                renderCustomHeader={(props) =>
                  renderCustomHeader(
                    props,
                    () => startDatePickerRef.current?.setOpen(false),
                    () => {
                      setStartDate(tempStartDate);
                      startDatePickerRef.current?.setOpen(false);
                    }
                  )
                }
                locale={ko}
                dateFormat="yyyy년 MM월 dd일"
                customInput={<CalendarIconInput />}
                popperPlacement="bottom-end"
              />
            </div>
          </div>

          <div className="date-range-arrow">➔</div>

          <div className="date-range-box">
            <span className={`date-range-text ${endDate ? "has-value" : ""}`}>
              {endDate ? formatDate(endDate) : "End date"}
            </span>
            <div className="date-picker-icon-wrap">
              <DatePicker
                ref={endDatePickerRef}
                selected={tempEndDate}
                onChange={(date: Date | null) => setTempEndDate(date)}
                onCalendarOpen={() => setTempEndDate(endDate)}
                shouldCloseOnSelect={false}
                includeDates={availableDates}
                calendarClassName="custom-datepicker"
                formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                renderCustomHeader={(props) =>
                  renderCustomHeader(
                    props,
                    () => endDatePickerRef.current?.setOpen(false),
                    () => {
                      setEndDate(tempEndDate);
                      endDatePickerRef.current?.setOpen(false);
                    }
                  )
                }
                locale={ko}
                dateFormat="yyyy년 MM월 dd일"
                customInput={<CalendarIconInput />}
                popperPlacement="bottom-end"
              />
            </div>
          </div>
        </div>

        <div className="skin-compare-wrap">
          <div className="skin-compare-card">
            <h3 className="skin-compare-date">{formatDate(startDate)}</h3>
            <div className="skin-compare-image-box">
              <img
                src={findImgByDate(startDate) || "/image/Mypage/before.png"}
                alt={`${formatDate(startDate)} 사진`}
                className="skin-compare-image"
              />
            </div>
          </div>

          <div className="skin-compare-arrow">〉</div>

          <div className="skin-compare-card">
            <h3 className="skin-compare-date">{formatDate(endDate)}</h3>
            <div className="skin-compare-image-box">
              <img
                src={findImgByDate(endDate) || "/image/Mypage/after.png"}
                alt={`${formatDate(endDate)} 사진`}
                className="skin-compare-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinReport;
