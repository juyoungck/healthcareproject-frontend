/**
 * AdminDietList.tsx
 * 식단 관리 컴포넌트 (목록 + 등록/수정 모달 통합)
 * 
 * TODO: 백엔드 완성 후 API 연동
 * - POST /api/admin/food (음식 등록)
 * - PUT /api/admin/food/{id} (음식 수정)
 * - DELETE /api/admin/food/{id} (음식 삭제)
 */

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, AlertCircle, X } from 'lucide-react';
import type { AdminFood } from '../../../types/admin';
import { adminFoods } from '../../../data/admin';

/**
 * ===========================================
 * 날짜 포맷
 * ===========================================
 */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * ===========================================
 * AdminDietList 컴포넌트
 * ===========================================
 */
export default function AdminDietList() {
  const [foods, setFoods] = useState<AdminFood[]>(adminFoods);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<AdminFood | null>(null);

  /**
   * 필터링된 목록
   */
  const filteredFoods = foods.filter((food) => {
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return food.name.toLowerCase().includes(keyword);
    }
    return true;
  });

  /**
   * 등록 모달 열기
   */
  const handleOpenCreateModal = () => {
    setSelectedFood(null);
    setIsModalOpen(true);
  };

  /**
   * 수정 모달 열기
   */
  const handleOpenEditModal = (food: AdminFood) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  /**
   * 저장 핸들러 (등록/수정)
   * TODO: POST /api/admin/food 또는 PUT /api/admin/food/{id}
   */
  const handleSave = (data: Omit<AdminFood, 'id' | 'createdAt'>) => {
    if (selectedFood) {
      /* 수정 */
      setFoods((prev) =>
        prev.map((food) =>
          food.id === selectedFood.id
            ? { ...food, ...data }
            : food
        )
      );
    } else {
      /* 등록 */
      const newFood: AdminFood = {
        ...data,
        id: Math.max(...foods.map((f) => f.id), 0) + 1,
        createdAt: new Date().toISOString(),
      };
      setFoods((prev) => [newFood, ...prev]);
    }
    setIsModalOpen(false);
  };

  /**
   * 삭제 핸들러
   * TODO: DELETE /api/admin/food/{id}
   */
  const handleDelete = (id: number) => {
    if (!confirm('해당 음식을 삭제하시겠습니까?')) return;
    setFoods((prev) => prev.filter((food) => food.id !== id));
  };

  return (
    <div className="admin-diet-list">
      <div className="admin-section-header">
        <h2 className="admin-section-title">식단 관리</h2>
        <button className="admin-add-btn" onClick={handleOpenCreateModal}>
          <Plus size={18} />
          음식 등록
        </button>
      </div>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          <div className="admin-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="음식명 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>음식명</th>
              <th>칼로리</th>
              <th>탄수화물</th>
              <th>단백질</th>
              <th>지방</th>
              <th>알러지</th>
              <th>등록일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredFoods.length === 0 ? (
              <tr>
                <td colSpan={9} className="admin-table-empty">
                  등록된 음식이 없습니다.
                </td>
              </tr>
            ) : (
              filteredFoods.map((food) => (
                <tr key={food.id}>
                  <td>{food.id}</td>
                  <td className="admin-table-name">{food.name}</td>
                  <td>{food.calories}kcal</td>
                  <td>{food.carbs}g</td>
                  <td>{food.protein}g</td>
                  <td>{food.fat}g</td>
                  <td>
                    {food.allergies.length > 0 ? (
                      <div className="admin-allergy-badges">
                        <AlertCircle size={14} className="admin-allergy-icon" />
                        {food.allergies.join(', ')}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{formatDate(food.createdAt)}</td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn edit"
                        onClick={() => handleOpenEditModal(food)}
                        title="수정"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="admin-action-btn delete"
                        onClick={() => handleDelete(food.id)}
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

      {/* 등록/수정 모달 (통합) */}
      {isModalOpen && (
        <DietModal
          food={selectedFood}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/**
 * ===========================================
 * 음식 등록/수정 모달 (내부 컴포넌트로 통합)
 * ===========================================
 */
const ALLERGY_OPTIONS = [
  '유제품',
  '계란',
  '밀',
  '땅콩',
  '대두',
  '갑각류',
  '생선',
  '견과류',
];

interface DietModalProps {
  food: AdminFood | null;
  onClose: () => void;
  onSave: (data: Omit<AdminFood, 'id' | 'createdAt'>) => void;
}

function DietModal({ food, onClose, onSave }: DietModalProps) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (food) {
      setName(food.name);
      setCalories(food.calories);
      setCarbs(food.carbs);
      setProtein(food.protein);
      setFat(food.fat);
      setAllergies(food.allergies);
      setImageUrl(food.imageUrl || '');
    }
  }, [food]);

  const handleAllergyToggle = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy)
        ? prev.filter((a) => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('음식명을 입력해주세요.');
      return;
    }
    if (calories <= 0) {
      alert('칼로리를 입력해주세요.');
      return;
    }

    onSave({
      name: name.trim(),
      calories,
      carbs,
      protein,
      fat,
      allergies,
      imageUrl: imageUrl.trim() || undefined,
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
          <h3 className="admin-modal-title">
            {food ? '음식 수정' : '음식 등록'}
          </h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="admin-modal-content">
          <div className="admin-form-group">
            <label className="admin-form-label">음식명 *</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="예: 닭가슴살"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">영양정보 (100g 기준) *</label>
            <div className="admin-nutrition-grid">
              <div className="admin-nutrition-item">
                <label>칼로리</label>
                <div className="admin-nutrition-input">
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    min={0}
                  />
                  <span>kcal</span>
                </div>
              </div>
              <div className="admin-nutrition-item">
                <label>탄수화물</label>
                <div className="admin-nutrition-input">
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(Number(e.target.value))}
                    min={0}
                  />
                  <span>g</span>
                </div>
              </div>
              <div className="admin-nutrition-item">
                <label>단백질</label>
                <div className="admin-nutrition-input">
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    min={0}
                  />
                  <span>g</span>
                </div>
              </div>
              <div className="admin-nutrition-item">
                <label>지방</label>
                <div className="admin-nutrition-input">
                  <input
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(Number(e.target.value))}
                    min={0}
                  />
                  <span>g</span>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">알러지 정보</label>
            <div className="admin-allergy-options">
              {ALLERGY_OPTIONS.map((allergy) => (
                <button
                  key={allergy}
                  type="button"
                  className={`admin-allergy-btn ${allergies.includes(allergy) ? 'active' : ''}`}
                  onClick={() => handleAllergyToggle(allergy)}
                >
                  {allergy}
                </button>
              ))}
            </div>
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
        </div>

        {/* 푸터 */}
        <div className="admin-modal-footer">
          <button className="admin-btn secondary" onClick={onClose}>
            취소
          </button>
          <button className="admin-btn primary" onClick={handleSave}>
            {food ? '수정' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}