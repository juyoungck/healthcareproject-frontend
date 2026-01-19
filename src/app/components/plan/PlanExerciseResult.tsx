/**
 * ExercisePlanResult.tsx
 * AI 운동 계획 생성 결과 화면
 * - 계획 요약 (기간, 주간 운동 횟수)
 * - 고려된 사항 안내
 * - 요일별 운동 목록
 * - 재생성/저장 버튼
 */

import { useState } from 'react';
import { ArrowLeft, Check, RefreshCw, Clock, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';
import PlanExerciseRegenerateModal from './PlanExerciseRegenerateModal';

/**
 * Props 타입 정의
 */
interface ExercisePlanResultProps {
  onBack: () => void;
  onSave: () => void;
  onRegenerate: (additionalRequest: string) => void;
  planData: ExercisePlan;
}

/**
 * 운동 계획 타입
 */
export interface ExercisePlan {
  createdAt: string;
  duration: string;
  daysPerWeek: number;
  considerations: string[];
  dailyPlans: DailyPlan[];
}

/**
 * 일별 계획 타입
 */
export interface DailyPlan {
  dayName: string;
  category: string;
  totalMinutes: number;
  exercises: Exercise[];
}

/**
 * 운동 타입
 */
export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
}

/**
 * 요일 라벨 매핑
 */
const DAY_LABELS: { [key: string]: string } = {
  '0': '일요일',
  '1': '월요일',
  '2': '화요일',
  '3': '수요일',
  '4': '목요일',
  '5': '금요일',
  '6': '토요일',
};

/**
 * ExercisePlanResult 컴포넌트
 */
export default function ExercisePlanResult({ 
  onBack, 
  onSave, 
  onRegenerate,
  planData 
}: ExercisePlanResultProps) {
  /**
   * 재생성 모달 상태
   */
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  /**
   * 펼쳐진 요일 상태
   */
  const [expandedDays, setExpandedDays] = useState<string[]>(
    planData.dailyPlans.map(p => p.dayName)
  );

  /**
   * 요일 펼침/접기 토글
   */
  const toggleDay = (dayName: string) => {
    setExpandedDays(prev => {
      if (prev.includes(dayName)) {
        return prev.filter(d => d !== dayName);
      } else {
        return [...prev, dayName];
      }
    });
  };

  /**
   * 재생성 핸들러
   */
  const handleRegenerate = (additionalRequest: string) => {
    setShowRegenerateModal(false);
    onRegenerate(additionalRequest);
  };

  return (
    <div className="exercise-result-container">
      {/* 헤더 */}
      <header className="exercise-result-header">
        <button className="exercise-result-back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="exercise-result-title">운동 계획</h1>
        <div className="exercise-result-header-spacer" />
      </header>

      {/* 메인 콘텐츠 */}
      <main className="exercise-result-content">
        {/* 생성 완료 배너 */}
        <div className="exercise-result-banner">
          <Check size={20} />
          <span>{planData.createdAt} 생성</span>
        </div>

        {/* 계획 요약 */}
        <section className="exercise-result-summary">
          <h2 className="exercise-result-summary-title">계획 요약</h2>
          <div className="exercise-result-summary-grid">
            <div className="exercise-result-summary-item">
              <span className="exercise-result-summary-value">{planData.duration}</span>
              <span className="exercise-result-summary-label">기간</span>
            </div>
            <div className="exercise-result-summary-item">
              <span className="exercise-result-summary-value">{planData.daysPerWeek}일</span>
              <span className="exercise-result-summary-label">주간 운동</span>
            </div>
          </div>
        </section>

        {/* 고려된 사항 */}
        <section className="exercise-result-considerations">
          <h3 className="exercise-result-considerations-title">
            📋 고려된 사항
          </h3>
          <ul className="exercise-result-considerations-list">
            {planData.considerations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 요일별 운동 목록 */}
        <section className="exercise-result-daily-plans">
          {planData.dailyPlans.map(dailyPlan => (
            <div key={dailyPlan.dayName} className="exercise-result-day-card">
              {/* 요일 헤더 */}
              <button 
                className="exercise-result-day-header"
                onClick={() => toggleDay(dailyPlan.dayName)}
              >
                <div className="exercise-result-day-info">
                  <h4 className="exercise-result-day-name">
                    {DAY_LABELS[dailyPlan.dayName] || dailyPlan.dayName}
                  </h4>
                  <span className="exercise-result-day-category">
                    <Dumbbell size={14} />
                    {dailyPlan.category}
                  </span>
                </div>
                <div className="exercise-result-day-meta">
                  <span className="exercise-result-day-time">
                    <Clock size={14} />
                    {dailyPlan.totalMinutes}분
                  </span>
                  {expandedDays.includes(dailyPlan.dayName) ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </button>

              {/* 운동 목록 */}
              {expandedDays.includes(dailyPlan.dayName) && (
                <div className="exercise-result-exercises">
                  {dailyPlan.exercises.map(exercise => (
                    <div key={exercise.id} className="exercise-result-exercise-item">
                      <div className="exercise-result-exercise-icon">
                        <Dumbbell size={20} />
                      </div>
                      <div className="exercise-result-exercise-info">
                        <span className="exercise-result-exercise-name">
                          {exercise.name}
                        </span>
                        <span className="exercise-result-exercise-detail">
                          {exercise.sets}세트 × {exercise.reps}회 • 휴식 {exercise.restSeconds}초
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      </main>

      {/* 하단 버튼 */}
      <footer className="exercise-result-footer">
        <button 
          className="exercise-result-regenerate-btn"
          onClick={() => setShowRegenerateModal(true)}
        >
          <RefreshCw size={18} />
          재생성
        </button>
        <button 
          className="exercise-result-save-btn"
          onClick={onSave}
        >
          <Check size={18} />
          계획 저장
        </button>
      </footer>

      {/* 재생성 모달 */}
      {showRegenerateModal && (
        <PlanExerciseRegenerateModal
          onClose={() => setShowRegenerateModal(false)}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
}
