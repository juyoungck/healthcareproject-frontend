/**
 * LoginModal.tsx
 * 로그인 모달 컴포넌트
 * - ID/PW 입력 후 DB 대조 및 JWT 토큰 발급
 * - 로그인 실패 시 에러 메시지 출력
 * - 소셜 로그인 (카카오, 네이버, 구글) 지원
 * - 아이디/비밀번호 찾기 링크
 */

import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';

/**
 * 컴포넌트 Props 타입 정의
 */
interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  onSwitchToSignup: () => void;
}

/**
 * LoginModal 컴포넌트
 * 로그인 UI 및 로직 처리
 */
export default function LoginModal({ 
  onClose, 
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

  /**
   * 로그인 폼 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    /**
     * TODO: 실제 API 호출로 대체
     * - ID/PW DB 대조
     * - JWT 토큰 발급 및 저장
     */
    try {
      /* 임시 로그인 처리 (데모용) */
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        onLoginSuccess();
      } else {
        setError('이메일과 비밀번호를 입력해주세요.');
      }
    } catch {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 소셜 로그인 핸들러
   * TODO: OAuth 연동 구현
   */
  const handleSocialLogin = (provider: 'kakao' | 'naver' | 'google') => {
    console.log(`${provider} 로그인 시도`);
    /* TODO: OAuth 리다이렉트 처리 */
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
          {error && (
            <p className="form-error">{error}</p>
          )}

          {/* 로그인 버튼 */}
          <button 
            type="submit" 
            className="form-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          {/* 아이디/비밀번호 찾기 */}
          <div className="form-links">
            <button type="button" className="form-link">
              아이디 찾기
            </button>
            <span className="form-link-divider">|</span>
            <button type="button" className="form-link">
              비밀번호 찾기
            </button>
          </div>
        </form>

        {/* 소셜 로그인 구분선 */}
        <div className="social-divider">
          <span className="social-divider-text">또는</span>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="social-login-buttons">
          <button 
            className="social-btn social-btn-kakao"
            onClick={() => handleSocialLogin('kakao')}
          >
            <span className="social-btn-text">카카오로 시작하기</span>
          </button>
          <button 
            className="social-btn social-btn-naver"
            onClick={() => handleSocialLogin('naver')}
          >
            <span className="social-btn-text">네이버로 시작하기</span>
          </button>
          <button 
            className="social-btn social-btn-google"
            onClick={() => handleSocialLogin('google')}
          >
            <span className="social-btn-text">구글로 시작하기</span>
          </button>
        </div>

        {/* 회원가입 안내 */}
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
