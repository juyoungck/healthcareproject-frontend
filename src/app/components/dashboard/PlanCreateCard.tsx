/**
 * PlanCreateCard.tsx
 * 계획 생성 버튼 카드 컴포넌트
 */

import { Dumbbell, Utensils } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface PlanCreateCardProps {
  type: 'workout' | 'diet';
  onClick: () => void;
}

/**
 * PlanCreateCard 컴포넌트
 */
export default function PlanCreateCard({ type, onClick }: PlanCreateCardProps) {
  const isWorkout = type === 'workout';

  return (
    <button className="plan-card" onClick={onClick}>
      <div className="plan-card-content">
        {isWorkout ? (
          <Dumbbell className="plan-card-icon workout" />
        ) : (
          <Utensils className="plan-card-icon diet" />
        )}
        <p className="plan-card-title">
          {isWorkout ? '운동 계획 생성' : '식단 계획 생성'}
        </p>
      </div>
    </button>
  );
}
