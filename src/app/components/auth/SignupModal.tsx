/**
 * SignupModal.tsx
 * 회원가입 모달 컴포넌트
 * - 기본정보 입력 (이메일, 비밀번호, 닉네임, 전화번호)
 * - 이메일 인증
 * - 가입 완료 → 자동 로그인 → 온보딩으로 이동
 */

import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, Phone, Check } from 'lucide-react';
import { signup, checkEmail, saveTokens } from '../../../api/auth';
import { requestEmailVerification, confirmEmailVerification } from '../../../api/emailVerification';

/**
 * 컴포넌트 Props 타입 정의
 */
interface SignupModalProps {
  onClose: () => void;
  onSignupComplete: () => void;  // 가입 완료 후 자동 로그인 처리
  onSwitchToLogin: () => void;
}

/**
 * 회원가입 단계
 */
type SignupStep = 'info' | 'verify' | 'complete';

/**
 * SignupModal 컴포넌트
 */
export default function SignupModal({
  onClose,
  onSignupComplete,
  onSwitchToLogin
}: SignupModalProps) {
  /**
   * 단계 상태
   */
  const [step, setStep] = useState<SignupStep>('info');

  /**
   * 폼 데이터 상태
   */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  /**
   * 상태 관리
   */
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  /**
   * 약관 동의 상태
   */
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  /**
   * 전체 동의 핸들러
   */
  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreeTerms(newValue);
    setAgreePrivacy(newValue);
  };

  /**
   * 개별 약관 체크 시 전체 동의 상태 업데이트
   */
  const handleTermsChange = (checked: boolean) => {
    setAgreeTerms(checked);
    setAgreeAll(checked && agreePrivacy);
  };

  const handlePrivacyChange = (checked: boolean) => {
    setAgreePrivacy(checked);
    setAgreeAll(checked && agreeTerms);
  };

  /**
   * 전화번호 포맷팅 (01012345678 → 010-1234-5678)
   */
  const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/-/g, '');
    if (digits.length === 11) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  /**
   * 이메일 중복 체크 핸들러
   */
  const handleCheckEmail = async () => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    /* 이메일 형식 검증 */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await checkEmail({ email });

      if (result.available) {
        setIsEmailChecked(true);
        setIsEmailAvailable(true);
        setError('');
      } else {
        setIsEmailChecked(true);
        setIsEmailAvailable(false);
        setError('이미 사용 중인 이메일입니다.');
      }
    } catch (err: unknown) {
      const axiosError = err as {
        response?: {
          data?: {
            error?: { code?: string; message?: string };
            code?: string;
            message?: string;
          }
        }
      };

      /* 에러 코드 추출 (백엔드 응답 구조에 따라 유연하게 처리) */
      const errorCode = axiosError.response?.data?.error?.code
        || axiosError.response?.data?.code;

      if (errorCode === 'AUTH-006') {
        setIsEmailChecked(true);
        setIsEmailAvailable(false);
        setError('이미 사용 중인 이메일입니다.');
      } else {
        console.error('이메일 중복 체크 에러:', axiosError.response?.data);
        setError('이메일 확인에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 이메일 변경 시 중복 체크 상태 초기화
   */
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsEmailChecked(false);
    setIsEmailAvailable(false);
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
   * 기본정보 제출 핸들러
   */
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    /* 유효성 검증 */
    if (!email || !password || !passwordConfirm || !nickname) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (!isEmailChecked || !isEmailAvailable) {
      setError('이메일 중복 확인을 해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      setError('필수 약관에 동의해주세요.');
      return;
    }


    setIsLoading(true);

    try {
      /* 전화번호 포맷팅 */
      const formattedPhone = phone ? formatPhoneNumber(phone) : undefined;

      /* 회원가입 API 호출 */
      const tokens = await signup({
        email,
        password,
        nickname,
        phoneNumber: formattedPhone,
      });

      /* 토큰 저장 */
      saveTokens(tokens);

      /* 이메일 인증 단계로 이동 */
      setStep('verify');
    } catch (err: unknown) {
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
      const errorMessage = axiosError.response?.data?.error?.message
        || axiosError.response?.data?.message;

      if (errorCode === 'AUTH-006') {
        setError('이미 사용 중인 이메일입니다.');
      } else {
        setError(errorMessage || '회원가입에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 인증 코드 확인 핸들러
   */
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      /* 이메일 인증 코드 확인 API 호출 */
      await confirmEmailVerification({ email, code: verificationCode });

      setStep('complete');
    } catch (err: unknown) {
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
   * 회원가입 완료 → 자동 로그인 → 온보딩으로 이동
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

  /**
   * 단계별 렌더링
   */
  const renderStep = () => {
    switch (step) {
      /* 기본정보 입력 단계 */
      case 'info':
        return (
          <form className="modal-form" onSubmit={handleInfoSubmit}>
            {/* 이메일 */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="signup-email">
                  이메일 *
                </label>
                {isEmailChecked && (
                  <span className={`form-label-status ${isEmailAvailable ? 'success' : 'error'}`}>
                    {isEmailAvailable ? '사용 가능한 이메일입니다.' : '이미 사용 중인 이메일입니다.'}
                  </span>
                )}
              </div>
              <div className="form-input-wrapper">
                <Mail className="form-input-icon" size={20} />
                <input
                  id="signup-email"
                  type="email"
                  className="form-input"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
                <button
                  type="button"
                  className="form-input-btn"
                  onClick={handleCheckEmail}
                  disabled={isLoading || !email}
                >
                  {isEmailChecked && isEmailAvailable ? '확인완료' : '중복확인'}
                </button>
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">
                비밀번호 *
              </label>
              <div className="form-input-wrapper">
                <Lock className="form-input-icon" size={20} />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="8자 이상 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <label className="form-label" htmlFor="signup-password-confirm">
                비밀번호 확인 *
              </label>
              <div className="form-input-wrapper">
                <Lock className="form-input-icon" size={20} />
                <input
                  id="signup-password-confirm"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
            </div>

            {/* 닉네임 */}
            <div className="form-group">
              <label className="form-label" htmlFor="signup-nickname">
                닉네임 *
              </label>
              <div className="form-input-wrapper">
                <User className="form-input-icon" size={20} />
                <input
                  id="signup-nickname"
                  type="text"
                  className="form-input"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>

            {/* 전화번호 (선택) */}
            <div className="form-group">
              <label className="form-label" htmlFor="signup-phone">
                전화번호
              </label>
              <div className="form-input-wrapper">
                <Phone className="form-input-icon" size={20} />
                <input
                  id="signup-phone"
                  type="tel"
                  className="form-input"
                  placeholder="전화번호를 입력하세요 (선택)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="form-agreements">
              <label className="form-agreement-item form-agreement-all">
                <input
                  type="checkbox"
                  checked={agreeAll}
                  onChange={handleAgreeAll}
                />
                <Check size={16} className={agreeAll ? 'checked' : ''} />
                <span>전체 동의</span>
              </label>
              <label className="form-agreement-item">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => handleTermsChange(e.target.checked)}
                />
                <Check size={16} className={agreeTerms ? 'checked' : ''} />
                <span>[필수] 서비스 이용약관</span>
              </label>
              <label className="form-agreement-item">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => handlePrivacyChange(e.target.checked)}
                />
                <Check size={16} className={agreePrivacy ? 'checked' : ''} />
                <span>[필수] 개인정보 처리방침</span>
              </label>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="form-submit-btn">
              다음
            </button>
          </form>
        );

      /* 이메일 인증 단계 */
      case 'verify':
        return (
          <form className="modal-form" onSubmit={handleVerifyCode}>
            <div className="verify-info">
              <p className="verify-email">{email}</p>
              <p className="verify-desc">
                위 이메일로 인증 코드를 발송합니다
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
            {/* 안내 문구 */}
            <p className="verify-notice">
              인증 완료 후 로그인이 가능합니다
            </p>
          </form>
        );

      /* 가입 완료 단계 */
      case 'complete':
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
              onClick={handleComplete}
            >
              시작하기
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  /**
   * 단계별 제목
   */
  const getStepTitle = () => {
    switch (step) {
      case 'info': return '회원가입';
      case 'verify': return '이메일 인증';
      case 'complete': return '가입 완료';
      default: return '회원가입';
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container modal-container-large">
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h2 className="modal-title">{getStepTitle()}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 단계별 콘텐츠 */}
        {renderStep()}

        {/* 로그인 안내 (완료 단계 제외) */}
        {step !== 'complete' && (
          <div className="modal-footer">
            <span className="modal-footer-text">이미 계정이 있으신가요?</span>
            <button
              className="modal-footer-link"
              onClick={onSwitchToLogin}
            >
              로그인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}