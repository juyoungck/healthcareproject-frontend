/**
 * CalendarPage.tsx
 * 월간 캘린더 페이지
 * - 월간 캘린더 표시
 * - 날짜 클릭 시 팝업에서 상세 페이지 이동 지원
 */

import MonthCalendar from '../components/calendar/MonthCalendar';

/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface CalendarPageProps {
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
 * CalendarPage 컴포넌트
 * ===========================================
 */

export default function CalendarPage({
  onNavigateBack,
  onNavigateToWorkout,
  onNavigateToDiet,
  onNavigateToPT,
}: CalendarPageProps) {
  return (
    <div className="calendar-page">
      <MonthCalendar
        onNavigateBack={onNavigateBack}
        onNavigateToWorkout={onNavigateToWorkout}
        onNavigateToDiet={onNavigateToDiet}
        onNavigateToPT={onNavigateToPT}
      />
    </div>
  );
}