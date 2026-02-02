/**
 * MyPage.tsx
 * 마이페이지 컴포넌트
 * - 회원정보 조회/수정
 * - 온보딩 정보 요약
 * - 소셜계정 연동관리
 * - 로그아웃/회원탈퇴
 */

import { useEffect } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatPhoneNumber } from '../../utils/format';

/* 커스텀 훅 */
import { useProfileEdit } from '../../hooks/mypage/useProfileEdit';
import { useProfileImage } from '../../hooks/mypage/useProfileImage';
import { useSocialConnections } from '../../hooks/mypage/useSocialConnections';
import { useTrainerProfile } from '../../hooks/mypage/useTrainerProfile';
import { useOnboardingData } from '../../hooks/mypage/useOnboardingData';

/* 서브 컴포넌트 */
import ProfileSection from '../components/mypage/ProfileSection';
import TrainerBioSection from '../components/mypage/TrainerBioSection';
import BasicInfoSection from '../components/mypage/BasicInfoSection';
import BodyInfoSection from '../components/mypage/BodyInfoSection';
import SocialSection from '../components/mypage/SocialSection';
import RoleActionsSection from '../components/mypage/RoleActionsSection';

/* 모달 컴포넌트 */
import NicknameModal from '../components/mypage/modals/NicknameModal';
import PhoneModal from '../components/mypage/modals/PhoneModal';
import BioModal from '../components/mypage/modals/BioModal';
import ProfileImageSheet from '../components/mypage/modals/ProfileImageSheet';

/* 기타 */
import SettingsPage from './SettingsPage';
import TrainerApplyModal from '../components/auth/TrainerApplyModal';
import { useState } from 'react';

/**
 * Props 타입 정의
 */
interface MyPageProps {
  onBack: () => void;
  onLogout: () => void;
  onEditOnboarding: () => void;
  onOpenAdminPage?: () => void;
}

/**
 * MyPage 컴포넌트
 */
