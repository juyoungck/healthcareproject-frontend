/**
 * AdminPage.tsx
 * 관리자 패널 메인 페이지 (사이드바 통합)
 */

import { useState } from 'react';
import {
  ArrowLeft,
  Users,
  FileText,
  UserCheck,
  Video,
  LayoutDashboard,
  AlertTriangle,
  Dumbbell,
  UtensilsCrossed,
  BarChart3,
  Monitor,
} from 'lucide-react';
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
 * 사이드바 메뉴 데이터 (AdminSidebar 통합)
 * ===========================================
 */
const menuItems: { id: AdminMenuType; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={20} /> },
  { id: 'members', label: '회원 관리', icon: <Users size={20} /> },
  { id: 'trainers', label: '트레이너 승인', icon: <UserCheck size={20} /> },
  { id: 'boards', label: '게시글 관리', icon: <FileText size={20} /> },
  { id: 'reports', label: '신고 관리', icon: <AlertTriangle size={20} /> },
  { id: 'exercises', label: '운동 관리', icon: <Dumbbell size={20} /> },
  { id: 'diets', label: '식단 관리', icon: <UtensilsCrossed size={20} /> },
  { id: 'pt', label: '화상PT 관리', icon: <Video size={20} /> },
  { id: 'stats', label: '통계', icon: <BarChart3 size={20} /> },
  { id: 'system', label: '시스템', icon: <Monitor size={20} /> },
];

/**
 * ===========================================
 * Props 타입
 * ===========================================
 */
interface AdminPageProps {
  onBackToMyPage: () => void;
}

/**
 * ===========================================
 * AdminPage 컴포넌트
 * ===========================================
 */
export default function AdminPage({ onBackToMyPage }: AdminPageProps) {
  const [currentMenu, setCurrentMenu] = useState<AdminMenuType>('dashboard');

  const handleMenuChange = (menu: AdminMenuType) => {
    setCurrentMenu(menu);
  };

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
      {/* 사이드바 (통합됨) */}
      <aside className="admin-sidebar">
        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`admin-sidebar-item ${currentMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuChange(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-header-title">관리자 패널</h1>
          <button className="admin-back-btn" onClick={onBackToMyPage}>
            <ArrowLeft size={18} />
            메인 화면으로 이동
          </button>
        </header>

        <div className="admin-content">{renderContent()}</div>
      </main>
    </div>
  );
}

/**
 * ===========================================
 * 대시보드 콘텐츠 (더미 데이터)
 * TODO: 백엔드 완성 후 GET /api/admin/dashboard 연동
 * ===========================================
 */
function DashboardContent() {
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
          <div className="admin-stat-value">{dashboardStats.totalUsers}</div>
          <div className="admin-stat-sub">
            <span className="stat-active">활성: {dashboardStats.activeUsers}</span>
            <span className="stat-inactive">비활성: {dashboardStats.inactiveUsers}</span>
          </div>
        </div>

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