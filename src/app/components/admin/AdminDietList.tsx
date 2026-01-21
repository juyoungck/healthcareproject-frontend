/**
 * AdminDietList.tsx
 * 식단 관리 컴포넌트
 * - 음식 목록 CRUD
 * - 영양정보 등록/수정
 * - 알러지 정보 관리
 */

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import type { AdminFood } from '../../../types/admin';
import { adminFoods } from '../../../data/admin';
import AdminDietModal from './AdminDietModal';

/**
 * ===========================================
 * AdminDietList 컴포넌트
 * ===========================================
 */

export default function AdminDietList() {
  /**
   * 상태 관리
   */
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
        id: Math.max(...foods.map((f) => f.id)) + 1,
        createdAt: new Date().toISOString(),
      };
      setFoods((prev) => [newFood, ...prev]);
    }
    setIsModalOpen(false);

    /* TODO: API 연동 */
  };

  /**
   * 삭제 핸들러
   */
  const handleDelete = (id: number) => {
    if (!confirm('해당 음식을 삭제하시겠습니까?')) return;

    setFoods((prev) => prev.filter((food) => food.id !== id));

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/foods/${id}`, { method: 'DELETE' }); */
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
          {/* 검색 */}
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

      {/* 등록/수정 모달 */}
      {isModalOpen && (
        <AdminDietModal
          food={selectedFood}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}