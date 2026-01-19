/**
 * MonthCalendar.tsx
 * 월간 캘린더 컴포넌트
 * - 월 단위 달력 표시
 * - 운동/식단/화상PT/메모 마커 표시
 * - 날짜 클릭 시 상세 팝업 표시
 * - 이전/다음 달 이동
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, BarChart2 } from 'lucide-react';
import { DailyStatus, DailyRecord } from '../../../types/calendar';
import { WEEK_DAYS } from '../../../constants/calendar';
import {
  getDateKey,
  isToday,
  isSameDate,
  generateCalendarDays,
} from '../../../utils/calendar';
import { calendarDummyData } from '../../../data/calendars';
import CalendarPopup from './CalendarPopup';

/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface MonthCalendarProps {
  /** 뒤로가기 핸들러 */
  onNavigateBack?: () => void;
  /** 운동 상세 페이지 이동 핸들러 */
  onNavigateToWorkout?: () => void;
  /** 식단 상세 페이지 이동 핸들러 */
  onNavigateToDiet?: () => void;
  /** 화상PT 상세 페이지 이동 핸들러 */
  onNavigateToPT?: () => void;
}

/**
 * ===========================================
 * MonthCalendar 컴포넌트
 * ===========================================
 */

export default function MonthCalendar({
  onNavigateBack,
  onNavigateToWorkout,
  onNavigateToDiet,
  onNavigateToPT,
}: MonthCalendarProps) {
  /**
   * ===========================================
   * 상태 관리
   * ===========================================
   */

  /** 현재 표시 중인 년/월 */
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  /** 선택된 날짜 (팝업용) */
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  /** 캘린더 데이터 (메모 저장용 로컬 상태) */
  const [localCalendarData, setLocalCalendarData] = useState<Record<string, DailyRecord>>(calendarDummyData);

  /**
   * ===========================================
   * 파생 데이터
   * ===========================================
   */

  /** 헤더 타이틀 (예: "2025년 1월") */
  const headerTitle = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;

  /** 달력 날짜 배열 (6주 42일) */
  const calendarDays = generateCalendarDays(currentDate);

  /**
   * ===========================================
   * 이벤트 핸들러 - 월 이동
   * ===========================================
   */

  /**
   * 이전 달로 이동
   */
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  /**
   * 다음 달로 이동
   */
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  /**
   * ===========================================
   * 이벤트 핸들러 - 날짜 선택
   * ===========================================
   */

  /**
   * 날짜 클릭 시 팝업 열기
   */
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  /**
   * 팝업 닫기
   */
  const handleClosePopup = () => {
    setSelectedDate(null);
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
   * 렌더링
   * ===========================================
   */

  return (
    <div className="month-calendar-container">
      {/* 헤더 */}
      <div className="month-calendar-header">
        {/* 뒤로가기 버튼 */}
        <button className="month-calendar-back-btn" onClick={onNavigateBack}>
          <ArrowLeft size={20} />
        </button>

        {/* 년/월 네비게이션 */}
        <div className="month-calendar-nav">
          <button className="month-calendar-nav-btn" onClick={handlePrevMonth}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="month-calendar-title">{headerTitle}</h2>
          <button className="month-calendar-nav-btn" onClick={handleNextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 통계 버튼 */}
        <button className="month-calendar-stats-btn">
          <BarChart2 size={20} />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="month-calendar-weekdays">
        {WEEK_DAYS.map((day, index) => (
          <div
            key={day}
            className={`month-calendar-weekday ${
              index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="month-calendar-grid">
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const dateKey = getDateKey(date);
          const record = localCalendarData[dateKey];
          const status: DailyStatus | undefined = record?.status;
          const dayOfWeek = date.getDay();

          return (
            <button
              key={index}
              className={`month-calendar-cell ${!isCurrentMonth ? 'other-month' : ''} ${
                isToday(date) ? 'today' : ''
              } ${selectedDate && isSameDate(date, selectedDate) ? 'selected' : ''} ${
                dayOfWeek === 0 ? 'sunday' : dayOfWeek === 6 ? 'saturday' : ''
              }`}
              onClick={() => handleDateClick(date)}
            >
              {/* 날짜 */}
              <span className="month-calendar-date">{date.getDate()}</span>

              {/* 마커 */}
              {status && (
                <div className="month-calendar-markers">
                  <div className={`month-calendar-marker workout ${status.workout}`} />
                  <div className={`month-calendar-marker diet ${status.diet}`} />
                  <div className={`month-calendar-marker pt ${status.pt}`} />
                  <div className={`month-calendar-marker memo ${status.memo}`} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="month-calendar-legend">
        <div className="month-calendar-legend-item">
          <div className="month-calendar-legend-dot workout complete" />
          <span className="month-calendar-legend-label">운동</span>
        </div>
        <div className="month-calendar-legend-item">
          <div className="month-calendar-legend-dot diet complete" />
          <span className="month-calendar-legend-label">식단</span>
        </div>
        <div className="month-calendar-legend-item">
          <div className="month-calendar-legend-dot pt complete" />
          <span className="month-calendar-legend-label">화상PT</span>
        </div>
        <div className="month-calendar-legend-item">
          <div className="month-calendar-legend-dot memo complete" />
          <span className="month-calendar-legend-label">메모</span>
        </div>
      </div>

      {/* 팝업 */}
      {selectedDate && (
        <CalendarPopup
          date={selectedDate}
          record={
            localCalendarData[getDateKey(selectedDate)] || {
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