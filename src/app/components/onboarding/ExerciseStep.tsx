/**
 * ExerciseStep.tsx
 * 온보딩 - 운동 경력 및 목표 선택 단계
 */

import { Dumbbell, Target } from 'lucide-react';
import type { OnboardingData } from '../../../api/types/onboarding';
import { EXPERIENCE_OPTIONS, GOAL_OPTIONS } from '../../../constants/onboarding';

/**
 * Props 타입 정의
 */
interface ExerciseStepProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

/**
 * ExerciseStep 컴포넌트
 */
export default function ExerciseStep({ data, setData }: ExerciseStepProps) {
  return (
    <div className="onboarding-step-content">
      <p className="onboarding-step-desc">
        운동 경력과 목표를 선택해주세요
      </p>

      {/* 운동 경력 */}
      <div className="onboarding-section">
        <label className="onboarding-section-label">
          <Dumbbell size={16} />
          운동 경력
        </label>
        <div className="onboarding-option-grid">
          {EXPERIENCE_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`onboarding-option-btn ${data.experienceLevel === option.value ? 'active' : ''}`}
              onClick={() => setData({ ...data, experienceLevel: option.value as OnboardingData['experienceLevel'] })}
            >
              <span className="onboarding-option-label">{option.label}</span>
              <span className="onboarding-option-desc">{option.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 운동 목표 */}
      <div className="onboarding-section">
        <label className="onboarding-section-label">
          <Target size={16} />
          운동 목표
        </label>
        <div className="onboarding-option-grid">
          {GOAL_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`onboarding-option-btn ${data.goalType === option.value ? 'active' : ''}`}
              onClick={() => setData({ ...data, goalType: option.value as OnboardingData['goalType'] })}
            >
              <span className="onboarding-option-label">{option.label}</span>
              <span className="onboarding-option-desc">{option.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
