/**
 * SettingsPage.tsx
 * 설정 페이지 컴포넌트
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSocialConnections } from '../../api/auth';
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
  Key,
  X,
} from 'lucide-react';
import PasswordChangeModal from '../components/settings/PasswordChangeModal';
import WithdrawModal from '../components/settings/WithdrawModal';
import { TERMS_OF_SERVICE, TERMS_EFFECTIVE_DATE } from '../../data/terms';
import { PRIVACY_POLICY, PRIVACY_EFFECTIVE_DATE } from '../../data/privacy';

/**
 * Props 타입 정의
 */
interface SettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
}

/**
 * SettingsPage 컴포넌트
 */
export default function SettingsPage({ onBack, onLogout }: SettingsPageProps) {
  /**
   * Context에서 로그아웃 함수 가져오기
   */
  const { onLogout: contextLogout } = useAuth();

  /** 모달 상태 */
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  /** 소셜 로그인 여부 (비밀번호 없는 경우) */
  const [hasPassword, setHasPassword] = useState(true);

  /**
   * 소셜 연결 정보 조회
   */
  useEffect(() => {
    const fetchSocialConnections = async () => {
      try {
        const response = await getSocialConnections();
        setHasPassword(response.hasPassword);
      } catch {
        /* 조회 실패 시 기본값 유지 */
      }
    };

    fetchSocialConnections();
  }, []);

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      contextLogout();
      onLogout();
    }
  };

  /**
   * 비밀번호 변경 성공 핸들러
   */
  const handlePasswordChangeSuccess = () => {
    contextLogout();
    onLogout();
  };

  /**
   * 회원탈퇴 성공 핸들러
   */
  const handleWithdrawSuccess = () => {
    contextLogout();
    onLogout();
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
            <div className="settings-item settings-item-disabled">
              <div className="settings-item-left">
                <Bell size={20} className="settings-item-icon" />
                <span className="settings-item-label">알림 설정</span>
              </div>
              <span className="settings-item-badge">준비중</span>
            </div>
          </div>
        </section>

        {/* 약관 및 정책 */}
        <section className="settings-section">
          <h3 className="settings-section-title">약관 및 정책</h3>
          <div className="settings-list">
            <button className="settings-item" onClick={() => setShowTermsModal(true)}>
              <div className="settings-item-left">
                <FileText size={20} className="settings-item-icon" />
                <span className="settings-item-label">이용약관</span>
              </div>
              <ChevronRight size={20} className="settings-item-arrow" />
            </button>
            <button className="settings-item" onClick={() => setShowPrivacyModal(true)}>
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
            <div className="settings-item settings-item-disabled">
              <div className="settings-item-left">
                <Mail size={20} className="settings-item-icon" />
                <span className="settings-item-label">문의하기</span>
              </div>
              <span className="settings-item-badge">준비중</span>
            </div>
          </div>
        </section>

        {/* 계정 */}
        <section className="settings-section">
          <h3 className="settings-section-title">계정</h3>
          <div className="settings-list">
            {hasPassword ? (
              <button className="settings-item" onClick={() => setShowPasswordModal(true)}>
                <div className="settings-item-left">
                  <Key size={20} className="settings-item-icon" />
                  <span className="settings-item-label">비밀번호 변경</span>
                </div>
                <ChevronRight size={20} className="settings-item-arrow" />
              </button>
            ) : (
              <div className="settings-item settings-item-disabled">
                <div className="settings-item-left">
                  <Key size={20} className="settings-item-icon" />
                  <span className="settings-item-label">비밀번호 변경</span>
                </div>
                <span className="settings-item-badge">소셜 로그인</span>
              </div>
            )}
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

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <PasswordChangeModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handlePasswordChangeSuccess}
        />
      )}

      {/* 회원탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <WithdrawModal
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={handleWithdrawSuccess}
        />
      )}

      {/* 이용약관 모달 */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="settings-policy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-policy-header">
              <h2 className="settings-policy-title">이용약관</h2>
              <button className="settings-policy-close" onClick={() => setShowTermsModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="settings-policy-content">
              {TERMS_OF_SERVICE.map((section, index) => (
                <div key={index}>
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                </div>
              ))}
              <p className="settings-policy-date">시행일: {TERMS_EFFECTIVE_DATE}</p>
            </div>
          </div>
        </div>
      )}

      {/* 개인정보 처리방침 모달 */}
      {showPrivacyModal && (
        <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
          <div className="settings-policy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-policy-header">
              <h2 className="settings-policy-title">개인정보 처리방침</h2>
              <button className="settings-policy-close" onClick={() => setShowPrivacyModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="settings-policy-content">
              {PRIVACY_POLICY.map((section, index) => (
                <div key={index}>
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                </div>
              ))}
              <p className="settings-policy-date">시행일: {PRIVACY_EFFECTIVE_DATE}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
