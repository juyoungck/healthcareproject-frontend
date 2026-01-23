/**
 * AdminTrainerList.tsx
 * 트레이너 승인 관리 컴포넌트 (목록 + 상세 모달 통합)
 * 
 * TODO: 백엔드 완성 후 API 연동
 * - PATCH /api/admin/trainer/{handle}/approve (승인)
 * - PATCH /api/admin/trainer/{handle}/reject (거절)
 */

import { useState } from 'react';
import { Search, Eye, Check, X, FileText, Image, Download } from 'lucide-react';
import type { TrainerApplication, TrainerApplicationStatus } from '../../../types/admin';
import { trainerApplications } from '../../../data/admin';

/**
 * ===========================================
 * 상태 필터 옵션
 * ===========================================
 */
const statusFilters: { value: TrainerApplicationStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'PENDING', label: '대기중' },
  { value: 'APPROVED', label: '승인' },
  { value: 'REJECTED', label: '거절' },
];

/**
 * ===========================================
 * 상태 라벨 변환
 * ===========================================
 */
const getStatusLabel = (status: TrainerApplicationStatus) => {
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

const getStatusClass = (status: TrainerApplicationStatus) => {
  switch (status) {
    case 'PENDING':
      return 'status-pending';
    case 'APPROVED':
      return 'status-approved';
    case 'REJECTED':
      return 'status-rejected';
    default:
      return '';
  }
};

/**
 * ===========================================
 * 날짜 포맷
 * ===========================================
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
 * ===========================================
 * AdminTrainerList 컴포넌트
 * ===========================================
 */
export default function AdminTrainerList() {
  const [applications, setApplications] = useState<TrainerApplication[]>(trainerApplications);
  const [filterStatus, setFilterStatus] = useState<TrainerApplicationStatus | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<TrainerApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  /**
   * 필터링된 목록
   */
  const filteredApplications = applications.filter((app) => {
    if (filterStatus !== 'all' && app.status !== filterStatus) {
      return false;
    }
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        app.userName.toLowerCase().includes(keyword) ||
        app.userEmail.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  /**
   * 상세 보기 핸들러
   */
  const handleViewDetail = (application: TrainerApplication) => {
    setSelectedApplication(application);
    setIsDetailModalOpen(true);
  };

  /**
   * 승인 처리 핸들러
   * TODO: PATCH /api/admin/trainer/{handle}/approve
   */
  const handleApprove = (id: number) => {
    if (!confirm('해당 트레이너 신청을 승인하시겠습니까?')) return;

    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: 'APPROVED' as TrainerApplicationStatus, reviewedAt: new Date().toISOString() }
          : app
      )
    );
    setIsDetailModalOpen(false);
  };

  /**
   * 거절 처리 핸들러
   * TODO: PATCH /api/admin/trainer/{handle}/reject
   */
  const handleReject = (id: number, reason: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: 'REJECTED' as TrainerApplicationStatus,
              rejectReason: reason,
              reviewedAt: new Date().toISOString(),
            }
          : app
      )
    );
    setIsDetailModalOpen(false);
  };

  return (
    <div className="admin-trainer-page">
      <h2 className="admin-section-title">트레이너 승인 관리</h2>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-tabs">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              className={`admin-filter-tab ${filterStatus === filter.value ? 'active' : ''}`}
              onClick={() => setFilterStatus(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="이름 또는 이메일 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>이메일</th>
              <th>신청일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-table-empty">
                  신청 내역이 없습니다.
                </td>
              </tr>
            ) : (
              filteredApplications.map((app) => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.userName}</td>
                  <td>{app.userEmail}</td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td>
                    <span className={`admin-status-badge ${getStatusClass(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn view"
                        onClick={() => handleViewDetail(app)}
                        title="상세보기"
                      >
                        <Eye size={16} />
                      </button>
                      {app.status === 'PENDING' && (
                        <>
                          <button
                            className="admin-action-btn approve"
                            onClick={() => handleApprove(app.id)}
                            title="승인"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="admin-action-btn reject"
                            onClick={() => {
                              const reason = prompt('거절 사유를 입력해주세요:');
                              if (reason) handleReject(app.id, reason);
                            }}
                            title="거절"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 상세 모달 (통합) */}
      {isDetailModalOpen && selectedApplication && (
        <TrainerDetailModal
          application={selectedApplication}
          onClose={() => setIsDetailModalOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

/**
 * ===========================================
 * 트레이너 상세 모달 (내부 컴포넌트로 통합)
 * ===========================================
 */
interface TrainerDetailModalProps {
  application: TrainerApplication;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
}

function TrainerDetailModal({
  application,
  onClose,
  onApprove,
  onReject,
}: TrainerDetailModalProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText size={18} />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return <Image size={18} />;
    return <FileText size={18} />;
  };

  const handleApprove = () => {
    if (confirm('해당 트레이너 신청을 승인하시겠습니까?')) {
      onApprove(application.id);
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('거절 사유를 입력해주세요.');
      return;
    }
    if (confirm('해당 트레이너 신청을 거절하시겠습니까?')) {
      onReject(application.id, rejectReason.trim());
    }
  };

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