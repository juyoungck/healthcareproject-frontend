/**
 * MyPage.tsx
 * 마이페이지 컴포넌트
 * - 회원정보 조회/수정
 * - 온보딩 정보 요약
 * - 소셜계정 연동관리
 * - 로그아웃/회원탈퇴
 */

import { useState } from 'react';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Edit2,
  ChevronRight,
  Dumbbell,
  Target,
  Calendar,
  AlertTriangle,
  LogOut,
  UserX,
  Camera,
  X,
  Check,
  Settings
} from 'lucide-react';
import SettingsPage from './SettingsPage';

/**
 * Props 타입 정의
 */
interface MyPageProps {
  onBack: () => void;
  onLogout: () => void;
  onEditOnboarding: () => void;
}

/**
 * 더미 사용자 데이터
 * TODO: API 연동 시 실제 데이터로 대체
 */
const DUMMY_USER = {
  id: 1,
  email: 'user@example.com',
  nickname: '운동초보',
  phone: '010-1234-5678',
  profileImage: '',
  userType: 'general' as 'general' | 'trainer',
  createdAt: '2024-01-01',
  onboarding: {
    height: 175,
    weight: 70,
    age: 28,
    gender: '남성',
    exerciseLevel: '초급',
    exerciseGoal: '체중감량',
    injuryHistory: '없음',
    exerciseDays: 3,
    exerciseTime: '1시간',
    allergies: ['갑각류', '땅콩']
  },
  socialAccounts: {
    kakao: true,
    naver: false,
    google: false
  }
};

/**
 * MyPage 컴포넌트
 */
