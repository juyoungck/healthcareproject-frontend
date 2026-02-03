/**
 * Dashboard.tsx
 * 대시보드 페이지 컴포넌트
 * 로그인한 사용자에게 표시되는 메인 서비스 화면
 */

import { useAuth } from '../../contexts/AuthContext';
import ExercisePage from './ExercisePage';
import DietPage from './DietPage';
import VideoPTPage from './VideoPTPage';
import BoardPage from './BoardPage';
import PlanExercisePage from './PlanExercisePage';
import PlanExerciseViewPage from '../components/plan/PlanExerciseViewPage';
import PlanDietPage from './PlanDietPage';
import PlanDietViewPage from '../components/plan/PlanDietViewPage';
import WeekCalendar from '../components/calendar/WeekCalendar';
import CalendarPage from './CalendarPage';
import CalendarStatsPage from './CalendarStatsPage';
import MyPage from './MyPage';

/* 커스텀 훅 */
import { useTodayPlan } from '../../hooks/dashboard/useTodayPlan';
import { useDashboardNavigation } from '../../hooks/dashboard/useDashboardNavigation';
import { useLivePTCount } from '../../hooks/dashboard/useLivePTCount';

/* 서브 컴포넌트 */
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TodayWorkoutCard from '../components/dashboard/TodayWorkoutCard';
import TodayDietCard from '../components/dashboard/TodayDietCard';
import RestDayCard from '../components/dashboard/RestDayCard';
import PlanCreateCard from '../components/dashboard/PlanCreateCard';
import VideoPTBar from '../components/dashboard/VideoPTBar';
import BottomNavigation from '../components/dashboard/BottomNavigation';

/**
 * Props 타입 정의
 */
interface DashboardProps {
  onLogout: () => void;
  onEditOnboarding: () => void;
  initialShowMyPage?: boolean;
  onMyPageShown?: () => void;
  onOpenAdminPage?: () => void;
}

/**
 * Dashboard 컴포넌트
 */
