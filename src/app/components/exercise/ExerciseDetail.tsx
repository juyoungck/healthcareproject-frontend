/**
 * ExerciseDetailContent.tsx
 * 운동 상세 콘텐츠 컴포넌트
 * - 뒤로가기 바
 * - 운동 썸네일 이미지
 * - 운동명 및 태그
 * - 운동 방법 및 상세 설명
 * - 주의사항
 * - 유튜브 영상 썸네일
 * - 대체 운동 추천
 * 
 * 주의: 헤더/네비게이션은 Dashboard에서 관리
 */

import { useMemo } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { ExerciseDetail, DUMMY_EXERCISE_DETAILS } from '../../../data/exercises';

/**
 * 컴포넌트 Props 타입 정의
 */
interface ExerciseDetailContentProps {
  exerciseId: number;
  onBack: () => void;
  onSelectExercise: (id: number) => void;
}

/**
 * ExerciseDetailContent 컴포넌트
 * 운동 상세 정보 UI 렌더링 (콘텐츠만)
 */
export default function ExerciseDetailContent({ 
  exerciseId, 
  onBack,
  onSelectExercise,
}: ExerciseDetailContentProps) {
  /**
   * 현재 운동 데이터 찾기
   */
  const exercise = useMemo(() => {
    return DUMMY_EXERCISE_DETAILS.find(ex => ex.id === exerciseId);
  }, [exerciseId]);

  /**
   * 대체 운동 목록 (같은 부위, 현재 운동 제외)
   */
  const alternativeExercises = useMemo(() => {
    if (!exercise) return [];
    return DUMMY_EXERCISE_DETAILS
      .filter(ex => ex.bodyPart === exercise.bodyPart && ex.id !== exercise.id)
      .slice(0, 3);
  }, [exercise]);

  /**
   * 운동을 찾지 못한 경우
   */
  if (!exercise) {
    return (
      <main className="app-main">
        <div className="exercise-empty">
          <p className="exercise-empty-text">운동 정보를 찾을 수 없습니다</p>
        </div>
      </main>
    );
  }

  /**
   * 메인 콘텐츠 렌더링
   */
  return (
    <main className="exercise-detail-main">
      {/* 뒤로가기 바 */}
      <div className="exercise-detail-back-bar">
        <button className="exercise-detail-back" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* 썸네일 이미지 */}
      <div className="exercise-detail-thumbnail">
        <span className="exercise-detail-emoji">{exercise.thumbnail}</span>
      </div>

      {/* 운동명 및 태그 */}
      <div className="exercise-detail-title-section">
        <h1 className="exercise-detail-name">{exercise.name}</h1>
        <div className="exercise-detail-tags">
          <span className="exercise-card-tag bodypart">{exercise.bodyPart}</span>
          <span className="exercise-card-tag difficulty">{exercise.difficulty}</span>
        </div>
      </div>

      {/* 운동 설명 */}
      <div className="exercise-detail-section">
        <p className="exercise-detail-description">{exercise.description}</p>
      </div>

      {/* 운동 방법 */}
      <div className="exercise-detail-section">
        <h2 className="exercise-detail-section-title">운동 방법</h2>
        <ol className="exercise-detail-instructions">
          {exercise.instructions.map((instruction, index) => (
            <li key={index} className="exercise-detail-instruction-item">
              <span className="exercise-detail-instruction-number">{index + 1}</span>
              <span className="exercise-detail-instruction-text">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 주의사항 */}
      <div className="exercise-detail-section">
        <h2 className="exercise-detail-section-title">주의사항</h2>
        <ul className="exercise-detail-cautions">
          {exercise.cautions.map((caution, index) => (
            <li key={index} className="exercise-detail-caution-item">
              {caution}
            </li>
          ))}
        </ul>
      </div>

      {/* 유튜브 영상 */}
      <div className="exercise-detail-section">
        <h2 className="exercise-detail-section-title">운동 영상</h2>
        <a 
          href={exercise.youtubeUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="exercise-detail-video"
        >
          <img 
            src={exercise.youtubeThumb} 
            alt={`${exercise.name} 영상`}
            className="exercise-detail-video-thumb"
          />
          <div className="exercise-detail-video-play">
            <Play size={48} fill="white" />
          </div>
        </a>
      </div>

      {/* 대체 운동 */}
      {alternativeExercises.length > 0 && (
        <div className="exercise-detail-section">
          <h2 className="exercise-detail-section-title">대체 운동</h2>
          <div className="exercise-detail-alternatives">
            {alternativeExercises.map((alt) => (
              <button 
                key={alt.id} 
                className="exercise-alternative-card"
                onClick={() => onSelectExercise(alt.id)}
              >
                <div className="exercise-alternative-thumbnail">
                  <span className="exercise-alternative-emoji">{alt.thumbnail}</span>
                </div>
                <div className="exercise-alternative-info">
                  <p className="exercise-alternative-name">{alt.name}</p>
                  <span className="exercise-alternative-difficulty">{alt.difficulty}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}