/**
 * AdminExerciseList.tsx
 * 운동 관리 컴포넌트
 * 
 * API:
 * - GET /api/exercises (운동 목록 - 일반 API)
 * - POST /api/admin/exercise (운동 등록 - 관리자 API)
 * 
 * 수정/삭제는 백엔드 미구현으로 등록만 가능
 */

import { useState, useEffect } from 'react';
import { Search, Plus, X, Trash2 } from 'lucide-react';
import apiClient from '../../../api/client';
import type {
  ExerciseListItem,
  ExerciseListParams,
  ExerciseListResponse,
  BodyPart,
  Difficulty,
  BODY_PART_LABELS,
  DIFFICULTY_LABELS,
} from '../../../api/types/exercise';

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */
const bodyPartFilters: { value: BodyPart | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'CHEST', label: '가슴' },
  { value: 'BACK', label: '등' },
  { value: 'SHOULDER', label: '어깨' },
  { value: 'ARM', label: '팔' },
  { value: 'LEG', label: '하체' },
  { value: 'CORE', label: '코어' },
  { value: 'FULL_BODY', label: '전신' },
];

/**
 * ===========================================
 * 라벨 변환 함수
 * ===========================================
 */
const getBodyPartLabel = (part: BodyPart) => {
  const labels: Record<BodyPart, string> = {
    CHEST: '가슴',
    BACK: '등',
    SHOULDER: '어깨',
    ARM: '팔',
    LEG: '하체',
    CORE: '코어',
    FULL_BODY: '전신',
  };
  return labels[part] ?? part;
};

const getDifficultyLabel = (difficulty: Difficulty) => {
  const labels: Record<Difficulty, string> = {
    BEGINNER: '초급',
    INTERMEDIATE: '중급',
    ADVANCED: '고급',
  };
  return labels[difficulty] ?? difficulty;
};

/**
 * ===========================================
 * AdminExerciseList 컴포넌트
 * ===========================================
 */
