/**
 * ExercisePage.tsx
 * 운동 탭 콘텐츠 컴포넌트
 * - 운동 검색 기능
 * - 부위별 필터 (다중 선택)
 * - 난이도별 필터 (다중 선택)
 * - 운동 목록 무한 스크롤
 * - 운동 카드 클릭 시 상세 페이지 표시
 */

import { useState, useEffect } from 'react';
import { Search, Loader } from 'lucide-react';
import ExerciseDetailContent from '../components/exercise/ExerciseDetail';
import { useExerciseList } from '../../hooks/exercise/useExerciseList';
import type { BodyPart, Difficulty } from '../../api/types/exercise';
import { BODY_PART_OPTIONS, DIFFICULTY_OPTIONS, BODY_PART_LABELS, DIFFICULTY_LABELS } from '../../constants/exercise';
import { scrollToTop } from '../../utils/format';

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
   * 커스텀 훅 사용
   */
  const {
    exercises,
    isLoading,
    isLoadingMore,
    error,
    hasNext,
    searchQuery,
    selectedBodyParts,
    selectedDifficulties,
    loadMoreRef,
    setSearchQuery,
    handleSearch,
    handleBodyPartClick,
    handleDifficultyClick,
    fetchExercises,
  } = useExerciseList();

  /**
   * 선택된 운동 ID (상세 페이지)
   */
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(initialExerciseId);

  /**
   * initialExerciseId 변경 시 상태 업데이트
   */
  useEffect(() => {
    if (initialExerciseId !== null) {
      setSelectedExerciseId(initialExerciseId);
    }
  }, [initialExerciseId]);

  /**
   * 검색 입력 엔터 처리
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

        {/* 부위별 필터 (다중 선택) */}
        <div className="filter-group">
          {BODY_PART_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`filter-btn ${
                option.value === 'ALL'
                  ? selectedBodyParts.size === 0 ? 'active' : ''
                  : selectedBodyParts.has(option.value as BodyPart) ? 'active' : ''
              }`}
              onClick={() => handleBodyPartClick(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 난이도별 필터 (다중 선택) */}
        <div className="filter-group">
          {DIFFICULTY_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`filter-btn ${
                option.value === 'ALL'
                  ? selectedDifficulties.size === 0 ? 'active' : ''
                  : selectedDifficulties.has(option.value as Difficulty) ? 'active' : ''
              }`}
              onClick={() => handleDifficultyClick(option.value)}
            >
              {option.label}
            </button>
          ))}
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
                    className="scroll-top-btn scroll-top-btn-primary"
                    onClick={() => scrollToTop()}
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
