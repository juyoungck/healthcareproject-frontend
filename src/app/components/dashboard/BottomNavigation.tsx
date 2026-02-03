/**
 * BottomNavigation.tsx
 * 하단 네비게이션 바 컴포넌트
 */

import { Dumbbell, Utensils, Home, Video, MessageSquare } from 'lucide-react';
import type { TabType } from '../../../hooks/dashboard/useDashboardNavigation';

/**
 * Props 타입 정의
 */
interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onExerciseClick: () => void;
  onDietClick: () => void;
  onPTClick: () => void;
}

/**
 * BottomNavigation 컴포넌트
 */
export default function BottomNavigation({
  activeTab,
  onTabChange,
  onExerciseClick,
  onDietClick,
  onPTClick,
}: BottomNavigationProps) {
  return (
    <nav className="app-bottom-nav">
      <div className="app-bottom-nav-grid">
        {/* 운동 탭 */}
        <button
          className={`nav-button ${activeTab === 'exercise' ? 'active' : ''}`}
          onClick={onExerciseClick}
        >
          <Dumbbell className="nav-button-icon" />
          <span className="nav-button-label">운동</span>
        </button>

        {/* 식단 탭 */}
        <button
          className={`nav-button ${activeTab === 'diet' ? 'active' : ''}`}
          onClick={onDietClick}
        >
          <Utensils className="nav-button-icon" />
          <span className="nav-button-label">식단</span>
        </button>

        {/* 메인(홈) 탭 */}
        <button
          className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => onTabChange('home')}
        >
          <Home className="nav-button-icon" />
          <span className="nav-button-label">홈</span>
        </button>

        {/* 화상PT 탭 */}
        <button
          className={`nav-button ${activeTab === 'pt' ? 'active' : ''}`}
          onClick={onPTClick}
        >
          <Video className="nav-button-icon" />
          <span className="nav-button-label">화상PT</span>
        </button>

        {/* 게시판 탭 */}
        <button
          className={`nav-button ${activeTab === 'board' ? 'active' : ''}`}
          onClick={() => onTabChange('board')}
        >
          <MessageSquare className="nav-button-icon" />
          <span className="nav-button-label">게시판</span>
        </button>
      </div>
    </nav>
  );
}
