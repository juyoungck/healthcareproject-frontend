/**
 * CalendarPopup.tsx
 * 캘린더 날짜 클릭 팝업 컴포넌트
 * - 운동/식단/화상PT 요약 정보 표시
 * - 각 항목 클릭 시 상세 페이지로 이동
 * - 메모 입력/저장 기능
 * - 상태 표시 (완료/미흡/실패/예정/없음)
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DailyRecord } from '../../../types/calendar';
import { formatDateShort, getDateKey, getStatusText } from '../../../utils/calendar';

/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface CalendarPopupProps {
  /** 선택된 날짜 */
  date: Date;
  /** 해당 날짜의 기록 */
  record: DailyRecord;
  /** 팝업 닫기 핸들러 */
  onClose: () => void;
  /** 운동 상세 페이지 이동 핸들러 */
  onNavigateToWorkout?: () => void;
  /** 식단 상세 페이지 이동 핸들러 */
  onNavigateToDiet?: () => void;
  /** 화상PT 상세 페이지 이동 핸들러 */
  onNavigateToPT?: () => void;
  /** 메모 저장 핸들러 */
  onSaveMemo?: (dateKey: string, memoText: string) => void;
}

/**
 * ===========================================
 * CalendarPopup 컴포넌트
 * ===========================================
 */

export default function CalendarPopup({
  date,
  record,
  onClose,
  onNavigateToWorkout,
  onNavigateToDiet,
  onNavigateToPT,
  onSaveMemo,
}: CalendarPopupProps) {
  /**
   * ===========================================
   * 상태 관리
   * ===========================================
   */

  /** 메모 텍스트 상태 */
  const [memoText, setMemoText] = useState(record.memo || '');

  /**
   * ===========================================
   * 이펙트
   * ===========================================
   */

  /**
   * ESC 키로 팝업 닫기
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
   * ===========================================
   * 이벤트 핸들러
   * ===========================================
   */

  /**
   * 운동 항목 클릭
   */
  const handleWorkoutClick = () => {
    if (onNavigateToWorkout && record.status.workout !== 'none') {
      onNavigateToWorkout();
    }
  };

  /**
   * 식단 항목 클릭
   */
  const handleDietClick = () => {
    if (onNavigateToDiet && record.status.diet !== 'none') {
      onNavigateToDiet();
    }
  };

  /**
   * 화상PT 항목 클릭
   */
  const handlePTClick = () => {
    if (onNavigateToPT && record.status.pt !== 'none') {
      onNavigateToPT();
    }
  };

  /**
   * 메모 저장 및 팝업 닫기
   */
  const handleSaveMemo = () => {
    if (onSaveMemo) {
      onSaveMemo(getDateKey(date), memoText);
    }
    onClose();
  };

  /**
   * ===========================================
   * 렌더링
   * ===========================================
   */

  return (
    <>
      {/* 오버레이 */}
      <div className="calendar-popup-overlay" onClick={onClose} />

      {/* 팝업 */}
      <div className="calendar-popup">
        {/* 헤더 */}
        <div className="calendar-popup-header">
          <span className="calendar-popup-date">{formatDateShort(date)}</span>
          <button className="calendar-popup-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="calendar-popup-content">
          {/* 운동 */}
          <button
            className="calendar-popup-item"
            onClick={handleWorkoutClick}
            disabled={record.status.workout === 'none'}
          >
            <div className="calendar-popup-item-header">
              <span className="calendar-popup-item-title workout">운동</span>
              <span className={`calendar-popup-item-status ${record.status.workout}`}>
                {getStatusText(record.status.workout)}
              </span>
            </div>
            {record.workout ? (
              <div className="calendar-popup-item-body">
                <div className="calendar-popup-item-row">
                  <span>{record.workout.bodyPart}</span>
                  <span>{record.workout.duration}분</span>
                </div>
                <div className="calendar-popup-item-detail">
                  {record.workout.exercises}
                </div>
              </div>
            ) : (
              <div className="calendar-popup-item-empty">기록 없음</div>
            )}
          </button>

          {/* 식단 */}
          <button
            className="calendar-popup-item"
            onClick={handleDietClick}
            disabled={record.status.diet === 'none'}
          >
            <div className="calendar-popup-item-header">
              <span className="calendar-popup-item-title diet">식단</span>
              <span className={`calendar-popup-item-status ${record.status.diet}`}>
                {getStatusText(record.status.diet)}
              </span>
            </div>
            {record.diet ? (
              <div className="calendar-popup-item-body">
                <div className="calendar-popup-item-row">
                  <span>{record.diet.mealCount}끼</span>
                  <span>{record.diet.totalCalories.toLocaleString()}kcal</span>
                </div>
              </div>
            ) : (
              <div className="calendar-popup-item-empty">기록 없음</div>
            )}
          </button>

          {/* 화상PT */}
          <button
            className="calendar-popup-item"
            onClick={handlePTClick}
            disabled={record.status.pt === 'none'}
          >
            <div className="calendar-popup-item-header">
              <span className="calendar-popup-item-title pt">화상PT</span>
              <span className={`calendar-popup-item-status ${record.status.pt}`}>
                {getStatusText(record.status.pt)}
              </span>
            </div>
            {record.pt ? (
              <div className="calendar-popup-item-body">
                <div className="calendar-popup-item-row">
                  <span>{record.pt.roomTitle}</span>
                  <span>{record.pt.trainerName}</span>
                  <span>{record.pt.duration}분</span>
                </div>
              </div>
            ) : (
              <div className="calendar-popup-item-empty">기록 없음</div>
            )}
          </button>

          {/* 메모 */}
          <div className="calendar-popup-item memo-section">
            <div className="calendar-popup-item-header">
              <span className="calendar-popup-item-title memo">📝 메모</span>
            </div>
            <div className="calendar-popup-memo-body">
              <textarea
                className="calendar-popup-memo-input"
                placeholder="메모를 입력하세요..."
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                rows={3}
              />
              <button
                className="calendar-popup-memo-save"
                onClick={handleSaveMemo}
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