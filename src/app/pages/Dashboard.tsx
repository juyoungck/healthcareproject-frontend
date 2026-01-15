/**
 * Dashboard.tsx
 * 대시보드 페이지 컴포넌트
 * 로그인한 사용자에게 표시되는 메인 서비스 화면
 * - 오늘의 운동/식단 요약 카드
 * - 화상PT 알림
 * - 주간 미니 캘린더
 * - 하단 탭 네비게이션
 */

import { useState } from 'react';
import { 
  Dumbbell, 
  User, 
  Video, 
  Utensils, 
  Home, 
  MessageSquare,
  Calendar
} from 'lucide-react';
import ExerciseContent from '../components/exercise/ExerciseContent';
import DietPage from './DietPage';
import VideoPTPage from './VideoPTPage';
import BoardPage from './BoardPage';

/**
 * 컴포넌트 Props 타입 정의
 */
interface DashboardProps {
  onLogout: () => void;
}

/**
   * 현재 로그인한 사용자 ID
   * TODO: 실제 구현 시 인증 시스템에서 가져오기
   */
  const currentUserId = 1;

/**
 * 요일 데이터
 */
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 탭 타입 정의
 */
type TabType = 'home' | 'exercise' | 'diet' | 'pt' | 'board';

/**
 * Dashboard 컴포넌트
 * 메인 대시보드 UI 렌더링
 */
