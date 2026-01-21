/**
 * SettingsPage.tsx
 * 설정 페이지 컴포넌트
 */

import { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight,
  Bell,
  FileText,
  Shield,
  Info,
  Mail,
  LogOut,
  UserX,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { withdrawUser } from '../../api/me';
import { getErrorMessage, isErrorCode } from '../../constants/errorCodes';

interface SettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export default function SettingsPage({ onBack, onLogout }: SettingsPageProps) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      onLogout();
    }
  };

  /**
   * 회원탈퇴 핸들러
   */
  /**
 * 회원탈퇴 모달 닫기
 */
const closeWithdrawModal = () => {
  setShowWithdrawModal(false);
  setWithdrawPassword('');
  setWithdrawError('');
};

  /**
   * 회원탈퇴 핸들러
   */
  const confirmWithdraw = async () => {
    /* 비밀번호 검증 */
    if (!withdrawPassword.trim()) {
      setWithdrawError('비밀번호를 입력해주세요.');
      return;
    }

    setIsWithdrawing(true);
    setWithdrawError('');

    try {
      await withdrawUser({ password: withdrawPassword });
      alert('회원탈퇴가 완료되었습니다.');
      closeWithdrawModal();
      onLogout();
    } catch (err: unknown) {
        console.error('회원탈퇴 실패:', err);
        const axiosError = err as { response?: { data?: { error?: { code?: string } } } };
        const errorCode = axiosError.response?.data?.error?.code;

        setWithdrawError(getErrorMessage(errorCode, '회원탈퇴에 실패했습니다. 다시 시도해주세요.'));
    } finally {
      setIsWithdrawing(false);
    }
  };

  /**
   * 약관 페이지 열기
   * TODO: 실제 약관 페이지 또는 모달로 연결
   */
  const openTerms = () => {
    alert('이용약관 페이지로 이동합니다.');
  };

  const openPrivacy = () => {
    alert('개인정보 처리방침 페이지로 이동합니다.');
  };

  const openContact = () => {
    alert('문의하기 페이지로 이동합니다.');
  };

  return (
    <div className="settings-page">
      {/* 헤더 */}
      <header className="settings-header">
        <div className="settings-header-content">
          <button className="settings-back-btn" onClick={onBack}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="settings-title">설정</h1>
          <div style={{ width: 24 }} />
        </div>
      </header>

      {/* 설정 내용 */}
      <main className="settings-main">
        {/* 앱 설정 */}
        <section className="settings-section">
          <h3 className="settings-section-title">앱 설정</h3>
          <div className="settings-list">
            <button className="settings-item">
              <div className="settings-item-left">
                <Bell size={20} className="settings-item-icon" />
                <span className="settings-item-label">알림 설정</span>
              </div>
              <ChevronRight size={20} className="settings-item-arrow" />
            </button>
          </div>
        </section>

        {/* 약관 및 정책 */}
        <section className="settings-section">
          <h3 className="settings-section-title">약관 및 정책</h3>
          <div className="settings-list">
            <button className="settings-item" onClick={openTerms}>
              <div className="settings-item-left">
                <FileText size={20} className="settings-item-icon" />
                <span className="settings-item-label">이용약관</span>
              </div>
              <ChevronRight size={20} className="settings-item-arrow" />
            </button>
            <button className="settings-item" onClick={openPrivacy}>
              <div className="settings-item-left">
                <Shield size={20} className="settings-item-icon" />
                <span className="settings-item-label">개인정보 처리방침</span>
              </div>
              <ChevronRight size={20} className="settings-item-arrow" />
            </button>
          </div>
        </section>

        {/* 앱 정보 */}
        <section className="settings-section">
          <h3 className="settings-section-title">앱 정보</h3>
          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-left">
                <Info size={20} className="settings-item-icon" />
                <span className="settings-item-label">버전 정보</span>
              </div>
              <span className="settings-item-value">1.0.0</span>
            </div>
            <button className="settings-item" onClick={openContact}>
              <div className="settings-item-left">
                <Mail size={20} className="settings-item-icon" />
                <span className="settings-item-label">문의하기</span>
              </div>
              <ChevronRight size={20} className="settings-item-arrow" />
            </button>
          </div>
        </section>

        {/* 계정 */}
        <section className="settings-section">
          <h3 className="settings-section-title">계정</h3>
          <div className="settings-list">
            <button className="settings-item" onClick={handleLogout}>
              <div className="settings-item-left">
                <LogOut size={20} className="settings-item-icon" />
                <span className="settings-item-label">로그아웃</span>
              </div>
            </button>
            <button className="settings-item settings-item-danger" onClick={() => setShowWithdrawModal(true)}>
              <div className="settings-item-left">
                <UserX size={20} className="settings-item-icon" />
                <span className="settings-item-label">회원탈퇴</span>
              </div>
            </button>
          </div>
        </section>
      </main>

      {/* 회원탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <div className="modal-overlay" onClick={closeWithdrawModal}>
          <div className="settings-withdraw-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-withdraw-icon">
              <AlertTriangle size={32} />
            </div>
            <h3 className="settings-withdraw-title">정말 탈퇴하시겠습니까?</h3>
            <p className="settings-withdraw-desc">
              탈퇴 시 모든 데이터가 삭제되며<br />복구할 수 없습니다.
            </p>
            
            {/* 비밀번호 입력 */}
            <div className="settings-withdraw-password">
              <div className="form-input-wrapper">
                <Lock className="form-input-icon" size={20} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="비밀번호를 입력하세요"
                  value={withdrawPassword}
                  onChange={(e) => setWithdrawPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && confirmWithdraw()}
                />
              </div>
              {withdrawError && (
                <p className="settings-withdraw-error">{withdrawError}</p>
              )}
            </div>

            <div className="settings-withdraw-actions">
              <button 
                className="settings-withdraw-btn cancel"
                onClick={closeWithdrawModal}
                disabled={isWithdrawing}
              >
                취소
              </button>
              <button 
                className="settings-withdraw-btn confirm"
                onClick={confirmWithdraw}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? '처리중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}