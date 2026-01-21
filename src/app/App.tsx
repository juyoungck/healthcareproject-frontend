/**
 * App.tsx
 * 메인 애플리케이션 컴포넌트
 * 로그인 상태에 따라 랜딩페이지 또는 대시보드를 렌더링
 */

import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import type { OnboardingData } from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import { isAuthenticated, clearTokens, logout, getRefreshToken } from '../api/auth';
import { getProfile, getInjuries, getAllergies } from '../api/me';
import type { ProfileResponse, InjuryItem } from '../api/types/me';


/**
 * App 컴포넌트
 * - 비로그인 시: 랜딩페이지 (로그인/회원가입 버튼 + 사이트 소개)
 * - 로그인 시: 대시보드 (메인 서비스)
 */
export default function App() {
  /**
   * 로그인 상태 관리
   * TODO: 실제 구현 시 JWT 토큰 기반 인증으로 변경
   */
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());

  /**
   * 온보딩 상태 관리
   */
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showOnboardingEdit, setShowOnboardingEdit] = useState(false);
  const [userOnboardingData, setUserOnboardingData] = useState<OnboardingData | null>(null);
  const [isLoadingOnboardingData, setIsLoadingOnboardingData] = useState(false);

  /**
   * 마이페이지 상태 관리
   */
  const [returnToMyPage, setReturnToMyPage] = useState(false);

  /**
   * API 응답 데이터를 OnboardingData 형식으로 변환
   */
  const convertApiToOnboardingData = (
    profile: ProfileResponse,
    injuries: InjuryItem[],
    allergies: string[]
  ): OnboardingData => {
    /* 성별 변환 */
    const convertGender = (gender: string): 'male' | 'female' | null => {
      switch (gender) {
        case 'MALE': return 'male';
        case 'FEMALE': return 'female';
        default: return null;
      }
    };

    /* 운동 경력 변환 */
    const convertExperienceLevel = (level: string): OnboardingData['experienceLevel'] => {
      switch (level) {
        case 'BEGINNER': return 'beginner';
        case 'ELEMENTARY': return 'elementary';
        case 'INTERMEDIATE': return 'intermediate';
        case 'ADVANCED': return 'advanced';
        default: return null;
      }
    };

    /* 운동 목표 변환 */
    const convertGoalType = (goal: string): OnboardingData['goalType'] => {
      switch (goal) {
        case 'DIET': return 'weight_loss';
        case 'BULK': return 'strength';
        case 'FLEXIBILITY': return 'flexibility';
        case 'MAINTAIN': return 'endurance';
        default: return null;
      }
    };

    /* 운동 시간 변환 */
    const convertSessionMinutes = (minutes: number): OnboardingData['sessionMinutes'] => {
      if (minutes <= 30) return '30min';
      if (minutes <= 60) return '1hour';
      if (minutes <= 90) return '1hour30';
      return '2hour';
    };

    /* 부상 정도 변환 */
    const convertInjuryLevel = (level: string): 'mild' | 'caution' | 'severe' | null => {
      switch (level) {
        case 'MILD': return 'mild';
        case 'CAUTION': return 'caution';
        case 'SEVERE': return 'severe';
        default: return null;
      }
    };

    return {
      heightCm: String(profile.heightCm),
      weightKg: String(profile.weightKg),
      age: String(profile.age),
      gender: convertGender(profile.gender),
      allergies: allergies,
      experienceLevel: convertExperienceLevel(profile.experienceLevel),
      goalType: convertGoalType(profile.goalType),
      hasInjury: injuries.length > 0,
      injuries: injuries.map((injury, index) => ({
        id: injury.injuryId || Date.now() + index,
        part: injury.injuryPart,
        severity: convertInjuryLevel(injury.injuryLevel),
      })),
      weeklyDays: profile.weeklyDays,
      sessionMinutes: convertSessionMinutes(profile.sessionMinutes),
    };
  };

  /**
   * 온보딩 데이터 로드 함수
   */
  const fetchOnboardingData = async (): Promise<OnboardingData | null> => {
    try {
      const [profileData, injuriesData, allergiesData] = await Promise.all([
        getProfile(),
        getInjuries(),
        getAllergies(),
      ]);

      return convertApiToOnboardingData(
        profileData,
        injuriesData.injuries,
        allergiesData.allergies
      );
    } catch (error) {
      console.error('온보딩 데이터 로드 실패:', error);
      return null;
    }
  };

  // 회원가입 완료 핸들러
  const handleSignupComplete  = () => {
    /* 
    * TODO: 실제 구현 시 토큰은 이미 저장된 상태
    * 여기서는 자동 로그인 처리
    */
    setIsLoggedIn(true);
    setShowOnboarding(true);
  };

  /**
   * 로그인 핸들러
   * 로그인 성공 시 호출
   */
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  /**
   * 로그아웃 핸들러
   * - 서버에 로그아웃 요청
   * - 로컬 토큰 삭제
   */
  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await logout({ refreshToken });
      }
    } catch (error) {
      console.error('로그아웃 API 에러:', error);
    } finally {
      /* 토큰 삭제 및 상태 초기화 */
      clearTokens();
      setIsLoggedIn(false);
      setShowOnboarding(false);
      setShowOnboardingEdit(false);
    }
  };

  // 온보딩 완료 핸들러
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // 온보딩 스킵 핸들러
  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  /**
   * 온보딩 수정 페이지 열기
   */
  const handleOpenOnboardingEdit = async () => {
    setIsLoadingOnboardingData(true);
    
    try {
      const data = await fetchOnboardingData();
      setUserOnboardingData(data);
      setShowOnboardingEdit(true);
    } catch (error) {
      console.error('온보딩 데이터 로드 실패:', error);
      alert('정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingOnboardingData(false);
    }
  };

  /**
   * 온보딩 수정 완료
   */
  const handleOnboardingEditComplete = () => {
    setShowOnboardingEdit(false);
    setReturnToMyPage(true);
  };

  /**
   * 온보딩 수정 취소
   */
  const handleOnboardingEditCancel = () => {
    setShowOnboardingEdit(false);
    setReturnToMyPage(true);
  };

  /**
   * 토큰 만료로 인한 자동 로그아웃 이벤트 처리
   */
  useEffect(() => {
    const handleAuthLogout = () => {
      setIsLoggedIn(false);
      setShowOnboarding(false);
      setShowOnboardingEdit(false);
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  /**
   * 상태값에 따른 랜더링 변경
   */
  if (isLoggedIn) {
    if (isLoadingOnboardingData) {
      return (
        <div className="loading-screen">
          <p>정보를 불러오는 중...</p>
        </div>
      );
    }

    // 회원가입 후 온보딩 입력
    if (showOnboarding) {
      return (
        <OnboardingPage 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      );
    }

    // 온보딩 수정 모드
    if (showOnboardingEdit) {
      return (
        <OnboardingPage 
          onComplete={handleOnboardingEditComplete}
          onSkip={handleOnboardingEditCancel}
          isEditMode={true}
          initialData={userOnboardingData}
        />
      );
    }

    return (
    <Dashboard 
      onLogout={handleLogout} 
      onEditOnboarding={handleOpenOnboardingEdit}
      initialShowMyPage={returnToMyPage}
      onMyPageShown={() => setReturnToMyPage(false)}
    />
  );
  }

  return (
    <LandingPage 
      onLogin={handleLogin} 
      onSignupComplete={handleSignupComplete}
    />
  );
}
