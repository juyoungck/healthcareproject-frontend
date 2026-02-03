/**
 * RestDayCard.tsx
 * 휴식일 카드 컴포넌트 (운동/식단 공통)
 */

/**
 * Props 타입 정의
 */
interface RestDayCardProps {
  type: 'workout' | 'diet';
  onViewWeekly: () => void;
}

/**
 * RestDayCard 컴포넌트
 */
export default function RestDayCard({ type, onViewWeekly }: RestDayCardProps) {
  const isWorkout = type === 'workout';

  return (
    <div className={`rest-day-card ${isWorkout ? '' : 'diet'}`}>
      <div className="rest-day-content">
        <span className="rest-day-emoji">{isWorkout ? '😴' : '🍽️'}</span>
        <p className="rest-day-title">
          {isWorkout ? '오늘은 휴식일' : '오늘은 자유 식단'}
        </p>
        <p className="rest-day-desc">
          {isWorkout ? '푹 쉬고 내일 다시 힘내요!' : '오늘은 편하게 드세요!'}
        </p>
      </div>
      <button className="rest-day-view-btn" onClick={onViewWeekly}>
        주간 {isWorkout ? '운동' : '식단'} 보기
      </button>
    </div>
  );
}
