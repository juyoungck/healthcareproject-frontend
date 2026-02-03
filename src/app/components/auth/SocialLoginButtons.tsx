/**
 * SocialLoginButtons.tsx
 * 소셜 로그인 버튼 그룹 컴포넌트
 */

import type { SocialProvider } from '../../../api/types/auth';

/**
 * Props 타입 정의
 */
interface SocialLoginButtonsProps {
  onSocialLogin: (provider: SocialProvider) => void;
}

/**
 * SocialLoginButtons 컴포넌트
 */
export default function SocialLoginButtons({ onSocialLogin }: SocialLoginButtonsProps) {
  return (
    <>
      <div className="social-divider">
        <span className="social-divider-text">또는</span>
      </div>

      <div className="social-login-buttons">
        {/* 구글 (활성화) */}
        <button
          className="social-btn social-btn-google"
          onClick={() => onSocialLogin('GOOGLE')}
        >
          <span className="social-btn-text">구글로 시작하기</span>
        </button>

        {/* 카카오 (비활성화 - 비즈앱 전환 필요) */}
        <button
          className="social-btn social-btn-kakao"
          disabled
          title="준비 중입니다"
        >
          <span className="social-btn-text">카카오로 시작하기</span>
        </button>

        {/* 네이버 (비활성화 - 테스터 등록 필요) */}
        <button
          className="social-btn social-btn-naver"
          disabled
          title="준비 중입니다"
        >
          <span className="social-btn-text">네이버로 시작하기</span>
        </button>
      </div>
    </>
  );
}
