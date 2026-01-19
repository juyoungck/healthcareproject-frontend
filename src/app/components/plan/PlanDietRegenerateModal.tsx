/**
 * PlanDietRegenerateModal.tsx
 * 식단 계획 재생성 모달
 * - 추가 요구사항 텍스트 입력
 * - AI가 텍스트를 이해하여 계획 재생성
 */

import { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface PlanDietRegenerateModalProps {
  onClose: () => void;
  onRegenerate: (additionalRequest: string) => void;
}

/**
 * PlanDietRegenerateModal 컴포넌트
 */
export default function PlanDietRegenerateModal({ 
  onClose, 
  onRegenerate 
}: PlanDietRegenerateModalProps) {
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
    <div className="diet-regenerate-overlay" onClick={handleOverlayClick}>
      <div className="diet-regenerate-modal">
        {/* 헤더 */}
        <div className="diet-regenerate-header">
          <h2 className="diet-regenerate-title">식단 계획 재생성</h2>
          <button className="diet-regenerate-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="diet-regenerate-content">
          <p className="diet-regenerate-desc">
            추가 요구사항을 입력하면 더 정확한 식단을 만들어드립니다.
          </p>

          {/* 텍스트 입력 */}
          <textarea
            className="diet-regenerate-textarea"
            placeholder={`예: 닭가슴살 대신 다른 단백질로 대체해주세요\n예: 아침 식사를 간단하게 해주세요`}
            value={additionalRequest}
            onChange={(e) => setAdditionalRequest(e.target.value)}
            rows={4}
          />
        </div>

        {/* 버튼 */}
        <div className="diet-regenerate-actions">
          <button 
            className="diet-regenerate-cancel-btn"
            onClick={onClose}
          >
            취소
          </button>
          <button 
            className="diet-regenerate-submit-btn"
            onClick={handleRegenerate}
          >
            재생성하기
          </button>
        </div>
      </div>
    </div>
  );
}
