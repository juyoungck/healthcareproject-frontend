/**
 * MonthCalendar.tsx
 * 월간 캘린더 컴포넌트
 * - 월 단위 달력 표시
 * - 운동/식단/화상PT/메모 마커 표시
 * - 날짜 클릭 시 상세 팝업 표시
 * - 이전/다음 달 이동
 */
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, BarChart2 } from 'lucide-react';
import { WEEK_DAYS } from '../../../constants/calendar';
import {
  getDateKey,
  isToday,
  isSameDate,
  generateCalendarDays
} from '../../../utils/calendar';
import {
  getWorkoutDietClass,
  getVideoPtClass,
  getMemoClass
} from '../../../utils/calendarStatus';
import { getWeeklyCalendar } from '../../../api/calendar';
import { DayStatusItem } from '../../../api/types/calendar';
import CalendarPopup from './CalendarPopup';
/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface MonthCalendarProps {
  /** 뒤로가기 핸들러 */
  onNavigateBack?: () => void;
  /** 운동 상세 페이지 이동 핸들러 (날짜 전달) */
  onNavigateToWorkout?: (dateStr: string) => void;
  /** 식단 상세 페이지 이동 핸들러 (날짜 전달) */
  onNavigateToDiet?: (dateStr: string) => void;
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

  /** 캘린더 상태 데이터 (API 응답) */
  const [calendarStatus, setCalendarStatus] = useState<Record<string, DayStatusItem>>({});

  /** 로딩 상태 */
  const [isLoading, setIsLoading] = useState(false);

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
   * 이펙트
   * ===========================================
   */

  useEffect(() => {
    const fetchCalendarStatus = async () => {
      setIsLoading(true);

      try {
        /* 화면에 보이는 전체 날짜 범위 요청 (42일) */
        const days = generateCalendarDays(currentDate);
        const firstDay = days[0].date;
        const lastDay = days[days.length - 1].date;

        const startDateKey = getDateKey(firstDay);
        const endDateKey = getDateKey(lastDay);

        const response = await getWeeklyCalendar(startDateKey, endDateKey);

        const statusMap: Record<string, DayStatusItem> = {};
        response.days.forEach((day) => {
          statusMap[day.date] = day;
        });

        setCalendarStatus(statusMap);
      } catch (error) {
        console.error('캘린더 상태 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarStatus();
  }, [currentDate]);


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
        memo: { exists: hasContent },
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
            className={`month-calendar-weekday ${index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''
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
          const dayStatus = calendarStatus[dateKey];
          const dayOfWeek = date.getDay();

          return (
            <button
              key={index}
              className={`month-calendar-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday(date) ? 'today' : ''
                } ${selectedDate && isSameDate(date, selectedDate) ? 'selected' : ''} ${dayOfWeek === 0 ? 'sunday' : dayOfWeek === 6 ? 'saturday' : ''
                }`}
              onClick={() => handleDateClick(date)}
            >
              {/* 날짜 */}
              <span className="month-calendar-date">{date.getDate()}</span>

              {/* 마커 */}
              <div className="month-calendar-markers">
                <div className={`month-calendar-marker workout ${getWorkoutDietClass(dayStatus?.workout?.status, dateKey)}`} />
                <div className={`month-calendar-marker diet ${getWorkoutDietClass(dayStatus?.diet?.status, dateKey)}`} />
                <div className={`month-calendar-marker pt ${getVideoPtClass(dayStatus?.videoPt?.status)}`} />
                <div className={`month-calendar-marker memo ${getMemoClass(dayStatus?.memo)}`} />
              </div>
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
          onClose={handleClosePopup}
          onNavigateToWorkout={onNavigateToWorkout}
          onNavigateToDiet={onNavigateToDiet}
          onNavigateToPT={onNavigateToPT}
          onMemoSaved={handleMemoSaved}
          workoutStatus={calendarStatus[getDateKey(selectedDate)]?.workout?.status}
          dietStatus={calendarStatus[getDateKey(selectedDate)]?.diet?.status}
        />
      )}
    </div>
  );
}