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
  Copy,
  Check
} from 'lucide-react';

/**
 * 방 유형
 */
type RoomType = 'instant' | 'scheduled';

/**
 * Props 타입 정의
 */
interface PTCreateRoomModalProps {
  onClose: () => void;
  onCreate: (roomData: CreateRoomData) => void;
}

/**
 * 방 생성 데이터 타입
 */
export interface CreateRoomData {
  title: string;
  description: string;
  roomType: RoomType;
  scheduledDate?: string;
  scheduledTime?: string;
  maxParticipants: number;
  isPrivate: boolean;
}

/**
 * PTCreateRoomModal 컴포넌트
 */
export default function PTCreateRoomModal({ 
  onClose, 
  onCreate 
}: PTCreateRoomModalProps) {
  /**
   * 폼 상태 관리
   */
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roomType, setRoomType] = useState<RoomType>('instant');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(6);
  const [isPrivate, setIsPrivate] = useState(false);
  
  /**
   * 상태 관리
   */
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);

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
    if (maxParticipants < 6) {
      setMaxParticipants(prev => prev + 1);
    }
  };

  /**
   * 인원 감소
   */
  const decreaseParticipants = () => {
    if (maxParticipants > 2) {
      setMaxParticipants(prev => prev - 1);
    }
  };

  /**
   * 비공개 토글 시 입장 코드 생성
   */
  const handlePrivateToggle = () => {
    const newValue = !isPrivate;
    setIsPrivate(newValue);
    
    if (newValue && !generatedCode) {
      /* 랜덤 6자리 코드 생성 */
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setGeneratedCode(code);
    }
  };

  /**
   * 코드 복사
   */
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('코드 복사 실패:', err);
    }
  };

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    /* 유효성 검증 */
    if (!title.trim()) {
      setError('방 제목을 입력해주세요.');
      return;
    }

    if (roomType === 'scheduled') {
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
    onCreate({
      title: title.trim(),
      description: description.trim(),
      roomType,
      scheduledDate: roomType === 'scheduled' ? scheduledDate : undefined,
      scheduledTime: roomType === 'scheduled' ? scheduledTime : undefined,
      maxParticipants,
      isPrivate,
    });
  };

  /**
   * 오늘 날짜 (최소 선택 날짜)
   */
  const today = new Date().toISOString().split('T')[0];

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
                className={`pt-room-type-btn ${roomType === 'instant' ? 'active' : ''}`}
                onClick={() => setRoomType('instant')}
              >
                <Video className="pt-room-type-icon" />
                <span className="pt-room-type-label">실시간</span>
              </button>
              <button
                type="button"
                className={`pt-room-type-btn ${roomType === 'scheduled' ? 'active' : ''}`}
                onClick={() => setRoomType('scheduled')}
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
              maxLength={50}
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
              maxLength={200}
            />
          </div>

          {/* 예약 일시 (예약 방인 경우) */}
          {roomType === 'scheduled' && (
            <div className="form-group">
              <label className="form-label">예약 일시 *</label>
              <div className="pt-datetime-group">
                <input
                  type="date"
                  className="pt-datetime-input"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={today}
                />
                <input
                  type="time"
                  className="pt-datetime-input"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
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
                disabled={maxParticipants <= 2}
              >
                <Minus size={18} />
              </button>
              <span className="pt-capacity-value">{maxParticipants}명</span>
              <button
                type="button"
                className="pt-capacity-btn"
                onClick={increaseParticipants}
                disabled={maxParticipants >= 6}
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

          {/* 생성된 입장 코드 표시 */}
          {isPrivate && generatedCode && (
            <div 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-pt-light)',
                borderRadius: 'var(--border-radius-md)'
              }}
            >
              <div>
                <p style={{ 
                  fontSize: 'var(--font-size-xs)', 
                  color: 'var(--color-gray-600)',
                  marginBottom: '4px'
                }}>
                  입장 코드
                </p>
                <p style={{ 
                  fontSize: 'var(--font-size-xl)', 
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-pt)',
                  letterSpacing: '0.2em'
                }}>
                  {generatedCode}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-pt)',
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-pt)',
                  borderRadius: 'var(--border-radius-sm)',
                  cursor: 'pointer'
                }}
              >
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                {isCopied ? '복사됨' : '복사'}
              </button>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <p className="form-error">{error}</p>
          )}

          {/* 생성 버튼 */}
          <button type="submit" className="form-submit-btn">
            {roomType === 'instant' ? '방 만들고 시작하기' : '예약 방 만들기'}
          </button>
        </form>
      </div>
    </div>
  );
}
