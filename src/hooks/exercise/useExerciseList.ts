/**
 * useExerciseList.ts
 * 운동 목록 조회 커스텀 훅
 * - 운동 검색 및 필터링
 * - 무한 스크롤 페이지네이션
 * - 다중 선택 필터 (부위, 난이도)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getExercises } from '../../api/exercise';
import { getApiErrorMessage } from '../../api/apiError';
import type { ExerciseListItem, BodyPart, Difficulty } from '../../api/types/exercise';

/**
 * 반환 타입 인터페이스
 */
interface UseExerciseListReturn {
  /** 상태 */
  exercises: ExerciseListItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string;
  hasNext: boolean;

  /** 필터 상태 */
  searchQuery: string;
  selectedBodyParts: Set<BodyPart>;
  selectedDifficulties: Set<Difficulty>;

  /** 무한 스크롤 ref */
  loadMoreRef: React.RefObject<HTMLDivElement | null>;

  /** 액션 */
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleBodyPartClick: (bodyPart: BodyPart | 'ALL') => void;
  handleDifficultyClick: (difficulty: Difficulty | 'ALL') => void;
  fetchExercises: (reset?: boolean) => Promise<void>;
}

/**
 * useExerciseList 훅
 */
export function useExerciseList(): UseExerciseListReturn {
  /** 운동 목록 상태 */
  const [exercises, setExercises] = useState<ExerciseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  /** 페이지네이션 */
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(true);

  /** 필터 (다중 선택) */
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyParts, setSelectedBodyParts] = useState<Set<BodyPart>>(new Set());
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<Difficulty>>(new Set());

  /** 무한 스크롤 옵저버 */
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /**
   * 운동 목록 조회 (첫 페이지)
   * - 다중 선택 시 배열로 한 번에 요청
   */
  const fetchExercises = useCallback(async (reset = false) => {
    if (reset) {
      setIsLoading(true);
      setExercises([]);
      setNextCursor(null);
      setHasNext(true);
    }
    setError('');

    try {
      const bodyPartsArray = Array.from(selectedBodyParts);
      const difficultiesArray = Array.from(selectedDifficulties);

      const response = await getExercises({
        limit: 10,
        keyword: searchQuery || undefined,
        bodyParts: bodyPartsArray.length > 0 ? bodyPartsArray : undefined,
        difficulties: difficultiesArray.length > 0 ? difficultiesArray : undefined,
      });

      setExercises(response.items);
      setNextCursor(response.nextCursor);
      setHasNext(response.hasNext);
    } catch (err) {
      setError(getApiErrorMessage(err, '운동 목록을 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedBodyParts, selectedDifficulties]);

  /**
   * 운동 목록 추가 조회 (무한 스크롤)
   * - 다중 선택 시 배열로 한 번에 요청
   */
  const fetchMoreExercises = useCallback(async () => {
    if (isLoadingMore || !hasNext || nextCursor === null) return;

    setIsLoadingMore(true);

    try {
      const bodyPartsArray = Array.from(selectedBodyParts);
      const difficultiesArray = Array.from(selectedDifficulties);

      const response = await getExercises({
        cursor: nextCursor,
        limit: 10,
        keyword: searchQuery || undefined,
        bodyParts: bodyPartsArray.length > 0 ? bodyPartsArray : undefined,
        difficulties: difficultiesArray.length > 0 ? difficultiesArray : undefined,
      });

      setExercises(prev => [...prev, ...response.items]);
      setNextCursor(response.nextCursor);
      setHasNext(response.hasNext);
    } catch {
      /** 추가 로딩 실패는 조용히 처리 */
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasNext, nextCursor, searchQuery, selectedBodyParts, selectedDifficulties]);

  /**
   * 실시간 검색 (debounce 300ms) - 필터/검색어 변경 시 자동 재조회
   * searchQuery가 변경되면 300ms 후에 fetchExercises가 호출됨
   */

  /**
   * 초기 로드 및 필터/검색어 변경 시 재조회
   */
  useEffect(() => {
    fetchExercises(true);
  }, [fetchExercises]);

  /**
   * 검색 실행 (즉시)
   */
  const handleSearch = useCallback(() => {
    fetchExercises(true);
  }, [fetchExercises]);

  /**
   * 부위 필터 클릭 핸들러 (다중 선택)
   */
  const handleBodyPartClick = useCallback((bodyPart: BodyPart | 'ALL') => {
    if (bodyPart === 'ALL') {
      setSelectedBodyParts(new Set());
    } else {
      setSelectedBodyParts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(bodyPart)) {
          newSet.delete(bodyPart);
        } else {
          newSet.add(bodyPart);
        }
        return newSet;
      });
    }
  }, []);

  /**
   * 난이도 필터 클릭 핸들러 (다중 선택)
   */
  const handleDifficultyClick = useCallback((difficulty: Difficulty | 'ALL') => {
    if (difficulty === 'ALL') {
      setSelectedDifficulties(new Set());
    } else {
      setSelectedDifficulties(prev => {
        const newSet = new Set(prev);
        if (newSet.has(difficulty)) {
          newSet.delete(difficulty);
        } else {
          newSet.add(difficulty);
        }
        return newSet;
      });
    }
  }, []);

  /**
   * 무한 스크롤 옵저버 설정
   */
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isLoadingMore) {
          fetchMoreExercises();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchMoreExercises, hasNext, isLoadingMore]);

  return {
    /** 상태 */
    exercises,
    isLoading,
    isLoadingMore,
    error,
    hasNext,

    /** 필터 상태 */
    searchQuery,
    selectedBodyParts,
    selectedDifficulties,

    /** 무한 스크롤 ref */
    loadMoreRef,

    /** 액션 */
    setSearchQuery,
    handleSearch,
    handleBodyPartClick,
    handleDifficultyClick,
    fetchExercises,
  };
}
