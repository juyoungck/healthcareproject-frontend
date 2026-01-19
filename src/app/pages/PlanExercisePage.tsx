/**
 * PlanExercisePage.tsx
 * 운동 계획 생성 페이지
 * - 생성 폼 / 로딩 / 결과 화면 전환 관리
 * - AI API 호출 및 상태 관리
 */

import { useState, useCallback } from 'react';
import PlanExerciseCreate from '../components/plan/PlanExerciseCreate';
import PlanExerciseLoading from '../components/plan/PlanExerciseLoading';
import PlanExerciseResult, { ExercisePlan } from '../components/plan/PlanExerciseResult';
import { generateDummyExercisePlan } from '../../data/plan';

/**
 * Props 타입 정의
 */
interface PlanExercisePageProps {
  onBack: () => void;
  onSavePlan: (plan: ExercisePlan) => void;
}

/**
 * 현재 화면 타입
 */
type ViewType = 'create' | 'loading' | 'result';

/**
 * PlanExercisePage 컴포넌트
 */
export default function PlanExercisePage({ onBack, onSavePlan }: PlanExercisePageProps) {
  /**
   * 현재 화면 상태
   */
  const [currentView, setCurrentView] = useState<ViewType>('create');

  /**
   * 선택된 요일
   */
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  /**
   * 생성된 계획 데이터
   */
  const [planData, setPlanData] = useState<ExercisePlan | null>(null);

  /**
   * 추가 요구사항 (재생성 시 사용)
   */
  const [additionalRequest, setAdditionalRequest] = useState<string>('');

  /**
   * 계획 생성 시작 핸들러
   */
  const handleGenerate = (days: number[]) => {
    setSelectedDays(days);
    setCurrentView('loading');
  };

  /**
   * 로딩 완료 핸들러
   * TODO: 실제 AI API 호출로 대체
   */
  const handleLoadingComplete = useCallback(() => {
    const plan = generateDummyExercisePlan(selectedDays);
    setPlanData(plan);
    setCurrentView('result');
  }, [selectedDays]);

  /**
   * 재생성 핸들러
   */
  const handleRegenerate = (request: string) => {
    setAdditionalRequest(request);
    setCurrentView('loading');
    
    /**
     * TODO: 실제 구현 시 additionalRequest를 AI API에 전달
     * AI가 기존 온보딩 정보 + 추가 요구사항을 함께 고려하여 재생성
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
      return <PlanExerciseLoading onComplete={handleLoadingComplete} />;
    
    case 'result':
      if (!planData) return null;
      return (
        <PlanExerciseResult
          onBack={() => setCurrentView('create')}
          onSave={handleSave}
          onRegenerate={handleRegenerate}
          planData={planData}
        />
      );
    
    case 'create':
    default:
      return (
        <PlanExerciseCreate
          onBack={onBack}
          onGenerate={handleGenerate}
        />
      );
  }
}