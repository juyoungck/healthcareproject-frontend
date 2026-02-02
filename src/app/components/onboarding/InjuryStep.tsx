/**
 * InjuryStep.tsx
 * 온보딩 - 부상 이력 입력 단계
 */

import { AlertTriangle, Trash2, Plus } from 'lucide-react';
import type { OnboardingData } from '../../../api/types/onboarding';
import { INJURY_SEVERITY_OPTIONS } from '../../../constants/onboarding';

/**
 * Props 타입 정의
 */
interface InjuryStepProps {
  data: OnboardingData;
  handleHasInjuryChange: (hasInjury: boolean) => void;
  addInjury: () => void;
  removeInjury: (id: number) => void;
  updateInjury: (id: number, field: 'part' | 'severity', value: string) => void;
}

/**
 * InjuryStep 컴포넌트
 */
export default function InjuryStep({
  data,
  handleHasInjuryChange,
  addInjury,
  removeInjury,
  updateInjury
}: InjuryStepProps) {
  return (
    <div className="onboarding-step-content">
      <p className="onboarding-step-desc">
        부상 이력이 있다면 알려주세요<br />안전한 운동 추천에 활용됩니다
      </p>

      {/* 부상 여부 선택 */}
      <div className="onboarding-section">
        <label className="onboarding-section-label">
          <AlertTriangle size={16} />
          부상 여부
        </label>
        <div className="onboarding-toggle-group">
          <button
            className={`onboarding-toggle-btn ${!data.hasInjury ? 'active' : ''}`}
            onClick={() => handleHasInjuryChange(false)}
          >
            없음
          </button>
          <button
            className={`onboarding-toggle-btn ${data.hasInjury ? 'active' : ''}`}
            onClick={() => handleHasInjuryChange(true)}
          >
            있음
          </button>
        </div>
      </div>

      {/* 부상 목록 (있음 선택 시) */}
      {data.hasInjury && (
        <div className="onboarding-section">
          <label className="onboarding-section-label">
            부상 정보
          </label>

          <div className="onboarding-injury-list">
            {data.injuries.map((injury, index) => (
              <div key={injury.id} className="onboarding-injury-item">
                {/* 부상 헤더 */}
                <div className="onboarding-injury-header">
                  <span className="onboarding-injury-number">부상 {index + 1}</span>
                  {data.injuries.length > 1 && (
                    <button
                      className="onboarding-injury-delete"
                      onClick={() => removeInjury(injury.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* 부상 부위 입력 */}
                <input
                  type="text"
                  className="onboarding-text-input"
                  placeholder="부상 부위 (예: 허리, 무릎, 어깨)"
                  value={injury.part}
                  onChange={(e) => updateInjury(injury.id, 'part', e.target.value)}
                />

                {/* 부상 정도 선택 */}
                <div className="onboarding-injury-severity">
                  {INJURY_SEVERITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      className={`onboarding-severity-btn ${injury.severity === option.value ? 'active' : ''}`}
                      onClick={() => updateInjury(injury.id, 'severity', option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 부상 추가 버튼 */}
          <button className="onboarding-injury-add" onClick={addInjury}>
            <Plus size={18} />
            부상 추가하기
          </button>
        </div>
      )}
    </div>
  );
}
