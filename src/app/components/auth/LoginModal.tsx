/**
 * LoginModal.tsx
 * 로그인 모달 컴포넌트
 * - ID/PW 입력 후 DB 대조 및 JWT 토큰 발급
 * - 로그인 실패 시 에러 메시지 출력
 * - 이메일 미인증 시 인증 화면 표시
 * - 소셜 로그인 (카카오, 네이버, 구글) 지원
 * - 아이디/비밀번호 찾기 링크
 */

import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Check} from 'lucide-react';
import { login, saveTokens, getOAuthUrl } from '../../../api/auth';
import { requestEmailVerification, confirmEmailVerification } from '../../../api/emailVerification';
import type { SocialProvider } from '../../../api/types/auth';
import ForgotPasswordModal from './ForgotPasswordModal';
import { getErrorMessage, isErrorCode } from '../../../constants/errorCodes';

/**
 * 컴포넌트 Props 타입 정의
 */
interface LoginModalProps {
  onClose: () => void;
  onSignupComplete: () => void;
  onLoginSuccess: () => void;
  onSwitchToSignup: () => void;
}

/**
 * 모달 모드 타입
 */
type ModalMode = 'login' | 'forgot' | 'email-verify' | 'complete';

/**
 * LoginModal 컴포넌트
 * 로그인 UI 및 로직 처리
 */
