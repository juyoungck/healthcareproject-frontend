/**
 * MyPage.tsx
 * 마이페이지 컴포넌트
 * - 회원정보 조회/수정
 * - 온보딩 정보 요약
 * - 소셜계정 연동관리
 * - 로그아웃/회원탈퇴
 */

import { useState, useEffect } from 'react';
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
  UserMinus
} from 'lucide-react';
import SettingsPage from './SettingsPage';
import TrainerApplyModal, { TrainerApplyData } from '../components/auth/TrainerApplyModal';
import { getMe, getProfile, getInjuries, getAllergies, updateNickname } from '../../api/me';
import type { MeResponse, ProfileResponse, InjuryItem } from '../../api/types/me';
import { CURRENT_USER_TRAINER_STATUS } from '../../data/users';

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
}

/**
 * MyPage 컴포넌트
 */
export default function MyPage({ onBack, onLogout, onEditOnboarding }: MyPageProps) {
  /**
   * 상태 관리
   */
  /* 로딩/에러 */
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /* 사용자 기본 정보 */
  const [userInfo, setUserInfo] = useState<MeResponse | null>(null);

  /* 신체/운동 정보 */
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  /* 부상 정보 */
  const [injuries, setInjuries] = useState<InjuryItem[]>([]);

  /* 알러지 정보 */
  const [allergies, setAllergies] = useState<string[]>([]);

  /* 모달 상태 */
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsPage, setShowSettingsPage] = useState(false);
  const [showTrainerModal, setShowTrainerModal] = useState(false);

  /* 닉네임 수정 */
  const [editNickname, setEditNickname] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * ===========================================
   * 유저 데이터 로드
   * ===========================================
   */

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError('');

    try {
      /* 병렬로 API 호출 */
      const [meData, profileData, injuriesData, allergiesData] = await Promise.all([
        getMe(),
        getProfile(),
        getInjuries(),
        getAllergies(),
      ]);

      setUserInfo(meData);
      setProfile(profileData);
      setInjuries(injuriesData.injuries);
      setAllergies(allergiesData.allergies);
      setEditNickname(meData.nickname);
    } catch (err) {
      console.error('데이터 로드 실패:', err);
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

    setIsUpdating(true);

    try {
      await updateNickname({ nickname: editNickname });
    
      /* API 호출 성공 시 로컬 상태 직접 업데이트 */
      if (userInfo) {
        setUserInfo({
          ...userInfo,
          nickname: editNickname,  // ← 응답 대신 입력한 닉네임 값 사용
        });
      }
      
      setShowEditModal(false);
      alert('닉네임이 수정되었습니다.');
    } catch (err: unknown) {
      console.error('닉네임 수정 실패:', err);
      const axiosError = err as { response?: { data?: { error?: { code?: string } } } };
      if (axiosError.response?.data?.error?.code === 'DUPLICATE_NICKNAME') {
        alert('이미 사용 중인 닉네임입니다.');
      } else {
        alert('닉네임 수정에 실패했습니다.');
      }
    } finally {
      setIsUpdating(false);
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
          <button className="mypage-profile-edit-btn">
            <Camera size={16} />
          </button>
        </div>
        <div className="mypage-profile-info">
          <div className="mypage-nickname-row">
            <h2 className="mypage-nickname">{userInfo?.nickname}</h2>
            <button className="mypage-edit-btn" onClick={() => setShowEditModal(true)}>
              <Edit2 size={16} />
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

      {/* 트레이너 등록 모달 */}
      {showTrainerModal && (
        <TrainerApplyModal
          onClose={() => setShowTrainerModal(false)}
          onSubmit={handleTrainerApply}
        />
      )}

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
              <button 
                className="form-submit-btn" 
                onClick={handleEditNickname}
                disabled={isUpdating}
              >
                {isUpdating ? '저장 중...' : (
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
    </div>
  );
}