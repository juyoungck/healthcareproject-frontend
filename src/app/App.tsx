/**
 * App.tsx
 * 메인 애플리케이션 컴포넌트
 * 로그인 상태에 따라 랜딩페이지 또는 대시보드를 렌더링
 */

import { useState } from 'react';
import LandingPage from './pages/LandingPage';
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

  /**
   * 조건부 렌더링
   * 로그인 상태에 따라 다른 페이지 표시
   */
  return (
    <>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LandingPage onLogin={handleLogin} />
      )}
    </>
  );
}
