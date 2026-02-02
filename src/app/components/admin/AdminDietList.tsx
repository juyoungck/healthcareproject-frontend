/**
 * AdminDietList.tsx
 * 식단(음식) 관리 컴포넌트
 * 
 * API:
 * - GET /api/foods (음식 목록 - 일반 API)
 * - POST /api/admin/food (음식 등록 - 관리자 API)
 * 
 * 수정/삭제는 백엔드 미구현으로 등록만 가능
 */

import { useState, useEffect } from 'react';
import { Plus, AlertCircle, X, Trash2 } from 'lucide-react';
import apiClient from '../../../api/client';
import type {
  FoodListItem,
  FoodListParams,
  FoodListResponse,
} from '../../../api/types/food';
import { getApiErrorMessage } from '../../../api/apiError';
import { ALLERGY_OPTIONS, ALLERGY_LABELS } from '../../../constants/admin';
import type { AllergyType } from '../../../api/types/me';

/**
 * 알레르기 코드를 한글 라벨로 변환
 * @param allergyCodes 쉼표로 구분된 알레르기 코드 (예: "WHEAT,EGG,MILK")
 * @returns 한글 라벨 문자열 (예: "밀, 계란, 우유")
 */
const formatAllergyLabels = (allergyCodes: string): string => {
  return allergyCodes
    .split(',')
    .map(code => ALLERGY_LABELS[code.trim() as AllergyType] || code.trim())
    .join(', ');
};

/**
 * ===========================================
 * AdminDietList 컴포넌트
 * ===========================================
 */
export default function AdminDietList() {
  /** 상태 관리 */
  const [foods, setFoods] = useState<FoodListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * 음식 목록 조회 (GET /api/foods)
   */
  const fetchFoods = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: FoodListParams = {
        limit: 100,
      };

      const response = await apiClient.get<{ data: FoodListResponse }>('/api/foods', { params });
      setFoods(response.data.data.items);
    } catch (err) {
      setError(getApiErrorMessage(err, '음식 목록을 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 초기 로드
   */
  useEffect(() => {
    fetchFoods();
  }, []);

  /**
   * 등록 모달 열기
   */
  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  /**
   * 등록 핸들러 (POST /api/foods)
   */
  const handleSave = async (data: {
    name: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    allergyCodes: string;
    imageUrl?: string;
    nutritionUnit: string;
    nutritionAmount: number;
  }) => {
    try {
      await apiClient.post('/api/foods', {
        ...data,
        isActive: true,
      });
      setIsModalOpen(false);
      fetchFoods();
      alert('음식이 등록되었습니다.');
    } catch (err) {
      alert(getApiErrorMessage(err, '음식 등록에 실패했습니다.'));
    }
  };

  /**
   * 삭제 핸들러 (DELETE /api/foods/{id})
   */
  const handleDelete = async (foodId: number) => {
    if (!confirm('해당 음식을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return;

    try {
      await apiClient.delete(`/api/foods/${foodId}`);
      fetchFoods();
      alert('음식이 삭제되었습니다.');
    } catch (err) {
      alert(getApiErrorMessage(err, '음식 삭제에 실패했습니다.'));
    }
  };

  /**
   * 로딩 상태
   */
  if (isLoading) {
    return (
      <div className="admin-diet-list">
        <h2 className="admin-section-title">식단 관리</h2>
        <div className="admin-loading">로딩 중...</div>
      </div>
    );
  }

  /**
   * 에러 상태
   */
  if (error) {
    return (
      <div className="admin-diet-list">
        <h2 className="admin-section-title">식단 관리</h2>
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={fetchFoods} className="admin-btn primary">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-diet-list">
      {/* 헤더 영역 */}
      <div className="admin-section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 className="admin-section-title" style={{ margin: 0 }}>식단 관리</h2>
          <span className="admin-section-count" style={{ margin: 0 }}>전체 {foods.length}건</span>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div></div>
        <button className="admin-add-btn" onClick={handleOpenCreateModal}>
          <Plus size={18} />
          음식 등록
        </button>
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
              <th>이미지</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {foods.length === 0 ? (
              <tr>
                <td colSpan={9} className="admin-table-empty">
                  등록된 음식이 없습니다.
                </td>
              </tr>
            ) : (
              [...foods].sort((a, b) => b.foodId - a.foodId).map((food) => (
                <tr key={food.foodId}>
                  <td>{food.foodId}</td>
                  <td className="admin-table-name">{food.name}</td>
                  <td>{food.calories ?? '-'}</td>
                  <td>{food.carbs ?? '-'}</td>
                  <td>{food.protein ?? '-'}</td>
                  <td>{food.fat ?? '-'}</td>
                  <td>
                    {food.allergyCodes ? (
                      <div className="admin-allergy-badges">
                        <AlertCircle size={14} className="admin-allergy-icon" />
                        {formatAllergyLabels(food.allergyCodes)}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {food.imageUrl ? (
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="admin-table-img"
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn delete"
                        onClick={() => handleDelete(food.foodId)}
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

      {/* 등록 모달 */}
      {isModalOpen && (
        <DietModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/**
 * ===========================================
 * 음식 등록 모달
 * ===========================================
 */

interface DietModalProps {
  onClose: () => void;
  onSave: (data: {
    name: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    allergyCodes: string;
    imageUrl?: string;
    nutritionUnit: string;
    nutritionAmount: number;
  }) => void;
}

function DietModal({ onClose, onSave }: DietModalProps) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [allergyCodes, setAllergyCodes] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [nutritionUnit, setNutritionUnit] = useState('g');
  const [nutritionAmount, setNutritionAmount] = useState<number>(100);

  const handleAllergyToggle = (allergy: string) => {
    setAllergyCodes((prev) =>
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
      allergyCodes: allergyCodes.join(','),
      imageUrl: imageUrl.trim() || undefined,
      nutritionUnit,
      nutritionAmount,
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
          <h3 className="admin-modal-title">음식 등록</h3>
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
            <label className="admin-form-label">영양정보</label>
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
            <label className="admin-form-label">영양정보 기준</label>
            <div className="admin-nutrition-grid">
              <div className="admin-nutrition-item">
                <label>단위</label>
                <div className="admin-nutrition-input">
                  <select
                    value={nutritionUnit}
                    onChange={(e) => setNutritionUnit(e.target.value)}
                    className="admin-form-select"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="인분">인분</option>
                    <option value="개">개</option>
                  </select>
                </div>
              </div>
              <div className="admin-nutrition-item">
                <label>기준량</label>
                <div className="admin-nutrition-input">
                  <input
                    type="number"
                    value={nutritionAmount}
                    onChange={(e) => setNutritionAmount(Number(e.target.value))}
                    min={1}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">알러지 정보</label>
            <div className="admin-allergy-options">
              {ALLERGY_OPTIONS.map((allergy) => (
                <button
                  key={allergy.value}
                  type="button"
                  className={`admin-allergy-btn ${allergyCodes.includes(allergy.value) ? 'active' : ''}`}
                  onClick={() => handleAllergyToggle(allergy.value)}
                >
                  {allergy.label}
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
            등록
          </button>
        </div>
      </div>
    </div>
  );
}