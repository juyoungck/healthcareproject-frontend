/**
 * ExerciseContent.tsx
 * 운동 탭 콘텐츠 컴포넌트
 * - 운동 검색 기능
 * - 부위별/난이도별 필터
 * - 운동 목록 2열 그리드 표시
 * - 운동 카드 클릭 시 상세 페이지 표시
 * 
 * 주의: 헤더/네비게이션은 Dashboard에서 관리
 */

import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import ExerciseDetailContent from '../components/exercise/ExerciseDetail';
import { 
  BodyPart, 
  Difficulty, 
  BODY_PARTS, 
  DIFFICULTIES, 
  DUMMY_EXERCISES 
} from '../../data/exercises';

/**
 * Props 타입 정의
 */
interface ExerciseContentProps {
  initialExerciseId?: number | null;
  onExerciseSelect?: (id: number | null) => void;
}

/**
 * ExerciseContent 컴포넌트
 * 운동 탭 콘텐츠 UI 렌더링
 */
export default function ExerciseContent({ 
  initialExerciseId = null,
  onExerciseSelect 
}: ExerciseContentProps = {}) { 
  /**
   * 검색어 상태
   */
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * 부위 필터 상태 (복수 선택 가능)
   */
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPart[]>(['전체']);

  /**
   * 난이도 필터 상태 (복수 선택 가능)
   */
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>(['전체']);

  /**
   * 선택된 운동 ID (상세 페이지 표시용)
   */
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(initialExerciseId);

  /**
   * initialExerciseId가 변경되면 상태 업데이트
   */
  useEffect(() => {
    if (initialExerciseId !== null) {
      setSelectedExerciseId(initialExerciseId);
    }
  }, [initialExerciseId]);

  /**
   * 부위 필터 클릭 핸들러
   */
  const handleBodyPartClick = (bodyPart: BodyPart) => {
    if (bodyPart === '전체') {
      setSelectedBodyParts(['전체']);
    } else {
      setSelectedBodyParts(prev => {
        /* 전체가 선택되어 있으면 제거하고 새 항목 추가 */
        const withoutAll = prev.filter(p => p !== '전체');
        
        if (prev.includes(bodyPart)) {
          /* 이미 선택된 항목 클릭 시 제거 */
          const newSelection = withoutAll.filter(p => p !== bodyPart);
          /* 아무것도 선택 안되면 전체로 */
          return newSelection.length === 0 ? ['전체'] : newSelection;
        } else {
          /* 새 항목 추가 */
          return [...withoutAll, bodyPart];
        }
      });
    }
  };

  /**
   * 난이도 필터 클릭 핸들러
   */
  const handleDifficultyClick = (difficulty: Difficulty) => {
    if (difficulty === '전체') {
      setSelectedDifficulties(['전체']);
    } else {
      setSelectedDifficulties(prev => {
        /* 전체가 선택되어 있으면 제거하고 새 항목 추가 */
        const withoutAll = prev.filter(d => d !== '전체');
        
        if (prev.includes(difficulty)) {
          /* 이미 선택된 항목 클릭 시 제거 */
          const newSelection = withoutAll.filter(d => d !== difficulty);
          /* 아무것도 선택 안되면 전체로 */
          return newSelection.length === 0 ? ['전체'] : newSelection;
        } else {
          /* 새 항목 추가 */
          return [...withoutAll, difficulty];
        }
      });
    }
  };

  /**
   * 필터링된 운동 목록
   */
  const filteredExercises = useMemo(() => {
    return DUMMY_EXERCISES.filter(exercise => {
      /* 검색어 필터 */
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      /* 부위 필터 */
      const matchesBodyPart = 
        selectedBodyParts.includes('전체') || 
        selectedBodyParts.includes(exercise.bodyPart);

      /* 난이도 필터 */
      const matchesDifficulty = 
        selectedDifficulties.includes('전체') || 
        selectedDifficulties.includes(exercise.difficulty);

      return matchesSearch && matchesBodyPart && matchesDifficulty;
    });
  }, [searchQuery, selectedBodyParts, selectedDifficulties]);

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
          />
        </div>

        {/* 부위별 필터 */}
        <div className="filter-group">
            {BODY_PARTS.map((bodyPart) => (
                <button
                key={bodyPart}
                className={`filter-btn ${
                    selectedBodyParts.includes(bodyPart) ? 'active' : ''
                }`}
                onClick={() => handleBodyPartClick(bodyPart)}
                >
                {bodyPart}
                </button>
            ))}
        </div>

        {/* 난이도별 필터 */}
        <div className="filter-group">
            {DIFFICULTIES.map((difficulty) => (
                <button
                key={difficulty}
                className={`filter-btn ${
                    selectedDifficulties.includes(difficulty) ? 'active' : ''
                }`}
                onClick={() => handleDifficultyClick(difficulty)}
                >
                {difficulty}
                </button>
            ))}
        </div>
      </div>

      {/* 운동 목록 */}
      <div className="exercise-list">
        {filteredExercises.length > 0 ? (
          <div className="exercise-grid">
            {filteredExercises.map((exercise) => (
              <button 
                key={exercise.id} 
                className="exercise-card"
                onClick={() => handleExerciseClick(exercise.id)}
              >
                <div className="exercise-card-thumbnail">
                  <span className="exercise-card-emoji">{exercise.thumbnail}</span>
                </div>
                <div className="exercise-card-info">
                  <p className="exercise-card-name">{exercise.name}</p>
                  <div className="exercise-card-tags">
                    <span className="exercise-card-tag bodypart">{exercise.bodyPart}</span>
                    <span className="exercise-card-tag difficulty">{exercise.difficulty}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="exercise-empty">
            <p className="exercise-empty-text">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}