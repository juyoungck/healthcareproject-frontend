/**
 * NicknameModal.tsx
 * 닉네임 수정 모달
 */

import { X, Check } from 'lucide-react';
import { NICKNAME_MAX_LENGTH } from '../../../../constants/validation';

/**
 * Props 타입 정의
 */
interface NicknameModalProps {
  nickname: string;
  isUpdating: boolean;
  onChange: (nickname: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

/**
 * NicknameModal 컴포넌트
 */
export default function NicknameModal({
  nickname,
  isUpdating,
  onChange,
  onSubmit,
  onClose,
}: NicknameModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">닉네임 수정</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="mypage-edit-modal-content">
          <div className="form-group">
            <label className="form-label">닉네임</label>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 'var(--spacing-lg)' }}
              value={nickname}
              onChange={(e) => onChange(e.target.value)}
              maxLength={NICKNAME_MAX_LENGTH}
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
