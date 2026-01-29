/**
 * Dashboard.tsx
 * 대시보드 페이지 컴포넌트
 * 로그인한 사용자에게 표시되는 메인 서비스 화면
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Dumbbell,
  User,
  Video,
  Utensils,
  Home,
  MessageSquare,
  Clock,
  Check,
  ExternalLink
} from 'lucide-react';
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
import MyPage from './MyPage';

import { getDailyWorkout, getWeeklyWorkoutStatus, updateWorkoutItemCheck } from '../../api/workout';
import { getDailyDiet, getWeeklyDietStatus, updateDietItemCheck } from '../../api/dietplan';
import type { DailyWorkoutResponse, WorkoutItem } from '../../api/types/workout';
import type { DailyDietResponse, DietMeal, DietMealItem } from '../../api/types/dietplan';
import type { WeeklyStatusMap } from '../../api/types/calendar';

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
 * 탭 타입 정의
 */
type TabType = 'home' | 'exercise' | 'diet' | 'pt' | 'board' | 'exerciseView' | 'dietView' | 'calendar';

/**
 * 서브페이지 타입 정의
 */
type SubPageType = 'none' | 'exercisePlan' | 'dietPlan';

/**
 * 오늘 날짜 문자열 반환 (YYYY-MM-DD)
 */
