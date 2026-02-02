/**
 * useOnboardingData.ts
 * 온보딩 데이터 로드 관련 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { getProfile, getInjuries, getAllergies } from '../../api/me';
import type { ProfileResponse, InjuryItem } from '../../api/types/me';

/**
 * 반환 타입 인터페이스
 */
interface UseOnboardingDataReturn {
  /* 상태 */
  profile: ProfileResponse | null;
  injuries: InjuryItem[];
  allergies: string[];
  isLoading: boolean;
  error: string;

  /* 액션 */
  fetchOnboardingData: () => Promise<void>;
}

/**
 * 온보딩 데이터 훅
 */
export function useOnboardingData(): UseOnboardingDataReturn {
  /** 상태 */
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [injuries, setInjuries] = useState<InjuryItem[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /** 온보딩 데이터 로드 */
  const fetchOnboardingData = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const [profileResult, injuriesResult, allergiesResult] = await Promise.allSettled([
        getProfile(),
        getInjuries(),
        getAllergies(),
      ]);

      /* 프로필 정보 */
      if (profileResult.status === 'fulfilled') {
        setProfile(profileResult.value);
      } else {
        setProfile(null);
      }

      /* 부상 정보 */
      if (injuriesResult.status === 'fulfilled') {
        setInjuries(injuriesResult.value.injuries);
      } else {
        setInjuries([]);
      }

      /* 알레르기 정보 */
      if (allergiesResult.status === 'fulfilled') {
        setAllergies(allergiesResult.value.allergies);
      } else {
        setAllergies([]);
      }
    } catch {
      setError('정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** 컴포넌트 마운트 시 로드 */
  useEffect(() => {
    fetchOnboardingData();
  }, [fetchOnboardingData]);

  return {
    profile,
    injuries,
    allergies,
    isLoading,
    error,
    fetchOnboardingData,
  };
}
