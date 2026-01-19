/**
 * PlanDietLoading.tsx
 * AI 식단 계획 생성 중 로딩 화면
 * - 단계별 진행 상태 표시
 * - 로딩 애니메이션
 * - TIP 안내
 */

import { useState, useEffect } from 'react';
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
  { id: 1, text: '신체정보 분석 완료' },
  { id: 2, text: '칼로리 및 영양소 계산 중' },
  { id: 3, text: '주간 식단 구성' },
];

/**
 * PlanDietLoading 컴포넌트
 */
export default function PlanDietLoading({ onComplete }: PlanDietLoadingProps) {
  /**
   * 현재 진행 단계 (1~3)
   */
  const [currentStep, setCurrentStep] = useState(1);

  /**
   * 단계별 진행 시뮬레이션
   * TODO: 실제 API 호출 상태와 연동
   */
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 1500);
    const timer2 = setTimeout(() => setCurrentStep(3), 3000);
    const timer3 = setTimeout(() => onComplete(), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

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
          <strong>TIP:</strong> 식단이 마음에 들지 않으면 언제든 재생성할 수 있습니다!
        </p>
      </div>
    </div>
  );
}
