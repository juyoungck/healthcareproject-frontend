/**
 * SettingsPage.tsx
 * 설정 페이지 컴포넌트
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
} from 'lucide-react';
import PasswordChangeModal from '../components/settings/PasswordChangeModal';
import WithdrawModal from '../components/settings/WithdrawModal';

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
            <button className="settings-item" onClick={() => setShowPasswordModal(true)}>
              <div className="settings-item-left">
                <Key size={20} className="settings-item-icon" />
                <span className="settings-item-label">비밀번호 변경</span>
              </div>
              <ChevronRight size={20} className="settings-item-arrow" />
            </button>
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
    </div>
  );
}
