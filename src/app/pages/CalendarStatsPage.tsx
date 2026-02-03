/**
 * CalendarStatsPage.tsx
 * 월간 캘린더 통계 페이지
 * - 운동/식단 달성률 (원형 프로그레스)
 * - 운동/식단 계획 일수, 화상PT 참여수 (텍스트)
 */

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, Dumbbell, Utensils, Video } from 'lucide-react';
import { getWeeklyCalendar } from '../../api/calendar';
import { DayStatusItem } from '../../api/types/calendar';
import { getDateKey } from '../../utils/calendar';

/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface CalendarStatsPageProps {
  /** 뒤로가기 핸들러 */
  onNavigateBack?: () => void;
}

/**
 * ===========================================
 * 원형 프로그레스 컴포넌트
 * ===========================================
 */

interface CircularProgressProps {
  /** 달성률 (0-100) */
  percentage: number;
  /** 프로그레스 색상 */
  color: string;
  /** 라벨 */
  label: string;
  /** 완료 수 */
  completed: number;
  /** 계획 수 */
  planned: number;
}

function CircularProgress({ percentage, color, label, completed, planned }: CircularProgressProps) {
  const radius = 60;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="calendar-stats-progress-item">
      <div className="calendar-stats-progress-circle">
        <svg width={radius * 2} height={radius * 2}>
          {/* 배경 원 */}
          <circle
            stroke="var(--color-gray-200)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* 프로그레스 원 */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        </svg>
        <div className="calendar-stats-progress-text">
          <span className="calendar-stats-progress-percentage">{percentage}%</span>
        </div>
      </div>
      <div className="calendar-stats-progress-info">
        <span className="calendar-stats-progress-label">{label}</span>
        <span className="calendar-stats-progress-detail">
          {completed} / {planned}일 달성
        </span>
      </div>
    </div>
  );
}

/**
 * ===========================================
 * CalendarStatsPage 컴포넌트
 * ===========================================
 */

export default function CalendarStatsPage({ onNavigateBack }: CalendarStatsPageProps) {
  /**
   * ===========================================
   * 상태 관리
   * ===========================================
   */

  /** 현재 표시 중인 년/월 */
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  /** 캘린더 상태 데이터 (API 응답) */
  const [calendarStatus, setCalendarStatus] = useState<Record<string, DayStatusItem>>({});

  /** 로딩 상태 */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * ===========================================
   * 파생 데이터
   * ===========================================
   */

  /** 헤더 타이틀 (예: "2025년 1월") */
  const headerTitle = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;

  /**
   * ===========================================
   * 월간 통계 계산
   * ===========================================
   */
  const monthlyStats = useMemo(() => {
    const days = Object.values(calendarStatus);

    /* 운동 통계 */
    const workoutPlanned = days.filter(
      (d) => d.workout?.status && d.workout.status !== 'NONE'
    ).length;
    const workoutComplete = days.filter(
      (d) => d.workout?.status === 'COMPLETE'
    ).length;
    const workoutRate = workoutPlanned > 0 ? Math.round((workoutComplete / workoutPlanned) * 100) : 0;

    /* 식단 통계 */
    const dietPlanned = days.filter(
      (d) => d.diet?.status && d.diet.status !== 'NONE'
    ).length;
    const dietComplete = days.filter(
      (d) => d.diet?.status === 'COMPLETE'
    ).length;
    const dietRate = dietPlanned > 0 ? Math.round((dietComplete / dietPlanned) * 100) : 0;

    /* 화상PT 참여수 */
    const ptCount = days.filter(
      (d) => d.videoPt?.status === 'HAS_RESERVATION'
    ).length;

    return {
      workoutPlanned,
      workoutComplete,
      workoutRate,
      dietPlanned,
      dietComplete,
      dietRate,
      ptCount,
    };
  }, [calendarStatus]);

  /**
   * ===========================================
   * 이펙트
   * ===========================================
   */

  useEffect(() => {
    const fetchCalendarStatus = async () => {
      setIsLoading(true);

      try {
        /* 해당 월의 1일 ~ 말일만 조회 */
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDateKey = getDateKey(firstDay);
        const endDateKey = getDateKey(lastDay);

        const response = await getWeeklyCalendar(startDateKey, endDateKey);

        const statusMap: Record<string, DayStatusItem> = {};
        response.days.forEach((day) => {
          statusMap[day.date] = day;
        });

        setCalendarStatus(statusMap);
      } catch {
        /** 캘린더 상태 조회 실패는 조용히 처리 */
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarStatus();
  }, [currentDate]);

  /**
   * ===========================================
   * 이벤트 핸들러 - 월 이동
   * ===========================================
   */

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  /**
   * ===========================================
   * 렌더링
   * ===========================================
   */

  return (
    <div className="calendar-stats-container">
      {/* 헤더 */}
      <div className="calendar-stats-header">
        {/* 뒤로가기 버튼 */}
        <button className="calendar-stats-back-btn" onClick={onNavigateBack}>
          <ArrowLeft size={20} />
        </button>

        {/* 년/월 네비게이션 */}
        <div className="calendar-stats-nav">
          <button className="calendar-stats-nav-btn" onClick={handlePrevMonth}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="calendar-stats-title">{headerTitle}</h2>
          <button className="calendar-stats-nav-btn" onClick={handleNextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 빈 공간 (레이아웃 균형) */}
        <div style={{ width: '40px' }} />
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="calendar-stats-loading">통계를 불러오는 중...</div>
      ) : (
        <>
          {/* 달성률 섹션 */}
          <section className="calendar-stats-section">
            <h3 className="calendar-stats-section-title">달성률</h3>
            <div className="calendar-stats-progress-grid">
              <CircularProgress
                percentage={monthlyStats.workoutRate}
                color="var(--color-workout)"
                label="운동"
                completed={monthlyStats.workoutComplete}
                planned={monthlyStats.workoutPlanned}
              />
              <CircularProgress
                percentage={monthlyStats.dietRate}
                color="var(--color-diet)"
                label="식단"
                completed={monthlyStats.dietComplete}
                planned={monthlyStats.dietPlanned}
              />
            </div>
          </section>

          {/* 요약 섹션 */}
          <section className="calendar-stats-section">
            <h3 className="calendar-stats-section-title">이번 달 요약</h3>
            <div className="calendar-stats-summary">
              <div className="calendar-stats-summary-item workout">
                <div className="calendar-stats-summary-icon">
                  <Dumbbell size={20} />
                </div>
                <div className="calendar-stats-summary-content">
                  <span className="calendar-stats-summary-label">운동 계획</span>
                  <span className="calendar-stats-summary-value">{monthlyStats.workoutPlanned}일</span>
                </div>
              </div>
              <div className="calendar-stats-summary-item diet">
                <div className="calendar-stats-summary-icon">
                  <Utensils size={20} />
                </div>
                <div className="calendar-stats-summary-content">
                  <span className="calendar-stats-summary-label">식단 계획</span>
                  <span className="calendar-stats-summary-value">{monthlyStats.dietPlanned}일</span>
                </div>
              </div>
              <div className="calendar-stats-summary-item pt">
                <div className="calendar-stats-summary-icon">
                  <Video size={20} />
                </div>
                <div className="calendar-stats-summary-content">
                  <span className="calendar-stats-summary-label">화상PT 참여</span>
                  <span className="calendar-stats-summary-value">{monthlyStats.ptCount}회</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
