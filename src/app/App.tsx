/**
 * App.tsx
 * 메인 애플리케이션 컴포넌트
 * 로그인 상태에 따라 랜딩페이지 또는 대시보드를 렌더링
 */

import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * 온보딩 상태 관리
   */
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showOnboardingEdit, setShowOnboardingEdit] = useState(false);
//  const [userOnboardingData, setUserOnboardingData] = useState<OnboardingData | null>(null);


  /**
   * 온보딩 저장정보 더미데이터
   * TODO: 실제 구현 시 삭제
   */
  const DUMMY_ONBOARDING_DATA: OnboardingData = {
    height: '175',
    weight: '70',
    age: '28',
    gender: 'male',
    allergies: ['갑각류', '땅콩'],
    exerciseLevel: 'elementary',
    exerciseGoal: 'weight_loss',
    hasInjury: false,
    injuries: [],
    exerciseDays: 3,
    exerciseTime: '1hour'
  };

  const [userOnboardingData] = useState<OnboardingData>(DUMMY_ONBOARDING_DATA);

  /**
   * 마이페이지 상태 관리
   */
  const [returnToMyPage, setReturnToMyPage] = useState(false);

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
   * 로그아웃 시 호출
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
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
  const handleOpenOnboardingEdit = () => {
    setShowOnboardingEdit(true);
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
   * 상태값에 따른 랜더링 변경
   */
  if (isLoggedIn) {
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
