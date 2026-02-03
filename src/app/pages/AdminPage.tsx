/**
 * AdminPage.tsx
 * 관리자 패널 메인 페이지 (레이아웃 + 사이드바)
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
} from 'lucide-react';
import type { AdminMenuType } from '../../api/types/admin';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminTrainerList from '../components/admin/AdminTrainerList';
import AdminMemberList from '../components/admin/AdminMemberList';
import AdminBoardList from '../components/admin/AdminBoardList';
import AdminReportList from '../components/admin/AdminReportList';
import AdminExerciseList from '../components/admin/AdminExerciseList';
import AdminDietList from '../components/admin/AdminDietList';
import AdminPTList from '../components/admin/AdminPTList';

/**
 * ===========================================
 * 사이드바 메뉴 데이터
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

  /**
   * 메뉴별 콘텐츠 렌더링
   */
  const renderContent = () => {
    switch (currentMenu) {
      case 'dashboard':
        return <AdminDashboard />;
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
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-layout">
      {/* 사이드바 */}
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