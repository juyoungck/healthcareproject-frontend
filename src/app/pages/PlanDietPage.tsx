/**
 * PlanDietPage.tsx
 * 식단 계획 생성 페이지
 * - 생성 폼 / 로딩 / 결과 화면 전환 관리
 * - AI API 호출 및 상태 관리
 */

import { useState, useCallback } from 'react';
import PlanDietCreate, { DietGoal } from '../components/plan/PlanDietCreate';
import PlanDietLoading from '../components/plan/PlanDietLoading';
import PlanDietResult, { DietPlan } from '../components/plan/PlanDietResult';
import { generateDummyDietPlan } from '../../data/plan';

/**
 * Props 타입 정의
 */
interface PlanDietPageProps {
  onBack: () => void;
  onSavePlan: (plan: DietPlan) => void;
}

/**
 * 현재 화면 타입
 */
type ViewType = 'create' | 'loading' | 'result';

/**
 * PlanDietPage 컴포넌트
 */
export default function PlanDietPage({ onBack, onSavePlan }: PlanDietPageProps) {
  /**
   * 현재 화면 상태
   */
  const [currentView, setCurrentView] = useState<ViewType>('create');

  /**
   * 선택된 식단 목표
   */
  const [selectedGoal, setSelectedGoal] = useState<DietGoal>('diet');

  /**
   * 선택된 알러지
   */
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['none']);

  /**
   * 생성된 계획 데이터
   */
  const [planData, setPlanData] = useState<DietPlan | null>(null);

  /**
   * 추가 요구사항 (재생성 시 사용)
   */
  const [additionalRequest, setAdditionalRequest] = useState<string>('');

  /**
   * 계획 생성 시작 핸들러
   */
  const handleGenerate = (goal: DietGoal, allergies: string[]) => {
    setSelectedGoal(goal);
    setSelectedAllergies(allergies);
    setCurrentView('loading');
  };

  /**
   * 로딩 완료 핸들러
   * TODO: 실제 AI API 호출로 대체
   */
  const handleLoadingComplete = useCallback(() => {
    const plan = generateDummyDietPlan(selectedGoal, selectedAllergies);
    setPlanData(plan);
    setCurrentView('result');
  }, [selectedGoal, selectedAllergies]);

  /**
   * 재생성 핸들러
   */
  const handleRegenerate = (request: string) => {
    setAdditionalRequest(request);
    setCurrentView('loading');
    
    /**
     * TODO: 실제 구현 시 additionalRequest를 AI API에 전달
     */
    console.log('재생성 요청:', request);
  };

  /**
   * 계획 저장 핸들러
   */
  const handleSave = () => {
    if (planData) {
      onSavePlan(planData);
    }
    onBack();
  };

  /**
   * 화면 전환 렌더링
   */
  switch (currentView) {
    case 'loading':
      return <PlanDietLoading onComplete={handleLoadingComplete} />;
    
    case 'result':
      if (!planData) return null;
      return (
        <PlanDietResult
          onBack={() => setCurrentView('create')}
          onSave={handleSave}
          onRegenerate={handleRegenerate}
          planData={planData}
        />
      );
    
    case 'create':
    default:
      return (
        <PlanDietCreate
          onBack={onBack}
          onGenerate={handleGenerate}
        />
      );
  }
}
  