export default function LoginModal({
  onClose,
  onSignupComplete,
  onLoginSuccess,
  onSwitchToSignup
}: LoginModalProps) {
  /**
   * 폼 상태 관리
   */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ModalMode>('login');

  /**
   * 이메일 인증 상태
   */
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  /**
   * 로그인 폼 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    /* 입력값 검증 */
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      /* 로그인 API 호출 */
      const tokens = await login({ email, password });

      /* 토큰 저장 */
      saveTokens(tokens);

      /* 로그인 성공 콜백 */
      onLoginSuccess();
    } catch (error: unknown) {
      console.error('로그인 실패:', error);
      const axiosError = error as { response?: { data?: { error?: { code?: string } } } };
      const errorCode = axiosError.response?.data?.error?.code;

      /* 이메일 미인증 에러 처리 */
      if (isErrorCode(errorCode, 'USER_EMAIL_NOT_VERIFIED')) {
        setMode('email-verify');
        setError('');
        setIsEmailSent(false);
        setVerificationCode('');
      } else {
        setError(getErrorMessage(errorCode, '로그인에 실패했습니다. 다시 시도해주세요.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 이메일 인증 발송 핸들러
   */
  const handleSendVerification = async () => {
    if (isLoading) return;
    setError('');

    /* 바로 코드 입력 화면으로 전환 */
    setIsEmailSent(true);

    /* 백그라운드에서 이메일 발송 (await 없이) */
    requestEmailVerification({ email }).catch((err: unknown) => {
      console.error('이메일 발송 실패:', err);
      const axiosError = err as {
        response?: {
          data?: {
            error?: { code?: string };
          };
          status?: number;
        };
      };
      const errorCode = axiosError.response?.data?.error?.code;

      if (errorCode === 'AUTH-008' || axiosError.response?.status === 429) {
        setError('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('인증 이메일 발송에 실패했습니다. 재전송을 시도해주세요.');
      }
    });
  };

  /**
   * 인증 코드 확인 핸들러
   */
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('1. 인증 확인 시작, 코드:', verificationCode);

    if (!verificationCode || verificationCode.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('2. confirmEmailVerification API 호출');
      await confirmEmailVerification({ email, code: verificationCode });

      console.log('3. API 성공! setMode(complete) 호출');

      /* 인증 완료 후 온보딩 페이지로 이동 */
      setMode('complete');
    } catch (err: unknown) {
      console.log('4. API 실패:', err);
      const axiosError = err as {
        response?: {
          data?: {
            error?: { code?: string; message?: string };
            code?: string;
            message?: string;
          };
        };
      };

      const errorCode = axiosError.response?.data?.error?.code
        || axiosError.response?.data?.code;

      console.log('5. errorCode:', errorCode);

      if (errorCode === 'AUTH-009' || errorCode === 'G001') {
        setError('인증 코드가 올바르지 않습니다.');
      } else {
        setError('인증 확인에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 소셜 로그인 핸들러
   * OAuth 인증 페이지로 리다이렉트
   */
  const handleSocialLogin = (provider: SocialProvider) => {
    /* state에 'login' 표시하여 로그인 용도임을 구분 */
    const oauthUrl = getOAuthUrl(provider, `login_${provider}`);
    window.location.href = oauthUrl;
  };

  /**
   * 이메일 인증 완료 → 자동 로그인 → 온보딩으로 이동
   */
  const handleComplete = () => {
    /* 
     * TODO: 실제 구현 시
     * - 토큰이 이미 저장된 상태
     * - onSignupComplete 호출하여 로그인 상태로 전환 + 온보딩 표시
     */
    onSignupComplete();
  };

  /**
   * 모달 외부 클릭 시 닫기
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /* 비밀번호 찾기 모달 */
  if (mode === 'forgot') {
    return (
      <ForgotPasswordModal
        onClose={onClose}
        onBackToLogin={() => setMode('login')}
      />
    );
  }

  /* 이메일 인증 모달 */
  if (mode === 'email-verify') {
    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-container">
          {/* 모달 헤더 */}
          <div className="modal-header">
            <h2 className="modal-title">이메일 인증</h2>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* 이메일 인증 폼 */}
          <form className="modal-form" onSubmit={handleVerifyCode}>
            <div className="verify-info">
              <p className="verify-email">{email}</p>
              <p className="verify-desc">
                이메일 인증이 완료되지 않았습니다.<br />
                인증 코드를 발송하여 인증을 완료해주세요.
              </p>
            </div>

            {!isEmailSent ? (
              <button
                type="button"
                className="form-submit-btn"
                onClick={handleSendVerification}
              >
                인증 코드 발송
              </button>
            ) : (
              <>
                {/* 안내 문구 */}
                <div className="verify-notice-box">
                  <p className="verify-notice-text">
                    📧 인증 코드가 발송되었습니다.<br />
                    이메일 수신까지 <strong>최대 20초</strong> 정도 소요될 수 있습니다.
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="verify-code">
                    인증 코드
                  </label>
                  <input
                    id="verify-code"
                    type="text"
                    className="form-input form-input-center"
                    placeholder="6자리 코드 입력"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                </div>

                {error && <p className="form-error-bottom">{error}</p>}

                <button
                  type="submit"
                  className="form-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? '확인 중...' : '인증 확인'}
                </button>

                <button
                  type="button"
                  className="form-link form-link-center"
                  onClick={handleSendVerification}
                >
                  이메일이 안 오셨나요? 재전송
                </button>
              </>
            )}
            {/* 안내 문구 (로그인으로 돌아가기 대신) */}
            <p className="verify-notice center">
              인증 완료 후 로그인이 가능합니다
            </p>
          </form>
        </div>
      </div>
    );
  }

  /* 이메일 인증 완료 */
  if (mode === 'complete') {
    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-container">
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
              onClick={handleComplete}
            >
              시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* 로그인 모달 */
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h2 className="modal-title">로그인</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 로그인 폼 */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* 이메일 입력 */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              이메일
            </label>
            <div className="form-input-wrapper">
              <Mail className="form-input-icon" size={20} />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              비밀번호
            </label>
            <div className="form-input-wrapper">
              <Lock className="form-input-icon" size={20} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="form-input-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && <p className="form-error">{error}</p>}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="form-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          {/* 비밀번호 찾기 */}
          <div className="form-links">
            <button
              type="button"
              className="form-link"
              onClick={() => setMode('forgot')}
            >
              비밀번호 찾기
            </button>
          </div>
        </form>

        {/* 소셜 로그인 */}
        <div className="social-divider">
          <span className="social-divider-text">또는</span>
        </div>

        <div className="social-login-buttons">
          {/* 구글 (활성화) */}
          <button 
            className="social-btn social-btn-google"
            onClick={() => handleSocialLogin('GOOGLE')}
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

        {/* 회원가입 */}
        <div className="modal-footer">
          <span className="modal-footer-text">아직 계정이 없으신가요?</span>
          <button
            className="modal-footer-link"
            onClick={onSwitchToSignup}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}