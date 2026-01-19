/**
 * WeekCalendar.tsx
 * 주간 캘린더 컴포넌트
 * - 7일간 활동 상태 표시 (운동/식단/화상PT/메모)
 * - 날짜 클릭 시 상세 팝업 표시
 * - 전체보기 클릭 시 월간 캘린더로 이동
 * - 스와이프/드래그로 주 이동
 */

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { DailyStatus, DailyRecord } from '../../../types/calendar';
import { WEEK_DAYS } from '../../../constants/calendar';
import {
  getDateKey,
  isToday,
  getWeekStartDate,
  getWeekDates,
  getWeekOfMonth,
} from '../../../utils/calendar';
import { calendarDummyData } from '../../../data/calendars';
import CalendarPopup from './CalendarPopup';

/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface WeekCalendarProps {
  /** 월간 캘린더 이동 핸들러 */
  onNavigateToMonth?: () => void;
  /** 운동 상세 페이지 이동 핸들러 */
  onNavigateToWorkout?: () => void;
  /** 식단 상세 페이지 이동 핸들러 */
  onNavigateToDiet?: () => void;
  /** 화상PT 상세 페이지 이동 핸들러 */
  onNavigateToPT?: () => void;
}

/**
 * ===========================================
 * WeekCalendar 컴포넌트
 * ===========================================
 */

