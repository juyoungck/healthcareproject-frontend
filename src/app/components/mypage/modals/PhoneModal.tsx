/**
 * PhoneModal.tsx
 * 전화번호 수정 모달
 */

import { X, Check, Phone } from 'lucide-react';
import { PHONE_MAX_LENGTH } from '../../../../constants/validation';

/**
 * Props 타입 정의
 */
interface PhoneModalProps {
  phoneNumber: string;
  isUpdating: boolean;
  onChange: (phone: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

/**
 * PhoneModal 컴포넌트
 */
export default function PhoneModal({
  phoneNumber,
  isUpdating,
  onChange,
  onSubmit,
  onClose,
}: PhoneModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">전화번호 수정</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="mypage-edit-modal-content">
          <div className="form-group">
            <label className="form-label">전화번호</label>
            <div className="form-input-wrapper">
              <Phone className="form-input-icon" size={20} />
              <input
                type="tel"
                className="form-input"
                placeholder="010-0000-0000"
                value={phoneNumber}
                onChange={(e) => onChange(e.target.value)}
                maxLength={PHONE_MAX_LENGTH}
              />
            </div>
          </div>
          <button
            className="form-submit-btn"
            onClick={onSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? '저장 중...' : (
              <>
                <Check size={20} />
                저장
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
