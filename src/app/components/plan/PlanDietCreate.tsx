/**
 * PlanDietCreate.tsx
 * 식단 계획 생성 폼 컴포넌트
 * - 식단 목표 선택 (벌크업/다이어트/체중유지)
 * - 알러지 정보 선택
 * - AI 식단 계획 생성
 */

import { useState } from 'react';
import { ArrowLeft, Utensils, TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface PlanDietCreateProps {
  onBack: () => void;
  onGenerate: (goal: DietGoal, allergies: string[]) => void;
}

/**
 * 식단 목표 타입
 */
export type DietGoal = 'bulk' | 'diet' | 'maintain';

/**
 * 식단 목표 데이터
 */
const DIET_GOALS = [
  { 
    id: 'bulk' as DietGoal, 
    label: '벌크업', 
    desc: '근육량 증가를 위한 고칼로리',
    icon: TrendingUp,
    color: 'blue'
  },
  { 
    id: 'diet' as DietGoal, 
    label: '다이어트', 
    desc: '체중 감량을 위한 저칼로리',
    icon: TrendingDown,
    color: 'red'
  },
  { 
    id: 'maintain' as DietGoal, 
    label: '체중 유지', 
    desc: '현재 체중 유지 식단',
    icon: Minus,
    color: 'gray'
  },
];

/**
 * 알러지 데이터
 */
const ALLERGIES = [
  { id: 'peanut', label: '땅콩' },
  { id: 'milk', label: '우유' },
  { id: 'egg', label: '달걀' },
  { id: 'shellfish', label: '갑각류' },
  { id: 'wheat', label: '밀가루' },
  { id: 'soy', label: '대두' },
  { id: 'nuts', label: '견과류' },
  { id: 'none', label: '없음' },
];

/**
 * PlanDietCreate 컴포넌트
 */
export default function PlanDietCreate({ 
  onBack, 
  onGenerate 
}: PlanDietCreateProps) {
  /**
   * 선택된 식단 목표
   */
  const [selectedGoal, setSelectedGoal] = useState<DietGoal>('diet');

  /**
   * 선택된 알러지
   */
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['none']);

  /**
   * 알러지 토글 핸들러
   */
  const handleAllergyToggle = (allergyId: string) => {
    if (allergyId === 'none') {
      setSelectedAllergies(['none']);
    } else {
      setSelectedAllergies(prev => {
        const filtered = prev.filter(a => a !== 'none');
        if (filtered.includes(allergyId)) {
          const result = filtered.filter(a => a !== allergyId);
          return result.length === 0 ? ['none'] : result;
        } else {
          return [...filtered, allergyId];
        }
      });
    }
  };

  /**
   * 계획 생성 핸들러
   */
  const handleGenerate = () => {
    onGenerate(selectedGoal, selectedAllergies);
  };

  return (
    <div className="diet-plan-container">
      {/* 헤더 */}
      <header className="diet-plan-header">
        <button className="diet-plan-back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="diet-plan-title">식단 계획 생성</h1>
        <div className="diet-plan-header-spacer" />
      </header>

      {/* 메인 콘텐츠 */}
      <main className="diet-plan-content">
        {/* 소개 배너 */}
        <div className="diet-plan-banner">
          <Utensils className="diet-plan-banner-icon" />
          <p className="diet-plan-banner-text">맞춤형 식단을 생성합니다!</p>
        </div>

        {/* 식단 목표 선택 */}
        <section className="diet-plan-section">
          <h2 className="diet-plan-section-title">식단 목표를 선택하세요</h2>

          <div className="diet-plan-goals">
            {DIET_GOALS.map(goal => {
              const Icon = goal.icon;
              return (
                <button
                  key={goal.id}
                  className={`diet-plan-goal-btn ${selectedGoal === goal.id ? 'selected' : ''} ${goal.color}`}
                  onClick={() => setSelectedGoal(goal.id)}
                >
                  <div className={`diet-plan-goal-icon ${goal.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="diet-plan-goal-info">
                    <span className="diet-plan-goal-label">{goal.label}</span>
                    <span className="diet-plan-goal-desc">{goal.desc}</span>
                  </div>
                  <div className={`diet-plan-goal-check ${selectedGoal === goal.id ? 'checked' : ''}`}>
                    {selectedGoal === goal.id && <span className="diet-plan-goal-check-icon">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 알러지 정보 선택 */}
        <section className="diet-plan-section">
          <h2 className="diet-plan-section-title">알러지 정보를 확인하세요</h2>
          <p className="diet-plan-section-desc">선택한 알러지 식품은 식단에서 제외됩니다</p>

          <div className="diet-plan-allergies">
            {ALLERGIES.map(allergy => (
              <button
                key={allergy.id}
                className={`diet-plan-allergy-btn ${selectedAllergies.includes(allergy.id) ? 'selected' : ''} ${allergy.id === 'none' ? 'none' : ''}`}
                onClick={() => handleAllergyToggle(allergy.id)}
              >
                {allergy.label}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* 하단 버튼 */}
      <footer className="diet-plan-footer">
        <button 
          className="diet-plan-generate-btn"
          onClick={handleGenerate}
        >
          <Utensils size={20} />
          AI 식단 계획 생성하기
        </button>
      </footer>
    </div>
  );
}
