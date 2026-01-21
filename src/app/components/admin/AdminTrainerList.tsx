/**
 * AdminTrainerPage.tsx
 * 트레이너 승인 관리 페이지
 * - 트레이너 신청 목록 조회
 * - 상태별 필터 (전체/대기/승인/거절)
 * - 승인/거절 처리
 */

import { useState } from 'react';
import { Search, Eye, Check, X } from 'lucide-react';
import type { TrainerApplication, TrainerApplicationStatus } from '../../../types/admin';
import { trainerApplications } from '../../../data/admin';
import AdminTrainerDetailModal from './AdminTrainerDetailModal';

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
 * AdminTrainerPage 컴포넌트
 * ===========================================
 */

export default function AdminTrainerPage() {
  /**
   * 상태 관리
   */
  const [applications, setApplications] = useState<TrainerApplication[]>(trainerApplications);
  const [filterStatus, setFilterStatus] = useState<TrainerApplicationStatus | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<TrainerApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  /**
   * 필터링된 목록
   */
  const filteredApplications = applications.filter((app) => {
    /* 상태 필터 */
    if (filterStatus !== 'all' && app.status !== filterStatus) {
      return false;
    }
    /* 검색 필터 */
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

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/trainers/applications/${id}/approve`, { method: 'POST' }); */
  };

  /**
   * 거절 처리 핸들러
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

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/trainers/applications/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }); */
  };

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

  return (
    <div className="admin-trainer-page">
      <h2 className="admin-section-title">트레이너 승인 관리</h2>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        {/* 상태 필터 */}
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

        {/* 검색 */}
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

      {/* 상세 모달 */}
      {isDetailModalOpen && selectedApplication && (
        <AdminTrainerDetailModal
          application={selectedApplication}
          onClose={() => setIsDetailModalOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}