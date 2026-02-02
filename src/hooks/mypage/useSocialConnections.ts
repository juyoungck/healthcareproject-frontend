/**
 * useSocialConnections.ts
 * 소셜 계정 연동 관련 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { getSocialConnections, disconnectSocialAccount, getOAuthUrl } from '../../api/auth';
import type { SocialConnection, SocialProvider } from '../../api/types/auth';
import { getApiErrorMessage } from '../../api/apiError';
import { getSocialProviderLabel } from '../../utils/label';

/**
 * 반환 타입 인터페이스
 */
interface UseSocialConnectionsReturn {
  /* 상태 */
  socialConnections: SocialConnection[];
  hasPassword: boolean;
  isLoadingSocial: boolean;
  isSocialActionLoading: boolean;

  /* 액션 */
  fetchSocialConnections: () => Promise<void>;
  handleConnectSocial: (provider: SocialProvider) => void;
  handleDisconnectSocial: (provider: SocialProvider) => Promise<void>;
  isConnected: (provider: SocialProvider) => boolean;
}

/**
 * 소셜 연동 훅
 */
export function useSocialConnections(): UseSocialConnectionsReturn {
  /** 상태 */
  const [socialConnections, setSocialConnections] = useState<SocialConnection[]>([]);
  const [hasPassword, setHasPassword] = useState(true);
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  const [isSocialActionLoading, setIsSocialActionLoading] = useState(false);

  /** 소셜 연동 정보 로드 */
  const fetchSocialConnections = useCallback(async () => {
    setIsLoadingSocial(true);
    try {
      const data = await getSocialConnections();
      setSocialConnections(data.connections);
      setHasPassword(data.hasPassword);
    } catch {
      /* 소셜 연동 정보 로드 실패 - 무시 */
    } finally {
      setIsLoadingSocial(false);
    }
  }, []);

  /** 컴포넌트 마운트 시 로드 */
  useEffect(() => {
    fetchSocialConnections();
  }, [fetchSocialConnections]);

  /** 소셜 제공자 연동 여부 확인 */
  const isConnected = useCallback((provider: SocialProvider): boolean => {
    return socialConnections.some(conn => conn.provider === provider);
  }, [socialConnections]);

  /** 소셜 계정 연동 핸들러 */
  const handleConnectSocial = useCallback((provider: SocialProvider) => {
    const oauthUrl = getOAuthUrl(provider, `connect_${provider}`);
    window.location.href = oauthUrl;
  }, []);

  /** 소셜 계정 연동 해제 핸들러 */
  const handleDisconnectSocial = useCallback(async (provider: SocialProvider) => {
    /* 마지막 로그인 수단 체크 */
    if (!hasPassword && socialConnections.length <= 1) {
      alert('마지막 로그인 수단은 해제할 수 없습니다.');
      return;
    }

    const providerName = getSocialProviderLabel(provider);
    if (!confirm(`${providerName} 연동을 해제하시겠습니까?`)) {
      return;
    }

    setIsSocialActionLoading(true);
    try {
      await disconnectSocialAccount({ provider });
      alert('소셜 계정 연동이 해제되었습니다.');
      await fetchSocialConnections();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, '연동 해제에 실패했습니다.'));
    } finally {
      setIsSocialActionLoading(false);
    }
  }, [hasPassword, socialConnections.length, fetchSocialConnections]);

  return {
    socialConnections,
    hasPassword,
    isLoadingSocial,
    isSocialActionLoading,
    fetchSocialConnections,
    handleConnectSocial,
    handleDisconnectSocial,
    isConnected,
  };
}
