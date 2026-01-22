/**
 * WeekCalendar.tsx
 * 주간 캘린더 컴포넌트
 * - 7일간 활동 상태 표시 (운동/식단/화상PT/메모)
 * - 날짜 클릭 시 상세 팝업 표시
 * - 전체보기 클릭 시 월간 캘린더로 이동
 * - 스와이프/드래그로 주 이동
 */
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { WEEK_DAYS } from '../../../constants/calendar';
import {
  getDateKey, isToday, getWeekStartDate, getWeekDates, getWeekOfMonth,
} from '../../../utils/calendar';
import {
  getWorkoutDietClass, getVideoPtClass, getMemoClass,
} from '../../../utils/calendarStatus';
import { getWeeklyCalendar } from '../../../api/calendar';
import { DayStatusItem } from '../../../api/types/calendar';
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

  /** 캘린더 상태 데이터 (API 응답) */
  const [calendarStatus, setCalendarStatus] = useState<Record<string, DayStatusItem>>({});

  /** 로딩 상태 */
  const [isLoading, setIsLoading] = useState(false);

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
   * 이펙트
   * ===========================================
   */

  /**
   * 주 변경 시 주간 컬러코드 API 호출
   */
  useEffect(() => {
    const fetchCalendarStatus = async () => {
      setIsLoading(true);

      try {
        const startDateKey = getDateKey(weekStartDate);
        const response = await getWeeklyCalendar(startDateKey);

        const statusMap: Record<string, DayStatusItem> = {};
        response.days.forEach((day) => {
          statusMap[day.date] = day;
        });

        setCalendarStatus(statusMap);
      } catch (error) {
        console.error('주간 캘린더 상태 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarStatus();
  }, [weekStartDate]);

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
   * 이벤트 핸들러 - 메모 저장 콜백
   * ===========================================
   */

  /**
   * 메모 저장 성공 시 마커 업데이트
   * @param dateKey - 날짜 키 (YYYY-MM-DD)
   * @param hasContent - 메모 내용 존재 여부
   */
  const handleMemoSaved = (dateKey: string, hasContent: boolean) => {
    setCalendarStatus((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        date: dateKey,
        workout: prev[dateKey]?.workout || { status: 'NONE' },
        diet: prev[dateKey]?.diet || { status: 'NONE' },
        videoPt: prev[dateKey]?.videoPt || { status: 'NONE' },
        /** TODO: 메모 상태 - 백엔드 확정 후 변경될 수 있음 */
        memo: { status: hasContent ? 'HAS_MEMO' : 'NONE' },
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
          const dayStatus = calendarStatus[dateKey];

          return (
            <div key={index} className="week-calendar-day-column">
              {/* 날짜 라벨 */}
              <span className={`week-calendar-day-label ${isToday(date) ? 'today' : ''}`}>
                {date.getDate()}
                <span
                  className={`week-calendar-weekday ${index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''
                    }`}
                >
                  ({WEEK_DAYS[index]})
                </span>
              </span>

              {/* 날짜 셀 */}
              <button
                className={`week-calendar-day-cell ${isToday(date) ? 'today' : ''} ${selectedDayIndex === index ? 'selected' : ''
                  }`}
                onClick={() => handleDayClick(index)}
              >
                <div className="week-calendar-status-dots">
                  <div className={`week-calendar-status-dot workout ${getWorkoutDietClass(dayStatus?.workout?.status, dateKey)}`} />
                  <div className={`week-calendar-status-dot diet ${getWorkoutDietClass(dayStatus?.diet?.status, dateKey)}`} />
                  <div className={`week-calendar-status-dot pt ${getVideoPtClass(dayStatus?.videoPt?.status)}`} />
                  <div className={`week-calendar-status-dot memo ${getMemoClass(dayStatus?.memo?.status)}`} />
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
          onClose={handleClosePopup}
          onNavigateToWorkout={onNavigateToWorkout}
          onNavigateToDiet={onNavigateToDiet}
          onNavigateToPT={onNavigateToPT}
          onMemoSaved={handleMemoSaved}
        />
      )}
    </div>
  );
}