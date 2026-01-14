/**
 * PTRoomDetailModal.tsx
 * 화상PT 방 상세 모달 컴포넌트
 * 방 정보 확인 및 참여/예약 기능
 */

import { useState } from 'react';
import { 
  X, 
  User, 
  Users as UsersIcon,
  KeyRound, 
  Users, 
  Lock, 
  Video,
  Calendar,
  Copy,
  Check
} from 'lucide-react';
import { PTRoom } from './ptDummyData';

/**
 * Props 타입 정의
 */
interface PTRoomDetailModalProps {
  room: PTRoom;
  onClose: () => void;
  onJoin: (room: PTRoom, entryCode?: string) => void;
  onReserve: (room: PTRoom, entryCode?: string) => void;
  onCancelReservation?: (room: PTRoom) => void;
  isReserved?: boolean;
  isTrainer?: boolean;
  isMyRoom?: boolean;
  onStartRoom?: (room: PTRoom) => void;
}

/**
 * 날짜/시간 포맷팅 함수
 */
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? '오후' : '오전';
  const hour12 = hours % 12 || 12;
  
  return `${year}년 ${month}월 ${day}일 ${ampm} ${hour12}:${minutes}`;
};

/**
 * PTRoomDetailModal 컴포넌트
 */
export default function PTRoomDetailModal({ 
  room, 
  onClose, 
  onJoin,
  onReserve,
  onCancelReservation,
  isReserved = false,
  isTrainer = false,
  isMyRoom = false,
  onStartRoom
}: PTRoomDetailModalProps) {
  /**
   * 상태 관리
   */
  const [entryCode, setEntryCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [codePopupType, setCodePopupType] = useState<'join' | 'reserve'>('join');
  const [showParticipants, setShowParticipants] = useState(false);

  /**
   * 모달 외부 클릭 핸들러
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 참여하기 버튼 클릭 핸들러
   */
  const handleJoinClick = () => {
    if (room.visibility === 'private') {
      setCodePopupType('join');
      setEntryCode('');
      setCodeError('');
      setShowCodePopup(true);
    } else {
      onJoin(room);
    }
  };

  /**
   * 예약하기 버튼 클릭 핸들러
   */
  const handleReserveClick = () => {
    if (room.visibility === 'private') {
      setCodePopupType('reserve');
      setEntryCode('');
      setCodeError('');
      setShowCodePopup(true);
    } else {
      onReserve(room);
    }
  };

  /**
   * 코드 입력 팝업 확인 핸들러
   */
  const handleCodeSubmit = () => {
    if (!entryCode.trim()) {
      setCodeError('입장 코드를 입력해주세요.');
      return;
    }
    if (entryCode.toUpperCase() !== room.entryCode) {
      setCodeError('입장 코드가 올바르지 않습니다.');
      return;
    }

    setShowCodePopup(false);
    
    if (codePopupType === 'join') {
      onJoin(room, entryCode);
    } else {
      onReserve(room, entryCode);
    }
  };

  /**
   * 코드 입력 팝업 닫기
   */
  const handleCodePopupClose = () => {
    setShowCodePopup(false);
    setEntryCode('');
    setCodeError('');
  };

  /**
   * 예약 취소 핸들러
   */
  const handleCancelReservation = () => {
    if (onCancelReservation) {
      onCancelReservation(room);
    }
  };

  /**
   * 링크 복사 핸들러
   */
  const handleCopyLink = async () => {
    /* TODO: 실제 구현 시 공유 링크 생성 */
    const shareLink = `https://example.com/pt/room/${room.id}`;
    
    try {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('링크 복사 실패:', err);
    }
  };

  /**
   * 상태 뱃지 렌더링
   */
  const renderStatusBadge = () => {
    if (room.status === 'live') {
      return (
        <span className="pt-status-badge live">
          <span className="pt-live-dot" />
          진행중
        </span>
      );
    }
    
    if (room.status === 'reserved') {
      return (
        <span className="pt-status-badge reserved">
          예약중
        </span>
      );
    }
    
    return null;
  };

  /**
   * 인원 초과 여부
   */
  const isFull = room.currentParticipants >= room.maxParticipants;

  /**
   * 시작 가능 여부 (예약 시간 10분 전부터)
   */
  const canStartRoom = (): boolean => {
    if (!room.scheduledAt || room.status !== 'reserved') return false;
    
    const now = new Date();
    const scheduledTime = new Date(room.scheduledAt);
    const diffMinutes = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);
    
    return diffMinutes <= 10 && diffMinutes > -60; // 10분 전 ~ 시작 후 60분까지
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h2 className="modal-title">화상PT 상세</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 모달 콘텐츠 */}
        <div className="pt-detail-content">
          {/* 방 제목 및 상태 */}
          <div className="pt-detail-header">
            <h3 className="pt-detail-title">{room.title}</h3>
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
              {room.visibility === 'private' && (
                <span className="pt-status-badge private">
                  <Lock size={10} />
                  비공개
                </span>
              )}
              {renderStatusBadge()}
            </div>
          </div>

          {/* 방 설명 */}
          <p className="pt-detail-description">{room.description}</p>

          {/* 상세 정보 */}
          <div className="pt-detail-info-list">
            {/* 트레이너 */}
            <div className="pt-detail-info-item">
              <User className="pt-detail-info-icon" />
              <span className="pt-detail-info-label">트레이너</span>
              <span className="pt-detail-info-value">{room.trainerName}</span>
            </div>

            {/* 일시 */}
            <div className="pt-detail-info-item">
              {room.status === 'live' ? (
                <Video className="pt-detail-info-icon" />
              ) : (
                <Calendar className="pt-detail-info-icon" />
              )}
              <span className="pt-detail-info-label">일시</span>
              <span className="pt-detail-info-value">
                {room.status === 'live' 
                  ? '지금 진행중'
                  : room.scheduledAt 
                    ? formatDateTime(room.scheduledAt)
                    : '-'
                }
              </span>
            </div>

            {/* 참여 인원 */}
            <div className="pt-detail-info-item">
              <Users className="pt-detail-info-icon" />
              <span className="pt-detail-info-label">참여</span>
              <span className="pt-detail-info-value">
                {room.currentParticipants}/{room.maxParticipants}명
                {isFull && <span style={{ color: 'var(--color-error)', marginLeft: '8px' }}>(마감)</span>}
              </span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="pt-detail-actions">
            {/* 진행중인 방 - 참여하기 */}
            {room.status === 'live' && (
              <button 
                className="pt-action-btn primary"
                onClick={handleJoinClick}
                disabled={isFull}
              >
                <Video size={20} />
                {isFull ? '인원 마감' : '참여하기'}
              </button>
            )}

            {/* 예약중인 방 - 예약하기/취소 */}
            {room.status === 'reserved' && (
              <>
                {/* 트레이너 본인 방인 경우 */}
                {isTrainer && isMyRoom ? (
                  <>
                    {/* 참여자 목록 버튼 */}
                    <button 
                      className="pt-action-btn secondary"
                      onClick={() => setShowParticipants(true)}
                    >
                      <UsersIcon size={20} />
                      참여자 목록 ({room.participants?.length || 0}명)
                    </button>
                    
                    {/* 입장 코드 표시 (비공개 방) */}
                    {room.visibility === 'private' && (
                      <div className="pt-entry-code-display">
                        <span className="pt-entry-code-label">입장 코드</span>
                        <span className="pt-entry-code-value">{room.entryCode}</span>
                      </div>
                    )}
                    
                    {/* 시작하기 버튼 */}
                    <button 
                      className="pt-action-btn primary"
                      onClick={() => onStartRoom?.(room)}
                      disabled={!canStartRoom()}
                    >
                      <Video size={20} />
                      {canStartRoom() ? '시작하기' : '시작 대기중'}
                    </button>
                    
                    {!canStartRoom() && room.scheduledAt && (
                      <p className="pt-start-hint">
                        예약 시간 10분 전부터 시작할 수 있습니다
                      </p>
                    )}
                  </>
                ) : (
                  /* 일반 사용자 - 기존 예약/취소 버튼 */
                  <>
                    {isReserved ? (
                      <button 
                        className="pt-action-btn secondary"
                        onClick={handleCancelReservation}
                      >
                        예약 취소
                      </button>
                    ) : (
                      <button 
                        className="pt-action-btn primary"
                        onClick={handleReserveClick}
                        disabled={isFull}
                      >
                        <Calendar size={20} />
                        {isFull ? '예약 마감' : '예약하기'}
                      </button>
                    )}
                  </>
                )}
              </>
            )}

            {/* 링크 공유 */}
            <button 
              className="pt-action-btn secondary"
              onClick={handleCopyLink}
            >
              {isCopied ? <Check size={20} /> : <Copy size={20} />}
              {isCopied ? '복사됨!' : '링크 복사'}
            </button>

            {/* 입장 코드 팝업 */}
            {showCodePopup && (
              <div className="modal-overlay" style={{ zIndex: 'var(--z-modal)' }} onClick={(e) => {
                if (e.target === e.currentTarget) handleCodePopupClose();
              }}>
                <div className="pt-code-popup">
                  <div className="pt-code-popup-header">
                    <KeyRound size={24} className="pt-code-popup-icon" />
                    <h3 className="pt-code-popup-title">입장 코드 입력</h3>
                  </div>

                  <p className="pt-code-popup-desc">
                    비공개 방입니다.<br />
                    트레이너에게 받은 입장 코드를 입력해주세요.
                  </p>

                  <div className="pt-code-popup-input-group">
                    <input
                      type="text"
                      className="pt-code-popup-input"
                      placeholder="입장 코드 6자리"
                      value={entryCode}
                      onChange={(e) => {
                        setEntryCode(e.target.value.toUpperCase());
                        setCodeError('');
                      }}
                      maxLength={6}
                      autoFocus
                    />
                    {codeError && (
                      <span className="pt-code-popup-error">{codeError}</span>
                    )}
                  </div>

                  <div className="pt-code-popup-actions">
                    <button className="pt-code-popup-btn cancel" onClick={handleCodePopupClose}>
                      취소
                    </button>
                    <button className="pt-code-popup-btn confirm" onClick={handleCodeSubmit}>
                      {codePopupType === 'join' ? '참여하기' : '예약하기'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 참여자 목록 팝업 */}
            {showParticipants && (
              <div className="modal-overlay" style={{ zIndex: 'var(--z-modal)' }} onClick={(e) => {
                if (e.target === e.currentTarget) setShowParticipants(false);
              }}>
                <div className="pt-participants-popup">
                  <div className="pt-participants-header">
                    <h3 className="pt-participants-title">참여자 목록</h3>
                    <button className="modal-close-btn" onClick={() => setShowParticipants(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="pt-participants-list">
                    {room.participants && room.participants.length > 0 ? (
                      room.participants.map((participant, index) => (
                        <div key={participant.id} className="pt-participant-item">
                          <span className="pt-participant-number">{index + 1}</span>
                          <span className="pt-participant-name">{participant.nickname}</span>
                          <span className="pt-participant-date">
                            {new Date(participant.reservedAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="pt-participants-empty">아직 예약자가 없습니다</p>
                    )}
                  </div>
                  
                  <div className="pt-participants-footer">
                    <span>총 {room.participants?.length || 0} / {room.maxParticipants - 1}명</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
