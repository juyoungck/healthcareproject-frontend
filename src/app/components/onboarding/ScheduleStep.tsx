/**
 * ScheduleStep.tsx
 * 온보딩 - 운동 주기 설정 단계
 */

import { Calendar, Clock } from 'lucide-react';
import type { OnboardingData } from '../../../api/types/onboarding';
import { SESSION_TIME_OPTIONS } from '../../../constants/onboarding';

/**
 * Props 타입 정의
 */
interface ScheduleStepProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

/**
 * ScheduleStep 컴포넌트
 */
export default function ScheduleStep({ data, setData }: ScheduleStepProps) {
  return (
    <div className="onboarding-step-content">
      <p className="onboarding-step-desc">
        원하는 운동 주기를 설정해주세요
      </p>

      {/* 주간 운동 일수 */}
      <div className="onboarding-section">
        <label className="onboarding-section-label">
          <Calendar size={16} />
          주간 운동 일수
        </label>
        <div className="onboarding-days-slider">
          <input
            type="range"
            min="1"
            max="7"
            value={data.weeklyDays}
            onChange={(e) => setData({ ...data, weeklyDays: parseInt(e.target.value) })}
            className="onboarding-slider"
          />
          <div className="onboarding-days-display">
            <span className="onboarding-days-value">{data.weeklyDays}</span>
            <span className="onboarding-days-unit">일 / 주</span>
          </div>
        </div>
      </div>

      {/* 1회 운동 시간 */}
      <div className="onboarding-section">
        <label className="onboarding-section-label">
          <Clock size={16} />
          1회 운동 시간
        </label>
        <div className="onboarding-option-grid">
          {SESSION_TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`onboarding-time-btn ${data.sessionMinutes === option.value ? 'active' : ''}`}
              onClick={() => setData({ ...data, sessionMinutes: option.value as OnboardingData['sessionMinutes'] })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
