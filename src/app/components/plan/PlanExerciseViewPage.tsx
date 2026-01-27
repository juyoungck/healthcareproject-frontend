/**
 * PlanExerciseViewPage.tsx
 * 주간 운동 계획 보기 페이지
 * - 요일별 탭
 * - 운동 리스트 및 체크 기능
 * - 운동 클릭 시 상세 페이지 이동
 * - 하단 재생성 버튼
 */

import { useState, useMemo } from 'react';
import { Clock, Check, ExternalLink, Dumbbell, RefreshCw, ArrowLeft } from 'lucide-react';
import type { WorkoutAiResponse, WorkoutDay } from '../../../api/types/ai';

/**
 * Props 타입 정의
 */
interface PlanExerciseViewPageProps {
  onBack: () => void;
  planData: WorkoutAiResponse;
  completedExercises: { [key: string]: boolean };
  onToggleExercise: (exerciseKey: string) => void;
  onExerciseClick?: (exerciseId: number) => void;
  onRegenerate?: () => void;
}

/**
 * 요일 라벨 매핑 (영문 → 한글 단축)
 */
const DAY_OF_WEEK_SHORT: { [key: string]: string } = {
  'SUN': '일',
  'MON': '월',
  'TUE': '화',
  'WED': '수',
  'THU': '목',
  'FRI': '금',
  'SAT': '토',
};

/**
 * 날짜 포맷 함수 (2026-01-17 → 17(토))
 */
const formatDateTab = (logDate: string, dayOfWeek: string): string => {
  const date = new Date(logDate);
  const day = date.getDate();
  const dayLabel = DAY_OF_WEEK_SHORT[dayOfWeek] || dayOfWeek;
  return `${day}(${dayLabel})`;
};

/**
 * PlanExerciseViewPage 컴포넌트
 */
export default function PlanExerciseViewPage({
  onBack,
  planData,
  completedExercises,
  onToggleExercise,
  onExerciseClick,
  onRegenerate
}: PlanExerciseViewPageProps) {
  /**
   * 오늘 날짜 (YYYY-MM-DD)
   */
  const today = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  /**
   * 선택된 날짜 (workoutDayId)
   */
  const [selectedDayId, setSelectedDayId] = useState<number>(() => {
    /* 오늘 날짜에 해당하는 운동일이 있으면 선택, 없으면 첫 번째 */
    const todayPlan = planData.days.find(d => d.logDate === today);
    return todayPlan?.workoutDayId || planData.days[0]?.workoutDayId || 0;
  });

  /**
   * 선택된 날짜의 운동 계획
   */
  const selectedDayPlan = planData.days.find(d => d.workoutDayId === selectedDayId);

  /**
   * 해당 날짜의 완료율 계산
   */
  const getCompletionRate = (workoutDay: WorkoutDay) => {
    const total = workoutDay.items.length;
    const completed = workoutDay.items.filter(
      item => completedExercises[`${workoutDay.workoutDayId}-${item.workoutItemId}`]
    ).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

   return (
    <div className="exercise-view-content-wrapper">
      {/* 헤더 */}
      <header className="exercise-view-header">
        <button className="exercise-view-back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>목록으로</span>
        </button>
      </header>

      {/* 날짜 탭 */}
      <div className="exercise-view-day-tabs">
        {planData.days.map(workoutDay => {
          const isSelected = selectedDayId === workoutDay.workoutDayId;
          const isToday = workoutDay.logDate === today;
          const completionRate = getCompletionRate(workoutDay);

          return (
            <button
              key={workoutDay.workoutDayId}
              className={`exercise-view-day-tab ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} has-exercise ${completionRate === 100 ? 'completed' : ''}`}
              onClick={() => setSelectedDayId(workoutDay.workoutDayId)}
            >
              <span className="exercise-view-day-tab-label">
                {formatDateTab(workoutDay.logDate, workoutDay.dayOfWeek)}
              </span>
              {completionRate > 0 && completionRate < 100 && (
                <span className="exercise-view-day-tab-progress">{completionRate}%</span>
              )}
              {completionRate === 100 && (
                <Check size={12} className="exercise-view-day-tab-check" />
              )}
            </button>
          );
        })}
      </div>

      {/* 운동 리스트 */}
      <main className="exercise-view-content">
        {selectedDayPlan ? (
          <>
            {/* 카테고리 헤더 */}
            <div className="exercise-view-category">
              <Dumbbell size={20} className="exercise-view-category-icon" />
              <div className="exercise-view-category-info">
                <h2 className="exercise-view-category-title">{selectedDayPlan.title}</h2>
                <p className="exercise-view-category-meta">
                  <Clock size={14} />
                  {selectedDayPlan.totalMinutes}분 • {selectedDayPlan.items.length}개 운동
                </p>
              </div>
            </div>

            {/* 운동 목록 */}
            <ul className="exercise-view-list">
              {selectedDayPlan.items.map((item) => {
                const exerciseKey = `${selectedDayPlan.workoutDayId}-${item.workoutItemId}`;
                const isCompleted = completedExercises[exerciseKey] || item.isChecked;

                return (
                  <li
                    key={item.workoutItemId}
                    className={`exercise-view-item ${isCompleted ? 'completed' : ''}`}
                    onClick={() => onToggleExercise(exerciseKey)}
                  >
                    <div
                      className="exercise-view-item-check"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleExercise(exerciseKey);
                      }}
                    >
                      {isCompleted ? <Check size={14} /> : <div className="exercise-view-item-check-empty" />}
                    </div>
                    <div className="exercise-view-item-center">
                      <p className="exercise-view-item-name">{item.exerciseName}</p>
                      <p className="exercise-view-item-detail">
                        {item.sets && item.reps && `${item.sets}세트 × ${item.reps}회`}
                        {item.restSecond && ` • 휴식 ${item.restSecond}초`}
                        {item.durationMinutes && `${item.durationMinutes}분`}
                        {item.distanceKm && ` ${item.distanceKm}km`}
                      </p>
                    </div>
                    <ExternalLink
                      size={20}
                      className="exercise-view-item-arrow"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExerciseClick?.(item.exerciseId);
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="exercise-view-rest">
            <div className="exercise-view-rest-icon">😴</div>
            <h2 className="exercise-view-rest-title">운동 계획 없음</h2>
            <p className="exercise-view-rest-desc">선택된 날짜에 운동 계획이 없습니다</p>
          </div>
        )}
      </main>

      {/* 하단 재생성 버튼 */}
      <footer className="exercise-view-footer">
        <button
          className="exercise-view-regenerate-btn"
          onClick={onRegenerate}
        >
          <RefreshCw size={18} />
          <span>운동 계획 재생성</span>
        </button>
      </footer>
    </div>
  );
}