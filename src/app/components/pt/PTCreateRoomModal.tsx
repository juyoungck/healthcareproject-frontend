/**
 * PTCreateRoomModal.tsx
 * 화상PT 방 생성 모달 컴포넌트
 * 트레이너만 사용 가능 (PT-004 ~ PT-007)
 */

import { useState } from 'react';
import { 
  X, 
  Video, 
  Calendar, 
  Lock,
  Minus,
  Plus,
} from 'lucide-react';
import type { CreatePTRoomRequest, CreatePTRoomResponse } from '../../../api/types/pt';
import {
  PT_ROOM_TITLE_MAX_LENGTH,
  PT_ROOM_DESCRIPTION_MAX_LENGTH,
  PT_MAX_PARTICIPANTS,
  PT_MIN_PARTICIPANTS,
} from '../../../constants/validation';

/**
 * 방 유형
 */
type RoomType = 'LIVE' | 'RESERVED';

/**
 * Props 타입 정의
 */
interface PTCreateRoomModalProps {
  onClose: () => void;
  onCreate: (roomData: CreateRoomData) => Promise<void>;
  isLoading?: boolean;
}

/**
 * 방 생성 데이터 타입
 */
export interface CreateRoomData {
  roomType: RoomType;
  title: string;
  description?: string;
  scheduledAt?: string | null;
  maxParticipants?: number | null;
  isPrivate: boolean;
}

/**
 * PTCreateRoomModal 컴포넌트
 */
