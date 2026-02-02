/**
 * useFoodList.ts
 * 음식 목록 조회 커스텀 훅
 * - 음식 검색
 * - 무한 스크롤 페이지네이션
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getFoods } from '../../api/food';
import { getApiErrorMessage } from '../../api/apiError';
import type { FoodListItem } from '../../api/types/food';

/**
 * 반환 타입 인터페이스
 */
interface UseFoodListReturn {
  /** 상태 */
  foods: FoodListItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string;
  hasNext: boolean;

  /** 검색 상태 */
  searchQuery: string;
  searchKeyword: string;

  /** 무한 스크롤 ref */
  loadMoreRef: React.RefObject<HTMLDivElement | null>;

  /** 액션 */
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  fetchFoods: (isLoadMore?: boolean) => Promise<void>;
}

/**
 * useFoodList 훅
 */
export function useFoodList(): UseFoodListReturn {
  /** 상태 관리 */
  const [searchQuery, setSearchQuery] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [foods, setFoods] = useState<FoodListItem[]>([]);

  /** 로딩/에러 상태 */
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  /** 무한스크롤 */
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /**
   * 음식 리스트 조회
   */
  const fetchFoods = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setError('');
    }

    try {
      const response = await getFoods({
        cursor: isLoadMore ? (nextCursor ?? undefined) : undefined,
        limit: 10,
        keyword: searchKeyword || undefined,
      });

      if (isLoadMore) {
        setFoods(prev => [...prev, ...response.items]);
      } else {
        setFoods(response.items);
      }
      setNextCursor(response.nextCursor);
      setHasNext(response.hasNext);
    } catch (err) {
      setError(getApiErrorMessage(err, '음식 목록을 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [nextCursor, searchKeyword]);

  /**
   * 초기 로드 및 검색어 변경 시
   */
  useEffect(() => {
    setNextCursor(null);
    fetchFoods();
  }, [searchKeyword]);

  /**
   * 실시간 검색 (debounce 300ms)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== searchKeyword) {
        setSearchKeyword(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchKeyword]);

  /**
   * 무한스크롤 Observer
   */
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isLoadingMore) {
          fetchFoods(true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasNext, isLoadingMore, fetchFoods]);

  /**
   * 검색 핸들러
   */
  const handleSearch = useCallback(() => {
    setSearchKeyword(searchQuery);
  }, [searchQuery]);

  return {
    /** 상태 */
    foods,
    isLoading,
    isLoadingMore,
    error,
    hasNext,

    /** 검색 상태 */
    searchQuery,
    searchKeyword,

    /** 무한 스크롤 ref */
    loadMoreRef,

    /** 액션 */
    setSearchQuery,
    handleSearch,
    fetchFoods,
  };
}
