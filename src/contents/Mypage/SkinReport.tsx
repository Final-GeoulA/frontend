import React, { useState, useRef } from "react";
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
};

const skinReports: DailySkinReport[] = [
  {
    date: "2026.03.10",
    items: [
      { label: "여드름", value: 40 },
      { label: "염증성", value: 30 },
      { label: "아토피", value: 20 },
      { label: "건선", value: 10 },
    ],
  },
  {
    date: "2026.03.17",
    items: [
      { label: "여드름", value: 35 },
      { label: "염증성", value: 28 },
      { label: "아토피", value: 22 },
      { label: "건선", value: 15 },
    ],
  },
  {
    date: "2026.03.24",
    items: [
      { label: "여드름", value: 30 },
      { label: "염증성", value: 25 },
      { label: "아토피", value: 25 },
      { label: "건선", value: 20 },
    ],
  },
];

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentReport = skinReports[currentIndex];

  const [startDate, setStartDate] = useState<Date | null>(new Date("2026-02-13"));
  const [endDate, setEndDate] = useState<Date | null>(new Date("2026-02-18"));
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  const startDatePickerRef = useRef<DatePicker>(null);
  const endDatePickerRef = useRef<DatePicker>(null);

  const before = "/image/Mypage/before.png";
  const after = "/image/Mypage/after.png";

  const chartData = {
    labels: currentReport.items.map((item) => item.label),
    datasets: [
      {
        label: "피부 비율",
        data: currentReport.items.map((item) => item.value),
        backgroundColor: ["#50CDBA", "#7EDCD0", "#A8E8E0", "#D4F5F1"],
        borderRadius: 8,
        barThickness: 20,
        categoryPercentage: 0.72,
        barPercentage: 0.9,
      },
    ],
  };

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
          font: { size: 12 },
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
        <span onClick={onCancel} className="datepicker-cancel">
          취소
        </span>
        <span onClick={onSet} className="datepicker-confirm">
          날짜 확정
        </span>
      </div>

      <div className="datepicker-header-bottom">
        <span className="datepicker-current-month">
          {`${date.getFullYear()}년 ${date.toLocaleString("ko-KR", {
            month: "long",
          })}`}
        </span>
        <div>
          <button
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="datepicker-month-btn"
          >
            {"<"}
          </button>
          <button
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="datepicker-month-btn"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );

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
                현재 분석 결과, <span className="skin-report-summary-highlight">여드름</span> 가능성이 가장 높게 나타났어요.
            </div>
            </div>

          <div className="skin-report-chart-wrap">
            <Bar data={chartData} options={chartOptions} />
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
                minDate={startDate || undefined}
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
                src={before}
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
                src={after}
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