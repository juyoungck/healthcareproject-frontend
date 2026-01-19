/**
 * WeekCalendar.tsx
 * 주간 캘린더 컴포넌트
 * - 7일간 활동 상태 표시 (운동/식단/화상PT/메모)
 * - 날짜 클릭 시 상세 팝업 표시
 * - 전체보기 클릭 시 월간 캘린더로 이동
 * - 스와이프/드래그로 주 이동
 * - 메모 저장 시 마커 반영
 */

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { calendarDummyData, getDateKey } from '../../../data/calendardata';
import WeekCalendarPopup from './WeekCalendarPopup';

/**
 * 상태 타입 정의
 */
export type StatusType = 'none' | 'scheduled' | 'failed' | 'incomplete' | 'complete';

/**
 * 일일 상태 타입
 */
export interface DailyStatus {
  workout: StatusType;
  diet: StatusType;
  pt: StatusType;
  memo: StatusType;
}

/**
 * Props 타입 정의
 */
interface WeekCalendarProps {
  onNavigateToMonth?: () => void;
  onNavigateToWorkout?: () => void;
  onNavigateToDiet?: () => void;
  onNavigateToPT?: () => void;
}

/**
 * 요일 데이터
 */
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * WeekCalendar 컴포넌트
 */
export default function WeekCalendar({
  onNavigateToMonth,
  onNavigateToWorkout,
  onNavigateToDiet,
  onNavigateToPT,
}: WeekCalendarProps) {
  /**
   * 선택된 날짜 인덱스 (팝업 표시용)
   */
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  /**
   * 현재 주 기준 날짜 (해당 주의 일요일)
   */
  const [weekStartDate, setWeekStartDate] = useState<Date>(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    return sunday;
  });

  /**
   * 터치 시작 X 좌표
   */
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  /**
   * 마우스 시작 X 좌표
   */
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);

  /**
   * 캘린더 데이터 상태 (메모 저장용)
   */
  const [localCalendarData, setLocalCalendarData] = useState(calendarDummyData);

  /**
   * 오늘 날짜
   */
  const today = new Date();
  const todayString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  /**
   * 오늘인지 확인
   */
  const isToday = (date: Date): boolean => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` === todayString;
  };

  /**
   * 주간 날짜 배열 생성
   */
  const getWeekDates = (): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate);
      date.setDate(weekStartDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  /**
   * 주차 계산
   */
  const getWeekOfMonth = (): string => {
    const wednesday = new Date(weekStartDate);
    wednesday.setDate(weekStartDate.getDate() + 3);

    const month = wednesday.getMonth() + 1;
    const firstDayOfMonth = new Date(wednesday.getFullYear(), wednesday.getMonth(), 1);
    const firstDayWeek = firstDayOfMonth.getDay();
    const weekNumber = Math.ceil((wednesday.getDate() + firstDayWeek) / 7);

    return `${month}월 ${weekNumber}주차`;
  };

  /**
   * 이번 주 날짜 배열
   */
  const weekDates = getWeekDates();

  /**
   * 날짜 셀 클릭 핸들러
   */
  const handleDayClick = (index: number) => {
    setSelectedDayIndex(index);
  };

  /**
   * 팝업 닫기 핸들러
   */
  const handleClosePopup = () => {
    setSelectedDayIndex(null);
  };

  /**
   * 메모 저장 핸들러
   */
  const handleSaveMemo = (dateKey: string, memoText: string) => {
    setLocalCalendarData(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        status: {
          ...(prev[dateKey]?.status || { workout: 'none', diet: 'none', pt: 'none', memo: 'none' }),
          memo: memoText.trim() ? 'complete' : 'none',
        },
        memo: memoText.trim() || undefined,
      },
    }));
  };

  /**
   * 전체보기 버튼 클릭 핸들러
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
   * 터치 시작 핸들러
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  /**
   * 터치 종료 핸들러
   */
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
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
   * 마우스 다운 핸들러
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartX(e.clientX);
  };

  /**
   * 마우스 업 핸들러
   */
  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX === null) return;
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
   * 마우스 떠남 핸들러
   */
  const handleMouseLeave = () => {
    setMouseStartX(null);
  };

  return (
    <div
      className="week-calendar-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* 캘린더 헤더 */}
      <div className="week-calendar-header">
        <h2 className="week-calendar-title">주간 활동</h2>
        <span className="week-calendar-week-label">{getWeekOfMonth()}</span>
        <button className="week-calendar-more-btn" onClick={handleMoreClick}>
          <Calendar size={16} />
          <span>전체보기</span>
        </button>
      </div>

      {/* 캘린더 그리드 */}
      <div className="week-calendar-grid">
        {weekDates.map((date, index) => {
          const dateKey = getDateKey(date);
          const record = localCalendarData[dateKey];
          const status = record?.status || { workout: 'none', diet: 'none', pt: 'none', memo: 'none' };

          return (
            <div key={index} className="week-calendar-day-column">
              {/* 날짜(요일) 라벨 */}
              <span className={`week-calendar-day-label ${isToday(date) ? 'today' : ''}`}>
                {date.getDate()}
                <span
                  className={`week-calendar-weekday ${index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''}`}
                >
                  ({WEEK_DAYS[index]})
                </span>
              </span>

              {/* 날짜 셀 */}
              <button
                className={`week-calendar-day-cell ${isToday(date) ? 'today' : ''} ${selectedDayIndex === index ? 'selected' : ''}`}
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
        <WeekCalendarPopup
          date={weekDates[selectedDayIndex]}
          record={localCalendarData[getDateKey(weekDates[selectedDayIndex])] || {
            status: { workout: 'none', diet: 'none', pt: 'none', memo: 'none' }
          }}
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