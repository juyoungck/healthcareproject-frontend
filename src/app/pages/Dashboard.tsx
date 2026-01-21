/**
 * Dashboard.tsx
 * 대시보드 페이지 컴포넌트
 * 로그인한 사용자에게 표시되는 메인 서비스 화면
 */

import { useState, useEffect } from 'react';
import {
  Dumbbell,
  User,
  Video,
  Utensils,
  Home,
  MessageSquare,
  Calendar,
  ChevronRight,
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
import { ExercisePlan } from '../components/plan/PlanExerciseResult';
import { DietPlan } from '../components/plan/PlanDietResult';
import { MealType } from '../../data/plan';
import WeekCalendar from '../components/calendar/WeekCalendar';
import CalendarPage from './CalendarPage';
import MyPage from './MyPage';

/**
 * Props 타입 정의
 */
interface DashboardProps {
  onLogout: () => void;
  onEditOnboarding: () => void;
  initialShowMyPage?: boolean;
  onMyPageShown?: () => void;
}

/**
 * 현재 로그인한 사용자 ID
 * TODO: 실제 구현 시 인증 시스템에서 가져오기
 */
const currentUserId = 1;

/**
 * 탭 타입 정의
 */
type TabType = 'home' | 'exercise' | 'diet' | 'pt' | 'board' | 'exerciseView' | 'dietView' | 'calendar';

/**
 * 서브페이지 타입 정의
 */
type SubPageType = 'none' | 'exercisePlan' | 'dietPlan';

/**
 * 끼니 그룹 타입 정의
 */
interface MealGroup {
  type: string;
  typeLabel: string;
  meals: Array<{
    id: number;
    type: string;
    typeLabel: string;
    menu: string;
    calories: number;
    nutrients: {
      carb: number;
      protein: number;
      fat: number;
    };
  }>;
  totalCalories: number;
}

/**
 * Dashboard 컴포넌트
 */
export default function Dashboard({
  onLogout,
  onEditOnboarding,
  initialShowMyPage = false,
  onMyPageShown
}: DashboardProps) {

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
   * 저장된 운동 계획
   */
  const [savedExercisePlan, setSavedExercisePlan] = useState<ExercisePlan | null>(null);

  /**
   * 완료된 운동 목록
   */
  const [completedExercises, setCompletedExercises] = useState<{ [key: string]: boolean }>({});

  /**
   * 저장된 식단 계획
   */
  const [savedDietPlan, setSavedDietPlan] = useState<DietPlan | null>(null);

  /**
   * 완료된 식단 목록
   */
  const [completedMeals, setCompletedMeals] = useState<{ [key: string]: boolean }>({});

  /**
   * 선택된 운동 ID
   */
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);

  /**
   * 선택된 음식 ID
   */
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

  /**
   * 선택된 끼니 타입 (식단 뷰 초기 탭)
   */
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');

  /**
   * 오늘 날짜 인덱스
   */
  const today = new Date().getDay();

  /**
   * 예시 주간 활동 데이터
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
   * 운동 완료 토글
   */
  const handleToggleExercise = (exerciseKey: string) => {
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseKey]: !prev[exerciseKey]
    }));
  };

  /**
   * 식단 완료 토글
   */
  const handleToggleMeal = (mealKey: string) => {
    setCompletedMeals(prev => ({
      ...prev,
      [mealKey]: !prev[mealKey]
    }));
  };

  /**
   * 탭별 헤더 타이틀
   */
  const getHeaderTitle = (): string => {
    switch (activeTab) {
      case 'home':
        return '운동운동';
      case 'exercise':
        return '운동';
      case 'exerciseView':
        return '주간운동';
      case 'diet':
        return '식단';
      case 'dietView':
        return '주간식단';
      case 'pt':
        return '화상PT';
      case 'board':
        return '게시판';
      case 'calendar':
        return '캘린더';
      default:
        return '운동운동';
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
   * 오늘 요일 가져오기
   */
  const getTodayDayName = () => String(new Date().getDay());

  /**
   * 오늘의 운동 계획 가져오기
   */
  const getTodayExercise = () => {
    if (!savedExercisePlan) return null;
    return savedExercisePlan.dailyPlans.find(plan => plan.dayName === getTodayDayName());
  };

  /**
   * 오늘의 식단 가져오기
   */
  const getTodayDiet = () => {
    if (!savedDietPlan) return null;
    return savedDietPlan.dailyMeals.find(meal => meal.dayName === getTodayDayName());
  };

  /**
   * 끼니별 그룹화 함수
   */
  const groupMealsByType = (meals: DietPlan['dailyMeals'][0]['meals']): MealGroup[] => {
    const groups = meals.reduce((acc, meal) => {
      const type = meal.type;
      if (!acc[type]) {
        acc[type] = {
          type: meal.type,
          typeLabel: meal.typeLabel,
          meals: [],
          totalCalories: 0
        };
      }
      acc[type].meals.push(meal);
      acc[type].totalCalories += meal.calories;
      return acc;
    }, {} as Record<string, MealGroup>);

    return Object.values(groups);
  };

  /**
   * 서브페이지 렌더링
   */
  if (subPage === 'exercisePlan') {
    return (
      <PlanExercisePage
        onBack={() => setSubPage('none')}
        onSavePlan={(plan) => {
          setSavedExercisePlan(plan);
          setSubPage('none');
        }}
      />
    );
  }

  if (subPage === 'dietPlan') {
    return (
      <PlanDietPage
        onBack={() => setSubPage('none')}
        onSavePlan={(plan) => {
          setSavedDietPlan(plan);
          setSubPage('none');
        }}
      />
    );
  }

  /**
   * 홈 탭 콘텐츠 렌더링
   */
  const renderHomeContent = () => {
    const todayExercise = getTodayExercise();
    const todayDiet = getTodayDiet();

    return (
      <>
        {/* 운동/식단 계획 박스 */}
        <div className="plan-grid">
          {/* 운동 카드 */}
          {savedExercisePlan && todayExercise ? (
            <div className="today-exercise-card">
              <div className="today-exercise-header" onClick={() => setActiveTab('exerciseView')}>
                <span className="today-exercise-label">오늘의 운동</span>
                <ExternalLink size={16} className="today-exercise-arrow" />
              </div>
              <div className="today-exercise-category" onClick={() => setActiveTab('exerciseView')} style={{ cursor: 'pointer' }}>
                <Dumbbell size={20} className="today-exercise-category-icon" />
                <div className="today-exercise-category-info">
                  <p className="today-exercise-category-title">{todayExercise.category}</p>
                  <p className="today-exercise-category-meta">
                    <Clock size={12} />
                    {todayExercise.totalMinutes}분 • {todayExercise.exercises.length}개 운동
                  </p>
                </div>
              </div>
              <ul className="today-exercise-list">
                {todayExercise.exercises.map((exercise) => {
                  const exerciseKey = `${getTodayDayName()}-${exercise.id}`;
                  const isCompleted = completedExercises[exerciseKey];
                  return (
                    <li
                      key={exercise.id}
                      className={`today-exercise-item ${isCompleted ? 'completed' : ''}`}
                      onClick={() => handleToggleExercise(exerciseKey)}
                    >
                      <button
                        className="today-exercise-item-check"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExercise(exerciseKey);
                        }}
                      >
                        {isCompleted ? (
                          <Check size={16} />
                        ) : (
                          <div className="today-exercise-item-check-empty" />
                        )}
                      </button>
                      <div className="today-exercise-item-info">
                        <p className="today-exercise-item-name">{exercise.name}</p>
                        <p className="today-exercise-item-detail">
                          {exercise.sets}세트 × {exercise.reps}회 • 휴식 {exercise.restSeconds}초
                        </p>
                      </div>
                      <ExternalLink
                        size={16}
                        className="today-exercise-item-arrow"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExerciseId(exercise.id);
                          setActiveTab('exercise');
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : savedExercisePlan ? (
            <div className="today-exercise-card rest-day" onClick={() => setActiveTab('exerciseView')}>
              <div className="today-exercise-header">
                <span className="today-exercise-label">오늘의 운동</span>
                <ExternalLink size={16} className="today-exercise-arrow" />
              </div>
              <div className="today-exercise-rest">
                <Dumbbell size={32} className="today-exercise-rest-icon" />
                <div className="today-exercise-rest-info">
                  <p className="today-exercise-rest-title">휴식일</p>
                  <p className="today-exercise-rest-text">오늘은 쉬는 날이에요</p>
                </div>
              </div>
            </div>
          ) : (
            <button className="plan-card" onClick={() => setSubPage('exercisePlan')}>
              <div className="plan-card-content">
                <Dumbbell className="plan-card-icon workout" />
                <p className="plan-card-title">운동 계획 생성</p>
              </div>
            </button>
          )}

          {/* 식단 카드 - 끼니별 그룹화 적용 */}
          {savedDietPlan && todayDiet ? (
            <div className="today-diet-card">
              <div className="today-diet-header" onClick={() => {
                setSelectedMealType('breakfast');
                setActiveTab('dietView');
              }}>
                <span className="today-diet-label">오늘의 식단</span>
                <ExternalLink size={16} className="today-diet-arrow" />
              </div>
              <div className="today-diet-category" onClick={() => { setSelectedMealType('breakfast'); setActiveTab('dietView'); }} style={{ cursor: 'pointer' }}>
                <Utensils size={20} className="today-diet-category-icon" />
                <div className="today-diet-category-info">
                  <p className="today-diet-category-title">{todayDiet.totalCalories}kcal</p>
                  <p className="today-diet-category-meta">
                    {todayDiet.meals.length}개 메뉴
                  </p>
                </div>
              </div>
              {/* 끼니별 그룹화된 리스트 */}
              <ul className="today-diet-list">
                {groupMealsByType(todayDiet.meals).map((group) => {
                  /**
                   * 해당 끼니의 모든 메뉴가 완료되었는지 확인
                   */
                  const allCompleted = group.meals.every(
                    (meal) => completedMeals[`${getTodayDayName()}-${meal.id}`]
                  );

                  /**
                   * 메뉴명 전체 나열 (CSS로 말줄임 처리)
                   */
                  const menuNames = group.meals.map((m) => m.menu).join(', ');

                  return (
                    <li
                      key={group.type}
                      className={`today-diet-item ${allCompleted ? 'completed' : ''}`}
                      onClick={() => {
                        const newCompletedState = !allCompleted;
                        setCompletedMeals((prev) => {
                          const updated = { ...prev };
                          group.meals.forEach((meal) => {
                            const mealKey = `${getTodayDayName()}-${meal.id}`;
                            updated[mealKey] = newCompletedState;
                          });
                          return updated;
                        });
                      }}
                    >
                      <button
                        className="today-diet-item-check"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newCompletedState = !allCompleted;
                          setCompletedMeals((prev) => {
                            const updated = { ...prev };
                            group.meals.forEach((meal) => {
                              const mealKey = `${getTodayDayName()}-${meal.id}`;
                              updated[mealKey] = newCompletedState;
                            });
                            return updated;
                          });
                        }}
                      >
                        {allCompleted ? (
                          <Check size={16} />
                        ) : (
                          <div className="today-diet-item-check-empty" />
                        )}
                      </button>
                      <div className="today-diet-item-info">
                        <p className="today-diet-item-name">{menuNames}</p>
                        <p className="today-diet-item-detail">
                          {group.typeLabel} • {group.totalCalories}kcal
                        </p>
                      </div>
                      <ExternalLink
                        size={16}
                        className="today-diet-item-arrow"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMealType(group.type as MealType);
                          setActiveTab('dietView');
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : savedDietPlan ? (
            <div className="today-diet-card rest-day" onClick={() => {
              setSelectedMealType('breakfast');
              setActiveTab('dietView');
            }}>
              <div className="today-diet-header">
                <span className="today-diet-label">오늘의 식단</span>
                <ExternalLink size={16} className="today-diet-arrow" />
              </div>
              <div className="today-diet-rest">
                <Utensils size={32} className="today-diet-rest-icon" />
                <div className="today-diet-rest-info">
                  <p className="today-diet-rest-title">식단 없음</p>
                  <p className="today-diet-rest-text">오늘은 등록된 식단이 없어요</p>
                </div>
              </div>
            </div>
          ) : (
            <button className="plan-card" onClick={() => setSubPage('dietPlan')}>
              <div className="plan-card-content">
                <Utensils className="plan-card-icon diet" />
                <p className="plan-card-title">식단 계획 생성</p>
              </div>
            </button>
          )}
        </div>

        {/* 화상회의 예약 확인 바 */}
        <div className="video-call-bar"
          onClick={() => handleNavigateToPT('my-reservation')}
        >
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
          onNavigateToMonth={() => setActiveTab('calendar')}
          onNavigateToWorkout={() => setActiveTab('exerciseView')}
          onNavigateToDiet={() => setActiveTab('dietView')}
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
        return savedExercisePlan ? (
          <PlanExerciseViewPage
            onBack={() => setActiveTab('home')}
            planData={savedExercisePlan}
            completedExercises={completedExercises}
            onToggleExercise={handleToggleExercise}
            onExerciseClick={(id) => {
              setSelectedExerciseId(id);
              setActiveTab('exercise');
            }}
            onRegenerate={(feedback) => {
              console.log('운동 재생성 요청:', feedback);
              setSubPage('exercisePlan');
            }}
          />
        ) : null;
      case 'diet':
        return (
          <DietPage
            initialFoodId={selectedFoodId}
            onFoodSelect={(id) => setSelectedFoodId(id)}
          />
        );
      case 'dietView':
        return savedDietPlan ? (
          <PlanDietViewPage
            onBack={() => setActiveTab('home')}
            planData={savedDietPlan}
            completedMeals={completedMeals}
            onToggleMeal={handleToggleMeal}
            onFoodClick={(id) => {
              setSelectedFoodId(id);
              setActiveTab('diet');
            }}
            onRegenerate={(feedback) => {
              console.log('식단 재생성 요청:', feedback);
              setSubPage('dietPlan');
            }}
            initialMealType={selectedMealType}
          />
        ) : null;
      case 'pt':
        return <VideoPTPage initialFilter={videoPTFilter} />;
      case 'board':
        return <BoardPage currentUserId={currentUserId} />;
      case 'calendar':
        return (
          <CalendarPage
            onNavigateBack={() => setActiveTab('home')}
            onNavigateToWorkout={() => setActiveTab('exerciseView')}
            onNavigateToDiet={() => setActiveTab('dietView')}
            onNavigateToPT={() => handleNavigateToPT('my-reservation')}
          />
        );
      default:
        return renderHomeContent();
    }
  };

  if (showMyPage) {
    return (
      <MyPage
        onBack={() => setShowMyPage(false)}
        onLogout={onLogout}
        onEditOnboarding={onEditOnboarding}
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
            <User className="app-profile-icon" />
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