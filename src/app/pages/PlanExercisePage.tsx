/**
 * PlanExercisePage.tsx
 * 운동 계획 생성 페이지
 * - 생성 폼 / 로딩 / 결과 화면 전환 관리
 * - AI API 호출 및 상태 관리
 */

import { useState, useCallback } from 'react';
import PlanExerciseCreate from '../components/plan/PlanExerciseCreate';
import PlanExerciseLoading from '../components/plan/PlanExerciseLoading';
import PlanExerciseResult from '../components/plan/PlanExerciseResult';
import { generateWorkoutPlan } from '../../api/ai';
import type { WorkoutAiResponse } from '../../api/types/ai';

/**
 * Props 타입 정의
 */
interface PlanExercisePageProps {
  onBack: () => void;
}

/**
 * 현재 화면 타입
 */
type ViewType = 'create' | 'loading' | 'result';

/**
 * PlanExercisePage 컴포넌트
 */
export default function PlanExercisePage({ onBack }: PlanExercisePageProps) {
  /**
   * 현재 화면 상태
   */
  const [currentView, setCurrentView] = useState<ViewType>('create');

  /**
   * 선택된 날짜 배열 (ISO 문자열)
   */
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  /**
   * 추가 요청사항
   */
  const [additionalRequest, setAdditionalRequest] = useState<string>('');

  /**
   * 생성된 계획 데이터
   */
  const [planData, setPlanData] = useState<WorkoutAiResponse | null>(null);

  /**
   * 에러 상태
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * 계획 생성 시작 핸들러
   */
  const handleGenerate = (dates: string[], request: string) => {
    setSelectedDates(dates);
    setAdditionalRequest(request);
    setError(null);
    setCurrentView('loading');
  };

  /**
   * API 호출 및 로딩 완료 핸들러
   */
  const handleLoadingComplete = useCallback(async () => {
    try {
      const response = await generateWorkoutPlan({
        dates: selectedDates,
        additionalRequest: additionalRequest || null,
      });
      setPlanData(response);
      setCurrentView('result');
    } catch (err: any) {
      console.error('운동 계획 생성 실패:', err);
      const errorMessage = err.response?.data?.message || '운동 계획 생성에 실패했습니다.';
      setError(errorMessage);
      setCurrentView('create');
      alert(errorMessage);
    }
  }, [selectedDates, additionalRequest]);

  /**
   * 재생성 핸들러
   */
  const handleRegenerate = () => {
    setCurrentView('loading');
  };

  /**
   * 계획 저장 핸들러
   * - API 응답이 이미 저장된 상태이므로 화면만 이동
   */
  const handleSave = () => {
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