/**
 * AdminReportList.tsx
 * 신고 관리 컴포넌트
 * 
 * API:
 * - GET /api/admin/reports (신고 목록)
 * - PATCH /api/admin/reports/{reportId}/status (상태 변경)
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, X, Eye, User, FileText, MessageSquare, Video, Users, AlertCircle } from 'lucide-react';
import type { Report, ReportStatus, ReportType, ReportDetailData } from '../../../api/types/admin';
import { getAdminReports, processReport, rejectReport, getAdminCommentDetail } from '../../../api/admin';
import apiClient from '../../../api/client';
import { getApiErrorMessage } from '../../../api/apiError';
import { formatDateTimeAdmin } from '../../../utils/format';
import { stripHtml } from '../../../utils/html';
import {
  REPORT_STATUS_FILTERS,
  REPORT_TYPE_LABELS,
  REPORT_TYPE_CLASSES,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_CLASSES,
} from '../../../constants/admin';

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

  /** 상세 모달 상태 */
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<ReportDetailData>(null);
  const [detailType, setDetailType] = useState<ReportType | null>(null);

  /**
   * 상세 보기 핸들러
   */
  const handleViewDetail = async (report: Report) => {
    setDetailLoading(true);
    setDetailType(report.type);
    setIsDetailModalOpen(true);
    setDetailData(null);

    try {
      if (report.type === 'POST') {
        try {
          const response = await apiClient.get(`/api/board/posts/${report.targetId}`);
          const post = response.data.data;
          setDetailData({
            title: post.title,
            authorNickname: post.author?.nickname || '',
            authorHandle: post.author?.handle || '',
            content: post.content || '',
          });
        } catch {
          setDetailData(null);
        }
      } else if (report.type === 'PT_ROOM') {
        try {
          const response = await apiClient.get(`/api/pt-rooms/${report.targetId}`);
          const room = response.data.data;
          setDetailData({
            title: room.title,
            trainer: room.trainer,
            description: room.description || '',
            maxParticipants: room.maxParticipants,
          });
        } catch {
          setDetailData(null);
        }
      } else if (report.type === 'COMMENT') {
        try {
          const comment = await getAdminCommentDetail(report.targetId);
          setDetailData({
            postId: comment.postId,
            postTitle: comment.postTitle,
            authorNickname: comment.author.nickname,
            authorHandle: comment.author.handle,
            content: comment.content,
            status: comment.status,
            createdAt: comment.createdAt,
          });
        } catch {
          setDetailData(null);
        }
      }
    } catch {
      /** 조용히 처리 */
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

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
      setError(getApiErrorMessage(err, '신고 목록을 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  const handleProcess = async (reportId: number, type: ReportType) => {
    if (!confirm('신고를 승인하고 대상 콘텐츠를 삭제하시겠습니까?\n\n동일 대상의 다른 신고도 모두 처리됩니다.')) return;

    const typeLabels = {
      'POST': '게시글',
      'COMMENT': '댓글',
      'PT_ROOM': '화상PT'
    };

    try {
      await processReport(reportId);
      fetchReports();
      alert('제재 처리되었습니다. 콘텐츠가 삭제되었습니다.');
    } catch {
      /** 조용히 처리 */
      alert(`이미 삭제된 ${typeLabels[type]}입니다.`);
    }
  };

  const handleReject = async (reportId: number) => {
    if (!confirm('이 신고를 반려하시겠습니까?\n\n콘텐츠는 삭제되지 않습니다.')) return;

    try {
      await rejectReport(reportId);
      fetchReports();
      alert('반려 처리되었습니다.');
    } catch (err) {
      alert(getApiErrorMessage(err, '반려 처리에 실패했습니다.'));
    }
  };

  if (isLoading) {
    return (
      <div className="admin-report-list">
        <h2 className="admin-section-title">신고 관리</h2>
        <div className="admin-loading">로딩 중...</div>
      </div>
    );
  }

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
      <div className="admin-section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 className="admin-section-title" style={{ margin: 0 }}>신고 관리</h2>
          <span className="admin-section-count" style={{ margin: 0 }}>전체 {total}건</span>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          <div className="admin-filter-buttons">
            {REPORT_STATUS_FILTERS.map((filter) => (
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

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>신고자</th>
              <th>피신고자</th>
              <th>신고일시</th>
              <th>사유</th>
              <th>구분</th>
              <th>상태</th>
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
                  <td>@{report.reporterHandle}</td>
                  <td>@{report.targetAuthorHandle}</td>
                  <td>{formatDateTimeAdmin(report.createdAt)}</td>
                  <td className="admin-table-reason">{report.reason}</td>
                  <td>
                    <span className={`admin-type-badge ${REPORT_TYPE_CLASSES[report.type]}`}>
                      {REPORT_TYPE_LABELS[report.type]}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-status-badge ${REPORT_STATUS_CLASSES[report.status]}`}>
                      {REPORT_STATUS_LABELS[report.status]}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn view"
                        onClick={() => handleViewDetail(report)}
                        title="상세보기"
                      >
                        <Eye size={16} />
                      </button>
                      {report.status === 'PENDING' && (
                        <>
                          <button
                            className="admin-action-btn reject-dark"
                            onClick={() => handleReject(report.reportId)}
                            title="반려 (콘텐츠 유지)"
                          >
                            <X size={16} />
                          </button>
                          <button
                            className="admin-action-btn delete"
                            onClick={() => handleProcess(report.reportId, report.type)}
                            title="제재 (콘텐츠 삭제)"
                          >
                            <AlertTriangle size={16} />
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

      {isDetailModalOpen && (
        <ReportDetailModal
          type={detailType}
          data={detailData}
          loading={detailLoading}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  );
}

/**
 * ===========================================
 * 신고 대상 상세 모달
 * ===========================================
 */
interface ReportDetailModalProps {
  type: ReportType | null;
  data: ReportDetailData;
  loading: boolean;
  onClose: () => void;
}

// 기존 346번줄부터 시작하는 ReportDetailModal 함수를 아래로 교체

function ReportDetailModal({ type, data, loading, onClose }: ReportDetailModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const TypeIcon = () => {
    switch (type) {
      case 'POST': return <FileText size={20} />;
      case 'COMMENT': return <MessageSquare size={20} />;
      case 'PT_ROOM': return <Video size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const getCleanContent = (content: string | undefined): string => {
    if (!content) return '';
    return stripHtml(content);
  };

  /** 프로필 정보 가져오기 */
  const getAuthorInfo = () => {
    if (!data) return { nickname: '', handle: '' };
    if (type === 'POST') {
      return { nickname: data.authorNickname, handle: data.authorHandle };
    } else if (type === 'PT_ROOM') {
      return { nickname: data.trainer?.nickname || '알 수 없음', handle: data.trainer?.handle || '' };
    } else if (type === 'COMMENT') {
      return { nickname: data.authorNickname || '알 수 없음', handle: data.authorHandle || '' };
    }
    return { nickname: '', handle: '' };
  };

  const authorInfo = getAuthorInfo();

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal-container report-detail-modal">
        {/* 헤더: 왼쪽 타입, 오른쪽 프로필 + X버튼 */}
        <div className="admin-modal-header report-modal-header">
          <div className="report-header-left">
            <div className={`report-type-icon ${type?.toLowerCase()}`}>
              <TypeIcon />
            </div>
            <div className="report-header-text">
              <h3 className="admin-modal-title">신고된 {REPORT_TYPE_LABELS[type || 'POST']}</h3>
              <span className="report-header-subtitle">콘텐츠 상세 정보</span>
            </div>
          </div>
          <div className="report-header-right">
            {data && (
              <div className="report-author-profile">
                <div className={`report-avatar ${type?.toLowerCase()}`}>
                  <User size={16} />
                </div>
                <div className="admin-author-info" style={{ alignItems: 'flex-end' }}>
                  <span className="admin-nickname">{authorInfo.nickname}</span>
                  {authorInfo.handle && <span className="admin-handle">@{authorInfo.handle}</span>}
                </div>
              </div>
            )}
            <button className="admin-modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 바디: 제목 + 내용만 */}
        <div className="admin-modal-content report-modal-body">
          {loading ? (
            <div className="report-detail-loading">
              <div className="loading-spinner"></div>
              <span>로딩 중...</span>
            </div>
          ) : !data ? (
            <div className="report-deleted-content">
              <div className="deleted-icon">
                <AlertCircle size={28} />
              </div>
              <p className="deleted-title">삭제된 콘텐츠</p>
              <p className="deleted-desc">
                {type === 'POST' && '이 게시글은 이미 삭제되었습니다.'}
                {type === 'COMMENT' && '이 댓글은 이미 삭제되었습니다.'}
                {type === 'PT_ROOM' && '이 화상PT는 이미 종료되었습니다.'}
              </p>
            </div>
          ) : (
            <>
              {/* 게시글 */}
              {type === 'POST' && (
                <>
                  <h4 className="report-content-title">{data.title}</h4>
                  <div className="report-content-area">
                    <p>{getCleanContent(data.content) || '(내용 없음)'}</p>
                  </div>
                </>
              )}

              {/* 댓글 */}
              {type === 'COMMENT' && (
                <>
                  <h4 className="report-content-title">댓글</h4>
                  {data.isLimited ? (
                    <div className="report-warning-box">
                      <AlertCircle size={18} />
                      <span>댓글 조회 API가 필요합니다</span>
                    </div>
                  ) : (
                    <div className="report-content-area">
                      <p>{getCleanContent(data.content) || '(내용 없음)'}</p>
                    </div>
                  )}
                </>
              )}

              {/* 화상PT */}
              {type === 'PT_ROOM' && (
                <>
                  <h4 className="report-content-title">{data.title}</h4>
                  <div className="report-info-row">
                    <Users size={16} />
                    <span>정원 {data.maxParticipants}명</span>
                  </div>
                  <div className="report-content-area">
                    <p>{data.description || '(설명 없음)'}</p>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* 푸터 */}
        <div className="admin-modal-footer">
          <button className="admin-btn secondary" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}