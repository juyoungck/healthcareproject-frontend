/**
 * PlanDietLoading.tsx
 * AI 식단 계획 생성 중 로딩 화면
 * - 단계별 진행 상태 표시
 * - 로딩 애니메이션
 * - TIP 안내
 */

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, Loader } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface PlanDietLoadingProps {
  onComplete: () => void;
}

/**
 * 로딩 단계 정의
 */
const LOADING_STEPS = [
  { id: 1, text: '신체정보 분석 중' },
  { id: 2, text: '칼로리 및 영양소 계산 중' },
  { id: 3, text: '주간 식단 구성 중' },
];

/**
 * PlanDietLoading 컴포넌트
 */
export default function PlanDietLoading({ onComplete }: PlanDietLoadingProps) {
  /**
   * 현재 진행 단계 (1~3, 무한 반복)
   */
  const [currentStep, setCurrentStep] = useState(1);

  /**
   * API 호출 여부 추적 (중복 호출 방지)
   */
  const apiCalledRef = useRef(false);

  /**
   * 마운트 시 API 호출 시작
   */
  useEffect(() => {
    if (!apiCalledRef.current) {
      apiCalledRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  /**
   * 단계 애니메이션 (무한 루프)
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev >= 3 ? 1 : prev + 1));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  /**
   * 단계 상태 반환
   */
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="diet-loading-container">
      {/* AI 아이콘 */}
      <div className="diet-loading-icon">
        <Sparkles size={48} />
      </div>

      {/* 제목 */}
      <h1 className="diet-loading-title">AI 식단 계획 생성 중</h1>
      <p className="diet-loading-desc">
        목표와 신체정보를 바탕으로<br />
        맞춤형 식단을 만들고 있습니다
      </p>

      {/* 진행 단계 */}
      <div className="diet-loading-steps">
        {LOADING_STEPS.map(step => {
          const status = getStepStatus(step.id);
          return (
            <div key={step.id} className={`diet-loading-step ${status}`}>
              <div className="diet-loading-step-icon">
                {status === 'completed' && <Check size={16} />}
                {status === 'active' && <Loader size={16} className="spinning" />}
                {status === 'pending' && <div className="diet-loading-step-dot" />}
              </div>
              <span className="diet-loading-step-text">{step.text}</span>
            </div>
          );
        })}
      </div>

      {/* TIP 안내 */}
      <div className="diet-loading-tip">
        <span className="diet-loading-tip-icon">💡</span>
        <p className="diet-loading-tip-text">
          <strong>TIP:</strong> AI가 최적의 식단을 생성하고 있습니다. 잠시만 기다려주세요!
        </p>
      </div>
    </div>
  );
}
