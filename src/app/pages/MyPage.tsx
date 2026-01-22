/**
 * MyPage.tsx
 * 마이페이지 컴포넌트
 * - 회원정보 조회/수정
 * - 온보딩 정보 요약
 * - 소셜계정 연동관리
 * - 로그아웃/회원탈퇴
 */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
  Settings,
  GraduationCap,
  Clock,
  UserMinus,
  ImagePlus,
  RotateCcw
} from 'lucide-react';
import SettingsPage from './SettingsPage';
import TrainerApplyModal, { TrainerApplyData } from '../components/auth/TrainerApplyModal';
import { getProfile, getInjuries, getAllergies, updateNickname, updatePhoneNumber, updateProfileImage } from '../../api/me';
import type { ProfileResponse, InjuryItem } from '../../api/types/me';
import { CURRENT_USER_TRAINER_STATUS } from '../../data/users';
import { uploadImage } from '../../api/upload';

const ALLERGY_LABEL_MAP: Record<string, string> = {
  WHEAT: '밀',
  BUCKWHEAT: '메밀',
  PEANUT: '땅콩',
  TREE_NUT: '견과류',
  CRUSTACEAN: '갑각류',
  MOLLUSK: '연체류',
  FISH: '생선',
  EGG: '계란',
  MILK: '우유',
  BEEF: '소고기',
  PORK: '돼지고기',
  CHICKEN: '닭고기',
  SOY: '대두',
  SESAME: '참깨',
  SULFITE: '아황산류'
};

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
   * 상태 관리
   */
  const { user: userInfo, updateUser } = useAuth();

  /* 로딩/에러 */
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /* 신체/운동 정보 */
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  /* 부상 정보 */
  const [injuries, setInjuries] = useState<InjuryItem[]>([]);

  /* 알러지 정보 */
  const [allergies, setAllergies] = useState<string[]>([]);

  /* 모달 상태 */
  const [showSettingsPage, setShowSettingsPage] = useState(false);
  const [showTrainerModal, setShowTrainerModal] = useState(false);

  /* 닉네임 수정 */
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);

  /* 전화번호 수정 */
  const [showPhoneNumberModal, setShowPhoneNumberModal] = useState(false);
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [isUpdatingPhoneNumber, setIsUpdatingPhoneNumber] = useState(false);

  /* 프로필 이미지 업로드 */
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * ===========================================
   * 유저 데이터 로드
   * ===========================================
   */

  /**
   * userInfo(Context)가 변경되면 닉네임, 전화번호 초기값 설정
   */
  useEffect(() => {
    if (userInfo) {
      setEditNickname(userInfo.nickname);
      setEditPhoneNumber(userInfo.phoneNumber || '');
    }
  }, [userInfo]);

  /**
   * 온보딩 데이터만 로드 (userInfo는 Context에서 가져옴)
   */
  useEffect(() => {
    fetchOnboardingData();
  }, []);

  const fetchOnboardingData = async () => {
    setIsLoading(true);
    setError('');

    try {
      /* 온보딩 데이터만 로드 (userInfo는 이미 Context에 있음) */
      const [profileResult, injuriesResult, allergiesResult] = await Promise.allSettled([
        getProfile(),
        getInjuries(),
        getAllergies(),
      ]);

      /* 프로필 정보 */
      if (profileResult.status === 'fulfilled') {
        setProfile(profileResult.value);
      } else {
        console.log('프로필 정보 없음 또는 로드 실패');
        setProfile(null);
      }

      /* 부상 정보 */
      if (injuriesResult.status === 'fulfilled') {
        setInjuries(injuriesResult.value.injuries);
      } else {
        console.log('부상 정보 없음 또는 로드 실패');
        setInjuries([]);
      }

      /* 알레르기 정보 */
      if (allergiesResult.status === 'fulfilled') {
        setAllergies(allergiesResult.value.allergies);
      } else {
        console.log('알레르기 정보 없음 또는 로드 실패');
        setAllergies([]);
      }

    } catch (err) {
      console.error('온보딩 데이터 로드 실패:', err);
      setError('정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 닉네임 수정 핸들러
   */
  const handleEditNickname = async () => {
    if (!editNickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setIsUpdatingNickname(true);

    try {
      await updateNickname({ nickname: editNickname });

      /* API 호출 성공 시 Context 상태 업데이트 */
      updateUser({ nickname: editNickname });

      setShowNicknameModal(false);
      alert('닉네임이 수정되었습니다.');
    } catch (err: unknown) {
      console.error('닉네임 수정 실패:', err);
      alert('닉네임 수정에 실패했습니다.');
    } finally {
      setIsUpdatingNickname(false);
    }
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
   * 전화번호 수정 핸들러
   */
  const handleEditPhoneNumber = async () => {
    /* 전화번호 형식 검증 (선택) */
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (editPhoneNumber && !phoneRegex.test(editPhoneNumber.replace(/-/g, ''))) {
      alert('올바른 전화번호 형식이 아닙니다.');
      return;
    }

    const formattedPhone = editPhoneNumber ? formatPhoneNumber(editPhoneNumber) : '';

    setIsUpdatingPhoneNumber(true);

    try {
      await updatePhoneNumber({ phoneNumber: formattedPhone });

      /* API 호출 성공 시 Context 상태 업데이트 */
      updateUser({ phoneNumber: formattedPhone });

      setShowPhoneNumberModal(false);
      alert('전화번호가 수정되었습니다.');
    } catch (err: unknown) {
      console.error('전화번호 수정 실패:', err);
      alert('전화번호 수정에 실패했습니다.');
    } finally {
      setIsUpdatingPhoneNumber(false);
    }
  };

  /**
 * 기본 사진으로 변경 핸들러
 */
  const handleResetProfileImage = async () => {
    if (!userInfo?.profileImageUrl) {
      alert('이미 기본 사진입니다.');
      setShowProfileSheet(false);
      return;
    }

    if (!confirm('기본 사진으로 변경하시겠습니까?')) {
      return;
    }

    setIsUploadingImage(true);

    try {
      await updateProfileImage({ profileImageUrl: null });
      updateUser({ profileImageUrl: null });
      alert('기본 사진으로 변경되었습니다.');
    } catch (error) {
      console.error('프로필 이미지 초기화 실패:', error);
      alert('기본 사진으로 변경에 실패했습니다.');
    } finally {
      setIsUploadingImage(false);
      setShowProfileSheet(false);
    }
  };

  /**
   * 사진 변경하기 클릭 핸들러
   */
  const handleChangePhoto = () => {
    setShowProfileSheet(false);
    fileInputRef.current?.click();
  };

  /**
 * 프로필 이미지 업로드 핸들러
 */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    /* 파일 크기 체크 (5MB) */
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하만 가능합니다.');
      return;
    }

    /* 이미지 타입 체크 */
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setIsUploadingImage(true);

    try {
      /* 1. 이미지 업로드 → URL 받기 */
      const imageUrl = await uploadImage(file);

      /* 2. 프로필 이미지 URL 저장 API 호출 */
      await updateProfileImage({ profileImageUrl: imageUrl });

      /* 3. Context 상태 업데이트 */
      updateUser({ profileImageUrl: imageUrl });

      alert('프로필 이미지가 변경되었습니다.');
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploadingImage(false);
      /* input 초기화 */
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * 트레이너 등록 신청 완료 핸들러
   */
  const handleTrainerApply = (data: TrainerApplyData) => {
    console.log('트레이너 신청 데이터:', data);
    /* TODO: API 연동 - POST /api/trainer/application */
    alert('트레이너 등록 신청이 완료되었습니다.\n관리자 승인 후 트레이너로 활동할 수 있습니다.');
    setShowTrainerModal(false);
  };

  /**
   * 트레이너 해제 핸들러
   */
  const handleTrainerRelease = () => {
    if (confirm('트레이너를 해제하시겠습니까?\n해제 후에도 다시 신청할 수 있습니다.')) {
      /* TODO: API 연동 - 트레이너 해제 */
      alert('트레이너가 해제되었습니다.');
    }
  };

  /* 운동 경력 라벨 */
  const getExperienceLevelLabel = (level: string | undefined) => {
    switch (level) {
      case 'BEGINNER': return '입문';
      case 'ELEMENTARY': return '초급';
      case 'INTERMEDIATE': return '중급';
      case 'ADVANCED': return '고급';
      default: return '-';
    }
  };

  /* 운동 목표 라벨 */
  const getGoalTypeLabel = (goal: string | undefined) => {
    switch (goal) {
      case 'DIET': return '체중 감량';
      case 'BULK': return '근력 향상';
      case 'FLEXIBILITY': return '유연성';
      case 'MAINTAIN': return '체력 향상';
      default: return '-';
    }
  };

  /* 성별 라벨 */
  const getGenderLabel = (gender: string | undefined) => {
    switch (gender) {
      case 'MALE': return '남성';
      case 'FEMALE': return '여성';
      default: return '-';
    }
  };

  /* 운동 시간 라벨 */
  const getSessionTimeLabel = (minutes: number | undefined) => {
    if (!minutes) return '-';
    if (minutes <= 30) return '30분 이내';
    if (minutes <= 60) return '1시간';
    if (minutes <= 90) return '1시간 30분';
    return '2시간 이상';
  };

  /* 부상 정도 라벨 */
  const getInjuryLevelLabel = (level: string) => {
    switch (level) {
      case 'MILD': return '경미';
      case 'CAUTION': return '주의 요함';
      case 'SEVERE': return '심각';
      default: return '-';
    }
  };

  /* 알레르기 라벨 */
  const getAllergyLabel = (allergyEnum: string): string => {
    return ALLERGY_LABEL_MAP[allergyEnum] || allergyEnum;
  };

  /* 날짜 포맷 */
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  /* 트레이너 상태 (role 기반) */
  const getTrainerStatus = () => {
    if (userInfo?.role === 'TRAINER') return 'approved';
    return 'none';
  };

  /**
   * 트레이너 버튼 렌더링
   */
  const renderTrainerButton = () => {
    const status = getTrainerStatus();

    switch (status) {
      case 'none':
        return (
          <button
            className="mypage-trainer-btn apply"
            onClick={() => setShowTrainerModal(true)}
          >
            <GraduationCap size={20} />
            <span>트레이너로 등록하기</span>
            <ChevronRight size={18} />
          </button>
        );
      case 'pending':
        return (
          <button className="mypage-trainer-btn pending" disabled>
            <Clock size={20} />
            <span>트레이너 승인 대기중</span>
          </button>
        );
      case 'approved':
        return (
          <button
            className="mypage-trainer-btn release"
            onClick={handleTrainerRelease}
          >
            <UserMinus size={20} />
            <span>트레이너 해제하기</span>
          </button>
        );
      case 'rejected':
        return (
          <button
            className="mypage-trainer-btn release"
            onClick={handleTrainerRelease}
          >
            <GraduationCap size={20} />
            <span>트레이너 등록 재신청</span>
          </button>
        );
      default:
        return null;
    }
  };

  /* 설정 페이지 */
  if (showSettingsPage) {
    return (
      <SettingsPage
        onBack={() => setShowSettingsPage(false)}
        onLogout={onLogout}
      />
    );
  }

  /* 로딩 */
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

  /* 에러 */
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
          <button onClick={fetchUserData}>다시 시도</button>
        </div>
      </div>
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
          {userInfo?.profileImageUrl ? (
            <img src={userInfo.profileImageUrl} alt="프로필" className="mypage-profile-image" />
          ) : (
            <User size={48} className="mypage-profile-placeholder" />
          )}
          <>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button
              className="mypage-profile-edit-btn"
              onClick={() => setShowProfileSheet(true)}
              disabled={isUploadingImage}
            >
              {isUploadingImage ? (
                <div className="mypage-image-spinner" />
              ) : (
                <Camera size={16} />
              )}
            </button>
          </>
        </div>
        <div className="mypage-profile-info">
          <div className="mypage-nickname-row">
            <h2 className="mypage-nickname">{userInfo?.nickname}</h2>
            <button className="mypage-edit-btn" onClick={() => setShowNicknameModal(true)}>
              <Edit2 size={14} />
            </button>
          </div>
          <span className={`mypage-user-type ${userInfo?.role === 'TRAINER' ? 'trainer' : 'general'}`}>
            {userInfo?.role === 'TRAINER' ? '트레이너' : '일반회원'}
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
            <span className="mypage-info-value">{userInfo?.email}</span>
          </div>
          <div className="mypage-info-item">
            <Phone size={18} className="mypage-info-icon" />
            <span className="mypage-info-label">전화번호</span>
            <button className="mypage-edit-btn" onClick={() => {
              setEditPhoneNumber(formatPhoneNumber(userInfo?.phoneNumber || ''));
              setShowPhoneNumberModal(true);
            }}>
              <Edit2 size={14} />
            </button>
            <span className="mypage-info-value">{userInfo?.phoneNumber || '-'}</span>
          </div>
          <div className="mypage-info-item">
            <Calendar size={18} className="mypage-info-icon" />
            <span className="mypage-info-label">가입일</span>
            <span className="mypage-info-value">{formatDate(userInfo?.createdAt)}</span>
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
        {profile ? (
          <>
            <div className="mypage-body-grid">
              <div className="mypage-body-item">
                <span className="mypage-body-label">키</span>
                <span className="mypage-body-value">{profile.heightCm}<span className="mypage-body-unit">cm</span></span>
              </div>
              <div className="mypage-body-item">
                <span className="mypage-body-label">몸무게</span>
                <span className="mypage-body-value">{profile.weightKg}<span className="mypage-body-unit">kg</span></span>
              </div>
              <div className="mypage-body-item">
                <span className="mypage-body-label">나이</span>
                <span className="mypage-body-value">{profile.age}<span className="mypage-body-unit">세</span></span>
              </div>
              <div className="mypage-body-item">
                <span className="mypage-body-label">성별</span>
                <span className="mypage-body-value">{getGenderLabel(profile.gender)}</span>
              </div>
            </div>
            <div className="mypage-info-list">
              <div className="mypage-info-item">
                <Dumbbell size={18} className="mypage-info-icon" />
                <span className="mypage-info-label">운동 경력</span>
                <span className="mypage-info-value">{getExperienceLevelLabel(profile.experienceLevel)}</span>
              </div>
              <div className="mypage-info-item">
                <Target size={18} className="mypage-info-icon" />
                <span className="mypage-info-label">운동 목표</span>
                <span className="mypage-info-value">{getGoalTypeLabel(profile.goalType)}</span>
              </div>
              <div className="mypage-info-item">
                <Calendar size={18} className="mypage-info-icon" />
                <span className="mypage-info-label">운동 주기</span>
                <span className="mypage-info-value">주 {profile.weeklyDays}일, {getSessionTimeLabel(profile.sessionMinutes)}</span>
              </div>
              {/* 부상 이력 (없는 경우) */}
              <div className="mypage-info-item">
                <AlertTriangle size={18} className="mypage-info-icon" />
                <span className="mypage-info-label">부상 이력</span>
                <span className="mypage-info-value">{injuries.length > 0 ? `${injuries.length}건` : '없음'}</span>
              </div>
            </div>

            {/* 부상 상세 (있는 경우) */}
            {injuries.length > 0 && (
              <div className="mypage-injury-list">
                {injuries.map((injury, index) => (
                  <div key={injury.injuryId} className="mypage-injury-item">
                    <span className="mypage-injury-part">{index + 1}. {injury.injuryPart}</span>
                    <span className={`mypage-injury-severity ${injury.injuryLevel.toLowerCase()}`}>
                      {getInjuryLevelLabel(injury.injuryLevel)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 알레르기 정보 */}
            <div className="mypage-allergy-section">
              <span className="mypage-allergy-label">알레르기</span>
              <div className="mypage-allergy-tags">
                {allergies.length > 0 ? (
                  allergies.map((allergy, index) => (
                    <span key={index} className="mypage-allergy-tag">{getAllergyLabel(allergy)}</span>
                  ))
                ) : (
                  <span className="mypage-allergy-none">없음</span>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="mypage-no-profile">
            <p>등록된 신체/운동 정보가 없습니다.</p>
            <button className="mypage-register-btn" onClick={onEditOnboarding}>
              정보 등록하기
            </button>
          </div>
        )}
      </div>

      {/* 소셜 계정 연동 */}
      <div className="mypage-section">
        <h3 className="mypage-section-title">소셜 계정 연동</h3>
        <div className="mypage-social-list">
          <div className="mypage-social-item">
            <div className="mypage-social-icon kakao">K</div>
            <span className="mypage-social-name">카카오</span>
            <button className="mypage-social-btn">연동하기</button>
          </div>
          <div className="mypage-social-item">
            <div className="mypage-social-icon naver">N</div>
            <span className="mypage-social-name">네이버</span>
            <button className="mypage-social-btn">연동하기</button>
          </div>
          <div className="mypage-social-item">
            <div className="mypage-social-icon google">G</div>
            <span className="mypage-social-name">구글</span>
            <button className="mypage-social-btn">연동하기</button>
          </div>
        </div>
      </div>

      {/* 트레이너 등록/상태 섹션 */}
      <div className="mypage-section mypage-trainer-section">
        {renderTrainerButton()}
      </div>

      {/* 관리자 패널 버튼 (관리자만 표시) */}
      {userInfo?.role === 'ADMIN' && onOpenAdminPage && (
        <div className="mypage-section">
          <button
            className="mypage-trainer-btn apply"
            onClick={onOpenAdminPage}
          >
            <Settings size={20} />
            <span>관리자 패널</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* 트레이너 등록 모달 */}
      {showTrainerModal && (
        <TrainerApplyModal
          onClose={() => setShowTrainerModal(false)}
          onSubmit={handleTrainerApply}
        />
      )}

      {/* 닉네임 수정 모달 */}
      {showNicknameModal && (
        <div className="modal-overlay" onClick={() => setShowNicknameModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">닉네임 수정</h2>
              <button className="modal-close-btn" onClick={() => setShowNicknameModal(false)}>
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
              <button
                className="form-submit-btn"
                onClick={handleEditNickname}
                disabled={isUpdatingNickname}
              >
                {isUpdatingNickname ? '저장 중...' : (
                  <>
                    <Check size={20} />
                    저장
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 전화번호 수정 모달 */}
      {showPhoneNumberModal && (
        <div className="modal-overlay" onClick={() => setShowPhoneNumberModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">전화번호 수정</h2>
              <button className="modal-close-btn" onClick={() => setShowPhoneNumberModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="mypage-edit-modal-content">
              <div className="form-group">
                <label className="form-label">전화번호</label>
                <div className="form-input-wrapper">
                  <Phone className="form-input-icon" size={20} />
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="010-0000-0000"
                    value={editPhoneNumber}
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                    maxLength={13}
                  />
                </div>
              </div>
              <button
                className="form-submit-btn"
                onClick={handleEditPhoneNumber}
                disabled={isUpdatingPhoneNumber}
              >
                {isUpdatingPhoneNumber ? '저장 중...' : (
                  <>
                    <Check size={20} />
                    저장
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 프로필 이미지 바텀 시트 */}
      {showProfileSheet && (
        <div
          className="profile-bottom-sheet-overlay"
          onClick={() => setShowProfileSheet(false)}
        >
          <div
            className="profile-bottom-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="profile-bottom-sheet-handle" />
            <div className="profile-bottom-sheet-menu">
              <button
                className="profile-bottom-sheet-item"
                onClick={handleChangePhoto}
              >
                <ImagePlus size={20} />
                <span>사진 변경하기</span>
              </button>
              <button
                className="profile-bottom-sheet-item"
                onClick={handleResetProfileImage}
              >
                <RotateCcw size={20} />
                <span>기본 사진으로 변경</span>
              </button>
            </div>
            <div className="profile-bottom-sheet-divider" />
            <button
              className="profile-bottom-sheet-cancel"
              onClick={() => setShowProfileSheet(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}