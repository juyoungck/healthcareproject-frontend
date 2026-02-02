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
   * - 다중 선택 시 각 필터별 병렬 API 호출 후 결과 병합
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
      let allItems: ExerciseListItem[] = [];
      let finalHasNext = false;
      let finalNextCursor: number | null = null;

      const bodyPartsArray = Array.from(selectedBodyParts);
      const difficultiesArray = Array.from(selectedDifficulties);

      /** 다중 선택 조합 생성 (부위 x 난이도) */
      const hasMultipleBodyParts = bodyPartsArray.length > 1;
      const hasMultipleDifficulties = difficultiesArray.length > 1;
      const hasSingleBodyPart = bodyPartsArray.length === 1;
      const hasSingleDifficulty = difficultiesArray.length === 1;

      /** 병렬 API 호출이 필요한 경우 */
      if (hasMultipleBodyParts || hasMultipleDifficulties) {
        const requests: Promise<{ items: ExerciseListItem[]; hasNext: boolean; nextCursor: number | null }>[] = [];

        /** 다중 부위 + 다중 난이도: 모든 조합에 대해 호출 */
        if (hasMultipleBodyParts && hasMultipleDifficulties) {
          bodyPartsArray.forEach(bodyPart => {
            difficultiesArray.forEach(difficulty => {
              requests.push(getExercises({
                limit: 10,
                keyword: searchQuery || undefined,
                bodyPart,
                difficulty,
              }));
            });
          });
        }
        /** 다중 부위 + 단일/전체 난이도 */
        else if (hasMultipleBodyParts) {
          bodyPartsArray.forEach(bodyPart => {
            requests.push(getExercises({
              limit: 10,
              keyword: searchQuery || undefined,
              bodyPart,
              difficulty: hasSingleDifficulty ? difficultiesArray[0] : undefined,
            }));
          });
        }
        /** 단일/전체 부위 + 다중 난이도 */
        else if (hasMultipleDifficulties) {
          difficultiesArray.forEach(difficulty => {
            requests.push(getExercises({
              limit: 10,
              keyword: searchQuery || undefined,
              bodyPart: hasSingleBodyPart ? bodyPartsArray[0] : undefined,
              difficulty,
            }));
          });
        }

        const responses = await Promise.all(requests);

        /** 결과 병합 및 중복 제거 */
        const seenIds = new Set<number>();
        responses.forEach(response => {
          response.items.forEach(item => {
            if (!seenIds.has(item.exerciseId)) {
              seenIds.add(item.exerciseId);
              allItems.push(item);
            }
          });
          if (response.hasNext) finalHasNext = true;
          if (response.nextCursor && (!finalNextCursor || response.nextCursor < finalNextCursor)) {
            finalNextCursor = response.nextCursor;
          }
        });
      } else {
        /** 단일/전체 선택: 단일 API 호출 */
        const response = await getExercises({
          limit: 10,
          keyword: searchQuery || undefined,
          bodyPart: hasSingleBodyPart ? bodyPartsArray[0] : undefined,
          difficulty: hasSingleDifficulty ? difficultiesArray[0] : undefined,
        });

        allItems = response.items;
        finalHasNext = response.hasNext;
        finalNextCursor = response.nextCursor;
      }

      setExercises(allItems);
      setNextCursor(finalNextCursor);
      setHasNext(finalHasNext);
    } catch (err) {
      setError(getApiErrorMessage(err, '운동 목록을 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedBodyParts, selectedDifficulties]);

  /**
   * 운동 목록 추가 조회 (무한 스크롤)
   * - 다중 선택 시에도 병렬 호출로 처리
   */
  const fetchMoreExercises = useCallback(async () => {
    if (isLoadingMore || !hasNext || nextCursor === null) return;

    setIsLoadingMore(true);

    try {
      let newItems: ExerciseListItem[] = [];
      let finalHasNext = false;
      let finalNextCursor: number | null = null;

      const bodyPartsArray = Array.from(selectedBodyParts);
      const difficultiesArray = Array.from(selectedDifficulties);

      /** 다중 선택 조합 생성 (부위 x 난이도) */
      const hasMultipleBodyParts = bodyPartsArray.length > 1;
      const hasMultipleDifficulties = difficultiesArray.length > 1;
      const hasSingleBodyPart = bodyPartsArray.length === 1;
      const hasSingleDifficulty = difficultiesArray.length === 1;

      /** 기존 ID 수집 (중복 방지) */
      const existingIds = new Set(exercises.map(e => e.exerciseId));

      /** 병렬 API 호출이 필요한 경우 */
      if (hasMultipleBodyParts || hasMultipleDifficulties) {
        const requests: Promise<{ items: ExerciseListItem[]; hasNext: boolean; nextCursor: number | null }>[] = [];

        /** 다중 부위 + 다중 난이도: 모든 조합에 대해 호출 */
        if (hasMultipleBodyParts && hasMultipleDifficulties) {
          bodyPartsArray.forEach(bodyPart => {
            difficultiesArray.forEach(difficulty => {
              requests.push(getExercises({
                cursor: nextCursor,
                limit: 10,
                keyword: searchQuery || undefined,
                bodyPart,
                difficulty,
              }));
            });
          });
        }
        /** 다중 부위 + 단일/전체 난이도 */
        else if (hasMultipleBodyParts) {
          bodyPartsArray.forEach(bodyPart => {
            requests.push(getExercises({
              cursor: nextCursor,
              limit: 10,
              keyword: searchQuery || undefined,
              bodyPart,
              difficulty: hasSingleDifficulty ? difficultiesArray[0] : undefined,
            }));
          });
        }
        /** 단일/전체 부위 + 다중 난이도 */
        else if (hasMultipleDifficulties) {
          difficultiesArray.forEach(difficulty => {
            requests.push(getExercises({
              cursor: nextCursor,
              limit: 10,
              keyword: searchQuery || undefined,
              bodyPart: hasSingleBodyPart ? bodyPartsArray[0] : undefined,
              difficulty,
            }));
          });
        }

        const responses = await Promise.all(requests);

        /** 결과 병합 및 중복 제거 */
        responses.forEach(response => {
          response.items.forEach(item => {
            if (!existingIds.has(item.exerciseId)) {
              existingIds.add(item.exerciseId);
              newItems.push(item);
            }
          });
          if (response.hasNext) finalHasNext = true;
          if (response.nextCursor && (!finalNextCursor || response.nextCursor < finalNextCursor)) {
            finalNextCursor = response.nextCursor;
          }
        });
      } else {
        /** 단일/전체 선택: 단일 API 호출 */
        const response = await getExercises({
          cursor: nextCursor,
          limit: 10,
          keyword: searchQuery || undefined,
          bodyPart: hasSingleBodyPart ? bodyPartsArray[0] : undefined,
          difficulty: hasSingleDifficulty ? difficultiesArray[0] : undefined,
        });

        newItems = response.items;
        finalHasNext = response.hasNext;
        finalNextCursor = response.nextCursor;
      }

      setExercises(prev => [...prev, ...newItems]);
      setNextCursor(finalNextCursor);
      setHasNext(finalHasNext);
    } catch {
      /** 추가 로딩 실패는 조용히 처리 */
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasNext, nextCursor, searchQuery, selectedBodyParts, selectedDifficulties, exercises]);

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
