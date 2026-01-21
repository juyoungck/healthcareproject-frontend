/**
 * AuthContext.tsx
 * 전역 인증 상태 관리 Context
 * - 사용자 정보를 앱 전체에서 공유
 * - 중복 API 호출 방지
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getMe } from '../api/me';
import { isAuthenticated, clearTokens } from '../api/auth';
import type { MeResponse } from '../api/types/me';

/**
 * Context 타입 정의
 */
interface AuthContextType {
  /* 사용자 정보 */
  user: MeResponse | null;
  
  /* 로딩 상태 */
  isLoading: boolean;
  
  /* 로그인 여부 */
  isLoggedIn: boolean;
  
  /* 사용자 정보 새로고침 */
  refreshUser: () => Promise<void>;
  
  /* 사용자 정보 직접 업데이트 (닉네임 수정 등) */
  updateUser: (updates: Partial<MeResponse>) => void;
  
  /* 로그인 처리 (토큰 저장 후 호출) */
  onLoginSuccess: () => Promise<void>;
  
  /* 로그아웃 처리 */
  onLogout: () => void;
}

/**
 * Context 생성
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider 컴포넌트
 * App 최상위에서 감싸서 사용
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());

  /**
   * 사용자 정보 가져오기
   */
  const fetchUser = useCallback(async () => {
    /* 토큰이 없으면 호출하지 않음 */
    if (!isAuthenticated()) {
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await getMe();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      setUser(null);
      /* 토큰이 유효하지 않으면 로그아웃 처리 */
      clearTokens();
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 앱 시작 시 사용자 정보 로드
   */
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /**
   * 토큰 만료 이벤트 처리
   */
  useEffect(() => {
    const handleAuthLogout = () => {
      setUser(null);
      setIsLoggedIn(false);
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  /**
   * 사용자 정보 새로고침
   */
  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    await fetchUser();
  }, [fetchUser]);

  /**
   * 사용자 정보 부분 업데이트 (API 호출 없이)
   * 닉네임 수정 등에서 사용
   */
  const updateUser = useCallback((updates: Partial<MeResponse>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  /**
   * 로그인 성공 후 처리
   */
  const onLoginSuccess = useCallback(async () => {
    setIsLoggedIn(true);
    setIsLoading(true);
    await fetchUser();
  }, [fetchUser]);

  /**
   * 로그아웃 처리
   */
  const onLogout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn,
    refreshUser,
    updateUser,
    onLoginSuccess,
    onLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth 커스텀 훅
 * Context를 쉽게 사용하기 위한 훅
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}