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
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { login, saveTokens, getOAuthUrl } from '../../../api/auth';
import type { SocialProvider } from '../../../api/types/auth';
import { extractAxiosError } from '../../../api/apiError';

/* 공통 컴포넌트 */
import EmailVerifyForm from './EmailVerifyForm';
import SignupCompleteStep from './SignupCompleteStep';
import SocialLoginButtons from './SocialLoginButtons';
import ForgotPasswordModal from './ForgotPasswordModal';

/* 커스텀 훅 */
import { useEmailVerification } from '../../../hooks/auth/useEmailVerification';

/**
 * Props 타입 정의
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
 */
export default function LoginModal({
  onClose,
  onSignupComplete,
  onLoginSuccess,
  onSwitchToSignup
}: LoginModalProps) {
  /**
   * 폼 상태
   */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ModalMode>('login');

  /**
   * 이메일 인증 훅
   */
  const emailVerification = useEmailVerification();

  /**
   * 로그인 폼 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const tokens = await login({ email, password });
      saveTokens(tokens);
      onLoginSuccess();
    } catch (err: unknown) {
      const { code, message } = extractAxiosError(err, '로그인에 실패했습니다.');

      /* 이메일 미인증 에러 처리 */
      if (code === 'AUTH-018') {
        emailVerification.resetState();
        setMode('email-verify');
        setError('');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 소셜 로그인 핸들러
   */
  const handleSocialLogin = (provider: SocialProvider) => {
    const oauthUrl = getOAuthUrl(provider, `login_${provider}`);
    window.location.href = oauthUrl;
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
          <div className="modal-header">
            <h2 className="modal-title">이메일 인증</h2>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <EmailVerifyForm
            email={email}
            verificationCode={emailVerification.verificationCode}
            isEmailSent={emailVerification.isEmailSent}
            isLoading={emailVerification.isLoading}
            error={emailVerification.error}
            description="이메일 인증이 완료되지 않았습니다. 인증 코드를 발송하여 인증을 완료해주세요."
            onCodeChange={emailVerification.setVerificationCode}
            onSendVerification={() => emailVerification.handleSendVerification(email)}
            onVerifyCode={(e) => {
              e.preventDefault();
              emailVerification.handleVerifyCode(email, () => setMode('complete'));
            }}
          />
        </div>
      </div>
    );
  }

  /* 이메일 인증 완료 */
  if (mode === 'complete') {
    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-container">
          <SignupCompleteStep onComplete={onSignupComplete} />
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
        <SocialLoginButtons onSocialLogin={handleSocialLogin} />

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
