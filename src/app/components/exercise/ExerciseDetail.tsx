/**
 * ExerciseDetail.tsx
 * 운동 상세 페이지 컴포넌트
 * - 운동 상세 정보 표시
 * - 유튜브 영상 링크
 * - 대체 운동 추천
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, Loader } from 'lucide-react';
import { getExerciseDetail } from '../../../api/exercise';
import type { ExerciseDetail, AlternativeExercise } from '../../../api/types/exercise';
import { BODY_PART_LABELS, DIFFICULTY_LABELS } from '../../../api/types/exercise';

/**
 * Props 타입 정의
 */
interface ExerciseDetailProps {
  exerciseId: number;
  onBack: () => void;
  onSelectExercise: (id: number) => void;
}

/**
 * ExerciseDetailContent 컴포넌트
 */
export default function ExerciseDetailContent({
  exerciseId,
  onBack,
  onSelectExercise,
}: ExerciseDetailProps) {
  /**
   * 상태 관리
   */
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [alternatives, setAlternatives] = useState<AlternativeExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * 운동 상세 조회
   */
  useEffect(() => {
    const appMain = document.querySelector('.app-main');
    if (appMain) {
      appMain.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const fetchExerciseDetail = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await getExerciseDetail(exerciseId);
        setExercise(response.exercise);
        setAlternatives(response.alternatives);
      } catch (err) {
        console.error('운동 상세 조회 실패:', err);
        setError('운동 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExerciseDetail();
  }, [exerciseId]);

  /**
   * 로딩 상태
   */
  if (isLoading) {
    return (
      <div className="exercise-detail">
        <header className="exercise-detail-header">
          <button className="exercise-detail-back-btn" onClick={onBack}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="exercise-detail-title">운동 상세</h1>
          <div className="exercise-detail-header-spacer" />
        </header>
        <div className="exercise-detail-loading">
          <Loader className="spinner" size={32} />
          <p>운동 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  /**
   * 에러 상태
   */
  if (error || !exercise) {
    return (
      <div className="exercise-detail">
        <header className="exercise-detail-header">
          <button className="exercise-detail-back-btn" onClick={onBack}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="exercise-detail-title">운동 상세</h1>
          <div className="exercise-detail-header-spacer" />
        </header>
        <div className="exercise-detail-error">
          <p>{error || '운동을 찾을 수 없습니다.'}</p>
          <button onClick={onBack}>목록으로 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-detail">
      {/* 헤더 */}
      <header className="exercise-detail-header">
        <button className="exercise-detail-back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="exercise-detail-title">{exercise.name}</h1>
        <div className="exercise-detail-header-spacer" />
      </header>

      {/* 콘텐츠 */}
      <main className="exercise-detail-content">
        {/* 운동 이미지 */}
        <div className="exercise-detail-image-section">
          {exercise.imageUrl ? (
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="exercise-detail-image"
            />
          ) : (
            <div className="exercise-detail-image-placeholder">
              <span>💪</span>
            </div>
          )}
        </div>

        {/* 태그 */}
        <div className="exercise-detail-tags">
          <span className="exercise-detail-tag bodypart">
            {BODY_PART_LABELS[exercise.bodyPart]}
          </span>
          <span className="exercise-detail-tag difficulty">
            {DIFFICULTY_LABELS[exercise.difficulty]}
          </span>
        </div>

        {/* 설명 */}
        <section className="exercise-detail-section">
          <h2 className="exercise-detail-section-title">운동 설명</h2>
          <p className="exercise-detail-description">{exercise.description}</p>
        </section>

        {/* 주의사항 */}
        {exercise.precautions && (
          <section className="exercise-detail-section">
            <h2 className="exercise-detail-section-title">
              <AlertTriangle size={18} />
              주의사항
            </h2>
            <p className="exercise-detail-precautions">{exercise.precautions}</p>
          </section>
        )}

        {/* 유튜브 영상 */}
        {exercise.youtubeUrl && (
          <section className="exercise-detail-section">
            <h2 className="exercise-detail-section-title">운동 영상</h2>
            <iframe
              className="exercise-detail-video"
              src={exercise.youtubeUrl.replace('watch?v=', 'embed/')}
              title={`${exercise.name} 영상`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </section>
        )}

        {/* 대체 운동 */}
        {alternatives.length > 0 && (
          <section className="exercise-detail-section">
            <h2 className="exercise-detail-section-title">대체 운동</h2>
            <div className="exercise-detail-alternatives">
              {alternatives.map((alt) => (
                <button
                  key={alt.exerciseId}
                  className="exercise-detail-alternative-card"
                  onClick={() => onSelectExercise(alt.exerciseId)}
                >
                  <div className="exercise-detail-alternative-thumbnail">
                    {alt.imageUrl ? (
                      <img src={alt.imageUrl} alt={alt.name} />
                    ) : (
                      <span>💪</span>
                    )}
                  </div>
                  <span className="exercise-detail-alternative-name">{alt.name}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}