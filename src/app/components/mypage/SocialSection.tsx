/**
 * SocialSection.tsx
 * 소셜 계정 연동 섹션
 */

import type { SocialProvider } from '../../../api/types/auth';

/**
 * Props 타입 정의
 */
interface SocialSectionProps {
  isLoadingSocial: boolean;
  isSocialActionLoading: boolean;
  isConnected: (provider: SocialProvider) => boolean;
  onConnectSocial: (provider: SocialProvider) => void;
  onDisconnectSocial: (provider: SocialProvider) => void;
}

/**
 * SocialSection 컴포넌트
 */
export default function SocialSection({
  isLoadingSocial,
  isSocialActionLoading,
  isConnected,
  onConnectSocial,
  onDisconnectSocial,
}: SocialSectionProps) {
  return (
    <div className="mypage-section">
      <h3 className="mypage-section-title">소셜 계정 연동</h3>
      {isLoadingSocial ? (
        <div className="mypage-social-loading">로딩 중...</div>
      ) : (
        <div className="mypage-social-list">
          {/* 구글 */}
          <div className="mypage-social-item">
            <div className="mypage-social-icon google">G</div>
            <span className="mypage-social-name">구글</span>
            {isConnected('GOOGLE') ? (
              <button
                className="mypage-social-btn connected"
                onClick={() => onDisconnectSocial('GOOGLE')}
                disabled={isSocialActionLoading}
              >
                연동해제
              </button>
            ) : (
              <button
                className="mypage-social-btn"
                onClick={() => onConnectSocial('GOOGLE')}
                disabled={isSocialActionLoading}
              >
                연동하기
              </button>
            )}
          </div>

          {/* 카카오 (비활성화) */}
          <div className="mypage-social-item">
            <div className="mypage-social-icon kakao">K</div>
            <span className="mypage-social-name">카카오</span>
            <button
              className="mypage-social-btn"
              disabled
              title="준비 중입니다"
            >
              준비중
            </button>
          </div>

          {/* 네이버 (비활성화) */}
          <div className="mypage-social-item">
            <div className="mypage-social-icon naver">N</div>
            <span className="mypage-social-name">네이버</span>
            <button
              className="mypage-social-btn"
              disabled
              title="준비 중입니다"
            >
              준비중
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