export default function PTCreateRoomModal({ 
  onClose, 
  onCreate,
  isLoading = false
}: PTCreateRoomModalProps) {
  /**
   * 오늘 날짜 및 분 (최소 선택 날짜/분)
   */
  const getDefaultDateTime = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 5) * 5;
    
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);
    
    if (roundedMinutes === 60) {
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
    }
    
    /* 로컬 시간 기준으로 날짜/시간 포맷 */
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    
    const date = `${year}-${month}-${day}`;
    const time = `${hours}:${mins}`;
    
    return { date, time };
  };

  /**
   * 폼 상태 관리
   */
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roomType, setRoomType] = useState<RoomType>('LIVE');
  const [maxParticipants, setMaxParticipants] = useState(PT_MAX_PARTICIPANTS);
  const [isPrivate, setIsPrivate] = useState(false);
  
  /**
   * 상태 관리
   */
  const [error, setError] = useState('');

  /**
   * 시간 관리
   */
  const defaultDateTime = getDefaultDateTime();
  const [scheduledDate, setScheduledDate] = useState(defaultDateTime.date);
  const [scheduledTime, setScheduledTime] = useState(defaultDateTime.time);
  
  /**
   * 모달 외부 클릭 핸들러
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 인원 증가
   */
  const increaseParticipants = () => {
    if (maxParticipants < PT_MAX_PARTICIPANTS) {
      setMaxParticipants(prev => prev + 1);
    }
  };

  /**
   * 인원 감소
   */
  const decreaseParticipants = () => {
    if (maxParticipants > PT_MIN_PARTICIPANTS) {
      setMaxParticipants(prev => prev - 1);
    }
  };

  /**
   * 비공개 토글
   */
  const handlePrivateToggle = () => {
    setIsPrivate(!isPrivate);
  };

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    /* 유효성 검증 */
    if (!title.trim()) {
      setError('방 제목을 입력해주세요.');
      return;
    }

    if (roomType === 'RESERVED') {
      if (!scheduledDate) {
        setError('예약 날짜를 선택해주세요.');
        return;
      }
      if (!scheduledTime) {
        setError('예약 시간을 선택해주세요.');
        return;
      }
    }

    /* 방 생성 데이터 전달 */
    const scheduledAt = roomType === 'RESERVED' && scheduledDate && scheduledTime
      ? new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString()
      : null;   

    await onCreate({
      roomType,
      title: title.trim(),
      description: description.trim() || undefined,
      scheduledAt,
      maxParticipants: maxParticipants || null,
      isPrivate,
    });
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container modal-container-large">
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h2 className="modal-title">화상PT 방 만들기</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 방 생성 폼 */}
        <form className="pt-create-form" onSubmit={handleSubmit}>
          {/* 방 유형 선택 */}
          <div className="form-group">
            <label className="form-label">방 유형</label>
            <div className="pt-room-type-selector">
              <button
                type="button"
                className={`pt-room-type-btn ${roomType === 'LIVE' ? 'active' : ''}`}
                onClick={() => setRoomType('LIVE')}
              >
                <Video className="pt-room-type-icon" />
                <span className="pt-room-type-label">실시간</span>
              </button>
              <button
                type="button"
                className={`pt-room-type-btn ${roomType === 'RESERVED' ? 'active' : ''}`}
                onClick={() => setRoomType('RESERVED')}
              >
                <Calendar className="pt-room-type-icon" />
                <span className="pt-room-type-label">예약</span>
              </button>
            </div>
          </div>

          {/* 방 제목 */}
          <div className="form-group">
            <label className="form-label" htmlFor="room-title">
              방 제목 *
            </label>
            <input
              id="room-title"
              type="text"
              className="form-input"
              style={{ paddingLeft: 'var(--spacing-md)' }}
              placeholder="예: 초보자를 위한 홈트레이닝"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={PT_ROOM_TITLE_MAX_LENGTH}
            />
          </div>

          {/* 방 설명 */}
          <div className="form-group">
            <label className="form-label" htmlFor="room-description">
              설명
            </label>
            <textarea
              id="room-description"
              className="form-input"
              style={{ 
                paddingLeft: 'var(--spacing-md)',
                minHeight: '80px',
                resize: 'vertical'
              }}
              placeholder="운동 내용이나 준비물 등을 설명해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={PT_ROOM_DESCRIPTION_MAX_LENGTH}
            />
          </div>

          {/* 예약 일시 (예약 방인 경우) */}
          {roomType === 'RESERVED' && (
            <div className="form-group">
              <label className="form-label">예약 일시 *</label>
              <div className="pt-datetime-group">
                <input
                  type="date"
                  className="pt-datetime-input"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  onKeyDown={(e) => e.preventDefault()}
                  min={defaultDateTime.date}
                />
                <input
                  type="time"
                  className="pt-datetime-input"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  onKeyDown={(e) => e.preventDefault()}
                  min={scheduledDate === defaultDateTime.date ? defaultDateTime.time : undefined}
                />
              </div>
            </div>
          )}

          {/* 최대 인원 */}
          <div className="form-group">
            <label className="form-label">최대 참여 인원 (트레이너 포함)</label>
            <div className="pt-capacity-selector">
              <button
                type="button"
                className="pt-capacity-btn"
                onClick={decreaseParticipants}
                disabled={maxParticipants <= PT_MIN_PARTICIPANTS}
              >
                <Minus size={18} />
              </button>
              <span className="pt-capacity-value">{maxParticipants}명</span>
              <button
                type="button"
                className="pt-capacity-btn"
                onClick={increaseParticipants}
                disabled={maxParticipants >= PT_MAX_PARTICIPANTS}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* 공개/비공개 설정 */}
          <div className="pt-toggle-group">
            <div className="pt-toggle-label">
              <span className="pt-toggle-title">
                <Lock size={16} style={{ display: 'inline', marginRight: '4px' }} />
                비공개 방
              </span>
              <span className="pt-toggle-desc">
                입장 코드가 있어야만 참여할 수 있습니다
              </span>
            </div>
            <button
              type="button"
              className={`pt-toggle-switch ${isPrivate ? 'active' : ''}`}
              onClick={handlePrivateToggle}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="form-error">{error}</p>
          )}

          {/* 생성 버튼 */}
          <button type="submit" className="form-submit-btn" disabled={isLoading}>
            {isLoading 
              ? '생성 중...' 
              : roomType === 'LIVE' ? '방 만들고 시작하기' : '예약 방 만들기'
            }
          </button>
        </form>
      </div>
    </div>
  );
}
