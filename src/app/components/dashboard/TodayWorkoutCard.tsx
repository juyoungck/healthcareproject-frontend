/**
 * TodayWorkoutCard.tsx
 * 오늘의 운동 카드 컴포넌트
 */

import { Dumbbell, Clock, Check, ExternalLink } from 'lucide-react';
import type { DailyWorkoutResponse, WorkoutItem } from '../../../api/types/workout';

/**
 * Props 타입 정의
 */
interface TodayWorkoutCardProps {
  workout: DailyWorkoutResponse;
  onToggleItem: (item: WorkoutItem) => void;
  onViewAll: () => void;
  onExerciseClick: (exerciseId: number) => void;
}

/**
 * TodayWorkoutCard 컴포넌트
 */
export default function TodayWorkoutCard({
  workout,
  onToggleItem,
  onViewAll,
  onExerciseClick,
}: TodayWorkoutCardProps) {
  return (
    <div className="today-exercise-card">
      <div className="today-exercise-header" onClick={onViewAll}>
        <span className="today-exercise-label">오늘의 운동</span>
        <ExternalLink size={16} className="today-exercise-arrow" />
      </div>

      {/* 카테고리 헤더 */}
      <div className="today-exercise-category">
        <Dumbbell size={16} className="today-exercise-category-icon" />
        <div className="today-exercise-category-info">
          <h3 className="today-exercise-category-title">{workout.title}</h3>
          <p className="today-exercise-category-meta">
            <Clock size={12} />
            {workout.totalMinutes}분 • {workout.exerciseCount}개 운동
          </p>
        </div>
      </div>

      {/* 운동 리스트 */}
      <ul className="today-exercise-list">
        {workout.items.map((item) => (
          <li
            key={item.workoutItemId}
            className={`today-exercise-item ${item.isChecked ? 'completed' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleItem(item);
            }}
          >
            <button className="today-exercise-item-check">
              {item.isChecked ? (
                <Check size={12} />
              ) : (
                <div className="today-exercise-item-check-empty" />
              )}
            </button>
            <div className="today-exercise-item-info">
              <p className="today-exercise-item-name">{item.name}</p>
              <p className="today-exercise-item-detail">
                {item.amount} • 휴식 {item.restSeconds}초
              </p>
            </div>
            <ExternalLink
              size={16}
              className="today-exercise-item-arrow"
              onClick={(e) => {
                e.stopPropagation();
                onExerciseClick(item.exerciseId);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
