/**
 * ForgotPasswordModal.tsx
 * 비밀번호 찾기 모달 컴포넌트
 * - 이메일 입력 후 비밀번호 재설정 메일 발송
 */

import { useState } from 'react';
import { X, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { requestPasswordReset } from '../../../api/auth';
import { getErrorMessage } from '../../../constants/errorCodes';

/**
 * 컴포넌트 Props 타입 정의
 */
interface ForgotPasswordModalProps {
    onClose: () => void;
    onBackToLogin: () => void;
}

/**
 * ForgotPasswordModal 컴포넌트
 * 비밀번호 찾기 UI 및 로직 처리
 */
export default function ForgotPasswordModal({
    onClose,
    onBackToLogin,
}: ForgotPasswordModalProps) {
    /**
     * 폼 상태 관리
     */
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    /**
     * 이메일 유효성 검사
     */
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /**
     * 폼 제출 핸들러
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        /* 입력값 검증 */
        if (!email) {
            setError('이메일을 입력해주세요.');
            return;
        }

        if (!validateEmail(email)) {
            setError('올바른 이메일 형식이 아닙니다.');
            return;
        }

        setIsLoading(true);

        try {
            /* 비밀번호 재설정 메일 발송 API 호출 */
            await requestPasswordReset({ email });

            /* 성공 상태로 전환 */
            setIsSuccess(true);
        } catch (error: unknown) {
            console.error('비밀번호 재설정 메일 발송 실패:', error);
            const axiosError = error as { response?: { data?: { error?: { code?: string } } } };
            const errorCode = axiosError.response?.data?.error?.code;

            setError(getErrorMessage(errorCode, '메일 발송에 실패했습니다. 다시 시도해주세요.'));
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * 모달 외부 클릭 시 닫기
     */
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                {/* 모달 헤더 */}
                <div className="modal-header">
                    <button className="modal-back-btn" onClick={onBackToLogin}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="modal-title">비밀번호 찾기</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* 성공 화면 */}
                {isSuccess ? (
                    <div className="modal-success">
                        <CheckCircle className="modal-success-icon" size={64} />
                        <h3 className="modal-success-title">
                            비밀번호 재설정 메일 발송 완료
                        </h3>

                        <p className="modal-success-message">
                            입력하신 이메일로 비밀번호 재설정 링크를 보내드렸습니다.
                            <br />
                            메일을 확인한 뒤 링크를 눌러 비밀번호를 변경해주세요.
                        </p>
                        <button
                            type="button"
                            className="form-submit-btn"
                            onClick={onBackToLogin}
                        >
                            로그인으로 돌아가기
                        </button>
                    </div>
                ) : (
                    /* 이메일 입력 폼 */
                    <form className="modal-form" onSubmit={handleSubmit}>
                        <p className="form-description">
                            가입 시 사용한 이메일을 입력하시면
                            <br />
                            비밀번호 재설정 링크를 보내드립니다.
                        </p>

                        {/* 이메일 입력 */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="forgot-email">
                                이메일
                            </label>
                            <div className="form-input-wrapper">
                                <Mail className="form-input-icon" size={20} />
                                <input
                                    id="forgot-email"
                                    type="email"
                                    className="form-input"
                                    placeholder="이메일을 입력하세요"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
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
                            {isLoading ? '발송 중...' : '재설정 메일 발송'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}