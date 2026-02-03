/**
 * DashboardHeader.tsx
 * 대시보드 헤더 컴포넌트
 */

import { Dumbbell, User } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface DashboardHeaderProps {
  title: string;
  profileImageUrl: string | null | undefined;
  onProfileClick: () => void;
}

/**
 * DashboardHeader 컴포넌트
 */
export default function DashboardHeader({
  title,
  profileImageUrl,
  onProfileClick,
}: DashboardHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-content">
        <Dumbbell className="app-logo-icon" />

        {/* 중앙 타이틀 */}
        <h1 className="app-title">{title}</h1>

        {/* 우측 마이페이지 버튼 */}
        <button className="app-profile-btn" onClick={onProfileClick}>
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="프로필" className="mypage-profile-image" />
          ) : (
            <User size={48} className="mypage-profile-placeholder" />
          )}
        </button>
      </div>
    </header>
  );
}
