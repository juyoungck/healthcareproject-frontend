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
import type { WorkoutAiResponse, WorkoutDay } from '../../../api/types/ai';

/**
 * Props 타입 정의
 */
interface PlanExerciseResultProps {
  onBack: () => void;
  onSave: () => void;
  onRegenerate: () => void;
  planData: WorkoutAiResponse;
}

/**
 * 요일 라벨 매핑 (영문 → 한글)
 */
const DAY_OF_WEEK_LABELS: { [key: string]: string } = {
  'SUN': '일요일',
  'MON': '월요일',
  'TUE': '화요일',
  'WED': '수요일',
  'THU': '목요일',
  'FRI': '금요일',
  'SAT': '토요일',
};

/**
 * 날짜 포맷 함수 (2026-01-17 → 1월 17일 (토))
 */
const formatDateWithDay = (logDate: string, dayOfWeek: string): string => {
  const date = new Date(logDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayLabel = DAY_OF_WEEK_LABELS[dayOfWeek] || dayOfWeek;
  return `${month}월 ${day}일 (${dayLabel.charAt(0)})`;
};

/**
 * PlanExerciseResult 컴포넌트
 */
export default function PlanExerciseResult({ 
  onBack, 
  onSave, 
  onRegenerate,
  planData 
}: PlanExerciseResultProps) {
  /**
   * 펼쳐진 날짜 상태
   */
  const [expandedDays, setExpandedDays] = useState<number[]>(
    planData.days.map(d => d.workoutDayId)
  );

  /**
   * 날짜 펼침/접기 토글
   */
  const toggleDay = (workoutDayId: number) => {
    setExpandedDays(prev => {
      if (prev.includes(workoutDayId)) {
        return prev.filter(id => id !== workoutDayId);
      } else {
        return [...prev, workoutDayId];
      }
    });
  };

  /**
   * 생성 시각 포맷
   */
  const formatGeneratedAt = (generatedAt: string): string => {
    const date = new Date(generatedAt);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}. 생성`;
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
          <span>{formatGeneratedAt(planData.generatedAt)}</span>
        </div>

        {/* 계획 요약 */}
        <section className="exercise-result-summary">
          <h2 className="exercise-result-summary-title">계획 요약</h2>
          <div className="exercise-result-summary-grid">
            <div className="exercise-result-summary-item">
              <span className="exercise-result-summary-value">{planData.planSummary.rangeDays}일</span>
              <span className="exercise-result-summary-label">기간</span>
            </div>
            <div className="exercise-result-summary-item">
              <span className="exercise-result-summary-value">{planData.planSummary.workoutDayCount}일</span>
              <span className="exercise-result-summary-label">운동일</span>
            </div>
          </div>
        </section>

        {/* 고려된 사항 */}
        {planData.considerations && planData.considerations.length > 0 && (
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
        )}

        {/* 날짜별 운동 목록 */}
        <section className="exercise-result-daily-plans">
          {planData.days.map((workoutDay: WorkoutDay) => (
            <div key={workoutDay.workoutDayId} className="exercise-result-day-card">
              {/* 날짜 헤더 */}
              <button 
                className="exercise-result-day-header"
                onClick={() => toggleDay(workoutDay.workoutDayId)}
              >
                <h4 className="exercise-result-day-name">
                  {formatDateWithDay(workoutDay.logDate, workoutDay.dayOfWeek)}
                </h4>
                <div className="exercise-result-day-meta">
                  <span className="exercise-result-day-time">
                    <Clock size={14} />
                    {workoutDay.totalMinutes}분
                  </span>
                  {expandedDays.includes(workoutDay.workoutDayId) ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </button>

              {/* 운동 목록 */}
              {expandedDays.includes(workoutDay.workoutDayId) && (
                <div className="exercise-result-exercises">
                  {/* 카테고리 헤더 */}
                  <div className="exercise-result-category-header">
                    <Dumbbell size={14} />
                    {workoutDay.title}
                  </div>
                  {workoutDay.items.map(item => (
                    <div key={item.workoutItemId} className="exercise-result-exercise-item">
                      <div className="exercise-result-exercise-icon">
                        <Dumbbell size={20} />
                      </div>
                      <div className="exercise-result-exercise-info">
                        <span className="exercise-result-exercise-name">
                          {item.exerciseName}
                        </span>
                        <span className="exercise-result-exercise-detail">
                          {item.amount} • 휴식 {item.restSecond}초
                        </span>
                      </div>
                      {/* 강도 텍스트 */}
                      {item.rpe != null && (
                        <span className="exercise-result-exercise-rpe">
                          강도 {item.rpe}/10
                        </span>
                      )}
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
          onClick={onRegenerate}
        >
          <RefreshCw size={18} />
          재생성
        </button>
        <button 
          className="exercise-result-save-btn"
          onClick={onSave}
        >
          <Check size={18} />
          저장 완료
        </button>
      </footer>
    </div>
  );
}
