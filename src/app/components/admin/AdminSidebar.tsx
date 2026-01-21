/**
 * AdminSidebar.tsx
 * 관리자 패널 사이드바 네비게이션
 */

import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  AlertTriangle,
  Dumbbell,
  UtensilsCrossed,
  Video,
  BarChart3,
  Monitor,
} from 'lucide-react';
import type { AdminMenuType } from '../../../types/admin';

/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface AdminSidebarProps {
  /** 현재 선택된 메뉴 */
  currentMenu: AdminMenuType;
  /** 메뉴 변경 핸들러 */
  onMenuChange: (menu: AdminMenuType) => void;
}

/**
 * ===========================================
 * 메뉴 아이템 데이터
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
 * AdminSidebar 컴포넌트
 * ===========================================
 */

export default function AdminSidebar({ currentMenu, onMenuChange }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`admin-sidebar-item ${currentMenu === item.id ? 'active' : ''}`}
            onClick={() => onMenuChange(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}