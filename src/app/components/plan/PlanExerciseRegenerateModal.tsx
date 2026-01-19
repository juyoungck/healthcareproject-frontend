/**
 * ExercisePlanRegenerateModal.tsx
 * 운동 계획 재생성 모달
 * - 추가 요구사항 텍스트 입력
 * - AI가 텍스트를 이해하여 계획 재생성
 */

import { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface ExercisePlanRegenerateModalProps {
  onClose: () => void;
  onRegenerate: (additionalRequest: string) => void;
}

/**
 * ExercisePlanRegenerateModal 컴포넌트
 */
export default function ExercisePlanRegenerateModal({ 
  onClose, 
  onRegenerate 
}: ExercisePlanRegenerateModalProps) {
  /**
   * 추가 요구사항 텍스트 상태
   */
  const [additionalRequest, setAdditionalRequest] = useState('');

  /**
   * 재생성 핸들러
   */
  const handleRegenerate = () => {
    onRegenerate(additionalRequest);
  };

  /**
   * 모달 외부 클릭 시 닫기
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="exercise-regenerate-overlay" onClick={handleOverlayClick}>
      <div className="exercise-regenerate-modal">
        {/* 헤더 */}
        <div className="exercise-regenerate-header">
          <h2 className="exercise-regenerate-title">운동 계획 재생성</h2>
          <button className="exercise-regenerate-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="exercise-regenerate-content">
          <p className="exercise-regenerate-desc">
            추가 요구사항을 입력하면 더 정확한 계획을 만들어드립니다.
          </p>

          {/* 텍스트 입력 */}
          <textarea
            className="exercise-regenerate-textarea"
            placeholder={`예: 덤벨 운동을 더 많이 추가해주세요\n예: 유산소 운동 비중을 늘려주세요`}
            value={additionalRequest}
            onChange={(e) => setAdditionalRequest(e.target.value)}
            rows={4}
          />
        </div>

        {/* 버튼 */}
        <div className="exercise-regenerate-actions">
          <button 
            className="exercise-regenerate-cancel-btn"
            onClick={onClose}
          >
            취소
          </button>
          <button 
            className="exercise-regenerate-submit-btn"
            onClick={handleRegenerate}
          >
            재생성하기
          </button>
        </div>
      </div>
    </div>
  );
}
