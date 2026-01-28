/**
 * OAuthCallbackPage.tsx
 * OAuth 콜백 처리 페이지
 * - 소셜 로그인 후 리다이렉트되는 페이지
 * - URL에서 인가 코드를 추출하여 로그인/연동 처리
 */

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { socialLogin, saveTokens, connectSocialAccount } from '../../api/auth';
import { getOnboardingStatus } from '../../api/me';
import type { SocialProvider } from '../../api/types/auth';
import { getErrorMessage } from '../../constants/errorCodes';

/**
 * Props 타입 정의
 */
interface OAuthCallbackPageProps {
  onLoginSuccess: () => void;
  onSignupSuccess: () => void;
  onConnectSuccess: () => void;
  onError: (message: string) => void;
}

/**
 * 페이지 상태 타입
 */
type PageStatus = 'loading' | 'signup-complete' | 'error';


/**
 * OAuthCallbackPage 컴포넌트
 */
export default function OAuthCallbackPage({
  onLoginSuccess,
  onSignupSuccess,
  onConnectSuccess,
  onError,
}: OAuthCallbackPageProps) {
  const [status, setStatus] = useState<PageStatus>('loading');
  const [message, setMessage] = useState('소셜 로그인 처리 중...');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  /**
   * OAuth 콜백 처리
   */
  const handleOAuthCallback = async () => {
    try {
      /* URL에서 파라미터 추출 */
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      /* 에러 체크 */
      if (error) {
        throw new Error('소셜 로그인이 취소되었습니다.');
      }

      if (!code || !state) {
        throw new Error('인증 정보가 올바르지 않습니다.');
      }

      /* state 파싱: "login_KAKAO" 또는 "connect_KAKAO" 형태 */
      const [action, providerStr] = state.split('_');
      const provider = providerStr as SocialProvider;

      if (!['GOOGLE', 'KAKAO', 'NAVER'].includes(provider)) {
        throw new Error('지원하지 않는 소셜 서비스입니다.');
      }

      if (action === 'login') {
        /* 소셜 로그인 처리 */
        setMessage('로그인 처리 중...');
        
        const tokens = await socialLogin({
          provider,
          code,
          redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
          state: provider === 'NAVER' ? state : null,
        });

        /* 토큰 저장 */
        saveTokens(tokens);

        /* 온보딩 완료 여부 확인 */
        setMessage('정보 확인 중...');
        try {
          const completed = await getOnboardingStatus();
  
          if (completed) {
            onLoginSuccess();
          } else {
            setStatus('signup-complete');
          }
        } catch {
          /* 온보딩 상태 조회 실패 시 신규 가입자로 처리 */
          setStatus('signup-complete');
        }
      } else if (action === 'connect') {
        /* 소셜 계정 연동 처리 */
        setMessage('계정 연동 중...');

        await connectSocialAccount({
          provider,
          code,
          redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
          state: provider === 'NAVER' ? state : null,
        });

        /* 연동 성공 콜백 */
        onConnectSuccess();

      } else {
        throw new Error('잘못된 요청입니다.');
      }

    } catch (error: unknown) {
      console.error('OAuth 처리 실패:', error);
  
      const axiosError = error as { response?: { data?: { error?: { code?: string } } } };
      const errorCode = axiosError.response?.data?.error?.code;
      const errorMessage = errorCode 
        ? getErrorMessage(errorCode, '소셜 로그인에 실패했습니다.')
        : (error instanceof Error ? error.message : '소셜 로그인에 실패했습니다.');
      
      setStatus('error');
      setMessage(errorMessage);
      onError(errorMessage);
    }
  };

  /**
   * 신규 가입 완료 후 온보딩으로 이동
   */
  const handleStartOnboarding = () => {
    onSignupSuccess();
  };

  /* 신규 가입 완료 화면 */
  if (status === 'signup-complete') {
    return (
      <div className="oauth-callback-page">
        <div className="oauth-callback-content">
          <div className="oauth-complete">
            <div className="oauth-complete-icon">
              <Check size={48} />
            </div>
            <h3 className="oauth-complete-title">
              회원가입 완료!
            </h3>
            <p className="oauth-complete-desc">
              맞춤 운동과 식단 추천을 위해<br />
              간단한 정보를 입력해주세요
            </p>
            <button
              className="form-submit-btn"
              onClick={handleStartOnboarding}
            >
              시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* 에러 화면 */
  if (status === 'error') {
    return (
      <div className="oauth-callback-page">
        <div className="oauth-callback-content">
          <p className="oauth-callback-message oauth-callback-error">{message}</p>
          <button
            className="form-submit-btn"
            onClick={() => window.location.href = '/'}
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  /* 로딩 화면 */
  return (
    <div className="oauth-callback-page">
      <div className="oauth-callback-content">
        <div className="oauth-callback-spinner"></div>
        <p className="oauth-callback-message">{message}</p>
      </div>
    </div>
  );
}