const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

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

  /**
   * 현재 활성 탭 상태
   */
  const [activeTab, setActiveTab] = useState<TabType>('home');

  /**
   * 서브페이지 상태
   */
  const [subPage, setSubPage] = useState<SubPageType>('none');

  /**
   * 마이페이지 상태
   */
  const [showMyPage, setShowMyPage] = useState(false);

  /**
   * 마이페이지 초기 표시 처리
   */
  useEffect(() => {
    if (initialShowMyPage) {
      setShowMyPage(true);
      onMyPageShown?.();  // 상태 리셋 콜백 호출
    }
  }, [initialShowMyPage, onMyPageShown]);

  /**
    * 화상PT 초기 필터 상태
    */
  const [videoPTFilter, setVideoPTFilter] = useState<string | null>(null);

  /**
   * ===== 오늘의 운동/식단 (API 조회) =====
   */
  const [todayWorkout, setTodayWorkout] = useState<DailyWorkoutResponse | null>(null);
  const [todayDiet, setTodayDiet] = useState<DailyDietResponse | null>(null);
  const [isLoadingToday, setIsLoadingToday] = useState(true);

  /**
   * 주간 운동/식단 상태 (계획 존재 여부 확인용)
   */
  const [weeklyWorkoutStatus, setWeeklyWorkoutStatus] = useState<WeeklyStatusMap>({});
  const [weeklyDietStatus, setWeeklyDietStatus] = useState<WeeklyStatusMap>({});

  /**
   * 선택된 운동/음식 ID
   */
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

  /**
   * ViewPage 초기 날짜 (캘린더에서 선택한 날짜)
   */
  const [viewPageInitialDate, setViewPageInitialDate] = useState<string | undefined>(undefined);

  /**
   * 선택된 끼니 인덱스 (식단 뷰 초기 탭)
   */
  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(0);

  /**
   * 오늘 운동/식단 데이터 로드
   */
  const loadTodayData = useCallback(async () => {
    setIsLoadingToday(true);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const endDay = new Date(today);
    endDay.setDate(today.getDate() + 6);
    const startDate = todayStr;
    const endDate = endDay.toISOString().split('T')[0];

    try {
      /* 오늘 운동 조회 */
      const workoutData = await getDailyWorkout(todayStr);
      setTodayWorkout(workoutData);
    } catch (error: any) {
      /* 404는 정상 (해당 날짜에 운동 없음) */
      if (error?.response?.status !== 404) {
        console.error('오늘 운동 조회 실패:', error);
      }
      setTodayWorkout(null);
    }

    try {
      /* 오늘 식단 조회 */
      const dietData = await getDailyDiet(todayStr);
      setTodayDiet(dietData);
    } catch (error: any) {
      /* 404는 정상 (해당 날짜에 식단 없음) */
      if (error?.response?.status !== 404) {
        console.error('오늘 식단 조회 실패:', error);
      }
      setTodayDiet(null);
    }

    /* 주간 운동 상태 조회 */
    try {
      const workoutStatusRes = await getWeeklyWorkoutStatus(startDate, endDate);
      const statusMap: WeeklyStatusMap = {};
      workoutStatusRes.days.forEach(day => {
        statusMap[day.date] = day.status;
      });
      setWeeklyWorkoutStatus(statusMap);
    } catch (error) {
      console.error('주간 운동 상태 조회 실패:', error);
    }

    /* 주간 식단 상태 조회 */
    try {
      const dietStatusRes = await getWeeklyDietStatus(startDate, endDate);
      const statusMap: WeeklyStatusMap = {};
      dietStatusRes.days.forEach(day => {
        statusMap[day.date] = day.status;
      });
      setWeeklyDietStatus(statusMap);
    } catch (error) {
      console.error('주간 식단 상태 조회 실패:', error);
    }

    setIsLoadingToday(false);
  }, []);

  /**
   * 주간 캘린더 새로고침 키
   */
  const [calendarRefreshKey, setCalendarRefreshKey] = useState<number>(0);

  /**
   * 주간 운동 계획 존재 여부 확인
   */
  const hasWeeklyWorkoutPlan = (): boolean => {
    return Object.values(weeklyWorkoutStatus).some(
      status => status === 'PLANNED' || status === 'DONE'
    );
  };

  /**
   * 주간 식단 계획 존재 여부 확인
   */
  const hasWeeklyDietPlan = (): boolean => {
    return Object.values(weeklyDietStatus).some(
      status => status === 'PLANNED' || status === 'DONE'
    );
  };

  /**
   * 컴포넌트 마운트 시 오늘 데이터 로드
   */
  useEffect(() => {
    loadTodayData();
  }, [loadTodayData]);

  /**
   * 운동 체크 토글 핸들러 (API 호출)
   */
  const handleToggleWorkoutItem = async (item: WorkoutItem) => {
    if (!todayWorkout) return;

    const newChecked = !item.isChecked;

    /* 낙관적 업데이트 */
    setTodayWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.map(i =>
          i.workoutItemId === item.workoutItemId
            ? { ...i, isChecked: newChecked }
            : i
        ),
        completedCount: prev.completedCount + (newChecked ? 1 : -1)
      };
    });

    try {
      await updateWorkoutItemCheck(item.workoutItemId, newChecked);
      setCalendarRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('운동 체크 업데이트 실패:', error);
      /* 실패 시 롤백 */
      setTodayWorkout(prev => {
        if (!prev) return null;
        return {
          ...prev,
          items: prev.items.map(i =>
            i.workoutItemId === item.workoutItemId
              ? { ...i, isChecked: !newChecked }
              : i
          ),
          completedCount: prev.completedCount + (newChecked ? -1 : 1)
        };
      });
    }
  };

  /**
   * 끼니 전체 체크 토글 핸들러 (API 호출)
   */
  const handleToggleMeal = async (meal: DietMeal) => {
    if (!todayDiet) return;

    /* 현재 끼니의 모든 아이템이 체크되어 있는지 확인 */
    const allChecked = meal.items.length > 0 && meal.items.every(item => item.isChecked);
    const newChecked = !allChecked;

    /* 낙관적 업데이트: 해당 끼니의 모든 아이템 토글 */
    setTodayDiet(prev => {
      if (!prev) return null;
      return {
        ...prev,
        meals: prev.meals.map(m =>
          m.dietMealId === meal.dietMealId
            ? {
              ...m,
              items: m.items.map(item => ({ ...item, isChecked: newChecked }))
            }
            : m
        )
      };
    });

    /* 모든 아이템에 대해 API 호출 */
    try {
      await Promise.all(
        meal.items.map(item =>
          updateDietItemCheck(item.dietMealItemId, newChecked)
        )
      );
      setCalendarRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('식단 체크 업데이트 실패:', error);
      /* 실패 시 롤백 */
      setTodayDiet(prev => {
        if (!prev) return null;
        return {
          ...prev,
          meals: prev.meals.map(m =>
            m.dietMealId === meal.dietMealId
              ? {
                ...m,
                items: m.items.map(item => ({ ...item, isChecked: !newChecked }))
              }
              : m
          )
        };
      });
    }
  };

  /**
   * 탭별 헤더 타이틀
   */
  const getHeaderTitle = (): string => {
    switch (activeTab) {
      case 'home': return '운동운동';
      case 'exercise': return '운동';
      case 'exerciseView': return '주간운동';
      case 'diet': return '식단';
      case 'dietView': return '주간식단';
      case 'pt': return '화상PT';
      case 'board': return '게시판';
      case 'calendar': return '캘린더';
      default: return '운동운동';
    }
  };

  /**
   * 화상PT 페이지 이동 핸들러
   */
  const handleNavigateToPT = (filter?: string) => {
    if (filter) {
      setVideoPTFilter(filter);
    }
    setActiveTab('pt');
  };

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
            /* 오늘의 운동 카드 */
            <div className="today-exercise-card">
              <div
                className="today-exercise-header"
                onClick={() => setActiveTab('exerciseView')}
              >
                <span className="today-exercise-label">오늘의 운동</span>
                <ExternalLink size={16} className="today-exercise-arrow" />
              </div>

              {/* 카테고리 헤더 */}
              <div className="today-exercise-category">
                <Dumbbell size={16} className="today-exercise-category-icon" />
                <div className="today-exercise-category-info">
                  <h3 className="today-exercise-category-title">{todayWorkout.title}</h3>
                  <p className="today-exercise-category-meta">
                    <Clock size={12} />
                    {todayWorkout.totalMinutes}분 • {todayWorkout.exerciseCount}개 운동
                  </p>
                </div>
              </div>

              {/* 운동 리스트 */}
              <ul className="today-exercise-list">
                {todayWorkout.items.map((item) => (
                  <li
                    key={item.workoutItemId}
                    className={`today-exercise-item ${item.isChecked ? 'completed' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWorkoutItem(item);
                    }}
                  >
                    <button className="today-exercise-item-check">
                      {item.isChecked ? (
                        <Check size={12} />
                      ) : (
                        <div className="today-exercise-item-check-empty" />
                      )}
                    </button>
                    <div className="today-exercise-item-info">
                      <p className="today-exercise-item-name">{item.name}</p>
                      <p className="today-exercise-item-detail">
                        {item.amount} • 휴식 {item.restSeconds}초
                      </p>
                    </div>
                    <ExternalLink
                      size={16}
                      className="today-exercise-item-arrow"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExerciseId(item.exerciseId);
                        setActiveTab('exercise');
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : isLoadingToday ? (
            /* 로딩 중 */
            <div className="plan-card loading">
              <div className="plan-card-content">
                <p className="plan-card-title">로딩 중...</p>
              </div>
            </div>
          ) : hasWeeklyWorkoutPlan() ? (
            /* 휴식일 카드 (주간 계획은 있지만 오늘은 휴식) */
            <div className="rest-day-card">
              <div className="rest-day-content">
                <span className="rest-day-emoji">😴</span>
                <p className="rest-day-title">오늘은 휴식일</p>
                <p className="rest-day-desc">푹 쉬고 내일 다시 힘내요!</p>
              </div>
              <button
                className="rest-day-view-btn"
                onClick={() => setActiveTab('exerciseView')}
              >
                주간 운동 보기
              </button>
            </div>
          ) : (
            /* 운동 계획 생성 버튼 */
            <button className="plan-card" onClick={() => setSubPage('exercisePlan')}>
              <div className="plan-card-content">
                <Dumbbell className="plan-card-icon workout" />
                <p className="plan-card-title">운동 계획 생성</p>
              </div>
            </button>
          )}

          {/* 식단 카드 */}
          {todayDiet ? (
            /* 오늘의 식단 카드 */
            <div className="today-diet-card">
              <div
                className="today-diet-header"
                onClick={() => setActiveTab('dietView')}
              >
                <span className="today-diet-label">오늘의 식단</span>
                <ExternalLink size={16} className="today-diet-arrow" />
              </div>

              {/* 칼로리 헤더 */}
              <div className="today-diet-category">
                <Utensils size={16} className="today-diet-category-icon" />
                <div className="today-diet-category-info">
                  <h3 className="today-diet-category-title">
                    {todayDiet.meals.reduce((sum, meal) =>
                      sum + meal.items.reduce((s, item) => s + item.calories, 0), 0
                    )}kcal
                  </h3>
                  <p className="today-diet-category-meta">
                    {todayDiet.meals.length}끼 식단
                  </p>
                </div>
              </div>

              {/* 끼니별 리스트 */}
              <ul className="today-diet-list">
                {todayDiet.meals.map((meal, index) => {
                  const mealCalories = meal.items.reduce((sum, item) => sum + item.calories, 0);
                  const menuNames = meal.items.map(item => item.name).join(' + ');
                  const allChecked = meal.items.length > 0 && meal.items.every(item => item.isChecked);

                  return (
                    <li
                      key={meal.dietMealId}
                      className={`today-diet-item ${allChecked ? 'completed' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (meal.items.length > 0) {
                          handleToggleMeal(meal);
                        }
                      }}
                    >
                      <button className="today-diet-item-check">
                        {allChecked ? (
                          <Check size={12} />
                        ) : (
                          <div className="today-diet-item-check-empty" />
                        )}
                      </button>
                      <div className="today-diet-item-info">
                        <p className="today-diet-item-name">
                          {menuNames.length > 25 ? menuNames.substring(0, 25) + '...' : menuNames}
                        </p>
                        <p className="today-diet-item-detail">
                          {meal.title} • {mealCalories}kcal
                        </p>
                      </div>
                      <ExternalLink
                        size={16}
                        className="today-exercise-item-arrow"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMealIndex(index);
                          setActiveTab('dietView')
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : hasWeeklyDietPlan() ? (
            /* 휴식일 카드 (주간 계획은 있지만 오늘은 식단 없음) */
            <div className="rest-day-card diet">
              <div className="rest-day-content">
                <span className="rest-day-emoji">🍽️</span>
                <p className="rest-day-title">오늘은 자유 식단</p>
                <p className="rest-day-desc">오늘은 편하게 드세요!</p>
              </div>
              <button
                className="rest-day-view-btn"
                onClick={() => setActiveTab('dietView')}
              >
                주간 식단 보기
              </button>
            </div>
          ) : (
            /* 식단 계획 생성 버튼 */
            <button className="plan-card" onClick={() => setSubPage('dietPlan')}>
              <div className="plan-card-content">
                <Utensils className="plan-card-icon diet" />
                <p className="plan-card-title">식단 계획 생성</p>
              </div>
            </button>
          )}
        </div>

        {/* 화상회의 예약 확인 바 */}
        <div className="video-call-bar" onClick={() => handleNavigateToPT('my-reservation')}>
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
          onNavigateToPT={() => handleNavigateToPT('my-reservation')}
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
            onNavigateToPT={() => handleNavigateToPT('my-reservation')}
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
      <header className="app-header">
        <div className="app-header-content">
          <Dumbbell className="app-logo-icon" />

          {/* 중앙 타이틀 */}
          <h1 className="app-title">{getHeaderTitle()}</h1>

          {/* 우측 마이페이지 버튼 */}
          <button className="app-profile-btn" onClick={() => setShowMyPage(true)}>
            {userInfo?.profileImageUrl ? (
              <img src={userInfo.profileImageUrl} alt="프로필" className="mypage-profile-image" />
            ) : (
              <User size={48} className="mypage-profile-placeholder" />
            )}
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="app-main">
        {renderTabContent()}
      </main>

      {/* 하단 네비게이션 바 */}
      <nav className="app-bottom-nav">
        <div className="app-bottom-nav-grid">
          {/* 운동 탭 */}
          <button
            className={`nav-button ${activeTab === 'exercise' ? 'active' : ''}`}
            onClick={() => {
              setSelectedExerciseId(null);
              setActiveTab('exercise');
            }}
          >
            <Dumbbell className="nav-button-icon" />
            <span className="nav-button-label">운동</span>
          </button>

          {/* 식단 탭 */}
          <button
            className={`nav-button ${activeTab === 'diet' ? 'active' : ''}`}
            onClick={() => {
              setSelectedFoodId(null);
              setActiveTab('diet');
            }}
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
            onClick={() => handleNavigateToPT('all')}
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