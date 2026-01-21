/**
 * AdminDietModal.tsx
 * 음식 등록/수정 모달
 * - 음식명, 칼로리, 탄단지, 알러지 정보 입력
 */

import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { AdminFood } from '../../../types/admin';

/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface AdminDietModalProps {
  food: AdminFood | null;
  onClose: () => void;
  onSave: (data: Omit<AdminFood, 'id' | 'createdAt'>) => void;
}

/**
 * ===========================================
 * 알러지 옵션
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

/**
 * ===========================================
 * AdminDietModal 컴포넌트
 * ===========================================
 */

export default function AdminDietModal({
  food,
  onClose,
  onSave,
}: AdminDietModalProps) {
  /**
   * 상태 관리
   */
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');

  /**
   * 수정 모드일 경우 초기값 설정
   */
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

  /**
   * 알러지 토글 핸들러
   */
  const handleAllergyToggle = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy)
        ? prev.filter((a) => a !== allergy)
        : [...prev, allergy]
    );
  };

  /**
   * 저장 핸들러
   */
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
            {food ? '음식 수정' : '음식 등록'}
          </h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="admin-modal-content">
          {/* 음식명 */}
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

          {/* 영양정보 */}
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

          {/* 알러지 정보 */}
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
            {food ? '수정' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}