export default function MyPage({ onBack, onLogout, onEditOnboarding, onOpenAdminPage }: MyPageProps) {
  /**
   * Context
   */
  const { user: userInfo, updateUser, refreshUser } = useAuth();

  /**
   * 페이지 상태
   */
  const [showSettingsPage, setShowSettingsPage] = useState(false);

  /**
   * 커스텀 훅
   */
  const {
    showNicknameModal,
    editNickname,
    isUpdatingNickname,
    setShowNicknameModal,
    setEditNickname,
    handleEditNickname,
    showPhoneModal,
    editPhoneNumber,
    isUpdatingPhoneNumber,
    setShowPhoneModal,
    setEditPhoneNumber,
    handleEditPhoneNumber,
  } = useProfileEdit();

  const {
    isUploadingImage,
    showProfileSheet,
    fileInputRef,
    setShowProfileSheet,
    handleChangePhoto,
    handleImageUpload,
    handleResetProfileImage,
  } = useProfileImage();

  const {
    isLoadingSocial,
    isSocialActionLoading,
    isConnected,
    handleConnectSocial,
    handleDisconnectSocial,
    fetchSocialConnections,
  } = useSocialConnections();

  const {
    trainerInfo,
    showBioModal,
    editBio,
    isUpdatingBio,
    showTrainerModal,
    isApplyingTrainer,
    fetchTrainerInfo,
    setShowBioModal,
    setEditBio,
    setShowTrainerModal,
    handleUpdateBio,
    handleTrainerApply,
    getTrainerStatus,
    openBioModal,
  } = useTrainerProfile();

  const {
    profile,
    injuries,
    allergies,
    isLoading,
    error,
    fetchOnboardingData,
  } = useOnboardingData();

  /**
   * userInfo 변경 시 초기값 설정
   */
  useEffect(() => {
    if (userInfo) {
      setEditNickname(userInfo.nickname);
      setEditPhoneNumber(userInfo.phoneNumber || '');
    }
  }, [userInfo, setEditNickname, setEditPhoneNumber]);

  /**
   * 트레이너 정보 로드
   */
  useEffect(() => {
    if (userInfo?.role === 'TRAINER' || userInfo?.role === 'USER') {
      fetchTrainerInfo(userInfo.role);
    }
  }, [userInfo?.role, fetchTrainerInfo]);

  /**
   * 모든 데이터 새로고침 (에러 시 재시도)
   */
  const handleRefreshAll = async () => {
    await Promise.all([
      fetchOnboardingData(),
      fetchSocialConnections(),
      fetchTrainerInfo(userInfo?.role),
    ]);
  };

  /**
   * 닉네임 수정 모달 열기
   */
  const openNicknameModal = () => {
    setEditNickname(userInfo?.nickname || '');
    setShowNicknameModal(true);
  };

  /**
   * 전화번호 수정 모달 열기
   */
  const openPhoneModal = () => {
    setEditPhoneNumber(formatPhoneNumber(userInfo?.phoneNumber || ''));
    setShowPhoneModal(true);
  };

  /**
   * 설정 페이지 렌더링
   */
  if (showSettingsPage) {
    return (
      <SettingsPage
        onBack={() => setShowSettingsPage(false)}
        onLogout={onLogout}
      />
    );
  }

  /**
   * 로딩 상태
   */
  if (isLoading) {
    return (
      <div className="mypage">
        <header className="mypage-header">
          <div className="mypage-header-content">
            <button className="mypage-back-btn" onClick={onBack}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="mypage-title">마이페이지</h1>
            <div style={{ width: 24 }} />
          </div>
        </header>
        <div className="mypage-loading">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  /**
   * 에러 상태
   */
  if (error) {
    return (
      <div className="mypage">
        <header className="mypage-header">
          <div className="mypage-header-content">
            <button className="mypage-back-btn" onClick={onBack}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="mypage-title">마이페이지</h1>
            <div style={{ width: 24 }} />
          </div>
        </header>
        <div className="mypage-error">
          <p>{error}</p>
          <button onClick={handleRefreshAll}>다시 시도</button>
        </div>
      </div>
    );
  }

  /**
   * 메인 렌더링
   */
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
      <ProfileSection
        profileImageUrl={userInfo?.profileImageUrl}
        nickname={userInfo?.nickname}
        handle={userInfo?.handle}
        role={userInfo?.role}
        isUploadingImage={isUploadingImage}
        fileInputRef={fileInputRef}
        onImageUpload={(e) => handleImageUpload(e, (url) => updateUser({ profileImageUrl: url }))}
        onShowProfileSheet={() => setShowProfileSheet(true)}
        onEditNickname={openNicknameModal}
      />

      {/* 트레이너 소개 (트레이너만) */}
      {userInfo?.role === 'TRAINER' && (
        <TrainerBioSection
          bio={trainerInfo?.bio}
          onEdit={openBioModal}
        />
      )}

      {/* 기본 정보 */}
      <BasicInfoSection
        email={userInfo?.email}
        phoneNumber={userInfo?.phoneNumber}
        createdAt={userInfo?.createdAt}
        onEditPhoneNumber={openPhoneModal}
      />

      {/* 신체/운동 정보 */}
      <BodyInfoSection
        profile={profile}
        injuries={injuries}
        allergies={allergies}
        onEditOnboarding={onEditOnboarding}
      />

      {/* 소셜 계정 연동 */}
      <SocialSection
        isLoadingSocial={isLoadingSocial}
        isSocialActionLoading={isSocialActionLoading}
        isConnected={isConnected}
        onConnectSocial={handleConnectSocial}
        onDisconnectSocial={handleDisconnectSocial}
      />

      {/* 역할별 액션 (트레이너 등록 / 관리자 패널) */}
      <RoleActionsSection
        role={userInfo?.role}
        trainerStatus={getTrainerStatus(userInfo?.role)}
        rejectReason={trainerInfo?.rejectReason}
        onTrainerApply={() => setShowTrainerModal(true)}
        onOpenAdminPage={onOpenAdminPage}
      />

      {/* 트레이너 등록 모달 */}
      {showTrainerModal && (
        <TrainerApplyModal
          onClose={() => setShowTrainerModal(false)}
          onSubmit={(data) => handleTrainerApply(data, refreshUser)}
          isSubmitting={isApplyingTrainer}
        />
      )}

      {/* 닉네임 수정 모달 */}
      {showNicknameModal && (
        <NicknameModal
          nickname={editNickname}
          isUpdating={isUpdatingNickname}
          onChange={setEditNickname}
          onSubmit={() => handleEditNickname((nickname) => updateUser({ nickname }))}
          onClose={() => setShowNicknameModal(false)}
        />
      )}

      {/* 전화번호 수정 모달 */}
      {showPhoneModal && (
        <PhoneModal
          phoneNumber={editPhoneNumber}
          isUpdating={isUpdatingPhoneNumber}
          onChange={setEditPhoneNumber}
          onSubmit={() => handleEditPhoneNumber((phone) => updateUser({ phoneNumber: phone }))}
          onClose={() => setShowPhoneModal(false)}
        />
      )}

      {/* 소개문구 수정 모달 */}
      {showBioModal && (
        <BioModal
          bio={editBio}
          isUpdating={isUpdatingBio}
          onChange={setEditBio}
          onSubmit={handleUpdateBio}
          onClose={() => setShowBioModal(false)}
        />
      )}

      {/* 프로필 이미지 바텀시트 */}
      {showProfileSheet && (
        <ProfileImageSheet
          onChangePhoto={handleChangePhoto}
          onResetPhoto={() => handleResetProfileImage(
            userInfo?.profileImageUrl ?? null,
            () => updateUser({ profileImageUrl: null })
          )}
          onClose={() => setShowProfileSheet(false)}
        />
      )}
    </div>
  );
}
