/**
 * OAuthCallbackPage.tsx
 * OAuth 콜백 처리 페이지
 * - 소셜 로그인 후 리다이렉트되는 페이지
 * - URL에서 인가 코드를 추출하여 로그인/연동 처리
 */

import { useEffect, useState } from 'react';
import { socialLogin, saveTokens, connectSocialAccount } from '../../api/auth';
import type { SocialProvider } from '../../api/types/auth';
import { getErrorMessage } from '../../constants/errorCodes';

/**
 * Props 타입 정의
 */
interface OAuthCallbackPageProps {
  onLoginSuccess: () => void;
  onConnectSuccess: () => void;
  onError: (message: string) => void;
}

/**
 * OAuthCallbackPage 컴포넌트
 */
export default function OAuthCallbackPage({
  onLoginSuccess,
  onConnectSuccess,
  onError,
}: OAuthCallbackPageProps) {
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
          accessToken: code,
        });

        /* 토큰 저장 */
        saveTokens(tokens);

        /* 로그인 성공 콜백 */
        onLoginSuccess();

      } else if (action === 'connect') {
        /* 소셜 계정 연동 처리 */
        setMessage('계정 연동 중...');

        await connectSocialAccount({
          provider,
          accessToken: code,
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
      const errorMessage = error instanceof Error 
        ? error.message 
        : getErrorMessage(errorCode, '소셜 로그인에 실패했습니다.');
      
      setMessage(errorMessage);
      onError(errorMessage);
    }
  };

  return (
    <div className="oauth-callback-page">
      <div className="oauth-callback-content">
        <div className="oauth-callback-spinner"></div>
        <p className="oauth-callback-message">{message}</p>
      </div>
    </div>
  );
}