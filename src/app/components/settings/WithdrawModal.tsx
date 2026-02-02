/**
 * WithdrawModal.tsx
 * 회원탈퇴 확인 모달 컴포넌트
 */

import { useState } from 'react';
import { AlertTriangle, Type } from 'lucide-react';
import { withdrawUser } from '../../../api/me';
import { extractAxiosError } from '../../../api/apiError';

/**
 * Props 타입 정의
 */
interface WithdrawModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * 탈퇴 확인 문구 상수
 */
const WITHDRAW_CONFIRM_TEXT = '회원탈퇴';

/**
 * WithdrawModal 컴포넌트
 */
export default function WithdrawModal({ onClose, onSuccess }: WithdrawModalProps) {
  /** 상태 관리 */
  const [confirmText, setConfirmText] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState('');

  /**
   * 모달 닫기
   */
  const handleClose = () => {
    setConfirmText('');
    setError('');
    onClose();
  };

  /**
   * 회원탈퇴 핸들러
   */
  const handleWithdraw = async () => {
    /** 확인 문구 검증 */
    if (confirmText !== WITHDRAW_CONFIRM_TEXT) {
      setError(`"${WITHDRAW_CONFIRM_TEXT}"를 정확히 입력해주세요.`);
      return;
    }

    setIsWithdrawing(true);
    setError('');

    try {
      await withdrawUser();
      alert('회원탈퇴가 완료되었습니다.');
      handleClose();
      onSuccess();
    } catch (err) {
      const { message } = extractAxiosError(err, '회원탈퇴에 실패했습니다. 다시 시도해주세요.');
      setError(message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="settings-withdraw-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-withdraw-icon">
          <AlertTriangle size={32} />
        </div>
        <h3 className="settings-withdraw-title">정말 탈퇴하시겠습니까?</h3>
        <p className="settings-withdraw-desc">
          탈퇴 시 모든 데이터가 삭제되며<br />복구할 수 없습니다.
        </p>

        {/* 확인 문구 입력 */}
        <div className="settings-withdraw-confirm">
          <p className="settings-withdraw-confirm-label">
            탈퇴를 원하시면 <strong>"{WITHDRAW_CONFIRM_TEXT}"</strong>를 입력해주세요.
          </p>
          <div className="form-input-wrapper">
            <Type className="form-input-icon" size={20} />
            <input
              type="text"
              className="form-input"
              placeholder={WITHDRAW_CONFIRM_TEXT}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleWithdraw()}
            />
          </div>
          {error && (
            <p className="settings-withdraw-error">{error}</p>
          )}
        </div>

        <div className="settings-withdraw-actions">
          <button
            className="settings-withdraw-btn cancel"
            onClick={handleClose}
            disabled={isWithdrawing}
          >
            취소
          </button>
          <button
            className="settings-withdraw-btn confirm"
            onClick={handleWithdraw}
            disabled={isWithdrawing || confirmText !== WITHDRAW_CONFIRM_TEXT}
          >
            {isWithdrawing ? '처리중...' : '탈퇴하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
