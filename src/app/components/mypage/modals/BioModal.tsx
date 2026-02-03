/**
 * BioModal.tsx
 * 트레이너 소개문구 수정 모달
 */

import { X, Check } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface BioModalProps {
  bio: string;
  isUpdating: boolean;
  onChange: (bio: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

/**
 * BioModal 컴포넌트
 */
export default function BioModal({
  bio,
  isUpdating,
  onChange,
  onSubmit,
  onClose,
}: BioModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">소개문구 수정</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="mypage-edit-modal-content">
          <div className="form-group">
            <label className="form-label">소개문구</label>
            <textarea
              className="form-textarea"
              placeholder="트레이너 소개문구를 입력해주세요."
              value={bio}
              onChange={(e) => onChange(e.target.value)}
              rows={5}
            />
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
