/**
 * ExercisePage.tsx
 * 운동 탭 콘텐츠 컴포넌트
 * - 운동 검색 기능
 * - 부위별 필터
 * - 운동 목록 무한 스크롤
 * - 운동 카드 클릭 시 상세 페이지 표시
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Loader } from 'lucide-react';
import ExerciseDetailContent from '../components/exercise/ExerciseDetail';
import { getExercises } from '../../api/exercise';
import type { ExerciseListItem, BodyPart, Difficulty } from '../../api/types/exercise';
import { BODY_PART_OPTIONS, DIFFICULTY_OPTIONS, BODY_PART_LABELS, DIFFICULTY_LABELS} from '../../api/types/exercise';

/**
 * Props 타입 정의
 */
interface ExercisePageProps {
  initialExerciseId?: number | null;
  onExerciseSelect?: (id: number | null) => void;
}

/**
 * ExercisePage 컴포넌트
 */
export default function ExercisePage({
  initialExerciseId = null,
  onExerciseSelect,
}: ExercisePageProps = {}) {
  /**
   * 상태 관리
   */
  const [exercises, setExercises] = useState<ExerciseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  /* 페이지네이션 */
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(true);

  /* 필터 */
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | 'ALL'>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'ALL'>('ALL');

  /* 선택된 운동 ID (상세 페이지) */
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(initialExerciseId);

  /* 무한 스크롤 옵저버 */
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /**
   * 운동 목록 조회 (첫 페이지)
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
      const response = await getExercises({
        limit: 10,
        keyword: searchQuery || undefined,
        bodyPart: selectedBodyPart !== 'ALL' ? selectedBodyPart : undefined,
        difficulty: selectedDifficulty !== 'ALL' ? selectedDifficulty : undefined,
      });

      setExercises(response.items);
      setNextCursor(response.nextCursor);
      setHasNext(response.hasNext);
    } catch (err) {
      console.error('운동 목록 조회 실패:', err);
      setError('운동 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedBodyPart]);

  /**
   * 운동 목록 추가 조회 (무한 스크롤)
   */
  const fetchMoreExercises = useCallback(async () => {
    if (isLoadingMore || !hasNext || nextCursor === null) return;

    setIsLoadingMore(true);

    try {
      const response = await getExercises({
        cursor: nextCursor,
        limit: 10,
        keyword: searchQuery || undefined,
        bodyPart: selectedBodyPart !== 'ALL' ? selectedBodyPart : undefined,
        difficulty: selectedDifficulty !== 'ALL' ? selectedDifficulty : undefined,
      });

      setExercises(prev => [...prev, ...response.items]);
      setNextCursor(response.nextCursor);
      setHasNext(response.hasNext);
    } catch (err) {
      console.error('운동 목록 추가 조회 실패:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasNext, nextCursor, searchQuery, selectedBodyPart]);

  /**
   * 초기 로드 및 필터 변경 시 재조회
   */
  useEffect(() => {
    fetchExercises(true);
  }, [selectedBodyPart]);

  /**
   * 검색 실행 (엔터 또는 버튼)
   */
  const handleSearch = () => {
    fetchExercises(true);
  };

  /**
   * 검색 입력 엔터 처리
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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

  /**
   * initialExerciseId 변경 시 상태 업데이트
   */
  useEffect(() => {
    if (initialExerciseId !== null) {
      setSelectedExerciseId(initialExerciseId);
    }
  }, [initialExerciseId]);

  /**
   * 부위 필터 클릭 핸들러
   */
  const handleBodyPartClick = (bodyPart: BodyPart | 'ALL') => {
    setSelectedBodyPart(bodyPart);
  };

  /**
   * 난이도 필터 클릭 핸들러
   */
  const handleDifficultyClick = (difficulty: Difficulty | 'ALL') => {
    setSelectedDifficulty(difficulty);
  };

  /**
   * 운동 카드 클릭 핸들러
   */
  const handleExerciseClick = (exerciseId: number) => {
    setSelectedExerciseId(exerciseId);
    onExerciseSelect?.(exerciseId);
  };

  /**
   * 상세 페이지에서 뒤로가기 핸들러
   */
  const handleBackFromDetail = () => {
    setSelectedExerciseId(null);
    onExerciseSelect?.(null);
  };

  /**
 * 맨 위로 스크롤
 */
  const handleScrollToTop = () => {
    const appMain = document.querySelector('.app-main');
    if (appMain) {
      appMain.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * 상세 페이지 렌더링
   */
  if (selectedExerciseId !== null) {
    return (
      <ExerciseDetailContent
        exerciseId={selectedExerciseId}
        onBack={handleBackFromDetail}
        onSelectExercise={handleExerciseClick}
      />
    );
  }

  /**
   * 운동 목록 렌더링
   */
  return (
    <div className="exercise-page">
      {/* 페이지 헤더 */}
      <div className="pt-page-header">
        {/* 검색 입력 */}
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="운동 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* 부위별 필터 */}
        <div className="filter-group">
          {BODY_PART_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`filter-btn ${selectedBodyPart === option.value ? 'active' : ''}`}
              onClick={() => handleBodyPartClick(option.value)}
            >
              {option.label}
            </button>
          ))}
          </div>
          <div className="filter-group">
            {/* 난이도별 필터 */}
            <div className="filter-group">
              {DIFFICULTY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`filter-btn ${selectedDifficulty === option.value ? 'active' : ''}`}
                  onClick={() => handleDifficultyClick(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* 운동 목록 */}
      <div className="exercise-list">
        {isLoading ? (
          <div className="exercise-loading">
            <Loader className="spinner" size={32} />
            <p>운동 목록을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="exercise-error">
            <p>{error}</p>
            <button onClick={() => fetchExercises(true)}>다시 시도</button>
          </div>
        ) : exercises.length > 0 ? (
          <>
            <div className="exercise-grid">
              {exercises.map((exercise) => (
                <button
                  key={exercise.exerciseId}
                  className="exercise-card"
                  onClick={() => handleExerciseClick(exercise.exerciseId)}
                >
                  <div className="exercise-card-thumbnail">
                    {exercise.imageUrl ? (
                      <img
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        className="exercise-card-image"
                      />
                    ) : (
                      <span className="exercise-card-emoji">💪</span>
                    )}
                  </div>
                  <div className="exercise-card-info">
                    <p className="exercise-card-name">{exercise.name}</p>
                    <div className="exercise-card-tags">
                      <span className="exercise-card-tag bodypart">
                        {BODY_PART_LABELS[exercise.bodyPart]}
                      </span>
                      <span className="exercise-card-tag difficulty">
                        {DIFFICULTY_LABELS[exercise.difficulty]}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 무한 스크롤 트리거 */}
            <div ref={loadMoreRef} className="exercise-load-more">
              {isLoadingMore && (
                <div className="exercise-loading-more">
                  <Loader className="spinner" size={24} />
                  <span>불러오는 중...</span>
                </div>
              )}
              {!hasNext && exercises.length > 0 && (
                <div className="exercise-end-section">
                  <p className="exercise-end-message">모든 운동을 확인했습니다.</p>
                  <button
                    className="exercise-scroll-top-btn"
                    onClick={handleScrollToTop}
                  >
                    맨 위로 올라가기
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="exercise-empty">
            <p className="exercise-empty-text">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}