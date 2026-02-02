/**
 * DayDetailModal.tsx
 * 일자 상세 모달 컴포넌트
 * - 월간 캘린더에서 날짜 클릭 시 표시
 * - 운동/식단/화상PT 탭으로 구분
 * - 메모 기능 포함
 */

import { useState } from 'react';
import { X, Dumbbell, Utensils, Video, FileText } from 'lucide-react';
import { DailyStatus } from '../../../api/types/calendar';
import { formatDateKoreanFull } from '../../../utils/format';

/**
 * 탭 타입 정의
 */
type TabType = 'workout' | 'diet' | 'pt';

/**
 * Props 타입 정의
 */
interface DayDetailModalProps {
  date: Date | null;
  status: DailyStatus | null;
  onClose: () => void;
}

/**
 * 탭 데이터
 */
const TABS: { type: TabType; label: string; icon: typeof Dumbbell }[] = [
  { type: 'workout', label: '운동', icon: Dumbbell },
  { type: 'diet', label: '식단', icon: Utensils },
  { type: 'pt', label: '화상PT', icon: Video },
];

/**
 * DayDetailModal 컴포넌트
 */
export default function DayDetailModal({
  date,
  status,
  onClose,
}: DayDetailModalProps) {
  /**
   * 현재 활성 탭
   */
  const [activeTab, setActiveTab] = useState<TabType>('workout');

  /**
   * 메모 내용
   */
  const [memo, setMemo] = useState('');

  /**
   * date가 null이면 렌더링하지 않음
   */
  if (!date) return null;

  /**
   * 모달 외부 클릭 시 닫기
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 메모 저장 핸들러
   * TODO: API 연동 시 실제 저장 로직 추가
   */
  const handleSaveMemo = () => {
    /** TODO: API 연동 시 실제 저장 로직 추가 */
  };

  /**
   * 탭 콘텐츠 렌더링
   */
  const renderTabContent = () => {
    const hasRecord = status && status[activeTab];

    if (!hasRecord) {
      return (
        <div className="day-detail-empty">
          <FileText size={48} className="day-detail-empty-icon" />
          <p className="day-detail-empty-text">기록이 없습니다</p>
        </div>
      );
    }

    // TODO: 실제 기록 데이터 표시
    return (
      <div className="day-detail-record">
        <p>{activeTab === 'workout' && '운동 기록이 있습니다.'}</p>
        <p>{activeTab === 'diet' && '식단 기록이 있습니다.'}</p>
        <p>{activeTab === 'pt' && '화상PT 기록이 있습니다.'}</p>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h2 className="modal-title">{formatDateKoreanFull(date)}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="day-detail-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.type}
              className={`day-detail-tab ${tab.type} ${
                activeTab === tab.type ? 'active' : ''
              }`}
              onClick={() => setActiveTab(tab.type)}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="day-detail-content">
          {renderTabContent()}
        </div>

        {/* 메모 영역 */}
        <div className="day-detail-memo">
          <label className="day-detail-memo-label">메모</label>
          <textarea
            className="day-detail-memo-input"
            placeholder="메모를 입력하세요..."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
          <button
            className="btn btn-primary day-detail-memo-save"
            onClick={handleSaveMemo}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}