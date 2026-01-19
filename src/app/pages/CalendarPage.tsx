/**
 * CalendarPage.tsx
 * 월간 캘린더 페이지
 */

import MonthCalendar from '../components/calendar/MonthCalendar';

/**
 * Props 타입 정의
 */
interface CalendarPageProps {
  onNavigateBack?: () => void;
}

export default function CalendarPage({
  onNavigateBack,
}: CalendarPageProps) {
  return (
    <div className="calendar-page">
      <MonthCalendar
        onNavigateBack={onNavigateBack}
      />
    </div>
  );
}