export default function WeekCalendar({
  onNavigateToMonth,
  onNavigateToWorkout,
  onNavigateToDiet,
  onNavigateToPT,
}: WeekCalendarProps) {
  /**
   * ===========================================
   * 상태 관리
   * ===========================================
   */

  /** 선택된 날짜 인덱스 (팝업용) */
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  /** 주 시작일 (일요일) */
  const [weekStartDate, setWeekStartDate] = useState<Date>(() => {
    return getWeekStartDate(new Date());
  });

  /** 터치 시작 X 좌표 (스와이프용) */
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  /** 마우스 시작 X 좌표 (드래그용) */
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);

  /** 캘린더 데이터 (메모 저장용 로컬 상태) */
  const [localCalendarData, setLocalCalendarData] = useState<Record<string, DailyRecord>>(calendarDummyData);

  /**
   * ===========================================
   * 파생 데이터
   * ===========================================
   */

  /** 현재 주의 7일 배열 */
  const weekDates = getWeekDates(weekStartDate);

  /** 주차 표시 텍스트 (예: "1월 2주차") */
  const weekLabel = getWeekOfMonth(weekStartDate);

  /**
   * ===========================================
   * 이벤트 핸들러 - 날짜 선택
   * ===========================================
   */

  /**
   * 날짜 클릭 시 팝업 열기
   */
  const handleDayClick = (index: number) => {
    setSelectedDayIndex(index);
  };

  /**
   * 팝업 닫기
   */
  const handleClosePopup = () => {
    setSelectedDayIndex(null);
  };

  /**
   * ===========================================
   * 이벤트 핸들러 - 메모 저장
   * ===========================================
   */

  /**
   * 메모 저장 및 상태 업데이트
   */
  const handleSaveMemo = (dateKey: string, memoText: string) => {
    setLocalCalendarData((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        status: {
          ...(prev[dateKey]?.status || {
            workout: 'none',
            diet: 'none',
            pt: 'none',
            memo: 'none',
          }),
          memo: memoText.trim() ? 'complete' : 'none',
        },
        memo: memoText.trim() || undefined,
      },
    }));
  };

  /**
   * ===========================================
   * 이벤트 핸들러 - 네비게이션
   * ===========================================
   */

  /**
   * 전체보기 클릭 시 월간 캘린더로 이동
   */
  const handleMoreClick = () => {
    if (onNavigateToMonth) {
      onNavigateToMonth();
    }
  };

  /**
   * 이전 주로 이동
   */
  const handlePrevWeek = () => {
    const newDate = new Date(weekStartDate);
    newDate.setDate(weekStartDate.getDate() - 7);
    setWeekStartDate(newDate);
  };

  /**
   * 다음 주로 이동
   */
  const handleNextWeek = () => {
    const newDate = new Date(weekStartDate);
    newDate.setDate(weekStartDate.getDate() + 7);
    setWeekStartDate(newDate);
  };

  /**
   * ===========================================
   * 이벤트 핸들러 - 스와이프/드래그
   * ===========================================
   */

  /**
   * 터치 시작
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  /**
   * 터치 종료 시 스와이프 판정
   */
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    /* 팝업 열려있으면 스와이프 무시 */
    if (selectedDayIndex !== null) {
      setTouchStartX(null);
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNextWeek();
    } else if (diff < -50) {
      handlePrevWeek();
    }

    setTouchStartX(null);
  };

  /**
   * 마우스 다운
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartX(e.clientX);
  };

  /**
   * 마우스 업 시 드래그 판정
   */
  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX === null) return;

    /* 팝업 열려있으면 드래그 무시 */
    if (selectedDayIndex !== null) {
      setMouseStartX(null);
      return;
    }

    const diff = mouseStartX - e.clientX;

    if (diff > 50) {
      handleNextWeek();
    } else if (diff < -50) {
      handlePrevWeek();
    }

    setMouseStartX(null);
  };

  /**
   * 마우스가 컨테이너 벗어나면 드래그 취소
   */
  const handleMouseLeave = () => {
    setMouseStartX(null);
  };

  /**
   * ===========================================
   * 렌더링
   * ===========================================
   */

  return (
    <div
      className="week-calendar-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* 헤더 */}
      <div className="week-calendar-header">
        <h2 className="week-calendar-title">주간 활동</h2>
        <span className="week-calendar-week-label">{weekLabel}</span>
        <button className="week-calendar-more-btn" onClick={handleMoreClick}>
          <Calendar size={16} />
          <span>전체보기</span>
        </button>
      </div>

      {/* 날짜 그리드 */}
      <div className="week-calendar-grid">
        {weekDates.map((date, index) => {
          const dateKey = getDateKey(date);
          const record = localCalendarData[dateKey];
          const status: DailyStatus = record?.status || {
            workout: 'none',
            diet: 'none',
            pt: 'none',
            memo: 'none',
          };

          return (
            <div key={index} className="week-calendar-day-column">
              {/* 날짜 라벨 */}
              <span className={`week-calendar-day-label ${isToday(date) ? 'today' : ''}`}>
                {date.getDate()}
                <span
                  className={`week-calendar-weekday ${
                    index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''
                  }`}
                >
                  ({WEEK_DAYS[index]})
                </span>
              </span>

              {/* 날짜 셀 */}
              <button
                className={`week-calendar-day-cell ${isToday(date) ? 'today' : ''} ${
                  selectedDayIndex === index ? 'selected' : ''
                }`}
                onClick={() => handleDayClick(index)}
              >
                <div className="week-calendar-status-dots">
                  <div className={`week-calendar-status-dot workout ${status.workout}`} />
                  <div className={`week-calendar-status-dot diet ${status.diet}`} />
                  <div className={`week-calendar-status-dot pt ${status.pt}`} />
                  <div className={`week-calendar-status-dot memo ${status.memo}`} />
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="week-calendar-legend">
        <div className="week-calendar-legend-item">
          <div className="week-calendar-legend-dot workout complete" />
          <span className="week-calendar-legend-label">운동</span>
        </div>
        <div className="week-calendar-legend-item">
          <div className="week-calendar-legend-dot diet complete" />
          <span className="week-calendar-legend-label">식단</span>
        </div>
        <div className="week-calendar-legend-item">
          <div className="week-calendar-legend-dot pt complete" />
          <span className="week-calendar-legend-label">화상PT</span>
        </div>
        <div className="week-calendar-legend-item">
          <div className="week-calendar-legend-dot memo complete" />
          <span className="week-calendar-legend-label">메모</span>
        </div>
      </div>

      {/* 팝업 */}
      {selectedDayIndex !== null && (
        <CalendarPopup
          date={weekDates[selectedDayIndex]}
          record={
            localCalendarData[getDateKey(weekDates[selectedDayIndex])] || {
              status: { workout: 'none', diet: 'none', pt: 'none', memo: 'none' },
            }
          }
          onClose={handleClosePopup}
          onNavigateToWorkout={onNavigateToWorkout}
          onNavigateToDiet={onNavigateToDiet}
          onNavigateToPT={onNavigateToPT}
          onSaveMemo={handleSaveMemo}
        />
      )}
    </div>
  );
}