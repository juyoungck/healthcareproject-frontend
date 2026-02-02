/**
 * CompleteModal.tsx
 * 온보딩 완료 모달 컴포넌트
 */

import { Check } from 'lucide-react';
import type { CompleteMessage } from '../../../api/types/onboarding';

/**
 * Props 타입 정의
 */
interface CompleteModalProps {
  message: CompleteMessage;
  onConfirm: () => void;
}

/**
 * CompleteModal 컴포넌트
 */
export default function CompleteModal({ message, onConfirm }: CompleteModalProps) {
  return (
    <div className="modal-overlay">
      <div className="onboarding-complete-modal">
        <div className="onboarding-complete-modal-icon">
          <Check size={32} />
        </div>
        <h3 className="onboarding-complete-modal-title">{message.title}</h3>
        <p className="onboarding-complete-modal-desc">{message.desc}</p>
        <button
          className="onboarding-complete-modal-btn"
          onClick={onConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
}
