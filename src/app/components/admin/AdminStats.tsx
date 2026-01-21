/**
 * AdminStats.tsx
 * 관리자 통계 컴포넌트
 * - 일일/주간/월간 가입자 수
 * - 활성 사용자 통계
 * - 화상PT 이용 현황
 */

import { useState } from 'react';
import { Users, UserPlus, Video, TrendingUp, Calendar } from 'lucide-react';

/**
 * ===========================================
 * 기간 타입
 * ===========================================
 */

type PeriodType = 'daily' | 'weekly' | 'monthly';

/**
 * ===========================================
 * 더미 통계 데이터
 * ===========================================
 */

const STATS_DATA = {
  daily: {
    newUsers: 5,
    activeUsers: 89,
    ptSessions: 12,
    posts: 23,
  },
  weekly: {
    newUsers: 28,
    activeUsers: 134,
    ptSessions: 67,
    posts: 156,
  },
  monthly: {
    newUsers: 112,
    activeUsers: 156,
    ptSessions: 234,
    posts: 589,
  },
};

const CHART_DATA = {
  daily: [
    { label: '월', value: 3 },
    { label: '화', value: 5 },
    { label: '수', value: 4 },
    { label: '목', value: 7 },
    { label: '금', value: 6 },
    { label: '토', value: 2 },
    { label: '일', value: 1 },
  ],
  weekly: [
    { label: '1주', value: 22 },
    { label: '2주', value: 28 },
    { label: '3주', value: 25 },
    { label: '4주', value: 37 },
  ],
  monthly: [
    { label: '1월', value: 85 },
    { label: '2월', value: 92 },
    { label: '3월', value: 78 },
    { label: '4월', value: 105 },
    { label: '5월', value: 112 },
    { label: '6월', value: 98 },
  ],
};

/**
 * ===========================================
 * AdminStats 컴포넌트
 * ===========================================
 */

export default function AdminStats() {
  /**
   * 상태 관리
   */
  const [period, setPeriod] = useState<PeriodType>('daily');

  const stats = STATS_DATA[period];
  const chartData = CHART_DATA[period];
  const maxValue = Math.max(...chartData.map((d) => d.value));

  /**
   * 기간 라벨
   */
  const getPeriodLabel = () => {
    switch (period) {
      case 'daily':
        return '오늘';
      case 'weekly':
        return '이번 주';
      case 'monthly':
        return '이번 달';
      default:
        return '';
    }
  };

  return (
    <div className="admin-stats">
      <div className="admin-section-header">
        <h2 className="admin-section-title">통계</h2>
        
        {/* 기간 선택 */}
        <div className="admin-period-tabs">
          <button
            className={`admin-period-tab ${period === 'daily' ? 'active' : ''}`}
            onClick={() => setPeriod('daily')}
          >
            일간
          </button>
          <button
            className={`admin-period-tab ${period === 'weekly' ? 'active' : ''}`}
            onClick={() => setPeriod('weekly')}
          >
            주간
          </button>
          <button
            className={`admin-period-tab ${period === 'monthly' ? 'active' : ''}`}
            onClick={() => setPeriod('monthly')}
          >
            월간
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="admin-stats-cards">
        <div className="admin-stats-card">
          <div className="admin-stats-card-icon blue">
            <UserPlus size={24} />
          </div>
          <div className="admin-stats-card-info">
            <span className="admin-stats-card-label">신규 가입자</span>
            <span className="admin-stats-card-value">{stats.newUsers}명</span>
            <span className="admin-stats-card-period">{getPeriodLabel()}</span>
          </div>
        </div>

        <div className="admin-stats-card">
          <div className="admin-stats-card-icon green">
            <Users size={24} />
          </div>
          <div className="admin-stats-card-info">
            <span className="admin-stats-card-label">활성 사용자</span>
            <span className="admin-stats-card-value">{stats.activeUsers}명</span>
            <span className="admin-stats-card-period">{getPeriodLabel()}</span>
          </div>
        </div>

        <div className="admin-stats-card">
          <div className="admin-stats-card-icon purple">
            <Video size={24} />
          </div>
          <div className="admin-stats-card-info">
            <span className="admin-stats-card-label">화상PT 진행</span>
            <span className="admin-stats-card-value">{stats.ptSessions}회</span>
            <span className="admin-stats-card-period">{getPeriodLabel()}</span>
          </div>
        </div>

        <div className="admin-stats-card">
          <div className="admin-stats-card-icon yellow">
            <TrendingUp size={24} />
          </div>
          <div className="admin-stats-card-info">
            <span className="admin-stats-card-label">게시글 작성</span>
            <span className="admin-stats-card-value">{stats.posts}개</span>
            <span className="admin-stats-card-period">{getPeriodLabel()}</span>
          </div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="admin-chart-section">
        <h3 className="admin-chart-title">
          <Calendar size={18} />
          신규 가입자 추이
        </h3>
        <div className="admin-chart-container">
          <div className="admin-bar-chart">
            {chartData.map((data, index) => (
              <div key={index} className="admin-bar-item">
                <div className="admin-bar-wrapper">
                  <div
                    className="admin-bar"
                    style={{ height: `${(data.value / maxValue) * 100}%` }}
                  >
                    <span className="admin-bar-value">{data.value}</span>
                  </div>
                </div>
                <span className="admin-bar-label">{data.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 요약 정보 */}
      <div className="admin-summary-section">
        <h3 className="admin-chart-title">
          <TrendingUp size={18} />
          요약
        </h3>
        <div className="admin-summary-grid">
          <div className="admin-summary-item">
            <span className="admin-summary-label">전체 회원 수</span>
            <span className="admin-summary-value">156명</span>
          </div>
          <div className="admin-summary-item">
            <span className="admin-summary-label">트레이너 수</span>
            <span className="admin-summary-value">12명</span>
          </div>
          <div className="admin-summary-item">
            <span className="admin-summary-label">전체 게시글</span>
            <span className="admin-summary-value">89개</span>
          </div>
          <div className="admin-summary-item">
            <span className="admin-summary-label">누적 화상PT</span>
            <span className="admin-summary-value">523회</span>
          </div>
        </div>
      </div>
    </div>
  );
}