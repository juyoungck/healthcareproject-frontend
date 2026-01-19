/**
 * ExercisePlanLoading.tsx
 * AI 운동 계획 생성 중 로딩 화면
 * - 단계별 진행 상태 표시
 * - 로딩 애니메이션
 * - TIP 안내
 */

import { useState, useEffect } from 'react';
import { Sparkles, Check, Loader } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface ExercisePlanLoadingProps {
  onComplete: () => void;
}

/**
 * 로딩 단계 정의
 */
const LOADING_STEPS = [
  { id: 1, text: '온보딩 정보 분석 완료' },
  { id: 2, text: '맞춤형 운동 선별 중' },
  { id: 3, text: '주간 스케줄 최적화' },
];

/**
 * ExercisePlanLoading 컴포넌트
 */
export default function ExercisePlanLoading({ onComplete }: ExercisePlanLoadingProps) {
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
    <div className="exercise-loading-container">
      {/* AI 아이콘 */}
      <div className="exercise-loading-icon">
        <Sparkles size={48} />
      </div>

      {/* 제목 */}
      <h1 className="exercise-loading-title">AI 운동 계획 생성 중</h1>
      <p className="exercise-loading-desc">
        입력하신 정보를 바탕으로<br />
        맞춤형 운동 계획을 만들고 있습니다
      </p>

      {/* 진행 단계 */}
      <div className="exercise-loading-steps">
        {LOADING_STEPS.map(step => {
          const status = getStepStatus(step.id);
          return (
            <div key={step.id} className={`exercise-loading-step ${status}`}>
              <div className="exercise-loading-step-icon">
                {status === 'completed' && <Check size={16} />}
                {status === 'active' && <Loader size={16} className="spinning" />}
                {status === 'pending' && <div className="exercise-loading-step-dot" />}
              </div>
              <span className="exercise-loading-step-text">{step.text}</span>
            </div>
          );
        })}
      </div>

      {/* TIP 안내 */}
      <div className="exercise-loading-tip">
        <span className="exercise-loading-tip-icon">💡</span>
        <p className="exercise-loading-tip-text">
          <strong>TIP:</strong> 생성된 계획이 마음에 들지 않으면 언제든 재생성할 수 있습니다!
        </p>
      </div>
    </div>
  );
}
