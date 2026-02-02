/**
 * PasswordChangeModal.tsx
 * 비밀번호 변경 모달 컴포넌트
 */

import { useState } from 'react';
import { Lock, Eye, EyeOff, X } from 'lucide-react';
import { changePassword } from '../../../api/me';
import { extractAxiosError } from '../../../api/apiError';

/**
 * Props 타입 정의
 */
interface PasswordChangeModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * 비밀번호 정규식 (8자 이상, 영문, 숫자, 특수문자 각각 1개 이상)
 */
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

/**
 * PasswordChangeModal 컴포넌트
 */
export default function PasswordChangeModal({ onClose, onSuccess }: PasswordChangeModalProps) {
  /** 상태 관리 */
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState('');

  /**
   * 모달 닫기
   */
  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    onClose();
  };

  /**
   * 비밀번호 변경 핸들러
   */
  const handleSubmit = async () => {
    /** 입력값 검증 */
    if (!currentPassword.trim()) {
      setError('현재 비밀번호를 입력해주세요.');
      return;
    }
    if (!newPassword.trim()) {
      setError('새 비밀번호를 입력해주세요.');
      return;
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      setError('비밀번호는 8자 이상, 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (currentPassword === newPassword) {
      setError('현재 비밀번호와 다른 비밀번호를 입력해주세요.');
      return;
    }

    setIsChanging(true);
    setError('');

    try {
      await changePassword({
        currentPassword,
        newPassword
      });
      alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
      handleClose();
      onSuccess();
    } catch (err) {
      const { message } = extractAxiosError(err, '비밀번호 변경에 실패했습니다.');
      setError(message);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">비밀번호 변경</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-form">
          {/* 현재 비밀번호 */}
          <div className="form-group">
            <label className="form-label">현재 비밀번호</label>
            <div className="form-input-wrapper">
              <Lock className="form-input-icon" size={20} />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="현재 비밀번호를 입력하세요"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className="form-input-toggle"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 새 비밀번호 */}
          <div className="form-group">
            <label className="form-label">새 비밀번호</label>
            <div className="form-input-wrapper">
              <Lock className="form-input-icon" size={20} />
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="새 비밀번호를 입력하세요 (영문, 숫자, 특수문자 포함 8자 이상)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="form-input-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="form-group">
            <label className="form-label">새 비밀번호 확인</label>
            <div className="form-input-wrapper">
              <Lock className="form-input-icon" size={20} />
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="새 비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="form-error">{error}</p>
          )}

          {/* 버튼 */}
          <button
            className="form-submit-btn"
            onClick={handleSubmit}
            disabled={isChanging}
          >
            {isChanging ? '변경 중...' : '비밀번호 변경'}
          </button>
        </div>
      </div>
    </div>
  );
}