export default function AdminExerciseList() {
  /** 상태 관리 */
  const [exercises, setExercises] = useState<ExerciseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterBodyPart, setFilterBodyPart] = useState<BodyPart | 'ALL'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * 운동 목록 조회 (GET /api/exercises)
   */
  const fetchExercises = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: ExerciseListParams = {
        limit: 100,
      };

      if (filterBodyPart !== 'ALL') {
        params.bodyPart = filterBodyPart;
      }
      if (searchKeyword) {
        params.keyword = searchKeyword;
      }

      const response = await apiClient.get<{ data: ExerciseListResponse }>('/api/exercises', { params });
      setExercises(response.data.data.items);
    } catch (err) {
      console.error('운동 목록 조회 실패:', err);
      setError('운동 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 초기 로드 및 필터 변경 시 재조회
   */
  useEffect(() => {
    fetchExercises();
  }, [filterBodyPart]);

  /**
   * 검색 실행 (Enter 키)
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchExercises();
    }
  };

  /**
   * 등록 모달 열기
   */
  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  /**
   * 등록 핸들러 (POST /api/exercises)
   */
  const handleSave = async (data: {
    name: string;
    bodyPart: BodyPart;
    difficulty: Difficulty;
    description: string;
    precautions: string;
    imageUrl?: string;
    youtubeUrl?: string;
  }) => {
    try {
      await apiClient.post('/api/exercises', {
        ...data,
        isActive: true,
      });
      setIsModalOpen(false);
      fetchExercises();
      alert('운동이 등록되었습니다.');
    } catch (err) {
      console.error('운동 등록 실패:', err);
      alert('운동 등록에 실패했습니다.');
    }
  };

  /**
   * 삭제 핸들러 (DELETE /api/exercises/{id})
   * TODO: 백엔드 API 구현 필요
   */
  const handleDelete = async (exerciseId: number) => {
    if (!confirm('해당 운동을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return;

    try {
      await apiClient.delete(`/api/exercises/${exerciseId}`);
      fetchExercises();
      alert('운동이 삭제되었습니다.');
    } catch (err) {
      console.error('운동 삭제 실패:', err);
      alert('운동 삭제에 실패했습니다.');
    }
  };

  /**
   * 로딩 상태
   */
  if (isLoading) {
    return (
      <div className="admin-exercise-list">
        <h2 className="admin-section-title">운동 관리</h2>
        <div className="admin-loading">로딩 중...</div>
      </div>
    );
  }

  /**
   * 에러 상태
   */
  if (error) {
    return (
      <div className="admin-exercise-list">
        <h2 className="admin-section-title">운동 관리</h2>
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={fetchExercises} className="admin-btn primary">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-exercise-list">
      <div className="admin-section-header">
        <h2 className="admin-section-title">운동 관리</h2>
        <button className="admin-add-btn" onClick={handleOpenCreateModal}>
          <Plus size={18} />
          운동 등록
        </button>
      </div>
      <p className="admin-section-count">전체 {exercises.length}건</p>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          <div className="admin-filter-tabs">
            {bodyPartFilters.map((filter) => (
              <button
                key={filter.value}
                className={`admin-filter-tab ${filterBodyPart === filter.value ? 'active' : ''}`}
                onClick={() => setFilterBodyPart(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="운동명 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>이미지</th>
              <th>운동명</th>
              <th>부위</th>
              <th>난이도</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {exercises.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-table-empty">
                  등록된 운동이 없습니다.
                </td>
              </tr>
            ) : (
              [...exercises].sort((a, b) => b.exerciseId - a.exerciseId).map((exercise) => (
                <tr key={exercise.exerciseId}>
                  <td>{exercise.exerciseId}</td>
                  <td>
                    {exercise.imageUrl ? (
                      <img
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        className="admin-table-img"
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="admin-table-name">{exercise.name}</td>
                  <td>
                    <span className={`admin-part-badge part-${exercise.bodyPart.toLowerCase()}`}>
                      {getBodyPartLabel(exercise.bodyPart)}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-level-badge level-${exercise.difficulty.toLowerCase()}`}>
                      {getDifficultyLabel(exercise.difficulty)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="admin-action-btn delete"
                      onClick={() => handleDelete(exercise.exerciseId)}
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 등록 모달 */}
      {isModalOpen && (
        <ExerciseModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/**
 * ===========================================
 * 운동 등록 모달
 * ===========================================
 */
const bodyPartOptions: { value: BodyPart; label: string }[] = [
  { value: 'CHEST', label: '가슴' },
  { value: 'BACK', label: '등' },
  { value: 'SHOULDER', label: '어깨' },
  { value: 'ARM', label: '팔' },
  { value: 'LEG', label: '하체' },
  { value: 'CORE', label: '코어' },
  { value: 'FULL_BODY', label: '전신' },
];

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'BEGINNER', label: '초급' },
  { value: 'INTERMEDIATE', label: '중급' },
  { value: 'ADVANCED', label: '고급' },
];

interface ExerciseModalProps {
  onClose: () => void;
  onSave: (data: {
    name: string;
    bodyPart: BodyPart;
    difficulty: Difficulty;
    description: string;
    precautions: string;
    imageUrl?: string;
    youtubeUrl?: string;
  }) => void;
}

function ExerciseModal({ onClose, onSave }: ExerciseModalProps) {
  const [name, setName] = useState('');
  const [bodyPart, setBodyPart] = useState<BodyPart>('CHEST');
  const [difficulty, setDifficulty] = useState<Difficulty>('BEGINNER');
  const [description, setDescription] = useState('');
  const [precautions, setPrecautions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

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
      bodyPart,
      difficulty,
      description: description.trim(),
      precautions: precautions.trim(),
      imageUrl: imageUrl.trim() || undefined,
      youtubeUrl: youtubeUrl.trim() || undefined,
    });
  };

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
          <h3 className="admin-modal-title">운동 등록</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="admin-modal-content">
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

          <div className="admin-form-group">
            <label className="admin-form-label">부위 *</label>
            <select
              className="admin-form-select"
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value as BodyPart)}
            >
              {bodyPartOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">난이도 *</label>
            <select
              className="admin-form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">설명 *</label>
            <textarea
              className="admin-form-textarea"
              placeholder="운동 설명을 입력하세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">주의사항</label>
            <textarea
              className="admin-form-textarea"
              placeholder="운동 시 주의사항을 입력하세요."
              value={precautions}
              onChange={(e) => setPrecautions(e.target.value)}
              rows={2}
            />
          </div>

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

          <div className="admin-form-group">
            <label className="admin-form-label">유튜브 URL</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="https://youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="admin-modal-footer">
          <button className="admin-btn secondary" onClick={onClose}>
            취소
          </button>
          <button className="admin-btn primary" onClick={handleSave}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
}