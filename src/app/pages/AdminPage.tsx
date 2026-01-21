/**
 * AdminPage.tsx
 * 관리자 패널 메인 페이지 (레이아웃 + 대시보드)
 */

import { useState } from 'react';
import { ArrowLeft, Users, FileText, UserCheck, Video } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import type { AdminMenuType } from '../../types/admin';
import { dashboardStats, todayActivity } from '../../data/admin';
import AdminTrainerList from '../components/admin/AdminTrainerList';
import AdminMemberList from '../components/admin/AdminMemberList';
import AdminBoardList from '../components/admin/AdminBoardList';
import AdminReportList from '../components/admin/AdminReportList';
import AdminExerciseList from '../components/admin/AdminExerciseList';
import AdminDietList from '../components/admin/AdminDietList';
import AdminPTList from '../components/admin/AdminPTList';
import AdminStats from '../components/admin/AdminStats';
import AdminSystem from '../components/admin/AdminSystem';
/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface AdminPageProps {
  /** 마이페이지로 돌아가기 핸들러 */
  onBackToMyPage: () => void;
}

/**
 * ===========================================
 * AdminPage 컴포넌트
 * ===========================================
 */

export default function AdminPage({ onBackToMyPage }: AdminPageProps) {
  /**
   * 상태 관리
   */
  const [currentMenu, setCurrentMenu] = useState<AdminMenuType>('dashboard');

  /**
   * 메뉴 변경 핸들러
   */
  const handleMenuChange = (menu: AdminMenuType) => {
    setCurrentMenu(menu);
  };

  /**
   * 콘텐츠 렌더링
   */
  const renderContent = () => {
  switch (currentMenu) {
    case 'dashboard':
      return <DashboardContent />;
    case 'members':
      return <AdminMemberList />;
    case 'trainers':
      return <AdminTrainerList />;
    case 'boards':
      return <AdminBoardList />;
    case 'reports':
      return <AdminReportList />;
    case 'exercises':
      return <AdminExerciseList />;
    case 'diets':
      return <AdminDietList />;
    case 'pt':
      return <AdminPTList />;
    case 'stats':
      return <AdminStats />;
    case 'system':
      return <AdminSystem />;
    default:
      return <DashboardContent />;
  }
};

  return (
    <div className="admin-layout">
      {/* 사이드바 */}
      <AdminSidebar currentMenu={currentMenu} onMenuChange={handleMenuChange} />

      {/* 메인 콘텐츠 */}
      <main className="admin-main">
        {/* 헤더 */}
        <header className="admin-header">
          <h1 className="admin-header-title">관리자 패널</h1>
          <button className="admin-back-btn" onClick={onBackToMyPage}>
            <ArrowLeft size={18} />
            마이페이지로 돌아가기
          </button>
        </header>

        {/* 콘텐츠 영역 */}
        <div className="admin-content">{renderContent()}</div>
      </main>
    </div>
  );
}

/**
 * ===========================================
 * 대시보드 콘텐츠
 * ===========================================
 */

function DashboardContent() {
  return (
    <div className="admin-dashboard">
      <h2 className="admin-section-title">대시보드</h2>

      {/* 통계 카드 */}
      <div className="admin-stats-grid">
        {/* 전체 회원 */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">전체 회원</span>
            <Users size={24} className="admin-stat-icon users" />
          </div>
          <div className="admin-stat-value">{dashboardStats.totalUsers}</div>
          <div className="admin-stat-sub">
            <span className="stat-active">활성: {dashboardStats.activeUsers}</span>
            <span className="stat-inactive">비활성: {dashboardStats.inactiveUsers}</span>
          </div>
        </div>

        {/* 전체 게시글 */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">전체 게시글</span>
            <FileText size={24} className="admin-stat-icon posts" />
          </div>
          <div className="admin-stat-value">{dashboardStats.totalPosts}</div>
          <div className="admin-stat-sub">
            <span className="stat-visible">공개: {dashboardStats.visiblePosts}</span>
            <span className="stat-hidden">숨김: {dashboardStats.hiddenPosts}</span>
          </div>
        </div>

        {/* 트레이너 신청 */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">트레이너 신청</span>
            <UserCheck size={24} className="admin-stat-icon trainers" />
          </div>
          <div className="admin-stat-value">{dashboardStats.pendingTrainers}</div>
          <div className="admin-stat-sub">
            <span className="stat-pending">대기중</span>
          </div>
        </div>

        {/* 화상PT */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">화상PT</span>
            <Video size={24} className="admin-stat-icon pt" />
          </div>
          <div className="admin-stat-value">{dashboardStats.totalPTRooms}</div>
          <div className="admin-stat-sub">
            <span className="stat-live">진행중: {dashboardStats.livePTRooms}</span>
            <span className="stat-scheduled">예약: {dashboardStats.scheduledPTRooms}</span>
          </div>
        </div>
      </div>

      {/* 오늘의 활동 */}
      <h2 className="admin-section-title">오늘의 활동</h2>
      <div className="admin-activity-grid">
        <div className="admin-activity-card blue">
          <div className="admin-activity-value">{todayActivity.newUsers}</div>
          <div className="admin-activity-label">신규 가입</div>
        </div>
        <div className="admin-activity-card yellow">
          <div className="admin-activity-value">{todayActivity.newTrainerApplications}</div>
          <div className="admin-activity-label">트레이너 신청</div>
        </div>
        <div className="admin-activity-card green">
          <div className="admin-activity-value">{todayActivity.newPosts}</div>
          <div className="admin-activity-label">새 게시글</div>
        </div>
      </div>
    </div>
  );
}

/**
 * ===========================================
 * 플레이스홀더 콘텐츠 (임시)
 * ===========================================
 */

function PlaceholderContent({ title }: { title: string }) {
  return (
    <div className="admin-placeholder">
      <h2 className="admin-section-title">{title}</h2>
      <p>해당 기능은 개발 예정입니다.</p>
    </div>
  );
}