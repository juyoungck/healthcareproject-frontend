/**
 * EmailVerifyForm.tsx
 * 이메일 인증 폼 컴포넌트 (LoginModal, SignupModal 공통)
 */

import { VERIFICATION_CODE_LENGTH } from '../../../constants/validation';

/**
 * Props 타입 정의
 */
interface EmailVerifyFormProps {
  email: string;
  verificationCode: string;
  isEmailSent: boolean;
  isLoading: boolean;
  error: string;
  description?: string;
  onCodeChange: (code: string) => void;
  onSendVerification: () => void;
  onVerifyCode: (e: React.FormEvent) => void;
}

/**
 * EmailVerifyForm 컴포넌트
 */
export default function EmailVerifyForm({
  email,
  verificationCode,
  isEmailSent,
  isLoading,
  error,
  description = '위 이메일로 인증 코드를 발송합니다',
  onCodeChange,
  onSendVerification,
  onVerifyCode,
}: EmailVerifyFormProps) {
  return (
    <form className="modal-form" onSubmit={onVerifyCode}>
      <div className="verify-info">
        <p className="verify-email">{email}</p>
        <p className="verify-desc">{description}</p>
      </div>

      {!isEmailSent ? (
        <button
          type="button"
          className="form-submit-btn"
          onClick={onSendVerification}
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
              onChange={(e) => onCodeChange(e.target.value)}
              maxLength={VERIFICATION_CODE_LENGTH}
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
            onClick={onSendVerification}
          >
            이메일이 안 오셨나요? 재전송
          </button>
        </>
      )}

      {/* 안내 문구 */}
      <p className="verify-notice">
        인증 완료 후 로그인이 가능합니다
      </p>
    </form>
  );
}
