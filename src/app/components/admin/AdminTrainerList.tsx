/**
 * AdminTrainerList.tsx
 * 트레이너 승인 관리 컴포넌트 (목록 + 상세 모달 통합)
 * 
 * API:
 * - GET /api/admin/trainer/pending (승인 대기자 목록)
 * - PATCH /api/admin/trainer/{handle}/approve (승인)
 * - PATCH /api/admin/trainer/{handle}/reject (거절)
 */

import { useState, useEffect } from 'react';
import { Eye, Check, X, Download } from 'lucide-react';
import type { TrainerApplicant } from '../../../api/types/admin';
import { getTrainerPending, approveTrainer, rejectTrainer } from '../../../api/admin';
import { getApiErrorMessage } from '../../../api/apiError';
import { formatDateTimeAdmin } from '../../../utils/format';

/**
 * ===========================================
 * AdminTrainerList 컴포넌트
 * ===========================================
 */
export default function AdminTrainerList() {
  /** 상태 관리 */
  const [applicants, setApplicants] = useState<TrainerApplicant[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<TrainerApplicant | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  /**
   * 대기자 목록 조회
   */
  const fetchApplicants = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getTrainerPending();
      setApplicants(response.applicant);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(getApiErrorMessage(err, '트레이너 대기자 목록을 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 초기 로드
   */
  useEffect(() => {
    fetchApplicants();
  }, []);

  /**
   * 상세 보기 핸들러
   */
  const handleViewDetail = (applicant: TrainerApplicant) => {
    setSelectedApplicant(applicant);
    setIsDetailModalOpen(true);
  };

  /**
   * 승인 처리 핸들러
   */
  const handleApprove = async (handle: string) => {
    if (!confirm('해당 트레이너 신청을 승인하시겠습니까?')) return;

    try {
      await approveTrainer(handle);
      setApplicants((prev) => prev.filter((app) => app.handle !== handle));
      setTotalElements((prev) => prev - 1);
      setIsDetailModalOpen(false);
      alert('트레이너가 승인되었습니다!');
    } catch (err) {
      alert(getApiErrorMessage(err, '트레이너 승인에 실패했습니다.'));
    }
  };

  /**
   * 거절 처리 핸들러
   */
  const handleReject = async (handle: string, reason: string) => {
    try {
      await rejectTrainer(handle, reason);
      setApplicants((prev) => prev.filter((app) => app.handle !== handle));
      setTotalElements((prev) => prev - 1);
      setIsDetailModalOpen(false);
      alert('트레이너 신청이 거절되었습니다.');
    } catch (err) {
      alert(getApiErrorMessage(err, '트레이너 거절에 실패했습니다.'));
    }
  };

  /**
   * 로딩 상태
   */
  if (isLoading) {
    return (
      <div className="admin-trainer-page">
        <h2 className="admin-section-title">트레이너 승인 관리</h2>
        <div className="admin-loading">로딩 중...</div>
      </div>
    );
  }

  /**
   * 에러 상태
   */
  if (error) {
    return (
      <div className="admin-trainer-page">
        <h2 className="admin-section-title">트레이너 승인 관리</h2>
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={fetchApplicants} className="admin-btn primary">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-trainer-page">
      {/* 헤더 영역 */}
      <div className="admin-section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 className="admin-section-title" style={{ margin: 0 }}>트레이너 승인 관리</h2>
          <span className="admin-section-count" style={{ margin: 0 }}>승인 대기 {totalElements}명</span>
        </div>
      </div>

      {/* 테이블 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>신청자</th>
              <th>신청일</th>
              <th>소개</th>
              <th>증빙자료</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-table-empty">
                  승인 대기중인 신청이 없습니다.
                </td>
              </tr>
            ) : (
              applicants.map((app, index) => (
                <tr key={app.handle}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="admin-author-info">
                      <span className="admin-nickname">{app.nickname}</span>
                      <span className="admin-handle">@{app.handle}</span>
                    </div>
                  </td>
                  <td>{formatDateTimeAdmin(app.createdAt)}</td>
                  <td className="admin-bio-cell">{app.bio}</td>
                  <td>
                    <button
                      className="admin-license-btn"
                      onClick={() => handleViewDetail(app)}
                      title="증빙자료 보기"
                    >
                      <Eye size={16} /> {app.licenceUrl.length}개
                    </button>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn reject"
                        onClick={() => {
                          const reason = prompt('거절 사유를 입력해주세요:');
                          if (reason) handleReject(app.handle, reason);
                        }}
                        title="거절"
                      >
                        <X size={16} />
                      </button>
                      <button
                        className="admin-action-btn approve"
                        onClick={() => handleApprove(app.handle)}
                        title="승인"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 상세 모달 */}
      {isDetailModalOpen && selectedApplicant && (
        <TrainerDetailModal
          applicant={selectedApplicant}
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
 * 트레이너 상세 모달 (내부 컴포넌트)
 * ===========================================
 */
interface TrainerDetailModalProps {
  applicant: TrainerApplicant;
  onClose: () => void;
  onApprove: (handle: string) => void;
  onReject: (handle: string, reason: string) => void;
}

function TrainerDetailModal({
  applicant,
  onClose,
}: TrainerDetailModalProps) {
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
          <h3 className="admin-modal-title">증빙자료</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 - 증빙자료 이미지 */}
        <div className="admin-modal-content">
          {applicant.licenceUrl.length === 0 ? (
            <p className="admin-empty-text">등록된 증빙자료가 없습니다.</p>
          ) : (
            <div className="admin-license-images">
              {applicant.licenceUrl.map((url, index) => (
                <div key={index} className="admin-license-image-item">
                  <img
                    src={url}
                    alt={`증빙자료 ${index + 1}`}
                    className="admin-license-image"
                    onClick={() => window.open(url, '_blank')}
                  />
                  <button
                    className="admin-download-btn"
                    onClick={async () => {
                      try {
                        const response = await fetch(url);
                        const blob = await response.blob();
                        const downloadUrl = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = `증빙자료_${index + 1}.${url.split('.').pop()?.split('?')[0] || 'jpg'}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(downloadUrl);
                      } catch (err) {
                        alert(getApiErrorMessage(err, '파일 다운로드에 실패했습니다.'));
                      }
                    }}
                  >
                    <Download size={16} /> 다운로드
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="admin-modal-footer">
          <button className="admin-btn secondary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}