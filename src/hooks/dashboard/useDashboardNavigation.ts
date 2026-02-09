/**
 * useDashboardNavigation.ts
 * 대시보드 탭/서브페이지 네비게이션 관련 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * 탭 타입 정의
 */
export type TabType = 'home' | 'exercise' | 'diet' | 'pt' | 'board' | 'exerciseView' | 'dietView' | 'calendar' | 'calendarStats';

/**
 * 서브페이지 타입 정의
 */
export type SubPageType = 'none' | 'exercisePlan' | 'dietPlan';

/**
 * 반환 타입 인터페이스
 */
interface UseDashboardNavigationReturn {
  /* 상태 */
  activeTab: TabType;
  subPage: SubPageType;
  showMyPage: boolean;
  videoPTFilter: string | null;
  selectedExerciseId: number | null;
  selectedFoodId: number | null;
  viewPageInitialDate: string | undefined;
  selectedMealIndex: number;

  /* 액션 */
  setActiveTab: (tab: TabType) => void;
  setSubPage: (page: SubPageType) => void;
  setShowMyPage: (show: boolean) => void;
  setVideoPTFilter: (filter: string | null) => void;
  setSelectedExerciseId: (id: number | null) => void;
  setSelectedFoodId: (id: number | null) => void;
  setViewPageInitialDate: (date: string | undefined) => void;
  setSelectedMealIndex: (index: number) => void;
  handleNavigateToPT: (filter?: string) => void;
  getHeaderTitle: () => string;
}

/**
 * Props 타입
 */
interface UseDashboardNavigationProps {
  initialShowMyPage?: boolean;
  onMyPageShown?: () => void;
}

/**
 * 대시보드 네비게이션 훅
 */
export function useDashboardNavigation({
  initialShowMyPage = false,
  onMyPageShown,
}: UseDashboardNavigationProps = {}): UseDashboardNavigationReturn {
  /** 상태 */
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [subPage, setSubPage] = useState<SubPageType>('none');
  const [showMyPage, setShowMyPage] = useState(false);
  const [videoPTFilter, setVideoPTFilter] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);
  const [viewPageInitialDate, setViewPageInitialDate] = useState<string | undefined>(undefined);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(0);

  /** 마이페이지 초기 표시 처리 */
  useEffect(() => {
    if (initialShowMyPage) {
      setShowMyPage(true);
      onMyPageShown?.();
    }
  }, [initialShowMyPage, onMyPageShown]);

  /** 화상PT 페이지 이동 핸들러 */
  const handleNavigateToPT = useCallback((filter?: string) => {
    if (filter) {
      setVideoPTFilter(filter);
    }
    setActiveTab('pt');
  }, []);

  /** 탭별 헤더 타이틀 */
  const getHeaderTitle = useCallback((): string => {
    switch (activeTab) {
      case 'home': return '루틴어때?';
      case 'exercise': return '운동';
      case 'exerciseView': return '주간운동';
      case 'diet': return '식단';
      case 'dietView': return '주간식단';
      case 'pt': return '화상PT';
      case 'board': return '게시판';
      case 'calendar': return '캘린더';
      case 'calendarStats': return '월간 통계';
      default: return '루틴어때?';
    }
  }, [activeTab]);

  return {
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
    setVideoPTFilter,
    setSelectedExerciseId,
    setSelectedFoodId,
    setViewPageInitialDate,
    setSelectedMealIndex,
    handleNavigateToPT,
    getHeaderTitle,
  };
}
