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
import { ExercisePlan } from './PlanExerciseResult';
import PlanExerciseRegenerateModal from './PlanExerciseRegenerateModal';

/**
 * Props 타입 정의
 */
interface PlanExerciseViewPageProps {
  onBack: () => void;
  planData: ExercisePlan;
  completedExercises: { [key: string]: boolean };
  onToggleExercise: (exerciseKey: string) => void;
  onExerciseClick?: (exerciseId: number) => void;
  onRegenerate?: (feedback: string) => void;
}

/**
 * 요일 라벨 (일~토 순서)
 */
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

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
   * 재생성 모달 상태
   */
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  /**
   * 계획 생성일 파싱
   */
  const startDate = useMemo(() => {
    const dateMatch = planData.createdAt.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
    if (dateMatch) {
      return new Date(
        parseInt(dateMatch[1]),
        parseInt(dateMatch[2]) - 1,
        parseInt(dateMatch[3])
      );
    }
    return new Date();
  }, [planData.createdAt]);

  /**
   * 생성일 기준 7일치 날짜를 일~토 순서로 계산
   */
  const weekDates = useMemo(() => {
    const startDayOfWeek = startDate.getDay();
    const dates: { [key: string]: number } = {};

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      let daysToAdd = dayIndex - startDayOfWeek;
      if (daysToAdd < 0) {
        daysToAdd += 7;
      }

      const date = new Date(startDate);
      date.setDate(startDate.getDate() + daysToAdd);
      dates[String(dayIndex)] = date.getDate();
    }

    return dates;
  }, [startDate]);

  /**
   * 오늘이 어떤 요일 인덱스인지 계산
   */
  const todayDayIndex = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0 || diffDays >= 7) return -1;

    return today.getDay();
  }, [startDate]);

  /**
   * 선택된 요일
   */
  const [selectedDay, setSelectedDay] = useState<string>(
    todayDayIndex >= 0 ? String(todayDayIndex) : String(startDate.getDay())
  );

  /**
   * 선택된 요일의 운동 계획
   */
  const selectedDayPlan = planData.dailyPlans.find(
    plan => plan.dayName === selectedDay
  );

  /**
   * 요일에 운동이 있는지 확인
   */
  const hasExerciseForDay = (dayName: string) => {
    return planData.dailyPlans.some(plan => plan.dayName === dayName);
  };

  /**
   * 해당 요일의 완료율 계산
   */
  const getCompletionRate = (dayName: string) => {
    const dayPlan = planData.dailyPlans.find(plan => plan.dayName === dayName);
    if (!dayPlan) return 0;

    const total = dayPlan.exercises.length;
    const completed = dayPlan.exercises.filter(
      ex => completedExercises[`${dayName}-${ex.id}`]
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

      {/* 요일 탭 */}
      <div className="exercise-view-day-tabs">
        {['0', '1', '2', '3', '4', '5', '6'].map(day => {
          const hasExercise = hasExerciseForDay(day);
          const isSelected = selectedDay === day;
          const isToday = String(todayDayIndex) === day;
          const completionRate = getCompletionRate(day);

          return (
            <button
              key={day}
              className={`exercise-view-day-tab ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${hasExercise ? 'has-exercise' : ''} ${completionRate === 100 ? 'completed' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <span className="exercise-view-day-tab-label">
                {weekDates[day]}({DAY_LABELS[parseInt(day)]})
              </span>
              {hasExercise && completionRate > 0 && completionRate < 100 && (
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
                <h2 className="exercise-view-category-title">{selectedDayPlan.category}</h2>
                <p className="exercise-view-category-meta">
                  <Clock size={14} />
                  {selectedDayPlan.totalMinutes}분 • {selectedDayPlan.exercises.length}개 운동
                </p>
              </div>
            </div>

            {/* 운동 목록 */}
            <ul className="exercise-view-list">
              {selectedDayPlan.exercises.map((exercise) => {
                const exerciseKey = `${selectedDay}-${exercise.id}`;
                const isCompleted = completedExercises[exerciseKey];

                return (
                  <li
                    key={exercise.id}
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
                      <p className="exercise-view-item-name">{exercise.name}</p>
                      <p className="exercise-view-item-detail">
                        {exercise.sets}세트 × {exercise.reps}회 • 휴식 {exercise.restSeconds}초
                      </p>
                    </div>
                    <ExternalLink
                      size={20}
                      className="exercise-view-item-arrow"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExerciseClick?.(exercise.id);
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
            <h2 className="exercise-view-rest-title">휴식일</h2>
            <p className="exercise-view-rest-desc">오늘은 쉬는 날이에요</p>
          </div>
        )}
      </main>

      {/* 하단 재생성 버튼 */}
      <footer className="exercise-view-footer">
        <button
          className="exercise-view-regenerate-btn"
          onClick={() => setShowRegenerateModal(true)}
        >
          <RefreshCw size={18} />
          <span>운동 계획 재생성</span>
        </button>
      </footer>

      {/* 재생성 모달 */}
      {showRegenerateModal && (
        <PlanExerciseRegenerateModal
          onClose={() => setShowRegenerateModal(false)}
          onRegenerate={(feedback) => {
            setShowRegenerateModal(false);
            onRegenerate?.(feedback);
          }}
        />
      )}
    </div>
  );
}