export default function MyPage({ onBack, onLogout, onEditOnboarding }: MyPageProps) {
  /**
   * 상태 관리
   */
  const [user] = useState(DUMMY_USER);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [editNickname, setEditNickname] = useState(user.nickname);
  const [showSettingsPage, setShowSettingsPage] = useState(false);

  /**
   * 닉네임 수정 핸들러
   */
  const handleEditNickname = () => {
    /* TODO: API 연동 - 닉네임 수정 */
    setShowEditModal(false);
  };

  /**
   * 설정 페이지 표시
   */
  if (showSettingsPage) {
    return (
      <SettingsPage 
        onBack={() => setShowSettingsPage(false)}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="mypage">
      {/* 헤더 */}
      <header className="mypage-header">
        <div className="mypage-header-content">
          <button className="mypage-back-btn" onClick={onBack}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="mypage-title">마이페이지</h1>
          <button className="mypage-set-btn" onClick={() => setShowSettingsPage(true)}>
              <Settings size={24} />
          </button>
        </div>
      </header>

      {/* 프로필 섹션 */}
      <div className="mypage-profile-section">
        <div className="mypage-profile-image-wrapper">
          {user.profileImage ? (
            <img src={user.profileImage} alt="프로필" className="mypage-profile-image" />
          ) : (
            <User size={48} className="mypage-profile-placeholder" />
          )}
          <button className="mypage-profile-edit-btn">
            <Camera size={16} />
          </button>
        </div>
        <div className="mypage-profile-info">
          <div className="mypage-nickname-row">
            <h2 className="mypage-nickname">{user.nickname}</h2>
            <button className="mypage-edit-btn" onClick={() => setShowEditModal(true)}>
              <Edit2 size={16} />
            </button>
          </div>
          <span className="mypage-user-type">
            {user.userType === 'trainer' ? '트레이너' : '일반회원'}
          </span>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="mypage-section">
        <h3 className="mypage-section-title">기본 정보</h3>
        <div className="mypage-info-list">
          <div className="mypage-info-item">
            <Mail size={18} className="mypage-info-icon" />
            <span className="mypage-info-label">이메일</span>
            <span className="mypage-info-value">{user.email}</span>
          </div>
          <div className="mypage-info-item">
            <Phone size={18} className="mypage-info-icon" />
            <span className="mypage-info-label">전화번호</span>
            <span className="mypage-info-value">{user.phone}</span>
          </div>
          <div className="mypage-info-item">
            <Calendar size={18} className="mypage-info-icon" />
            <span className="mypage-info-label">가입일</span>
            <span className="mypage-info-value">{user.createdAt}</span>
          </div>
        </div>
      </div>

      {/* 신체/운동 정보 */}
      <div className="mypage-section">
        <div className="mypage-section-header">
          <h3 className="mypage-section-title">신체/운동 정보</h3>
          <button className="mypage-section-edit" onClick={onEditOnboarding}>
            수정
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="mypage-body-grid">
          <div className="mypage-body-item">
            <span className="mypage-body-label">키</span>
            <span className="mypage-body-value">{user.onboarding.height}<span className="mypage-body-unit">cm</span></span>
          </div>
          <div className="mypage-body-item">
            <span className="mypage-body-label">몸무게</span>
            <span className="mypage-body-value">{user.onboarding.weight}<span className="mypage-body-unit">kg</span></span>
          </div>
          <div className="mypage-body-item">
            <span className="mypage-body-label">나이</span>
            <span className="mypage-body-value">{user.onboarding.age}<span className="mypage-body-unit">세</span></span>
          </div>
          <div className="mypage-body-item">
            <span className="mypage-body-label">성별</span>
            <span className="mypage-body-value">{user.onboarding.gender}</span>
          </div>
        </div>
        <div className="mypage-info-list">
          <div className="mypage-info-item">
            <Dumbbell size={18} className="mypage-info-icon" />
            <span className="mypage-info-label">운동 경력</span>
            <span className="mypage-info-value">{user.onboarding.exerciseLevel}</span>
          </div>
          <div className="mypage-info-item">
            <Target size={18} className="mypage-info-icon" />
            <span className="mypage-info-label">운동 목표</span>
            <span className="mypage-info-value">{user.onboarding.exerciseGoal}</span>
          </div>
          {/* 부상 이력 (없는 경우) */}
          <div className="mypage-info-item">
            <AlertTriangle size={18} className="mypage-info-icon" />
            <span className="mypage-info-label">부상 이력</span>
            <span className="mypage-info-value">{user.onboarding.injuryHistory}</span>
          </div>
          {/* 부상 이력 (있는 경우) */}
          {/*
          <div className="mypage-injury-list">
              <AlertTriangle size={18} className="mypage-info-icon" />
              <span className="mypage-info-label">부상 이력</span>
              <div className="mypage-injury-item">
              <span className="mypage-injury-part">1. 허리</span>
              <span className="mypage-injury-severity caution">주의 요함</span>
              </div>
              <div className="mypage-injury-item">
              <span className="mypage-injury-part">2. 무릎</span>
              <span className="mypage-injury-severity mild">경미</span>
              </div>
          </div>
          */}
          <div className="mypage-info-item">
            <Calendar size={18} className="mypage-info-icon" />
            <span className="mypage-info-label">운동 주기</span>
            <span className="mypage-info-value">주 {user.onboarding.exerciseDays}일, {user.onboarding.exerciseTime}</span>
          </div>
        </div>

        {/* 알레르기 정보 */}
        <div className="mypage-allergy-section">
            <span className="mypage-allergy-label">알레르기</span>
            <div className="mypage-allergy-tags">
            {user.onboarding.allergies && user.onboarding.allergies.length > 0 ? (
                user.onboarding.allergies.map((allergy, index) => (
                <span key={index} className="mypage-allergy-tag">{allergy}</span>
                ))
            ) : (
                <span className="mypage-allergy-none">없음</span>
            )}
            </div>
        </div>
      </div>

      {/* 소셜 계정 연동 */}
      <div className="mypage-section">
        <h3 className="mypage-section-title">소셜 계정 연동</h3>
        <div className="mypage-social-list">
          <div className="mypage-social-item">
            <div className="mypage-social-icon kakao">K</div>
            <span className="mypage-social-name">카카오</span>
            <button className={`mypage-social-btn ${user.socialAccounts.kakao ? 'connected' : ''}`}>
              {user.socialAccounts.kakao ? '연동됨' : '연동하기'}
            </button>
          </div>
          <div className="mypage-social-item">
            <div className="mypage-social-icon naver">N</div>
            <span className="mypage-social-name">네이버</span>
            <button className={`mypage-social-btn ${user.socialAccounts.naver ? 'connected' : ''}`}>
              {user.socialAccounts.naver ? '연동됨' : '연동하기'}
            </button>
          </div>
          <div className="mypage-social-item">
            <div className="mypage-social-icon google">G</div>
            <span className="mypage-social-name">구글</span>
            <button className={`mypage-social-btn ${user.socialAccounts.google ? 'connected' : ''}`}>
              {user.socialAccounts.google ? '연동됨' : '연동하기'}
            </button>
          </div>
        </div>
      </div>

      {/* 닉네임 수정 모달 */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">닉네임 수정</h2>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="mypage-edit-modal-content">
              <div className="form-group">
                <label className="form-label">닉네임</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 'var(--spacing-lg)' }}
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  maxLength={10}
                />
              </div>
              <button className="form-submit-btn" onClick={handleEditNickname}>
                <Check size={20} />
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}