/**
 * AdminExerciseList.tsx
 * 운동 관리 컴포넌트
 * - 운동 목록 CRUD
 * - 부위별/난이도별 필터
 * - 운동 등록/수정/삭제
 */

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Video } from 'lucide-react';
import type { AdminExercise, ExercisePart, ExerciseLevel } from '../../../types/admin';
import { adminExercises } from '../../../data/admin';
import AdminExerciseModal from './AdminExerciseModal';

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */

const partFilters: { value: ExercisePart | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'upper', label: '상체' },
  { value: 'lower', label: '하체' },
  { value: 'core', label: '코어' },
  { value: 'full', label: '전신' },
];

const levelFilters: { value: ExerciseLevel | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'beginner', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
];

/**
 * ===========================================
 * 라벨 변환 함수
 * ===========================================
 */

const getPartLabel = (part: ExercisePart) => {
  switch (part) {
    case 'upper':
      return '상체';
    case 'lower':
      return '하체';
    case 'core':
      return '코어';
    case 'full':
      return '전신';
    default:
      return part;
  }
};

const getLevelLabel = (level: ExerciseLevel) => {
  switch (level) {
    case 'beginner':
      return '초급';
    case 'intermediate':
      return '중급';
    case 'advanced':
      return '고급';
    default:
      return level;
  }
};

/**
 * ===========================================
 * AdminExerciseList 컴포넌트
 * ===========================================
 */

export default function AdminExerciseList() {
  /**
   * 상태 관리
   */
  const [exercises, setExercises] = useState<AdminExercise[]>(adminExercises);
  const [filterPart, setFilterPart] = useState<ExercisePart | 'all'>('all');
  const [filterLevel, setFilterLevel] = useState<ExerciseLevel | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<AdminExercise | null>(null);

  /**
   * 필터링된 목록
   */
  const filteredExercises = exercises.filter((exercise) => {
    /* 부위 필터 */
    if (filterPart !== 'all' && exercise.part !== filterPart) {
      return false;
    }
    /* 난이도 필터 */
    if (filterLevel !== 'all' && exercise.level !== filterLevel) {
      return false;
    }
    /* 검색 필터 */
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return exercise.name.toLowerCase().includes(keyword);
    }
    return true;
  });

  /**
   * 등록 모달 열기
   */
  const handleOpenCreateModal = () => {
    setSelectedExercise(null);
    setIsModalOpen(true);
  };

  /**
   * 수정 모달 열기
   */
  const handleOpenEditModal = (exercise: AdminExercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  /**
   * 저장 핸들러 (등록/수정)
   */
  const handleSave = (data: Omit<AdminExercise, 'id' | 'createdAt'>) => {
    if (selectedExercise) {
      /* 수정 */
      setExercises((prev) =>
        prev.map((exercise) =>
          exercise.id === selectedExercise.id
            ? { ...exercise, ...data }
            : exercise
        )
      );
    } else {
      /* 등록 */
      const newExercise: AdminExercise = {
        ...data,
        id: Math.max(...exercises.map((e) => e.id)) + 1,
        createdAt: new Date().toISOString(),
      };
      setExercises((prev) => [newExercise, ...prev]);
    }
    setIsModalOpen(false);

    /* TODO: API 연동 */
  };

  /**
   * 삭제 핸들러
   */
  const handleDelete = (id: number) => {
    if (!confirm('해당 운동을 삭제하시겠습니까?')) return;

    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/exercises/${id}`, { method: 'DELETE' }); */
  };

  /**
   * 날짜 포맷
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="admin-exercise-list">
      <div className="admin-section-header">
        <h2 className="admin-section-title">운동 관리</h2>
        <button className="admin-add-btn" onClick={handleOpenCreateModal}>
          <Plus size={18} />
          운동 등록
        </button>
      </div>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          {/* 부위 필터 */}
          <div className="admin-filter-tabs">
            {partFilters.map((filter) => (
              <button
                key={filter.value}
                className={`admin-filter-tab ${filterPart === filter.value ? 'active' : ''}`}
                onClick={() => setFilterPart(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* 난이도 필터 */}
          <select
            className="admin-filter-select"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as ExerciseLevel | 'all')}
          >
            {levelFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        {/* 검색 */}
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="운동명 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>운동명</th>
              <th>부위</th>
              <th>난이도</th>
              <th>설명</th>
              <th>영상</th>
              <th>등록일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredExercises.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-table-empty">
                  등록된 운동이 없습니다.
                </td>
              </tr>
            ) : (
              filteredExercises.map((exercise) => (
                <tr key={exercise.id}>
                  <td>{exercise.id}</td>
                  <td className="admin-table-name">{exercise.name}</td>
                  <td>
                    <span className={`admin-part-badge part-${exercise.part}`}>
                      {getPartLabel(exercise.part)}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-level-badge level-${exercise.level}`}>
                      {getLevelLabel(exercise.level)}
                    </span>
                  </td>
                  <td className="admin-table-desc">{exercise.description}</td>
                  <td>
                    {exercise.videoUrl ? (
                      <a>
                        href={exercise.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-video-link"
                      
                        <Video size={16} />
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{formatDate(exercise.createdAt)}</td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn edit"
                        onClick={() => handleOpenEditModal(exercise)}
                        title="수정"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="admin-action-btn delete"
                        onClick={() => handleDelete(exercise.id)}
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
          ))
            )}
        </tbody>
      </table>
    </div>

      {/* 등록/수정 모달 */ }
  {
    isModalOpen && (
      <AdminExerciseModal
        exercise={selectedExercise}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    )
  }
    </div >
  );
}