/**
 * BodyStep.tsx
 * 온보딩 - 신체 정보 입력 단계
 */

import { Ruler, Weight, Calendar, Users, AlertTriangle } from 'lucide-react';
import type { OnboardingData } from '../../../api/types/onboarding';
import { ALLERGY_OPTIONS } from '../../../constants/me';

/**
 * Props 타입 정의
 */
interface BodyStepProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  toggleAllergy: (allergyValue: string) => void;
}

/**
 * BodyStep 컴포넌트
 */
export default function BodyStep({ data, setData, toggleAllergy }: BodyStepProps) {
  return (
    <div className="onboarding-step-content">
      <p className="onboarding-step-desc">
        맞춤 운동과 식단 추천을 위해<br />신체 정보를 입력해주세요
      </p>

      {/* 키, 몸무게, 나이 */}
      <div className="onboarding-input-grid">
        <div className="onboarding-input-group">
          <label className="onboarding-input-label">
            <Ruler size={16} />
            키
          </label>
          <div className="onboarding-input-wrapper">
            <input
              type="number"
              className="onboarding-input"
              placeholder="0"
              value={data.heightCm}
              onChange={(e) => setData({ ...data, heightCm: e.target.value })}
            />
            <span className="onboarding-input-unit">cm</span>
          </div>
        </div>

        <div className="onboarding-input-group">
          <label className="onboarding-input-label">
            <Weight size={16} />
            몸무게
          </label>
          <div className="onboarding-input-wrapper">
            <input
              type="number"
              className="onboarding-input"
              placeholder="0"
              value={data.weightKg}
              onChange={(e) => setData({ ...data, weightKg: e.target.value })}
            />
            <span className="onboarding-input-unit">kg</span>
          </div>
        </div>

        <div className="onboarding-input-group">
          <label className="onboarding-input-label">
            <Calendar size={16} />
            나이
          </label>
          <div className="onboarding-input-wrapper">
            <input
              type="number"
              className="onboarding-input"
              placeholder="0"
              value={data.age}
              onChange={(e) => setData({ ...data, age: e.target.value })}
            />
            <span className="onboarding-input-unit">세</span>
          </div>
        </div>
      </div>

      {/* 성별 선택 */}
      <div className="onboarding-section">
        <label className="onboarding-section-label">
          <Users size={16} />
          성별
        </label>
        <div className="onboarding-toggle-group">
          <button
            className={`onboarding-toggle-btn ${data.gender === 'male' ? 'active' : ''}`}
            onClick={() => setData({ ...data, gender: 'male' })}
          >
            남성
          </button>
          <button
            className={`onboarding-toggle-btn ${data.gender === 'female' ? 'active' : ''}`}
            onClick={() => setData({ ...data, gender: 'female' })}
          >
            여성
          </button>
        </div>
      </div>

      {/* 알레르기 선택 */}
      <div className="onboarding-section">
        <label className="onboarding-section-label">
          <AlertTriangle size={16} />
          알레르기 (선택)
        </label>
        <div className="onboarding-chip-group">
          {ALLERGY_OPTIONS.map((allergy) => (
            <button
              key={allergy.value}
              className={`onboarding-chip ${data.allergies.includes(allergy.value) ? 'active' : ''}`}
              onClick={() => toggleAllergy(allergy.value)}
            >
              {allergy.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
