/**
 * useEmailVerification.ts
 * 이메일 인증 관련 커스텀 훅
 */

import { useState, useCallback } from 'react';
import { requestEmailVerification, confirmEmailVerification } from '../../api/emailVerification';
import { getApiErrorMessage } from '../../api/apiError';

/**
 * 반환 타입 인터페이스
 */
interface UseEmailVerificationReturn {
  /* 상태 */
  verificationCode: string;
  isEmailSent: boolean;
  isLoading: boolean;
  error: string;

  /* 액션 */
  setVerificationCode: (code: string) => void;
  setError: (error: string) => void;
  handleSendVerification: (email: string) => void;
  handleVerifyCode: (email: string, onSuccess: () => void) => Promise<void>;
  resetState: () => void;
}

/**
 * 이메일 인증 훅
 */
export function useEmailVerification(): UseEmailVerificationReturn {
  /** 상태 */
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /** 상태 초기화 */
  const resetState = useCallback(() => {
    setVerificationCode('');
    setIsEmailSent(false);
    setIsLoading(false);
    setError('');
  }, []);

  /** 인증 코드 발송 */
  const handleSendVerification = useCallback((email: string) => {
    if (isLoading) return;
    setError('');

    /* 바로 코드 입력 화면으로 전환 */
    setIsEmailSent(true);

    /* 백그라운드에서 이메일 발송 */
    requestEmailVerification({ email }).catch((err: unknown) => {
      setError(getApiErrorMessage(err, '인증 이메일 발송에 실패했습니다.'));
    });
  }, [isLoading]);

  /** 인증 코드 확인 */
  const handleVerifyCode = useCallback(async (email: string, onSuccess: () => void) => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await confirmEmailVerification({ email, code: verificationCode });
      onSuccess();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, '인증 확인에 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  }, [verificationCode]);

  return {
    verificationCode,
    isEmailSent,
    isLoading,
    error,
    setVerificationCode,
    setError,
    handleSendVerification,
    handleVerifyCode,
    resetState,
  };
}