export default function Dashboard({
  onLogout,
  onEditOnboarding,
  initialShowMyPage = false,
  onMyPageShown,
  onOpenAdminPage
}: DashboardProps) {
  const { user: userInfo } = useAuth();

  /** 네비게이션 훅 */
  const {
    activeTab,
    subPage,
    showMyPage,
    videoPTFilter,
    selectedExerciseId,
    selectedFoodId,
    viewPageInitialDate,
    selectedMealIndex,
    setActiveTab,
    setSubPage,
    setShowMyPage,
    setSelectedExerciseId,
    setSelectedFoodId,
    setViewPageInitialDate,
    setSelectedMealIndex,
    handleNavigateToPT,
    getHeaderTitle,
  } = useDashboardNavigation({ initialShowMyPage, onMyPageShown });

  /** 오늘 계획 훅 */
  const {
    todayWorkout,
    todayDiet,
    isLoadingToday,
    calendarRefreshKey,
    loadTodayData,
    handleToggleWorkoutItem,
    handleToggleMeal,
    hasWeeklyWorkoutPlan,
    hasWeeklyDietPlan,
  } = useTodayPlan();

  /** 실시간 PT 개수 훅 */
  const { livePTCount } = useLivePTCount();

  /**
   * AI 계획 생성 완료 핸들러 (운동)
   */
  const handleExercisePlanComplete = () => {
    setSubPage('none');
    loadTodayData();
  };

  /**
   * AI 계획 생성 완료 핸들러 (식단)
   */
  const handleDietPlanComplete = () => {
    setSubPage('none');
    loadTodayData();
  };

  /**
   * 홈 탭 콘텐츠 렌더링
   */
  const renderHomeContent = () => {
    return (
      <>
        {/* 계획 생성/오늘의 계획 카드 그리드 */}
        <div className="plan-grid">
          {/* 운동 카드 */}
          {todayWorkout ? (
            <TodayWorkoutCard
              workout={todayWorkout}
              onToggleItem={handleToggleWorkoutItem}
              onViewAll={() => {
                setViewPageInitialDate(undefined);
                setActiveTab('exerciseView');
              }}
              onExerciseClick={(id) => {
                setSelectedExerciseId(id);
                setActiveTab('exercise');
              }}
            />
          ) : isLoadingToday ? (
            <div className="plan-card loading">
              <div className="plan-card-content">
                <p className="plan-card-title">로딩 중...</p>
              </div>
            </div>
          ) : hasWeeklyWorkoutPlan() ? (
            <RestDayCard
              type="workout"
              onViewWeekly={() => {
                setViewPageInitialDate(undefined);
                setActiveTab('exerciseView');
              }}
            />
          ) : (
            <PlanCreateCard
              type="workout"
              onClick={() => setSubPage('exercisePlan')}
            />
          )}

          {/* 식단 카드 */}
          {todayDiet ? (
            <TodayDietCard
              diet={todayDiet}
              onToggleMeal={handleToggleMeal}
              onViewAll={() => {
                setViewPageInitialDate(undefined);
                setActiveTab('dietView');
              }}
              onMealClick={(index) => {
                setSelectedMealIndex(index);
                setViewPageInitialDate(undefined);
                setActiveTab('dietView');
              }}
            />
          ) : hasWeeklyDietPlan() ? (
            <RestDayCard
              type="diet"
              onViewWeekly={() => {
                setViewPageInitialDate(undefined);
                setActiveTab('dietView');
              }}
            />
          ) : (
            <PlanCreateCard
              type="diet"
              onClick={() => setSubPage('dietPlan')}
            />
          )}
        </div>

        {/* 화상PT 바 - 진행중 탭으로 이동 */}
        <VideoPTBar
          livePTCount={livePTCount}
          onClick={() => handleNavigateToPT('live')}
        />

        {/* 주간 캘린더 */}
        <WeekCalendar
          key={calendarRefreshKey}
          onNavigateToMonth={() => setActiveTab('calendar')}
          onNavigateToWorkout={(dateStr) => {
            setViewPageInitialDate(dateStr);
            setActiveTab('exerciseView');
          }}
          onNavigateToDiet={(dateStr) => {
            setViewPageInitialDate(dateStr);
            setActiveTab('dietView');
          }}
          onNavigateToPT={() => handleNavigateToPT('live')}
        />
      </>
    );
  };

  /**
   * 탭별 콘텐츠 렌더링
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'exercise':
        return (
          <ExercisePage
            initialExerciseId={selectedExerciseId}
            onExerciseSelect={(id) => setSelectedExerciseId(id)}
          />
        );
      case 'exerciseView':
        return (
          <PlanExerciseViewPage
            onBack={() => {
              setViewPageInitialDate(undefined);
              setActiveTab('home');
            }}
            onExerciseClick={(id) => {
              setSelectedExerciseId(id);
              setActiveTab('exercise');
            }}
            onRegenerate={() => setSubPage('exercisePlan')}
            onDataChange={loadTodayData}
            initialDate={viewPageInitialDate}
          />
        );
      case 'diet':
        return (
          <DietPage
            initialFoodId={selectedFoodId}
            onFoodSelect={(id) => setSelectedFoodId(id)}
          />
        );
      case 'dietView':
        return (
          <PlanDietViewPage
            onBack={() => {
              setViewPageInitialDate(undefined);
              setActiveTab('home');
            }}
            onFoodClick={(id) => {
              setSelectedFoodId(id);
              setActiveTab('diet');
            }}
            onRegenerate={() => setSubPage('dietPlan')}
            initialMealIndex={selectedMealIndex}
            onDataChange={loadTodayData}
            initialDate={viewPageInitialDate}
          />
        );
      case 'pt':
        return <VideoPTPage initialFilter={videoPTFilter} />;
      case 'board':
        return <BoardPage />;
      case 'calendar':
        return (
          <CalendarPage
            onNavigateBack={() => setActiveTab('home')}
            onNavigateToWorkout={(dateStr) => {
              setViewPageInitialDate(dateStr);
              setActiveTab('exerciseView');
            }}
            onNavigateToDiet={(dateStr) => {
              setViewPageInitialDate(dateStr);
              setActiveTab('dietView');
            }}
            onNavigateToPT={() => handleNavigateToPT('live')}
            onNavigateToStats={() => setActiveTab('calendarStats')}
          />
        );
      case 'calendarStats':
        return (
          <CalendarStatsPage
            onNavigateBack={() => setActiveTab('calendar')}
          />
        );
      default:
        return renderHomeContent();
    }
  };

  /**
   * 서브페이지 렌더링
   */
  if (subPage === 'exercisePlan') {
    return (
      <PlanExercisePage
        onBack={() => setSubPage('none')}
        onComplete={handleExercisePlanComplete}
      />
    );
  }

  if (subPage === 'dietPlan') {
    return (
      <PlanDietPage
        onBack={() => setSubPage('none')}
        onComplete={handleDietPlanComplete}
      />
    );
  }

  if (showMyPage) {
    return (
      <MyPage
        onBack={() => setShowMyPage(false)}
        onLogout={onLogout}
        onEditOnboarding={onEditOnboarding}
        onOpenAdminPage={() => {
          setShowMyPage(false);
          onOpenAdminPage?.();
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* 상단 헤더 */}
      <DashboardHeader
        title={getHeaderTitle()}
        profileImageUrl={userInfo?.profileImageUrl}
        onProfileClick={() => setShowMyPage(true)}
      />

      {/* 메인 콘텐츠 영역 */}
      <main className="app-main">
        {renderTabContent()}
      </main>

      {/* 하단 네비게이션 바 */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExerciseClick={() => {
          setSelectedExerciseId(null);
          setActiveTab('exercise');
        }}
        onDietClick={() => {
          setSelectedFoodId(null);
          setActiveTab('diet');
        }}
        onPTClick={() => handleNavigateToPT('all')}
      />
    </div>
  );
}
