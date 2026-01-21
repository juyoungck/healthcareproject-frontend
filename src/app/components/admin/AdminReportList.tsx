/**
 * AdminReportList.tsx
 * 신고 관리 컴포넌트
 * - 신고된 게시글/댓글 목록
 * - 신고 처리 (삭제/경고/무시)
 */

import { useState } from 'react';
import { Search, Eye, Trash2, AlertTriangle, XCircle } from 'lucide-react';
import type { Report, ReportStatus, ReportType } from '../../../types/admin';
import { reports } from '../../../data/admin';

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */

const typeFilters: { value: ReportType | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'post', label: '게시글' },
  { value: 'comment', label: '댓글' },
  { value: 'user', label: '사용자' },
];

const statusFilters: { value: ReportStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기중' },
  { value: 'processed', label: '처리완료' },
  { value: 'ignored', label: '무시' },
];

/**
 * ===========================================
 * 라벨 변환 함수
 * ===========================================
 */

const getTypeLabel = (type: ReportType) => {
  switch (type) {
    case 'post':
      return '게시글';
    case 'comment':
      return '댓글';
    case 'user':
      return '사용자';
    default:
      return type;
  }
};

const getStatusLabel = (status: ReportStatus) => {
  switch (status) {
    case 'pending':
      return '대기중';
    case 'processed':
      return '처리완료';
    case 'ignored':
      return '무시';
    default:
      return status;
  }
};

const getStatusClass = (status: ReportStatus) => {
  switch (status) {
    case 'pending':
      return 'status-pending';
    case 'processed':
      return 'status-processed';
    case 'ignored':
      return 'status-ignored';
    default:
      return '';
  }
};

/**
 * ===========================================
 * AdminReportList 컴포넌트
 * ===========================================
 */

export default function AdminReportList() {
  /**
   * 상태 관리
   */
  const [reportList, setReportList] = useState<Report[]>(reports);
  const [filterType, setFilterType] = useState<ReportType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 필터링된 목록
   */
  const filteredReports = reportList.filter((report) => {
    /* 타입 필터 */
    if (filterType !== 'all' && report.type !== filterType) {
      return false;
    }
    /* 상태 필터 */
    if (filterStatus !== 'all' && report.status !== filterStatus) {
      return false;
    }
    /* 검색 필터 */
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        report.targetTitle.toLowerCase().includes(keyword) ||
        report.reporterName.toLowerCase().includes(keyword) ||
        report.reason.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  /**
   * 삭제 처리 핸들러
   */
  const handleDelete = (id: number) => {
    if (!confirm('신고된 대상을 삭제하시겠습니까?')) return;

    setReportList((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: 'processed' as ReportStatus } : report
      )
    );

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/reports/${id}/delete-target`, { method: 'POST' }); */
  };

  /**
   * 경고 처리 핸들러
   */
  const handleWarn = (id: number) => {
    if (!confirm('작성자에게 경고를 부여하시겠습니까?')) return;

    setReportList((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: 'processed' as ReportStatus } : report
      )
    );

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/reports/${id}/warn`, { method: 'POST' }); */
  };

  /**
   * 무시 처리 핸들러
   */
  const handleIgnore = (id: number) => {
    if (!confirm('해당 신고를 무시 처리하시겠습니까?')) return;

    setReportList((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: 'ignored' as ReportStatus } : report
      )
    );

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/reports/${id}/ignore`, { method: 'POST' }); */
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
    <div className="admin-report-list">
      <h2 className="admin-section-title">신고 관리</h2>

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
            onChange={(e) => setFilterStatus(e.target.value as ReportStatus | 'all')}
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
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-table-empty">
                  신고 내역이 없습니다.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>
                    <span className={`admin-type-badge type-${report.type}`}>
                      {getTypeLabel(report.type)}
                    </span>
                  </td>
                  <td className="admin-table-title">{report.targetTitle}</td>
                  <td>{report.reason}</td>
                  <td>{report.reporterName}</td>
                  <td>{formatDate(report.createdAt)}</td>
                  <td>
                    <span className={`admin-status-badge ${getStatusClass(report.status)}`}>
                      {getStatusLabel(report.status)}
                    </span>
                  </td>
                  <td>
                    {report.status === 'pending' && (
                      <div className="admin-action-buttons">
                        <button
                          className="admin-action-btn view"
                          onClick={() => alert('상세 보기 (TODO)')}
                          title="상세보기"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="admin-action-btn delete"
                          onClick={() => handleDelete(report.id)}
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className="admin-action-btn warn"
                          onClick={() => handleWarn(report.id)}
                          title="경고"
                        >
                          <AlertTriangle size={16} />
                        </button>
                        <button
                          className="admin-action-btn ignore"
                          onClick={() => handleIgnore(report.id)}
                          title="무시"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                    {report.status !== 'pending' && (
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