export default function Dashboard({ onLogout }: DashboardProps) {
  /**
   * 현재 활성 탭 상태
   */
  const [activeTab, setActiveTab] = useState<TabType>('home');
  
  /**
   * 오늘 날짜 인덱스 (0: 일요일 ~ 6: 토요일)
   */
  const today = new Date().getDay();

  /**
   * 예시 주간 활동 데이터
   * TODO: 실제 구현 시 API에서 가져오기
   */
  const dailyStatus = [
    { workout: false, diet: false, pt: false },
    { workout: true, diet: true, pt: false },
    { workout: true, diet: false, pt: true },
    { workout: false, diet: false, pt: false },
    { workout: false, diet: false, pt: false },
    { workout: false, diet: false, pt: false },
    { workout: false, diet: false, pt: false },
  ];

  /**
   * 탭별 헤더 타이틀
   */
  const getHeaderTitle = (): string => {
    switch (activeTab) {
      case 'home':
        return '운동운동';
      case 'exercise':
        return '운동';
      case 'diet':
        return '식단';
      case 'pt':
        return '화상PT';
      case 'board':
        return '게시판';
      default:
        return '운동운동';
    }
  };
  
  /**
   * 홈 탭 콘텐츠 렌더링
   */
  const renderHomeContent = () => (
    <>
      {/* 운동/식단 계획 생성 박스 */}
      <div className="plan-grid">
        {/* 운동 계획 생성 카드 */}
        <button className="plan-card">
          <div className="plan-card-content">
            <Dumbbell className="plan-card-icon workout" />
            <p className="plan-card-title">운동 계획 생성</p>
          </div>
        </button>
        
        {/* 식단 계획 생성 카드 */}
        <button className="plan-card">
          <div className="plan-card-content">
            <Utensils className="plan-card-icon diet" />
            <p className="plan-card-title">식단 계획 생성</p>
          </div>
        </button>
      </div>

      {/* 화상회의 예약 확인 바 */}
      <div className="video-call-bar">
        <div className="video-call-content">
          <div className="video-call-left">
            <Video className="video-call-icon" />
            <div>
              <p className="video-call-title">화상 PT 예약</p>
              <p className="video-call-subtitle">예약된 일정을 확인하세요</p>
            </div>
          </div>
          <span className="video-call-count">0건</span>
        </div>
      </div>

      {/* 주간 캘린더 */}
      <div className="calendar-container">
        <div className="calendar-header">
          <h2 className="calendar-title">주간 활동</h2>
          <button className="calendar-more-btn">
            <Calendar size={16} />
            <span>전체보기</span>
          </button>
        </div>
        
        <div className="calendar-grid">
          {WEEK_DAYS.map((day, index) => (
            <div key={index} className="calendar-day-column">
              {/* 요일 라벨 */}
              <span className={`calendar-day-label ${index === today ? 'today' : ''}`}>
                {day}
              </span>
              
              {/* 날짜 셀 */}
              <div className={`calendar-day-cell ${index === today ? 'today' : ''}`}>
                <div className="calendar-status-dots">
                  {/* 운동 완료 상태 도트 */}
                  <div className={`calendar-status-dot ${dailyStatus[index].workout ? 'workout' : ''}`} />
                  
                  {/* 식단 완료 상태 도트 */}
                  <div className={`calendar-status-dot ${dailyStatus[index].diet ? 'diet' : ''}`} />
                  
                  {/* PT 완료 상태 도트 */}
                  <div className={`calendar-status-dot ${dailyStatus[index].pt ? 'pt' : ''}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 범례 */}
        <div className="calendar-legend">
          <div className="calendar-legend-item">
            <div className="calendar-legend-dot workout" />
            <span className="calendar-legend-label">운동</span>
          </div>
          <div className="calendar-legend-item">
            <div className="calendar-legend-dot diet" />
            <span className="calendar-legend-label">식단</span>
          </div>
          <div className="calendar-legend-item">
            <div className="calendar-legend-dot pt" />
            <span className="calendar-legend-label">화상PT</span>
          </div>
        </div>
      </div>
    </>
  );

  /**
   * 탭별 콘텐츠 렌더링
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'exercise':
        return <ExerciseContent />;
      case 'diet':
        return <DietPage />;
      case 'pt':
        return <VideoPTPage />;
      case 'board':
        return <BoardPage />;
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="app-container">
      {/* 상단 헤더 (고정) */}
      <header className="app-header">
        <div className="app-header-content">
          {/* 좌측 로고 아이콘 */}
          <Dumbbell className="app-logo-icon" />
          
          {/* 중앙 타이틀 */}
          <h1 className="app-title">{getHeaderTitle()}</h1>
          
          {/* 우측 마이페이지 버튼 */}
          <button className="app-profile-btn" onClick={onLogout}>
            <User className="app-profile-icon" />
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="app-main">
        {renderTabContent()}
      </main>

      {/* 하단 네비게이션 바 (고정) */}
      <nav className="app-bottom-nav">
        <div className="app-bottom-nav-grid">
          {/* 운동 탭 */}
          <button 
            className={`nav-button ${activeTab === 'exercise' ? 'active' : ''}`}
            onClick={() => setActiveTab('exercise')}
          >
            <Dumbbell className="nav-button-icon" />
            <span className="nav-button-label">운동</span>
          </button>
          
          {/* 식단 탭 */}
          <button 
            className={`nav-button ${activeTab === 'diet' ? 'active' : ''}`}
            onClick={() => setActiveTab('diet')}
          >
            <Utensils className="nav-button-icon" />
            <span className="nav-button-label">식단</span>
          </button>
          
          {/* 메인(홈) 탭 */}
          <button 
            className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home className="nav-button-icon" />
            <span className="nav-button-label">홈</span>
          </button>
          
          {/* 화상PT 탭 */}
          <button 
            className={`nav-button ${activeTab === 'pt' ? 'active' : ''}`}
            onClick={() => setActiveTab('pt')}
          >
            <Video className="nav-button-icon" />
            <span className="nav-button-label">화상PT</span>
          </button>
          
          {/* 게시판 탭 */}
          <button 
            className={`nav-button ${activeTab === 'board' ? 'active' : ''}`}
            onClick={() => setActiveTab('board')}
          >
            <MessageSquare className="nav-button-icon" />
            <span className="nav-button-label">게시판</span>
          </button>
        </div>
      </nav>
    </div>
  );
}