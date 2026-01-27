/**
 * AdminReportList.tsx
 * 신고 관리 컴포넌트
 * 
 * API:
 * - GET /api/admin/reports (신고 목록)
 * - PATCH /api/admin/reports/{reportId}/status (상태 변경)
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';
import type { Report, ReportStatus, ReportType } from '../../../api/types/admin';
import { getAdminReports, processReport, rejectReport } from '../../../api/admin';

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */
const statusFilters: { value: ReportStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '대기중' },
  { value: 'PROCESSED', label: '처리완료' },
  { value: 'REJECTED', label: '반려' },
];

/**
 * ===========================================
 * 라벨 변환 함수
 * ===========================================
 */
const getTypeLabel = (type: ReportType) => {
  switch (type) {
    case 'POST':
      return '게시글';
    case 'COMMENT':
      return '댓글';
    default:
      return type;
  }
};

const getStatusLabel = (status: ReportStatus) => {
  switch (status) {
    case 'PENDING':
      return '대기중';
    case 'PROCESSED':
      return '처리완료';
    case 'REJECTED':
      return '반려';
    default:
      return status;
  }
};

const getStatusClass = (status: ReportStatus) => {
  switch (status) {
    case 'PENDING':
      return 'status-pending';
    case 'PROCESSED':
      return 'status-processed';
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
 * AdminReportList 컴포넌트
 * ===========================================
 */
export default function AdminReportList() {
  /** 상태 관리 */
  const [reportList, setReportList] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'ALL'>('ALL');

  /**
   * 신고 목록 조회
   */
  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: {
        status?: ReportStatus;
      } = {};

      if (filterStatus !== 'ALL') {
        params.status = filterStatus;
      }

      const response = await getAdminReports(params);
      setReportList(response.list);
      setTotal(response.total);
    } catch (err) {
      console.error('신고 목록 조회 실패:', err);
      setError('신고 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 초기 로드 및 필터 변경 시 재조회
   */
  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  /**
   * 제재 처리 핸들러 (PROCESSED - 콘텐츠 삭제)
   */
  const handleProcess = async (reportId: number) => {
    if (!confirm('신고를 승인하고 대상 콘텐츠를 삭제하시겠습니까?\n\n동일 대상의 다른 신고도 모두 처리됩니다.')) return;

    try {
      await processReport(reportId);
      fetchReports();
      alert('제재 처리되었습니다. 콘텐츠가 삭제되었습니다.');
    } catch (err) {
      console.error('제재 처리 실패:', err);
      alert('제재 처리에 실패했습니다.');
    }
  };

  /**
   * 반려 처리 핸들러 (REJECTED - 콘텐츠 유지)
   */
  const handleReject = async (reportId: number) => {
    if (!confirm('이 신고를 반려하시겠습니까?\n\n콘텐츠는 삭제되지 않습니다.')) return;

    try {
      await rejectReport(reportId);
      fetchReports();
      alert('반려 처리되었습니다.');
    } catch (err) {
      console.error('반려 처리 실패:', err);
      alert('반려 처리에 실패했습니다.');
    }
  };

  /**
   * 로딩 상태
   */
  if (isLoading) {
    return (
      <div className="admin-report-list">
        <h2 className="admin-section-title">신고 관리</h2>
        <div className="admin-loading">로딩 중...</div>
      </div>
    );
  }

  /**
   * 에러 상태
   */
  if (error) {
    return (
      <div className="admin-report-list">
        <h2 className="admin-section-title">신고 관리</h2>
        <div className="admin-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-report-list">
      <h2 className="admin-section-title">신고 관리</h2>
      <p className="admin-section-subtitle">전체 {total}건</p>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          <div className="admin-filter-buttons">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                className={`admin-filter-btn ${filterStatus === filter.value ? 'active' : ''}`}
                onClick={() => setFilterStatus(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>유형</th>
              <th>대상ID</th>
              <th>신고자</th>
              <th>사유</th>
              <th>상태</th>
              <th>신고일시</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {reportList.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-table-empty">
                  신고 내역이 없습니다.
                </td>
              </tr>
            ) : (
              reportList.map((report) => (
                <tr key={report.reportId}>
                  <td>{report.reportId}</td>
                  <td>
                    <span className={`admin-type-badge type-${report.type.toLowerCase()}`}>
                      {getTypeLabel(report.type)}
                    </span>
                  </td>
                  <td>{report.targetId}</td>
                  <td>@{report.reporterHandle}</td>
                  <td className="admin-table-reason">{report.reason}</td>
                  <td>
                    <span className={`admin-status-badge ${getStatusClass(report.status)}`}>
                      {getStatusLabel(report.status)}
                    </span>
                  </td>
                  <td>{formatDate(report.createdAt)}</td>
                  <td>
                    {report.status === 'PENDING' && (
                      <div className="admin-action-buttons">
                        <button
                          className="admin-action-btn secondary"
                          onClick={() => handleReject(report.reportId)}
                          title="반려 (콘텐츠 유지)"
                        >
                          <XCircle size={16} />
                        </button>
                        <button
                          className="admin-action-btn warning"
                          onClick={() => handleProcess(report.reportId)}
                          title="제재 (콘텐츠 삭제)"
                        >
                          <AlertTriangle size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}