/**
 * AdminTrainerDetailModal.tsx
 * 트레이너 신청 상세 모달
 * - 신청 정보 상세 조회
 * - 증빙자료 확인
 * - 승인/거절 처리
 */

import { useState } from 'react';
import { X, FileText, Image, Download } from 'lucide-react';
import type { TrainerApplication } from '../../../types/admin';

/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface AdminTrainerDetailModalProps {
  application: TrainerApplication;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
}

/**
 * ===========================================
 * 상태 라벨 변환
 * ===========================================
 */

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return '대기중';
    case 'APPROVED':
      return '승인';
    case 'REJECTED':
      return '거절';
    default:
      return status;
  }
};

/**
 * ===========================================
 * AdminTrainerDetailModal 컴포넌트
 * ===========================================
 */

export default function AdminTrainerDetailModal({
  application,
  onClose,
  onApprove,
  onReject,
}: AdminTrainerDetailModalProps) {
  /**
   * 상태 관리
   */
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  /**
   * 날짜 포맷
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * 파일 아이콘 결정
   */
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText size={18} />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return <Image size={18} />;
    return <FileText size={18} />;
  };

  /**
   * 승인 핸들러
   */
  const handleApprove = () => {
    if (confirm('해당 트레이너 신청을 승인하시겠습니까?')) {
      onApprove(application.id);
    }
  };

  /**
   * 거절 핸들러
   */
  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('거절 사유를 입력해주세요.');
      return;
    }
    if (confirm('해당 트레이너 신청을 거절하시겠습니까?')) {
      onReject(application.id, rejectReason.trim());
    }
  };

  /**
   * 오버레이 클릭 핸들러
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal-container">
        {/* 헤더 */}
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">트레이너 신청 상세</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="admin-modal-content">
          {/* 기본 정보 */}
          <div className="admin-detail-section">
            <h4 className="admin-detail-label">신청자 정보</h4>
            <div className="admin-detail-grid">
              <div className="admin-detail-item">
                <span className="admin-detail-key">이름</span>
                <span className="admin-detail-value">{application.userName}</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-key">이메일</span>
                <span className="admin-detail-value">{application.userEmail}</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-key">신청일</span>
                <span className="admin-detail-value">{formatDate(application.createdAt)}</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-key">상태</span>
                <span className={`admin-detail-value status-${application.status.toLowerCase()}`}>
                  {getStatusLabel(application.status)}
                </span>
              </div>
            </div>
          </div>

          {/* 소개 */}
          <div className="admin-detail-section">
            <h4 className="admin-detail-label">소개</h4>
            <p className="admin-detail-text">{application.introduction}</p>
          </div>

          {/* 첨부파일 */}
          <div className="admin-detail-section">
            <h4 className="admin-detail-label">증빙자료 ({application.documents.length}개)</h4>
            <ul className="admin-file-list">
              {application.documents.map((doc, index) => (
                <li key={index} className="admin-file-item">
                  {getFileIcon(doc)}
                  <span className="admin-file-name">{doc}</span>
                  <button className="admin-file-download" title="다운로드">
                    <Download size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 거절 사유 (이미 거절된 경우) */}
          {application.status === 'REJECTED' && application.rejectReason && (
            <div className="admin-detail-section">
              <h4 className="admin-detail-label">거절 사유</h4>
              <p className="admin-detail-text reject-reason">{application.rejectReason}</p>
            </div>
          )}

          {/* 거절 사유 입력 (대기중인 경우) */}
          {application.status === 'PENDING' && showRejectInput && (
            <div className="admin-detail-section">
              <h4 className="admin-detail-label">거절 사유 입력</h4>
              <textarea
                className="admin-reject-textarea"
                placeholder="거절 사유를 입력해주세요."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="admin-modal-footer">
          {application.status === 'PENDING' ? (
            <>
              {showRejectInput ? (
                <>
                  <button className="admin-btn secondary" onClick={() => setShowRejectInput(false)}>
                    취소
                  </button>
                  <button className="admin-btn danger" onClick={handleReject}>
                    거절 확인
                  </button>
                </>
              ) : (
                <>
                  <button className="admin-btn secondary" onClick={onClose}>
                    닫기
                  </button>
                  <button className="admin-btn danger" onClick={() => setShowRejectInput(true)}>
                    거절
                  </button>
                  <button className="admin-btn primary" onClick={handleApprove}>
                    승인
                  </button>
                </>
              )}
            </>
          ) : (
            <button className="admin-btn secondary" onClick={onClose}>
              닫기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}