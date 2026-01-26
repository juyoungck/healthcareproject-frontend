/**
 * AdminReportList.tsx
 * 신고 관리 컴포넌트
 * 
 * API:
 * - GET /api/admin/report (신고 목록)
 * - POST /api/admin/report/{reportId}/delete-target (삭제 처리)
 * - POST /api/admin/report/{reportId}/warn (경고 처리)
 * - POST /api/admin/report/{reportId}/ignore (무시 처리)
 */

import { useState, useEffect } from 'react';
import { Search, Eye, Trash2, AlertTriangle, XCircle } from 'lucide-react';
import type { Report, ReportStatus, ReportType } from '../../../api/types/admin';
import { getAdminReports, deleteReportTarget, warnReportTarget, ignoreReport } from '../../../api/admin';

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */
const typeFilters: { value: ReportType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'POST', label: '게시글' },
  { value: 'COMMENT', label: '댓글' },
  { value: 'USER', label: '사용자' },
];

const statusFilters: { value: ReportStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '대기중' },
  { value: 'PROCESSED', label: '처리완료' },
  { value: 'IGNORED', label: '무시' },
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
    case 'USER':
      return '사용자';
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
    case 'IGNORED':
      return '무시';
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
    case 'IGNORED':
      return 'status-ignored';
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
  const [filterType, setFilterType] = useState<ReportType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'ALL'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 신고 목록 조회
   */
  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: {
        type?: ReportType;
        status?: ReportStatus;
        keyword?: string;
      } = {};

      if (filterType !== 'ALL') {
        params.type = filterType;
      }
      if (filterStatus !== 'ALL') {
        params.status = filterStatus;
      }
      if (searchKeyword) {
        params.keyword = searchKeyword;
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
  }, [filterType, filterStatus]);

  /**
   * 검색 실행 (Enter 키)
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchReports();
    }
  };

  /**
   * 삭제 처리 핸들러
   */
  const handleDelete = async (reportId: number) => {
    if (!confirm('신고된 대상을 삭제하시겠습니까?')) return;

    try {
      await deleteReportTarget(reportId);
      fetchReports();
    } catch (err) {
      console.error('신고 대상 삭제 실패:', err);
      alert('신고 대상 삭제에 실패했습니다.');
    }
  };

  /**
   * 경고 처리 핸들러
   */
  const handleWarn = async (reportId: number) => {
    if (!confirm('작성자에게 경고를 부여하시겠습니까?')) return;

    try {
      await warnReportTarget(reportId);
      fetchReports();
    } catch (err) {
      console.error('경고 처리 실패:', err);
      alert('경고 처리에 실패했습니다.');
    }
  };

  /**
   * 무시 처리 핸들러
   */
  const handleIgnore = async (reportId: number) => {
    if (!confirm('해당 신고를 무시 처리하시겠습니까?')) return;

    try {
      await ignoreReport(reportId);
      fetchReports();
    } catch (err) {
      console.error('무시 처리 실패:', err);
      alert('무시 처리에 실패했습니다.');
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
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={fetchReports} className="admin-btn primary">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-report-list">
      <h2 className="admin-section-title">신고 관리</h2>
      <p className="admin-section-count">전체 {total}건</p>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          {/* 타입 필터 */}
          <div className="admin-filter-tabs">
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                className={`admin-filter-tab ${filterType === filter.value ? 'active' : ''}`}
                onClick={() => setFilterType(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* 상태 필터 */}
          <select
            className="admin-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ReportStatus | 'ALL')}
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        {/* 검색 */}
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="내용 또는 신고자 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>유형</th>
              <th>신고 대상</th>
              <th>신고 사유</th>
              <th>신고자</th>
              <th>신고일</th>
              <th>상태</th>
              <th>처리</th>
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
                  <td className="admin-table-title">{report.targetTitle}</td>
                  <td>{report.reason}</td>
                  <td>
                    <div className="admin-author-info">
                      <span className="admin-nickname">{report.reporterName}</span>
                      <span className="admin-handle">@{report.reporterHandle}</span>
                    </div>
                  </td>
                  <td>{formatDate(report.createdAt)}</td>
                  <td>
                    <span className={`admin-status-badge ${getStatusClass(report.status)}`}>
                      {getStatusLabel(report.status)}
                    </span>
                  </td>
                  <td>
                    {report.status === 'PENDING' && (
                      <div className="admin-action-buttons">
                        <button
                          className="admin-action-btn delete"
                          onClick={() => handleDelete(report.reportId)}
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className="admin-action-btn warn"
                          onClick={() => handleWarn(report.reportId)}
                          title="경고"
                        >
                          <AlertTriangle size={16} />
                        </button>
                        <button
                          className="admin-action-btn ignore"
                          onClick={() => handleIgnore(report.reportId)}
                          title="무시"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                    {report.status !== 'PENDING' && (
                      <span className="admin-processed-text">처리됨</span>
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