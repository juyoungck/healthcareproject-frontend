/**
 * AdminSystem.tsx
 * 시스템 헬스체크 컴포넌트
 * - 서버 상태 모니터링
 * - API 응답 상태 확인
 * - 에러 로그 조회
 */

import { useState } from 'react';
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Server,
  Database,
  Wifi,
  Clock,
} from 'lucide-react';
import type { HealthCheckItem, ErrorLog, ServiceStatus } from '../../../types/admin';
import { healthCheckItems, errorLogs } from '../../../data/admin';

/**
 * ===========================================
 * 상태 아이콘 컴포넌트
 * ===========================================
 */

const StatusIcon = ({ status }: { status: ServiceStatus }) => {
  switch (status) {
    case 'healthy':
      return <CheckCircle size={20} className="status-icon healthy" />;
    case 'unhealthy':
      return <XCircle size={20} className="status-icon unhealthy" />;
    case 'unknown':
      return <AlertCircle size={20} className="status-icon unknown" />;
    default:
      return null;
  }
};

/**
 * ===========================================
 * 서비스 아이콘 컴포넌트
 * ===========================================
 */

const ServiceIcon = ({ name }: { name: string }) => {
  if (name.includes('API') || name.includes('서버')) {
    return <Server size={20} />;
  }
  if (name.includes('데이터베이스') || name.includes('DB')) {
    return <Database size={20} />;
  }
  if (name.includes('Redis') || name.includes('캐시')) {
    return <Database size={20} />;
  }
  if (name.includes('WebRTC') || name.includes('통신')) {
    return <Wifi size={20} />;
  }
  return <Server size={20} />;
};

/**
 * ===========================================
 * 로그 레벨 라벨
 * ===========================================
 */

const getLogLevelLabel = (level: string) => {
  switch (level) {
    case 'error':
      return '오류';
    case 'warning':
      return '경고';
    case 'info':
      return '정보';
    default:
      return level;
  }
};

/**
 * ===========================================
 * AdminSystem 컴포넌트
 * ===========================================
 */

export default function AdminSystem() {
  /**
   * 상태 관리
   */
  const [services, setServices] = useState<HealthCheckItem[]>(healthCheckItems);
  const [logs, setLogs] = useState<ErrorLog[]>(errorLogs);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  /**
   * 새로고침 핸들러
   */
  const handleRefresh = () => {
    setIsRefreshing(true);

    /* API 호출 시뮬레이션 */
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);

    /* TODO: API 연동 */
    /* const response = await fetch('/api/admin/system/health'); */
  };

  /**
   * 전체 상태 계산
   */
  const overallStatus = services.every((s) => s.status === 'healthy')
    ? 'healthy'
    : services.some((s) => s.status === 'unhealthy')
    ? 'unhealthy'
    : 'unknown';

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
      second: '2-digit',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="admin-system">
      <div className="admin-section-header">
        <h2 className="admin-section-title">시스템 헬스체크</h2>
        <button
          className={`admin-refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw size={18} />
          {isRefreshing ? '확인 중...' : '새로고침'}
        </button>
      </div>

      {/* 전체 상태 */}
      <div className={`admin-overall-status status-${overallStatus}`}>
        <StatusIcon status={overallStatus} />
        <div className="admin-overall-info">
          <span className="admin-overall-label">
            {overallStatus === 'healthy'
              ? '모든 시스템이 정상 작동 중입니다.'
              : overallStatus === 'unhealthy'
              ? '일부 시스템에 문제가 발생했습니다.'
              : '시스템 상태를 확인 중입니다.'}
          </span>
          <span className="admin-overall-time">
            마지막 업데이트: {formatTime(lastUpdated)}
          </span>
        </div>
      </div>

      {/* 서비스 상태 */}
      <div className="admin-services-section">
        <h3 className="admin-subsection-title">서비스 상태</h3>
        <div className="admin-services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className={`admin-service-card status-${service.status}`}
            >
              <div className="admin-service-header">
                <div className="admin-service-icon">
                  <ServiceIcon name={service.name} />
                </div>
                <StatusIcon status={service.status} />
              </div>
              <div className="admin-service-info">
                <span className="admin-service-name">{service.name}</span>
                {service.responseTime && (
                  <span className="admin-service-response">
                    <Clock size={14} />
                    {service.responseTime}ms
                  </span>
                )}
              </div>
              {service.message && (
                <p className="admin-service-message">{service.message}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 에러 로그 */}
      <div className="admin-logs-section">
        <h3 className="admin-subsection-title">최근 에러 로그</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>레벨</th>
                <th>메시지</th>
                <th>엔드포인트</th>
                <th>발생 시간</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="admin-table-empty">
                    에러 로그가 없습니다.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className={`admin-log-level level-${log.level}`}>
                        {getLogLevelLabel(log.level)}
                      </span>
                    </td>
                    <td className="admin-log-message">{log.message}</td>
                    <td>
                      {log.endpoint ? (
                        <code className="admin-log-endpoint">{log.endpoint}</code>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{formatDate(log.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}