/**
 * WeekCalendarPopup.tsx
 * 주간 캘린더 날짜 클릭 팝업 컴포넌트
 * - 운동/식단/화상PT 요약 정보 표시
 * - 각 항목 클릭 시 상세 페이지로 이동
 * - 상태 텍스트 표시 (완료/미흡/실패/예정/없음)
 */

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { DailyRecord } from '../../../data/calendardata';

/**
 * Props 타입 정의
 */
interface WeekCalendarPopupProps {
  date: Date;
  record: DailyRecord;
  onClose: () => void;
  onNavigateToWorkout?: () => void;
  onNavigateToDiet?: () => void;
  onNavigateToPT?: () => void;
  onSaveMemo?: (dateKey: string, memoText: string) => void;
}

/**
 * 요일 데이터
 */
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 상태 텍스트 변환
 */
const getStatusText = (status: string): string => {
  switch (status) {
    case 'complete':
      return '완료';
    case 'incomplete':
      return '미흡';
    case 'failed':
      return '실패';
    case 'scheduled':
      return '예정';
    case 'none':
    default:
      return '없음';
  }
};
/**
 * 날짜 키 생성
 */
const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * WeekCalendarPopup 컴포넌트
 */
export default function WeekCalendarPopup({
  date,
  record,
  onClose,
  onNavigateToWorkout,
  onNavigateToDiet,
  onNavigateToPT,
  onSaveMemo,
}: WeekCalendarPopupProps) {
  /**
   * 팝업 ref (외부 클릭 감지용)
   */
  const popupRef = useRef<HTMLDivElement>(null);

  /**
   * 메모 상태
   */
  const [memoText, setMemoText] = useState(record.memo || '');

  /**
   * ESC 키로 닫기
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  /**
   * 날짜 포맷팅
   */
  const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = WEEK_DAYS[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  };

  /**
   * 운동 클릭 핸들러
   */
  const handleWorkoutClick = () => {
    if (onNavigateToWorkout && record.status.workout !== 'none') {
      onNavigateToWorkout();
    }
  };

  /**
   * 식단 클릭 핸들러
   */
  const handleDietClick = () => {
    if (onNavigateToDiet && record.status.diet !== 'none') {
      onNavigateToDiet();
    }
  };

  /**
   * 화상PT 클릭 핸들러
   */
  const handlePTClick = () => {
    if (onNavigateToPT && record.status.pt !== 'none') {
      onNavigateToPT();
    }
  };

  return (
    <>
      {/* 오버레이 */}
      <div className="week-calendar-popup-overlay" onClick={onClose} />

      {/* 팝업 */}
      <div className="week-calendar-popup" ref={popupRef}>
        {/* 팝업 헤더 */}
        <div className="week-calendar-popup-header">
          <span className="week-calendar-popup-date">{formatDate(date)}</span>
          <button className="week-calendar-popup-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 팝업 콘텐츠 */}
        <div className="week-calendar-popup-content">
          {/* 운동 */}
          <button
            className="week-calendar-popup-item"
            onClick={handleWorkoutClick}
            disabled={record.status.workout === 'none'}
          >
            <div className="week-calendar-popup-item-header">
              <span className="week-calendar-popup-item-title workout">운동</span>
              <span className={`week-calendar-popup-item-status ${record.status.workout}`}>
                {getStatusText(record.status.workout)}
              </span>
            </div>
            {record.workout ? (
              <div className="week-calendar-popup-item-body">
                <div className="week-calendar-popup-item-row">
                  <span>{record.workout.bodyPart}</span>
                  <span>{record.workout.duration}분</span>
                </div>
                <div className="week-calendar-popup-item-detail">
                  {record.workout.exercises}
                </div>
              </div>
            ) : (
              <div className="week-calendar-popup-item-empty">기록 없음</div>
            )}
          </button>

          {/* 식단 */}
          <button
            className="week-calendar-popup-item"
            onClick={handleDietClick}
            disabled={record.status.diet === 'none'}
          >
            <div className="week-calendar-popup-item-header">
              <span className="week-calendar-popup-item-title diet">식단</span>
              <span className={`week-calendar-popup-item-status ${record.status.diet}`}>
                {getStatusText(record.status.diet)}
              </span>
            </div>
            {record.diet ? (
              <div className="week-calendar-popup-item-body">
                <div className="week-calendar-popup-item-row">
                  <span>{record.diet.mealCount}끼</span>
                  <span>{record.diet.totalCalories.toLocaleString()}kcal</span>
                </div>
              </div>
            ) : (
              <div className="week-calendar-popup-item-empty">기록 없음</div>
            )}
          </button>

          {/* 화상PT */}
          <button
            className="week-calendar-popup-item"
            onClick={handlePTClick}
            disabled={record.status.pt === 'none'}
          >
            <div className="week-calendar-popup-item-header">
              <span className="week-calendar-popup-item-title pt">화상PT</span>
              <span className={`week-calendar-popup-item-status ${record.status.pt}`}>
                {getStatusText(record.status.pt)}
              </span>
            </div>
            {record.pt ? (
              <div className="week-calendar-popup-item-body">
                <div className="week-calendar-popup-item-row">
                  <span>{record.pt.roomTitle}</span>
                  <span>{record.pt.trainerName}</span>
                  <span>{record.pt.duration}분</span>
                </div>
              </div>
            ) : (
              <div className="week-calendar-popup-item-empty">기록 없음</div>
            )}
          </button>

          {/* 메모 */}
          <div className="week-calendar-popup-item memo-section">
            <div className="week-calendar-popup-item-header">
              <span className="week-calendar-popup-item-title memo">📝 메모</span>
            </div>
            <div className="week-calendar-popup-memo-body">
              <textarea
                className="week-calendar-popup-memo-input"
                placeholder="메모를 입력하세요..."
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                rows={3}
              />
              <button
                className="week-calendar-popup-memo-save"
                onClick={() => {
                  if (onSaveMemo) {
                    onSaveMemo(getDateKey(date), memoText);
                  }
                  onClose();
                }}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}