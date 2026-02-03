/**
 * AdminDashboard.tsx
 * 관리자 대시보드 컴포넌트
 * 
 * API:
 * - GET /api/admin/dashboard (대시보드 통계)
 * - GET /api/version (버전 정보)
 * - GET /api/health (서버 상태)
 */

import { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  AlertTriangle,
  Video,
  Server,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { DashboardStats, VersionInfo, HealthInfo } from '../../../api/types/admin';
import { getAdminDashboard, getVersion, getHealth } from '../../../api/admin';
import { getApiErrorMessage } from '../../../api/apiError';
import { formatDateTimeAdmin } from '../../../utils/format';

/**
 * ===========================================
 * AdminDashboard 컴포넌트
 * ===========================================
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [healthInfo, setHealthInfo] = useState<HealthInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 대시보드 데이터 조회
   */
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [dashboardRes, versionRes, healthRes] = await Promise.all([
        getAdminDashboard(),
        getVersion(),
        getHealth(),
      ]);

      setStats(dashboardRes);
      setVersionInfo(versionRes);
      setHealthInfo(healthRes);
    } catch (err) {
      setError(getApiErrorMessage(err, '대시보드 데이터를 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * 로딩 상태
   */
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <h2 className="admin-section-title">대시보드</h2>
        <div className="admin-loading">로딩 중...</div>
      </div>
    );
  }

  /**
   * 에러 상태
   */
  if (error) {
    return (
      <div className="admin-dashboard">
        <h2 className="admin-section-title">대시보드</h2>
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="admin-btn primary">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2 className="admin-section-title">대시보드</h2>

      {/* 통계 카드 */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">전체 회원</span>
            <Users size={24} className="admin-stat-icon users" />
          </div>
          <div className="admin-stat-value">{stats?.totalUser ?? 0}</div>
          <div className="admin-stat-sub">
            <span className="stat-active">활성: {stats?.activeUser ?? 0}</span>
            <span className="stat-inactive">비활성: {stats?.inactiveUser ?? 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">전체 게시글</span>
            <FileText size={24} className="admin-stat-icon posts" />
          </div>
          <div className="admin-stat-value">{stats?.totalPost ?? 0}</div>
          <div className="admin-stat-sub">
            <span className="stat-visible">공개: {stats?.publicPost ?? 0}</span>
            <span className="stat-hidden">숨김: {stats?.hiddenPost ?? 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">화상PT</span>
            <Video size={24} className="admin-stat-icon pt" />
          </div>
          <div className="admin-stat-value">{stats?.totalPt ?? 0}</div>
          <div className="admin-stat-sub">
            <span className="stat-live">진행중: {stats?.livePt ?? 0}</span>
            <span className="stat-scheduled">예약: {stats?.reservedPt ?? 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">미처리 신고</span>
            <AlertTriangle size={24} className="admin-stat-icon reports" />
          </div>
          <div className="admin-stat-value">{stats?.waitReport ?? 0}</div>
          <div className="admin-stat-sub">
            <span className="stat-pending">대기중</span>
          </div>
        </div>
      </div>

      {/* 오늘의 활동 */}
      <h2 className="admin-section-title">오늘의 활동</h2>
      <div className="admin-activity-grid">
        <div className="admin-activity-card blue">
          <div className="admin-activity-value">{stats?.todayJoin ?? 0}</div>
          <div className="admin-activity-label">신규 가입</div>
        </div>
        <div className="admin-activity-card green">
          <div className="admin-activity-value">{stats?.todayPost ?? 0}</div>
          <div className="admin-activity-label">새 게시글</div>
        </div>
        <div className="admin-activity-card purple">
          <div className="admin-activity-value">{stats?.waitTrainer ?? 0}</div>
          <div className="admin-activity-label">트레이너 승인 대기</div>
        </div>
        <div className="admin-activity-card orange">
          <div className="admin-activity-value">{stats?.todayReport ?? 0}</div>
          <div className="admin-activity-label">오늘 신고</div>
        </div>
      </div>

      {/* 시스템 정보 */}
      <h2 className="admin-section-title">시스템 정보</h2>
      <div className="admin-system-info">
        <div className="admin-system-card">
          <div className="admin-system-header">
            <Server size={20} />
            <span>서버 상태</span>
          </div>
          <div className="admin-system-content">
            <div className="admin-system-row">
              <span className="admin-system-key">상태</span>
              <span className={`admin-system-status ${healthInfo?.status === 'UP' ? 'up' : 'down'}`}>
                {healthInfo?.status === 'UP' ? (
                  <>
                    <CheckCircle size={16} />
                    정상
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    오류
                  </>
                )}
              </span>
            </div>
            <div className="admin-system-row">
              <span className="admin-system-key">버전</span>
              <span className="admin-system-value">{versionInfo?.version ?? '-'}</span>
            </div>
            <div className="admin-system-row">
              <span className="admin-system-key">빌드</span>
              <span className="admin-system-value">{formatDateTimeAdmin(versionInfo?.buildTime ?? null)}</span>
            </div>
            <div className="admin-system-row">
              <span className="admin-system-key">환경</span>
              <span className="admin-system-value">{versionInfo?.name ?? '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}