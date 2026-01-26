/**
 * ResetPasswordPage.tsx
 * 비밀번호 재설정 페이지
 * - 메일 링크 클릭 시 진입
 * - URL 파라미터로 token, email 수신
 * - 새 비밀번호 입력 후 변경 완료
 */

import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { resetPassword } from '../../api/auth';
import { getErrorMessage } from '../../constants/errorCodes';

/**
 * 컴포넌트 Props 타입 정의
 */
interface ResetPasswordPageProps {
  onGoToHome: () => void;
}

/**
 * ResetPasswordPage 컴포넌트
 */
export default function ResetPasswordPage({ onGoToHome }: ResetPasswordPageProps) {
  /**
   * URL 파라미터에서 token, email 추출
   */
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  /**
   * 상태 관리
   */
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidLink, setIsInvalidLink] = useState(false);

  /**
   * 토큰/이메일 유효성 검사
   */
  useEffect(() => {
    if (!token || !email) {
      setIsInvalidLink(true);
    }
  }, [token, email]);

  /**
   * 비밀번호 유효성 검사
   */
  const validatePassword = (pw: string): boolean => {
    return pw.length >= 8;
  };

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    /* 입력값 검증 */
    if (!password) {
      setError('새 비밀번호를 입력해주세요.');
      return;
    }

    if (!validatePassword(password)) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      /* 비밀번호 재설정 API 호출 */
      await resetPassword({ token, email, password });

      /* 성공 상태로 전환 */
      setIsSuccess(true);
    } catch (error: unknown) {
      console.error('비밀번호 재설정 실패:', error);
      const axiosError = error as { response?: { data?: { error?: { code?: string } } } };
      const errorCode = axiosError.response?.data?.error?.code;

      setError(getErrorMessage(errorCode, '비밀번호 재설정에 실패했습니다. 다시 시도해주세요.'));
    } finally {
      setIsLoading(false);
    }
  };

  /* 잘못된 링크 */
  if (isInvalidLink) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-error">
            <XCircle className="reset-password-error-icon" size={64} />
            <h2 className="reset-password-error-title">잘못된 링크입니다</h2>
            <p className="reset-password-error-message">
              비밀번호 재설정 링크가 유효하지 않습니다.
              <br />
              다시 비밀번호 찾기를 시도해주세요.
            </p>
            <button
              type="button"
              className="form-submit-btn"
              onClick={onGoToHome}
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* 성공 화면 */
  if (isSuccess) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-success">
            <CheckCircle className="reset-password-success-icon" size={64} />
            <h2 className="reset-password-success-title">비밀번호가 변경되었습니다</h2>
            <p className="reset-password-success-message">
              새 비밀번호로 로그인해주세요.
            </p>
            <button
              type="button"
              className="form-submit-btn"
              onClick={onGoToHome}
            >
              로그인하러 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* 비밀번호 입력 폼 */
  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h1 className="reset-password-title">비밀번호 재설정</h1>
        <p className="reset-password-desc">
          새로운 비밀번호를 입력해주세요.
        </p>

        <form className="reset-password-form" onSubmit={handleSubmit}>
          {/* 새 비밀번호 */}
          <div className="form-group">
            <label className="form-label" htmlFor="new-password">
              새 비밀번호
            </label>
            <div className="form-input-wrapper">
              <Lock className="form-input-icon" size={20} />
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password">
              새 비밀번호 확인
            </label>
            <div className="form-input-wrapper">
              <Lock className="form-input-icon" size={20} />
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="새 비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="form-input-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && <p className="form-error">{error}</p>}

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="form-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>
    </div>
  );
}