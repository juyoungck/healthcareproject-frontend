/**
 * useLivePTCount.ts
 * 실시간 진행중인 화상PT 개수 조회 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { getPTRoomList } from '../../api/pt';

/**
 * 반환 타입 인터페이스
 */
interface UseLivePTCountReturn {
  /* 상태 */
  livePTCount: number;
  isLoading: boolean;

  /* 액션 */
  refresh: () => Promise<void>;
}

/**
 * 실시간 PT 개수 훅
 */
export function useLivePTCount(): UseLivePTCountReturn {
  /** 상태 */
  const [livePTCount, setLivePTCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  /** 데이터 로드 */
  const loadLivePTCount = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getPTRoomList({ tab: 'LIVE' });
      setLivePTCount(response.items.length);
    } catch (error) {
      console.error('실시간 PT 개수 조회 실패:', error);
      setLivePTCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** 마운트 시 로드 */
  useEffect(() => {
    loadLivePTCount();
  }, [loadLivePTCount]);

  return {
    livePTCount,
    isLoading,
    refresh: loadLivePTCount,
  };
}
