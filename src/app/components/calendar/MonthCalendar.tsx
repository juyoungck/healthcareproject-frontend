/**
 * MonthCalendar.tsx
 * 월간 캘린더 컴포넌트
 * - 월 단위 달력 표시
 * - 운동/식단/화상PT/메모 마커 표시
 * - 날짜 클릭 시 상세 팝업 열기
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, BarChart2 } from 'lucide-react';
import { DailyStatus } from './WeekCalendar';
import WeekCalendarPopup from './WeekCalendarPopup';
import { calendarDummyData, getDateKey } from '../../../data/calendardata';

/**
 * 요일 데이터
 */
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * Props 타입 정의
 */
interface MonthCalendarProps {
    onNavigateBack?: () => void;
    onNavigateToWorkout?: () => void;
    onNavigateToDiet?: () => void;
    onNavigateToPT?: () => void;
}

/**
 * MonthCalendar 컴포넌트
 */
export default function MonthCalendar({
    onNavigateBack,
    onNavigateToWorkout,
    onNavigateToDiet,
    onNavigateToPT,
}: MonthCalendarProps) {
    /**
     * 현재 표시 중인 년/월
     */
    const [currentDate, setCurrentDate] = useState(new Date());

    /**
     * 선택된 날짜 (팝업용)
     */
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    /**
     * 캘린더 데이터 상태 (메모 저장용)
     */
    const [localCalendarData, setLocalCalendarData] = useState(calendarDummyData);

    /**
     * 오늘 날짜
     */
    const today = new Date();

    /**
     * 이전 달로 이동
     */
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    /**
     * 다음 달로 이동
     */
    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    /**
     * 날짜 클릭 핸들러
     */
    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    /**
     * 팝업 닫기 핸들러
     */
    const handleClosePopup = () => {
        setSelectedDate(null);
    };

    /**
     * 메모 저장 핸들러
     */
    const handleSaveMemo = (dateKey: string, memoText: string) => {
        setLocalCalendarData(prev => ({
        ...prev,
        [dateKey]: {
            ...prev[dateKey],
            status: {
            ...(prev[dateKey]?.status || { workout: 'none', diet: 'none', pt: 'none', memo: 'none' }),
            memo: memoText.trim() ? 'complete' : 'none',
            },
            memo: memoText.trim() || undefined,
        },
        }));
    };

    /**
     * 해당 월의 달력 데이터 생성
     */
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // 해당 월의 첫째 날과 마지막 날
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // 달력 시작 요일 (일요일 = 0)
        const startDayOfWeek = firstDay.getDay();

        // 이전 달의 마지막 날
        const prevLastDay = new Date(year, month, 0).getDate();

        const days: { date: Date; isCurrentMonth: boolean }[] = [];

        // 이전 달 날짜 채우기
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevLastDay - i),
                isCurrentMonth: false,
            });
        }

        // 현재 달 날짜 채우기
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true,
            });
        }

        // 다음 달 날짜 채우기 (6주 맞추기)
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false,
            });
        }

        return days;
    };

    /**
     * 날짜를 문자열로 변환 (YYYY-MM-DD)
     */
    const formatDateKey = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    /**
     * 날짜 비교 (년/월/일만)
     */
    const isSameDate = (date1: Date, date2: Date): boolean => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    /**
     * 선택된 날짜의 기록 가져오기
     */
    const getSelectedRecord = () => {
        if (!selectedDate) return null;
        const dateKey = formatDateKey(selectedDate);
        return calendarDummyData[dateKey] || null;
    };

    /**
     * 달력 데이터
     */
    const calendarDays = generateCalendarDays();

    /**
     * 헤더 타이틀
     */
    const headerTitle = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;

    /**
     * 선택된 날짜 기록
     */
    const selectedRecord = getSelectedRecord();

    return (
        <div className="month-calendar-container">
            {/* 캘린더 헤더 */}
            <div className="month-calendar-header">
                {/* 왼쪽: 뒤로가기 */}
                <button className="month-calendar-back-btn" onClick={onNavigateBack}>
                    <ArrowLeft size={20} />
                </button>

                {/* 중앙: 년/월 네비게이션 */}
                <div className="month-calendar-nav">
                    <button className="month-calendar-nav-btn" onClick={handlePrevMonth}>
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="month-calendar-title">{headerTitle}</h2>
                    <button className="month-calendar-nav-btn" onClick={handleNextMonth}>
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* 오른쪽: 통계 아이콘 */}
                <button className="month-calendar-stats-btn">
                    <BarChart2 size={20} />
                </button>
            </div>


            {/* 요일 헤더 */}
            <div className="month-calendar-weekdays">
                {WEEKDAYS.map((day, index) => (
                    <div
                        key={day}
                        className={`month-calendar-weekday ${index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''
                            }`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="month-calendar-grid">
                {calendarDays.map(({ date, isCurrentMonth }, index) => {
                    const dateKey = formatDateKey(date);
                    const record = localCalendarData[dateKey];
                    const status = record?.status;
                    const isToday = isSameDate(date, today);
                    const isSelected = selectedDate && isSameDate(date, selectedDate);
                    const dayOfWeek = date.getDay();

                    return (
                        <button
                            key={index}
                            className={`month-calendar-cell ${!isCurrentMonth ? 'other-month' : ''
                                } ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayOfWeek === 0 ? 'sunday' : dayOfWeek === 6 ? 'saturday' : ''
                                }`}
                            onClick={() => handleDateClick(date)}
                        >
                            {/* 날짜 */}
                            <span className="month-calendar-date">{date.getDate()}</span>

                            {/* 마커 */}
                            {status && (
                                <div className="month-calendar-markers">
                                    <div className={`month-calendar-marker workout ${status.workout}`} />
                                    <div className={`month-calendar-marker diet ${status.diet}`} />
                                    <div className={`month-calendar-marker pt ${status.pt}`} />
                                    <div className={`month-calendar-marker memo ${status.memo}`} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* 범례 */}
            <div className="month-calendar-legend">
                <div className="month-calendar-legend-item">
                    <div className="month-calendar-legend-dot workout complete" />
                    <span className="month-calendar-legend-label">운동</span>
                </div>
                <div className="month-calendar-legend-item">
                    <div className="month-calendar-legend-dot diet complete" />
                    <span className="month-calendar-legend-label">식단</span>
                </div>
                <div className="month-calendar-legend-item">
                    <div className="month-calendar-legend-dot pt complete" />
                    <span className="month-calendar-legend-label">화상PT</span>
                </div>
                <div className="month-calendar-legend-item">
                    <div className="month-calendar-legend-dot memo complete" />
                    <span className="month-calendar-legend-label">메모</span>
                </div>
            </div>

            {
                selectedDate && (
                    <WeekCalendarPopup
                        date={selectedDate}
                        record={localCalendarData[getDateKey(selectedDate)] || {
                            status: { workout: 'none', diet: 'none', pt: 'none', memo: 'none' }
                        }}
                        onClose={handleClosePopup}
                        onNavigateToWorkout={onNavigateToWorkout}
                        onNavigateToDiet={onNavigateToDiet}
                        onNavigateToPT={onNavigateToPT}
                        onSaveMemo={handleSaveMemo}

                    />
                )
            }
        </div >
    );
}