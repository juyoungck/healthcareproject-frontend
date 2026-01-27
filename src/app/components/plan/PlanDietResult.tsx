/**
 * PlanDietResult.tsx
 * AI 식단 계획 생성 결과 화면
 * - 일일 영양 목표 (칼로리, 탄/단/지)
 * - 고려된 사항 안내
 * - 요일별 식단 (아침/점심/저녁/간식)
 * - 재생성/저장 버튼
 */

import { useState } from 'react';
import { ArrowLeft, Check, RefreshCw, Flame, ChevronDown, ChevronUp, Utensils } from 'lucide-react';
import type { DietAiResponse, DietDay, DietMeal } from '../../../api/types/ai';

/**
 * Props 타입 정의
 */
interface PlanDietResultProps {
  onBack: () => void;
  onSave: () => void;
  onRegenerate: () => void;
  planData: DietAiResponse;
}

/**
 * 날짜 포맷 함수 (2026-01-17 → 1월 17일 (토))
 */
const formatDate = (logDate: string): string => {
  const date = new Date(logDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${month}월 ${day}일 (${dayOfWeek})`;
};

/**
 * 기간 포맷 함수 (2026-01-16 ~ 2026-01-22 → 1.16 ~ 1.22)
 */
const formatPeriod = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.getMonth() + 1}.${start.getDate()} ~ ${end.getMonth() + 1}.${end.getDate()}`;
};

/**
 * PlanDietResult 컴포넌트
 */
export default function PlanDietResult({ 
  onBack, 
  onSave, 
  onRegenerate,
  planData 
}: PlanDietResultProps) {
  /**
   * 펼쳐진 날짜 상태
   */
  const [expandedDays, setExpandedDays] = useState<number[]>(
    planData.days.map(d => d.dietDayId)
  );

  /**
   * 날짜 펼침/접기 토글
   */
  const toggleDay = (dietDayId: number) => {
    setExpandedDays(prev => {
      if (prev.includes(dietDayId)) {
        return prev.filter(id => id !== dietDayId);
      } else {
        return [...prev, dietDayId];
      }
    });
  };

  /**
   * 전체 평균 칼로리 계산
   */
  const averageCalories = Math.round(
    planData.days.reduce((sum, day) => sum + day.summary.totalCalories, 0) / planData.days.length
  );

  return (
    <div className="diet-result-container">
      {/* 헤더 */}
      <header className="diet-result-header">
        <button className="diet-result-back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="diet-result-title">식단 계획</h1>
        <div className="diet-result-header-spacer" />
      </header>

      {/* 메인 콘텐츠 */}
      <main className="diet-result-content">
        {/* 생성 완료 배너 */}
        <div className="diet-result-banner">
          <Check size={20} />
          <span>{formatPeriod(planData.startDate, planData.endDate)} ({planData.pageInfo.days}일)</span>
        </div>

        {/* 일일 평균 칼로리 */}
        <section className="diet-result-daily-goal">
          <h2 className="diet-result-section-title">일일 평균 칼로리</h2>
          
          <div className="diet-result-calories">
            <Flame size={24} className="diet-result-calories-icon" />
            <span className="diet-result-calories-value">{averageCalories}</span>
            <span className="diet-result-calories-unit">kcal</span>
          </div>
        </section>

        {/* 고려된 사항 */}
        {planData.considerations && planData.considerations.length > 0 && (
          <section className="diet-result-considerations">
            <h3 className="diet-result-considerations-title">
              📋 고려된 사항
            </h3>
            <ul className="diet-result-considerations-list">
              {planData.considerations.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* 날짜별 식단 */}
        <section className="diet-result-daily-meals">
          {planData.days.map((dietDay: DietDay) => (
            <div key={dietDay.dietDayId} className="diet-result-day-card">
              {/* 날짜 헤더 */}
              <button 
                className="diet-result-day-header"
                onClick={() => toggleDay(dietDay.dietDayId)}
              >
                <h4 className="diet-result-day-name">
                  {formatDate(dietDay.logDate)}
                </h4>
                <div className="diet-result-day-meta">
                  <span className="diet-result-day-calories">
                    <Flame size={14} />
                    {dietDay.summary.totalCalories}kcal
                  </span>
                  {expandedDays.includes(dietDay.dietDayId) ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </button>

              {/* 끼니 목록 */}
              {expandedDays.includes(dietDay.dietDayId) && (
                <div className="diet-result-meals">
                  {dietDay.meals.map((meal: DietMeal) => (
                    <div key={meal.dietMealId} className="diet-result-meal-group">
                      {/* 끼니 헤더 */}
                      <div className="diet-result-meal-group-header">
                        🍽 {meal.title}
                        <span className="diet-result-meal-group-calories">
                          {meal.nutrition.calories}kcal
                        </span>
                      </div>
                      {/* 음식 항목들 */}
                      {meal.items.map(item => (
                        <div key={item.dietMealItemId} className="diet-result-meal-item">
                          <div className="diet-result-meal-icon">
                            <Utensils size={20} />
                          </div>
                          <div className="diet-result-meal-center">
                            <p className="diet-result-meal-menu">{item.name}</p>
                            <span className="diet-result-meal-nutrients">
                              {item.grams}g × {item.count}개
                            </span>
                          </div>
                        </div>
                      ))}
                      {/* 끼니 영양소 요약 */}
                      <div className="diet-result-meal-nutrition-summary">
                        탄 {meal.nutrition.carbs}g · 단 {meal.nutrition.protein}g · 지 {meal.nutrition.fat}g
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
      <footer className="diet-result-footer">
        <button 
          className="diet-result-regenerate-btn"
          onClick={onRegenerate}
        >
          <RefreshCw size={18} />
          재생성
        </button>
        <button 
          className="diet-result-save-btn"
          onClick={onSave}
        >
          <Check size={18} />
          저장 완료
        </button>
      </footer>
    </div>
  );
}
