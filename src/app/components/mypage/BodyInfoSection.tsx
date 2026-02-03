/**
 * BodyInfoSection.tsx
 * 신체/운동 정보 섹션
 */

import { ChevronRight, Dumbbell, Target, Calendar, AlertTriangle } from 'lucide-react';
import type { ProfileResponse, InjuryItem } from '../../../api/types/me';
import {
  getGenderLabel,
  getExperienceLevelLabel,
  getGoalTypeLabel,
  getInjuryLevelLabel,
  getAllergyLabel,
} from '../../../utils/label';
import { formatSessionTime } from '../../../utils/format';

/**
 * Props 타입 정의
 */
interface BodyInfoSectionProps {
  profile: ProfileResponse | null;
  injuries: InjuryItem[];
  allergies: string[];
  onEditOnboarding: () => void;
}

/**
 * BodyInfoSection 컴포넌트
 */
export default function BodyInfoSection({
  profile,
  injuries,
  allergies,
  onEditOnboarding,
}: BodyInfoSectionProps) {
  return (
    <div className="mypage-section">
      <div className="mypage-section-header">
        <h3 className="mypage-section-title">신체/운동 정보</h3>
        <button className="mypage-section-edit" onClick={onEditOnboarding}>
          수정
          <ChevronRight size={16} />
        </button>
      </div>

      {profile ? (
        <>
          {/* 신체 정보 그리드 */}
          <div className="mypage-body-grid">
            <div className="mypage-body-item">
              <span className="mypage-body-label">키</span>
              <span className="mypage-body-value">
                {profile.heightCm}<span className="mypage-body-unit">cm</span>
              </span>
            </div>
            <div className="mypage-body-item">
              <span className="mypage-body-label">몸무게</span>
              <span className="mypage-body-value">
                {profile.weightKg}<span className="mypage-body-unit">kg</span>
              </span>
            </div>
            <div className="mypage-body-item">
              <span className="mypage-body-label">나이</span>
              <span className="mypage-body-value">
                {profile.age}<span className="mypage-body-unit">세</span>
              </span>
            </div>
            <div className="mypage-body-item">
              <span className="mypage-body-label">성별</span>
              <span className="mypage-body-value">{getGenderLabel(profile.gender)}</span>
            </div>
          </div>

          {/* 운동 정보 리스트 */}
          <div className="mypage-info-list">
            <div className="mypage-info-item">
              <Dumbbell size={18} className="mypage-info-icon" />
              <span className="mypage-info-label">운동 경력</span>
              <span className="mypage-info-value">{getExperienceLevelLabel(profile.experienceLevel)}</span>
            </div>
            <div className="mypage-info-item">
              <Target size={18} className="mypage-info-icon" />
              <span className="mypage-info-label">운동 목표</span>
              <span className="mypage-info-value">{getGoalTypeLabel(profile.goalType)}</span>
            </div>
            <div className="mypage-info-item">
              <Calendar size={18} className="mypage-info-icon" />
              <span className="mypage-info-label">운동 주기</span>
              <span className="mypage-info-value">
                주 {profile.weeklyDays}일, {formatSessionTime(profile.sessionMinutes)}
              </span>
            </div>
            <div className="mypage-info-item">
              <AlertTriangle size={18} className="mypage-info-icon" />
              <span className="mypage-info-label">부상 이력</span>
              <span className="mypage-info-value">
                {injuries.length > 0 ? `${injuries.length}건` : '없음'}
              </span>
            </div>
          </div>

          {/* 부상 상세 */}
          {injuries.length > 0 && (
            <div className="mypage-injury-list">
              {injuries.map((injury, index) => (
                <div key={injury.injuryId} className="mypage-injury-item">
                  <span className="mypage-injury-part">{index + 1}. {injury.injuryPart}</span>
                  <span className={`mypage-injury-severity ${injury.injuryLevel.toLowerCase()}`}>
                    {getInjuryLevelLabel(injury.injuryLevel)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 알레르기 정보 */}
          <div className="mypage-allergy-section">
            <span className="mypage-allergy-label">알레르기</span>
            <div className="mypage-allergy-tags">
              {allergies.length > 0 ? (
                allergies.map((allergy, index) => (
                  <span key={index} className="mypage-allergy-tag">
                    {getAllergyLabel(allergy)}
                  </span>
                ))
              ) : (
                <span className="mypage-allergy-none">없음</span>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mypage-no-profile">
          <p>등록된 신체/운동 정보가 없습니다.</p>
          <button className="mypage-register-btn" onClick={onEditOnboarding}>
            정보 등록하기
          </button>
        </div>
      )}
    </div>
  );
}
