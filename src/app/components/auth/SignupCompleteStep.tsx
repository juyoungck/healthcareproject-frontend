/**
 * SignupCompleteStep.tsx
 * 회원가입 완료 스텝 컴포넌트 (LoginModal, SignupModal 공통)
 */

import { Check } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface SignupCompleteStepProps {
  onComplete: () => void;
}

/**
 * SignupCompleteStep 컴포넌트
 */
export default function SignupCompleteStep({ onComplete }: SignupCompleteStepProps) {
  return (
    <div className="signup-complete">
      <div className="signup-complete-icon">
        <Check size={48} />
      </div>
      <h3 className="signup-complete-title">
        회원가입 완료!
      </h3>
      <p className="signup-complete-desc">
        맞춤 운동과 식단 추천을 위해<br />
        간단한 정보를 입력해주세요
      </p>
      <button
        className="form-submit-btn"
        onClick={onComplete}
      >
        시작하기
      </button>
    </div>
  );
}
