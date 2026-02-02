/**
 * PlanDietCreate.tsx
 * 식단 계획 생성 폼 컴포넌트
 * - 식단 목표 선택 (벌크업/다이어트/체중유지)
 * - 알러지 정보 선택
 * - AI 식단 계획 생성
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Utensils, TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import { getProfile, getAllergies } from '../../../api/me';
import type { GoalType } from '../../../api/types/me';
import { ALLERGY_OPTIONS_WITH_NONE } from '../../../constants/me';

/**
 * Props 타입 정의
 */
interface PlanDietCreateProps {
  onBack: () => void;
  onGenerate: (allergies: string[], note: string) => void;
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
 * 목표 라벨 (API note 전달용)
 */
const GOAL_LABELS: Record<DietGoal, string> = {
  bulk: '벌크업 (근육량 증가를 위한 고칼로리 식단)',
  diet: '다이어트 (체중 감량을 위한 저칼로리 식단)',
  maintain: '체중 유지 (현재 체중 유지 식단)',
};

/**
 * GoalType → DietGoal 매핑
 */
const mapGoalTypeToDietGoal = (goalType: GoalType | null): DietGoal => {
  switch (goalType) {
    case 'DIET':
      return 'diet';
    case 'BULK':
      return 'bulk';
    case 'MAINTAIN':
    case 'FLEXIBILITY':
    default:
      return 'maintain';
  }
};

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

  /*
   * 추가 요청사항
   */
  const [additionalNote, setAdditionalNote] = useState<string>('');

  /**
   * 로딩 상태
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 온보딩 완료 여부
   */
  const [hasOnboardingData, setHasOnboardingData] = useState(true);

  /**
   * 사용자 온보딩 정보 불러오기
   */
  useEffect(() => {
    const loadUserData = async () => {
      try {
        /* 프로필 정보 (목표) */
        const profile = await getProfile();

        /* 온보딩 완료 여부 확인 (필수 값 체크) */
        if (!profile || !profile.heightCm || !profile.weightKg || !profile.age) {
          setHasOnboardingData(false);
          setIsLoading(false);
          return;
        }
        setHasOnboardingData(true);
        
        if (profile?.goalType) {
          setSelectedGoal(mapGoalTypeToDietGoal(profile.goalType));
        }

        /* 알레르기 정보 */
        const allergiesData = await getAllergies();
        if (allergiesData?.allergies && allergiesData.allergies.length > 0) {
          /* NONE 제외한 실제 알레르기가 있는 경우 */
          const userAllergies = allergiesData.allergies.filter(a => a !== 'NONE');
          if (userAllergies.length > 0) {
            setSelectedAllergies(userAllergies);
          } else {
            setSelectedAllergies(['NONE']);
          }
        }
      } catch {
        setHasOnboardingData(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  /**
   * 알러지 토글 핸들러
   */
  const handleAllergyToggle = (allergyId: string) => {
    if (allergyId === 'NONE') {
      setSelectedAllergies(['NONE']);
    } else {
      setSelectedAllergies(prev => {
        const filtered = prev.filter(a => a !== 'NONE');
        if (filtered.includes(allergyId)) {
          const result = filtered.filter(a => a !== allergyId);
          return result.length === 0 ? ['NONE'] : result;
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
    /* NONE 제외한 알레르기만 전달 */
    const allergiesForApi = selectedAllergies.filter(a => a !== 'NONE');

    /* goal + 추가 요청사항을 note로 합침 */
    const goalText = `목표: ${GOAL_LABELS[selectedGoal]}`;
    const combinedNote = additionalNote.trim()
      ? `${goalText}\n추가 요청: ${additionalNote.trim()}`
      : goalText;

    onGenerate(allergiesForApi, combinedNote);
  };

  if (isLoading) {
    return (
      <div className="diet-plan-container">
        <div className="diet-plan-loading">정보를 불러오는 중...</div>
      </div>
    );
  }

  /* 온보딩 미완료 시 안내 */
  if (!hasOnboardingData) {
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

        {/* 온보딩 필요 안내 */}
        <main className="diet-plan-content">
          <div className="onboarding-required-popup">
            <button className="onboarding-required-close" onClick={onBack}>
              <X size={20} />
            </button>
            <div className="onboarding-required-icon">⚠️</div>
            <h2 className="onboarding-required-title">온보딩 정보가 필요합니다</h2>
            <p className="onboarding-required-desc">
              AI 식단 계획을 생성하려면<br />
              먼저 신체 정보를 입력해주세요
            </p>
            <button 
              className="onboarding-required-btn"
              onClick={onBack}
            >
              돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

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
            {ALLERGY_OPTIONS_WITH_NONE.map(allergy => (
              <button
                key={allergy.value}
                className={`diet-plan-allergy-btn ${selectedAllergies.includes(allergy.value) ? 'selected' : ''} ${allergy.value === 'NONE' ? 'none' : ''}`}
                onClick={() => handleAllergyToggle(allergy.value)}
              >
                {allergy.label}
              </button>
            ))}
          </div>
        </section>

        {/* 추가 요청사항 */}
        <section className="diet-plan-section">
          <h2 className="diet-plan-section-title">추가 요청사항 (선택)</h2>
          <textarea
            className="diet-plan-textarea"
            placeholder="예: 채식 위주로 해주세요, 간편식 위주로..."
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
            rows={3}
          />
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