/**
 * ConfirmStep.tsx
 * 온보딩 - 정보 확인 단계
 */

import type { OnboardingData } from '../../../api/types/onboarding';
import { ALLERGY_OPTIONS } from '../../../constants/me';
import {
  EXPERIENCE_OPTIONS,
  GOAL_OPTIONS,
  SESSION_TIME_OPTIONS,
  INJURY_SEVERITY_OPTIONS
} from '../../../constants/onboarding';

/**
 * Props 타입 정의
 */
interface ConfirmStepProps {
  data: OnboardingData;
}

/**
 * 라벨 찾기 헬퍼 함수
 */
const getLabel = <T extends { value: string; label: string }>(
  options: readonly T[],
  value: string | null
): string => {
  return options.find(opt => opt.value === value)?.label || '-';
};

/**
 * ConfirmStep 컴포넌트
 */
export default function ConfirmStep({ data }: ConfirmStepProps) {
  return (
    <div className="onboarding-step-content">
      <p className="onboarding-step-desc">
        입력하신 정보를 확인해주세요
      </p>

      <div className="onboarding-confirm-list">
        {/* 신체 정보 */}
        <div className="onboarding-confirm-section">
          <h4 className="onboarding-confirm-title">신체 정보</h4>
          <div className="onboarding-confirm-grid">
            <div className="onboarding-confirm-item">
              <span className="onboarding-confirm-label">키</span>
              <span className="onboarding-confirm-value">{data.heightCm}cm</span>
            </div>
            <div className="onboarding-confirm-item">
              <span className="onboarding-confirm-label">몸무게</span>
              <span className="onboarding-confirm-value">{data.weightKg}kg</span>
            </div>
            <div className="onboarding-confirm-item">
              <span className="onboarding-confirm-label">나이</span>
              <span className="onboarding-confirm-value">{data.age}세</span>
            </div>
            <div className="onboarding-confirm-item">
              <span className="onboarding-confirm-label">성별</span>
              <span className="onboarding-confirm-value">
                {data.gender === 'male' ? '남성' : data.gender === 'female' ? '여성' : '-'}
              </span>
            </div>
          </div>
          {data.allergies.length > 0 && (
            <div className="onboarding-confirm-tags">
              <span className="onboarding-confirm-label">알레르기</span>
              <div className="onboarding-confirm-tag-list">
                {data.allergies.map((allergyValue) => {
                  const allergyOption = ALLERGY_OPTIONS.find(opt => opt.value === allergyValue);
                  return (
                    <span key={allergyValue} className="onboarding-confirm-tag">
                      {allergyOption?.label || allergyValue}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 운동 정보 */}
        <div className="onboarding-confirm-section">
          <h4 className="onboarding-confirm-title">운동 정보</h4>
          <div className="onboarding-confirm-row">
            <span className="onboarding-confirm-label">운동 경력</span>
            <span className="onboarding-confirm-value">
              {getLabel(EXPERIENCE_OPTIONS, data.experienceLevel)}
            </span>
          </div>
          <div className="onboarding-confirm-row">
            <span className="onboarding-confirm-label">운동 목표</span>
            <span className="onboarding-confirm-value">
              {getLabel(GOAL_OPTIONS, data.goalType)}
            </span>
          </div>
          <div className="onboarding-confirm-row">
            <span className="onboarding-confirm-label">운동 주기</span>
            <span className="onboarding-confirm-value">
              주 {data.weeklyDays}일, {getLabel(SESSION_TIME_OPTIONS, data.sessionMinutes)}
            </span>
          </div>
        </div>

        {/* 부상 정보 */}
        <div className="onboarding-confirm-section">
          <h4 className="onboarding-confirm-title">부상 이력</h4>
          {!data.hasInjury ? (
            <div className="onboarding-confirm-row">
              <span className="onboarding-confirm-label">부상 여부</span>
              <span className="onboarding-confirm-value">없음</span>
            </div>
          ) : (
            <div className="onboarding-confirm-injuries">
              {data.injuries.map((injury, index) => (
                <div key={injury.id} className="onboarding-confirm-injury">
                  <span className="onboarding-confirm-injury-part">
                    {index + 1}. {injury.part}
                  </span>
                  <span className={`onboarding-confirm-injury-severity ${injury.severity}`}>
                    {getLabel(INJURY_SEVERITY_OPTIONS, injury.severity)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
