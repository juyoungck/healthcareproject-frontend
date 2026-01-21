/**
 * AdminExerciseModal.tsx
 * 운동 등록/수정 모달
 * - 운동명, 부위, 난이도, 설명, 영상URL 입력
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { AdminExercise, ExercisePart, ExerciseLevel } from '../../../types/admin';

/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface AdminExerciseModalProps {
  exercise: AdminExercise | null;
  onClose: () => void;
  onSave: (data: Omit<AdminExercise, 'id' | 'createdAt'>) => void;
}

/**
 * ===========================================
 * 옵션 데이터
 * ===========================================
 */

const partOptions: { value: ExercisePart; label: string }[] = [
  { value: 'upper', label: '상체' },
  { value: 'lower', label: '하체' },
  { value: 'core', label: '코어' },
  { value: 'full', label: '전신' },
];

const levelOptions: { value: ExerciseLevel; label: string }[] = [
  { value: 'beginner', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
];

/**
 * ===========================================
 * AdminExerciseModal 컴포넌트
 * ===========================================
 */

export default function AdminExerciseModal({
  exercise,
  onClose,
  onSave,
}: AdminExerciseModalProps) {
  /**
   * 상태 관리
   */
  const [name, setName] = useState('');
  const [part, setPart] = useState<ExercisePart>('upper');
  const [level, setLevel] = useState<ExerciseLevel>('beginner');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  /**
   * 수정 모드일 경우 초기값 설정
   */
  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setPart(exercise.part);
      setLevel(exercise.level);
      setDescription(exercise.description);
      setVideoUrl(exercise.videoUrl || '');
      setImageUrl(exercise.imageUrl || '');
    }
  }, [exercise]);

  /**
   * 저장 핸들러
   */
  const handleSave = () => {
    if (!name.trim()) {
      alert('운동명을 입력해주세요.');
      return;
    }
    if (!description.trim()) {
      alert('설명을 입력해주세요.');
      return;
    }

    onSave({
      name: name.trim(),
      part,
      level,
      description: description.trim(),
      videoUrl: videoUrl.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    });
  };

  /**
   * 오버레이 클릭 핸들러
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal-container">
        {/* 헤더 */}
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">
            {exercise ? '운동 수정' : '운동 등록'}
          </h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="admin-modal-content">
          {/* 운동명 */}
          <div className="admin-form-group">
            <label className="admin-form-label">운동명 *</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="예: 벤치프레스"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 부위 */}
          <div className="admin-form-group">
            <label className="admin-form-label">부위 *</label>
            <select
              className="admin-form-select"
              value={part}
              onChange={(e) => setPart(e.target.value as ExercisePart)}
            >
              {partOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 난이도 */}
          <div className="admin-form-group">
            <label className="admin-form-label">난이도 *</label>
            <select
              className="admin-form-select"
              value={level}
              onChange={(e) => setLevel(e.target.value as ExerciseLevel)}
            >
              {levelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 설명 */}
          <div className="admin-form-group">
            <label className="admin-form-label">설명 *</label>
            <textarea
              className="admin-form-textarea"
              placeholder="운동 방법 및 주의사항을 입력하세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* 영상 URL */}
          <div className="admin-form-group">
            <label className="admin-form-label">영상 URL</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="https://youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          {/* 이미지 URL */}
          <div className="admin-form-group">
            <label className="admin-form-label">이미지 URL</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="admin-modal-footer">
          <button className="admin-btn secondary" onClick={onClose}>
            취소
          </button>
          <button className="admin-btn primary" onClick={handleSave}>
            {exercise ? '수정' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}