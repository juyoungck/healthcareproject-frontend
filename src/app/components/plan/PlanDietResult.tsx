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
import PlanDietRegenerateModal from './PlanDietRegenerateModal';

/**
 * Props 타입 정의
 */
interface PlanDietResultProps {
  onBack: () => void;
  onSave: () => void;
  onRegenerate: (additionalRequest: string) => void;
  planData: DietPlan;
}

/**
 * 식단 계획 타입
 */
export interface DietPlan {
  createdAt: string;
  dailyCalories: number;
  macros: {
    carb: number;      /* 탄수화물 비율 % */
    protein: number;   /* 단백질 비율 % */
    fat: number;       /* 지방 비율 % */
  };
  considerations: string[];
  dailyMeals: DailyMeal[];
}

/**
 * 일별 식단 타입
 */
export interface DailyMeal {
  dayName: string;
  totalCalories: number;
  meals: Meal[];
}

/**
 * 끼니 타입
 */
export interface Meal {
  id: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'snack2';
  typeLabel: string;
  menu: string;
  calories: number;
  nutrients: {
    carb: number;
    protein: number;
    fat: number;
  };
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
 * PlanDietResult 컴포넌트
 */
export default function PlanDietResult({ 
  onBack, 
  onSave, 
  onRegenerate,
  planData 
}: PlanDietResultProps) {
 /**
   * 재생성 모달 상태
   */
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  /**
   * 펼쳐진 요일 상태
   */
  const [expandedDays, setExpandedDays] = useState<string[]>(
    planData.dailyMeals.map(p => p.dayName)
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
   * 끼니별 그룹화 함수
   */
  const groupMealsByType = (meals: Meal[]) => {
    const groups: { [key: string]: Meal[] } = {};
    meals.forEach(meal => {
      if (!groups[meal.type]) {
        groups[meal.type] = [];
      }
      groups[meal.type].push(meal);
    });
    return groups;
  };

  /**
   * 재생성 핸들러
   */
  const handleRegenerate = (additionalRequest: string) => {
    setShowRegenerateModal(false);
    onRegenerate(additionalRequest);
  };

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
          <span>{planData.createdAt}</span>
        </div>

        {/* 일일 영양 목표 */}
        <section className="diet-result-daily-goal">
          <h2 className="diet-result-section-title">일일 영양 목표</h2>
          
          {/* 칼로리 */}
          <div className="diet-result-calories">
            <Flame size={24} className="diet-result-calories-icon" />
            <span className="diet-result-calories-value">{planData.dailyCalories}</span>
            <span className="diet-result-calories-unit">kcal</span>
          </div>
          <p className="diet-result-calories-label">일일 권장 칼로리</p>

          {/* 영양소 비율 */}
          <div className="diet-result-macros">
            {/* 탄수화물 */}
            <div className="diet-result-macro">
              <div className="diet-result-macro-header">
                <span className="diet-result-macro-label">탄수화물</span>
                <span className="diet-result-macro-value carb">{planData.macros.carb}%</span>
              </div>
              <div className="diet-result-macro-bar">
                <div 
                  className="diet-result-macro-fill carb" 
                  style={{ width: `${planData.macros.carb}%` }}
                />
              </div>
            </div>

            {/* 단백질 */}
            <div className="diet-result-macro">
              <div className="diet-result-macro-header">
                <span className="diet-result-macro-label">단백질</span>
                <span className="diet-result-macro-value protein">{planData.macros.protein}%</span>
              </div>
              <div className="diet-result-macro-bar">
                <div 
                  className="diet-result-macro-fill protein" 
                  style={{ width: `${planData.macros.protein}%` }}
                />
              </div>
            </div>

            {/* 지방 */}
            <div className="diet-result-macro">
              <div className="diet-result-macro-header">
                <span className="diet-result-macro-label">지방</span>
                <span className="diet-result-macro-value fat">{planData.macros.fat}%</span>
              </div>
              <div className="diet-result-macro-bar">
                <div 
                  className="diet-result-macro-fill fat" 
                  style={{ width: `${planData.macros.fat}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 고려된 사항 */}
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

        {/* 요일별 식단 */}
        <section className="diet-result-daily-meals">
          {planData.dailyMeals.map(dailyMeal => (
            <div key={dailyMeal.dayName} className="diet-result-day-card">
              {/* 요일 헤더 - 클릭 가능 */}
              <button 
                className="diet-result-day-header"
                onClick={() => toggleDay(dailyMeal.dayName)}
              >
                <h4 className="diet-result-day-name">
                  {DAY_LABELS[dailyMeal.dayName] || dailyMeal.dayName}
                </h4>
                <div className="diet-result-day-meta">
                  <span className="diet-result-day-calories">
                    <Flame size={14} />
                    {dailyMeal.totalCalories}kcal
                  </span>
                  {expandedDays.includes(dailyMeal.dayName) ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </button>

              {/* 끼니 목록 - 펼쳐진 경우만 표시 */}
              {expandedDays.includes(dailyMeal.dayName) && (
                <div className="diet-result-meals">
                  {Object.entries(groupMealsByType(dailyMeal.meals)).map(([type, meals]) => (
                    <div key={type} className="diet-result-meal-group">
                      {/* 끼니 그룹 헤더 */}
                      <div className="diet-result-meal-group-header">
                        🍽 {meals[0].typeLabel}
                      </div>
                      {/* 해당 끼니의 메뉴들 */}
                      {meals.map(meal => (
                        <div key={meal.id} className="diet-result-meal-item">
                          <div className="diet-result-meal-icon">
                            <Utensils size={20} />
                          </div>
                          <div className="diet-result-meal-center">
                            <p className="diet-result-meal-menu">{meal.menu}</p>
                            <span className="diet-result-meal-nutrients">
                              탄 {meal.nutrients.carb}g 단 {meal.nutrients.protein}g 지 {meal.nutrients.fat}g
                            </span>
                          </div>
                          <span className="diet-result-meal-calories">{meal.calories}kcal</span>
                        </div>
                      ))}
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
          onClick={() => setShowRegenerateModal(true)}
        >
          <RefreshCw size={18} />
          재생성
        </button>
        <button 
          className="diet-result-save-btn"
          onClick={onSave}
        >
          <Check size={18} />
          계획 저장
        </button>
      </footer>

      {/* 재생성 모달 */}
      {showRegenerateModal && (
        <PlanDietRegenerateModal
          onClose={() => setShowRegenerateModal(false)}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
}
