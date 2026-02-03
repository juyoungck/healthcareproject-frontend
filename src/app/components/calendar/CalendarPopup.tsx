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
import { formatDateShort, getDateKey } from '../../../utils/calendar';
import { getDailyDetail } from '../../../api/calendar';
import { getMemo, putMemo } from '../../../api/memo';
import { DailyDetailResponse } from '../../../api/types/calendar';
import { WorkoutDietStatus } from '../../../api/types/calendar';

/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */
interface CalendarPopupProps {
  /** 선택된 날짜 */
  date: Date;
  /** 팝업 닫기 핸들러 */
  onClose: () => void;
  /** 운동 상세 페이지 이동 핸들러 (날짜 전달) */
  onNavigateToWorkout?: (dateStr: string) => void;
  /** 식단 상세 페이지 이동 핸들러 (날짜 전달) */
  onNavigateToDiet?: (dateStr: string) => void;
  /** 화상PT 상세 페이지 이동 핸들러 */
  onNavigateToPT?: () => void;
  /** 메모 저장 성공 콜백 (마커 업데이트용) */
  onMemoSaved?: (dateKey: string, hasContent: boolean) => void;
  /** 운동 상태값 */
  workoutStatus?: WorkoutDietStatus;
  /** 식단 상태값 */
  dietStatus?: WorkoutDietStatus;
}

/**
 * ===========================================
 * CalendarPopup 컴포넌트
 * ===========================================
 */

export default function CalendarPopup({
  date,
  onClose,
  onNavigateToWorkout,
  onNavigateToDiet,
  onNavigateToPT,
  onMemoSaved,
  workoutStatus,
  dietStatus,
}: CalendarPopupProps) {

  /**
   * ===========================================
   * 파생 데이터
   * ===========================================
   */

  /** 날짜 키 (YYYY-MM-DD) - useEffect 의존성용 */
  const dateKey = getDateKey(date);
  /**
   * 상태값 → 텍스트 + CSS 클래스 변환
   */
  const getStatusInfo = (status: WorkoutDietStatus | undefined): { text: string; className: string } | null => {
    if (!status || status === 'NONE') return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateKey);
    targetDate.setHours(0, 0, 0, 0);

    /* 미래 날짜 + FAILED = 예정 */
    if (status === 'FAILED' && targetDate > today) {
      return { text: '예정', className: 'scheduled' };
    }

    const statusMap: Record<string, { text: string; className: string }> = {
      COMPLETE: { text: '완료', className: 'complete' },
      INCOMPLETE: { text: '미흡', className: 'incomplete' },
      FAILED: { text: '안함', className: 'failed' },
    };

    return statusMap[status] || null;
  };

  const workoutStatusInfo = getStatusInfo(workoutStatus);
  const dietStatusInfo = getStatusInfo(dietStatus);

  /**
   * ===========================================
   * 상태 관리
   * ===========================================
   */

  /** 일일 상세 데이터 */
  const [dailyDetail, setDailyDetail] = useState<DailyDetailResponse | null>(null);

  /** 메모 텍스트 상태 */
  const [memoText, setMemoText] = useState('');

  /** 초기 메모 텍스트 (변경 여부 비교용) */
  const [initialMemoText, setInitialMemoText] = useState('');

  /** 데이터 로딩 상태 */
  const [isLoading, setIsLoading] = useState(true);

  /** 메모 저장 중 상태 */
  const [isSaving, setIsSaving] = useState(false);

  /** 에러 메시지 */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * ===========================================
   * 이펙트
   * ===========================================
   */

  /**
   * 팝업 열릴 때 일일 상세 + 메모 조회
   */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        /* 일일 상세 조회 */
        const detailResponse = await getDailyDetail(dateKey);
        setDailyDetail(detailResponse);

        /* 메모 내용 설정 */
        const content = detailResponse.memo?.content || '';
        setMemoText(content);
        setInitialMemoText(content);
      } catch (error) {
        /* 데이터가 없는 경우도 정상 처리 */
        setDailyDetail(null);
        setMemoText('');
        setInitialMemoText('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateKey]);

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
    if (onNavigateToWorkout && dailyDetail?.workout?.exists) {
      onNavigateToWorkout(dateKey);
    }
  };

  /**
   * 식단 항목 클릭
   */
  const handleDietClick = () => {
    if (onNavigateToDiet && dailyDetail?.diet?.exists) {
      onNavigateToDiet(dateKey);
    }
  };

  /**
   * 화상PT 항목 클릭
   */
  const handlePTClick = () => {
    if (onNavigateToPT && dailyDetail?.videoPt?.exists) {
      onNavigateToPT();
    }
  };

  /**
   * 메모 저장 (API 호출)
   */
  const handleSaveMemo = async () => {
    const trimmedText = memoText.trim();

    /* 변경사항 없으면 그냥 닫기 */
    if (trimmedText === initialMemoText) {
      onClose();
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await putMemo(dateKey, trimmedText);

      /* 마커 업데이트 콜백 호출 */
      if (onMemoSaved) {
        onMemoSaved(dateKey, trimmedText.length > 0);
      }

      onClose();
    } catch (error) {
      setErrorMessage('메모 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
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
          {isLoading ? (
            <div className="calendar-popup-loading">불러오는 중...</div>
          ) : (
            <>
              {/* 운동 */}
              <button
                className="calendar-popup-item"
                onClick={handleWorkoutClick}
                disabled={!dailyDetail?.workout?.exists}
              >
                <div className="calendar-popup-item-header">
                  <span className="calendar-popup-item-title workout">운동</span>
                  {workoutStatusInfo && (
                    <span className={`calendar-popup-item-status workout ${workoutStatusInfo.className}`}>
                      {workoutStatusInfo.text}
                    </span>
                  )}
                </div>
                {dailyDetail?.workout?.exists ? (
                  <div className="calendar-popup-item-body">
                    <div className="calendar-popup-item-row">
                      <span>{dailyDetail.workout.summary}</span>
                    </div>
                    {dailyDetail.workout.itemsPreview && (
                      <div className="calendar-popup-item-detail">
                        {dailyDetail.workout.itemsPreview.join(', ')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="calendar-popup-item-empty">기록 없음</div>
                )}
              </button>

              {/* 식단 */}
              <button
                className="calendar-popup-item"
                onClick={handleDietClick}
                disabled={!dailyDetail?.diet?.exists}
              >
                <div className="calendar-popup-item-header">
                  <span className="calendar-popup-item-title diet">식단</span>
                  {dietStatusInfo && (
                    <span className={`calendar-popup-item-status diet ${dietStatusInfo.className}`}>
                      {dietStatusInfo.text}
                    </span>
                  )}
                </div>
                {dailyDetail?.diet?.exists ? (
                  <div className="calendar-popup-item-body">
                    <div className="calendar-popup-item-row">
                      <span>{dailyDetail.diet.summary}</span>
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
                disabled={!dailyDetail?.videoPt?.exists}
              >
                <div className="calendar-popup-item-header">
                  <span className="calendar-popup-item-title pt">화상PT</span>
                </div>
                {dailyDetail?.videoPt?.exists ? (
                  <div className="calendar-popup-item-body">
                    <div className="calendar-popup-item-row">
                      <span>{dailyDetail.videoPt.summary}</span>
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
                    disabled={isSaving}
                  />
                  {errorMessage && (
                    <div className="calendar-popup-memo-error">{errorMessage}</div>
                  )}
                  <button
                    className="calendar-popup-memo-save"
                    onClick={handleSaveMemo}
                    disabled={isSaving}
                  >
                    {isSaving ? '저장 중...' : '저장'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}