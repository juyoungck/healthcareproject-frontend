/**
 * PlanDietPage.tsx
 * 식단 계획 생성 페이지
 * - 생성 폼 / 로딩 / 결과 화면 전환 관리
 * - AI API 호출 및 상태 관리
 */

import { useState, useCallback } from 'react';
import PlanDietCreate, { DietGoal } from '../components/plan/PlanDietCreate';
import PlanDietLoading from '../components/plan/PlanDietLoading';
import PlanDietResult from '../components/plan/PlanDietResult';
import { generateDietPlan } from '../../api/ai';
import type { DietAiResponse } from '../../api/types/ai';

/**
 * Props 타입 정의
 */
interface PlanDietPageProps {
  onBack: () => void;
}

/**
 * 현재 화면 타입
 */
type ViewType = 'create' | 'loading' | 'result';

/**
 * PlanDietPage 컴포넌트
 */
export default function PlanDietPage({ onBack }: PlanDietPageProps) {
  /**
   * 현재 화면 상태
   */
  const [currentView, setCurrentView] = useState<ViewType>('create');

  /**
   * 선택된 알레르기
   */
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  /**
   * 추가 요청사항 (goal 포함)
   */
  const [note, setNote] = useState<string>('');

  /**
   * 생성된 계획 데이터
   */
  const [planData, setPlanData] = useState<DietAiResponse | null>(null);

  /**
   * 에러 상태
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * 계획 생성 시작 핸들러
   */
  const handleGenerate = (allergies: string[], combinedNote: string) => {
    setSelectedAllergies(allergies);
    setNote(combinedNote);
    setError(null);
    setCurrentView('loading');
  };

  /**
   * API 호출 및 로딩 완료 핸들러
   */
  const handleLoadingComplete = useCallback(async () => {
    try {
      const response = await generateDietPlan({
        allergies: selectedAllergies,
        note: note || null,
      });
      setPlanData(response);
      setCurrentView('result');
    } catch (err: any) {
      console.error('식단 계획 생성 실패:', err);
      const errorMessage = err.response?.data?.message || '식단 계획 생성에 실패했습니다.';
      setError(errorMessage);
      setCurrentView('create');
      alert(errorMessage);
    }
  }, [selectedAllergies, note]);

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