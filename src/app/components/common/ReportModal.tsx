/**
 * ReportModal.tsx
 * 공통 신고 모달 컴포넌트
 * - 화상PT, 게시글, 댓글 등 다양한 컨텐츠 신고에 사용
 */

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { reportContent } from '../../../api/report';
import { extractAxiosError } from '../../../api/apiError';
import { REPORT_REASONS } from '../../../constants/report';
import type { ReportType } from '../../../api/types/report';

/**
 * Props 타입 정의
 */
interface ReportModalProps {
  type: ReportType;
  targetId: number;
  targetName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * 타입별 자기 신고 에러 메시지
 */
const SELF_REPORT_MESSAGES: Record<ReportType, string> = {
  PT_ROOM: '본인의 화상PT는 신고할 수 없습니다.',
  POST: '본인의 게시글은 신고할 수 없습니다.',
  COMMENT: '본인의 댓글은 신고할 수 없습니다.',
};

/**
 * 타입별 중복 신고 에러 메시지
 */
const DUPLICATE_REPORT_MESSAGES: Record<ReportType, string> = {
  PT_ROOM: '이미 신고한 화상PT입니다.',
  POST: '이미 신고한 게시글입니다.',
  COMMENT: '이미 신고한 댓글입니다.',
};

/**
 * ReportModal 컴포넌트
 */
export default function ReportModal({
  type,
  targetId,
  targetName,
  onClose,
  onSuccess
}: ReportModalProps) {
  /** 상태 관리 */
  const [selectedReason, setSelectedReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  /**
   * 모달 외부 클릭 핸들러
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 신고 제출
   */
  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsReporting(true);
    try {
      await reportContent({
        type,
        id: targetId,
        cause: selectedReason,
      });
      alert('신고가 접수되었습니다.');
      onSuccess?.();
      onClose();
    } catch (error) {
      const { code, message } = extractAxiosError(error, '신고에 실패했습니다.');
      if (code === 'COMMUNITY-006') {
        alert(SELF_REPORT_MESSAGES[type]);
      } else if (code === 'COMMUNITY-008') {
        alert(DUPLICATE_REPORT_MESSAGES[type]);
      } else {
        alert(message);
      }
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 'var(--z-modal)' }}
      onClick={handleOverlayClick}
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="modal-header">
          <div className="report-modal-header-title">
            <AlertTriangle size={20} className="report-modal-icon" />
            <h2 className="modal-title">신고하기</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 내용 */}
        <div className="modal-form">
          <p className="report-modal-target">
            신고 대상: <strong>{targetName}</strong>
          </p>

          <p className="report-modal-desc">신고 사유를 선택해주세요</p>

          <div className="report-options">
            {REPORT_REASONS.map((reason) => (
              <label
                key={reason}
                className={`report-option ${selectedReason === reason ? 'selected' : ''}`}
                onClick={() => setSelectedReason(reason)}
              >
                <div className="report-radio" />
                <span className="report-label">{reason}</span>
              </label>
            ))}
          </div>

          <button
            className="form-submit-btn"
            onClick={handleSubmit}
            disabled={!selectedReason || isReporting}
          >
            {isReporting ? '신고 중...' : '신고하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
