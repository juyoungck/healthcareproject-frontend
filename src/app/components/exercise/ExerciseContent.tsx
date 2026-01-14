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

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import ExerciseDetailContent from './ExerciseDetailContent';

/**
 * 운동 부위 타입
 */
type BodyPart = '전체' | '상체' | '하체' | '전신' | '코어';

/**
 * 난이도 타입
 */
type Difficulty = '전체' | '초급' | '중급' | '고급';

/**
 * 운동 데이터 타입
 */
interface Exercise {
  id: number;
  name: string;
  bodyPart: Exclude<BodyPart, '전체'>;
  difficulty: Exclude<Difficulty, '전체'>;
  thumbnail: string;
}

/**
 * 부위 필터 옵션
 */
const BODY_PARTS: BodyPart[] = ['전체', '상체', '하체', '전신', '코어'];

/**
 * 난이도 필터 옵션
 */
const DIFFICULTIES: Difficulty[] = ['전체', '초급', '중급', '고급'];

/**
 * 더미 운동 데이터
 * TODO: 실제 구현 시 API에서 가져오기
 */
const DUMMY_EXERCISES: Exercise[] = [
  { id: 1, name: '푸쉬업', bodyPart: '상체', difficulty: '초급', thumbnail: '💪' },
  { id: 2, name: '벤치프레스', bodyPart: '상체', difficulty: '중급', thumbnail: '🏋️' },
  { id: 3, name: '풀업', bodyPart: '상체', difficulty: '고급', thumbnail: '🔝' },
  { id: 4, name: '덤벨 숄더프레스', bodyPart: '상체', difficulty: '중급', thumbnail: '💪' },
  { id: 5, name: '스쿼트', bodyPart: '하체', difficulty: '초급', thumbnail: '🦵' },
  { id: 6, name: '런지', bodyPart: '하체', difficulty: '초급', thumbnail: '🚶' },
  { id: 7, name: '레그프레스', bodyPart: '하체', difficulty: '중급', thumbnail: '🦿' },
  { id: 8, name: '데드리프트', bodyPart: '하체', difficulty: '고급', thumbnail: '🏋️' },
  { id: 9, name: '버피', bodyPart: '전신', difficulty: '고급', thumbnail: '🔥' },
  { id: 10, name: '마운틴클라이머', bodyPart: '전신', difficulty: '중급', thumbnail: '⛰️' },
  { id: 11, name: '점핑잭', bodyPart: '전신', difficulty: '초급', thumbnail: '⭐' },
  { id: 12, name: '케틀벨 스윙', bodyPart: '전신', difficulty: '중급', thumbnail: '🔔' },
  { id: 13, name: '플랭크', bodyPart: '코어', difficulty: '초급', thumbnail: '🧘' },
  { id: 14, name: '크런치', bodyPart: '코어', difficulty: '초급', thumbnail: '💫' },
  { id: 15, name: '레그레이즈', bodyPart: '코어', difficulty: '중급', thumbnail: '🦵' },
  { id: 16, name: '러시안 트위스트', bodyPart: '코어', difficulty: '중급', thumbnail: '🔄' },
  { id: 17, name: '행잉 레그레이즈', bodyPart: '코어', difficulty: '고급', thumbnail: '🎯' },
  { id: 18, name: '바벨 로우', bodyPart: '상체', difficulty: '중급', thumbnail: '💪' },
  { id: 19, name: '힙 쓰러스트', bodyPart: '하체', difficulty: '중급', thumbnail: '🍑' },
  { id: 20, name: '박스점프', bodyPart: '전신', difficulty: '고급', thumbnail: '📦' },
];

/**
 * ExerciseContent 컴포넌트
 * 운동 탭 콘텐츠 UI 렌더링
 */
export default function ExerciseContent() { 
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
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);

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
  };

  /**
   * 상세 페이지에서 뒤로가기 핸들러
   */
  const handleBackFromDetail = () => {
    setSelectedExerciseId(null);
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
    <main className="app-main">
      {/* 검색 바 */}
      <div className="exercise-search-bar">
        <Search className="exercise-search-icon" size={20} />
        <input
          type="text"
          className="exercise-search-input"
          placeholder="운동 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 부위별 필터 */}
      <div className="exercise-filter-section">
        <div className="exercise-filter-chips">
          {BODY_PARTS.map((bodyPart) => (
            <button
              key={bodyPart}
              className={`exercise-filter-chip ${
                selectedBodyParts.includes(bodyPart) ? 'active' : ''
              }`}
              onClick={() => handleBodyPartClick(bodyPart)}
            >
              {bodyPart}
            </button>
          ))}
        </div>
      </div>

      {/* 난이도별 필터 */}
      <div className="exercise-filter-section">
        <div className="exercise-filter-chips">
          {DIFFICULTIES.map((difficulty) => (
            <button
              key={difficulty}
              className={`exercise-filter-chip difficulty ${
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
    </main>
  );
}
