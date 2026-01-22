/**
 * PTRoomDetailModal.tsx
 * 화상PT 방 상세 모달 컴포넌트
 * 방 정보 확인 및 참여/예약 기능
 */

import { useState } from 'react';
import { 
  X, 
  User,
  KeyRound, 
  Users, 
  Lock, 
  Video,
  Calendar,
  Copy,
  Check
} from 'lucide-react';
import type { PTRoomListItem, GetPTRoomDetailResponse } from '../../../api/types/pt';

/**
 * Props 타입 정의
 */
interface PTRoomDetailModalProps {
  room: PTRoomListItem;
  roomDetail?: GetPTRoomDetailResponse | null;
  onClose: () => void;
  onJoin: (room: PTRoomListItem, entryCode?: string) => Promise<void>;
  isTrainer?: boolean;
  isMyRoom?: boolean;
  onStartRoom?: (room: PTRoomListItem) => void;
  onCancelRoom?: (room: PTRoomListItem) => void;
  isLoading?: boolean;
}

/**
 * 날짜/시간 포맷팅 함수
 */
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  
  /* 로컬 시간(한국시간) 기준으로 표시 */
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
  roomDetail,
  onClose, 
  onJoin,
  isTrainer = false,
  isMyRoom = false,
  onStartRoom,
  onCancelRoom,
  isLoading = false
}: PTRoomDetailModalProps) {
  /**
   * 상태 관리
   */
  const [entryCode, setEntryCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);

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
    if (room.isPrivate) {
      setEntryCode('');
      setCodeError('');
      setShowCodePopup(true);
    } else {
      onJoin(room);
    }
  };

  /**
   * 코드 입력 팝업 확인 핸들러
   */
  const handleCodeSubmit = async () => {
    if (!entryCode.trim()) {
      setCodeError('입장 코드를 입력해주세요.');
      return;
    }
    
    /* 6자리 형식만 체크 - 실제 검증은 백엔드에서 */
    if (entryCode.length !== 6) {
      setCodeError('입장 코드는 6자리입니다.');
      return;
    }

    try {
      await onJoin(room, entryCode.toUpperCase());
      setShowCodePopup(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || '입장에 실패했습니다.';
      setCodeError(errorMessage);
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
   * 링크 복사 핸들러
   */
  const handleCopyLink = async () => {
    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/pt/room/${room.ptRoomId}`;
    
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
    if (room.status === 'LIVE') {
      return (
        <span className="pt-status-badge live">
          <span className="pt-live-dot" />
          진행중
        </span>
      );
    }
    
    if (room.status === 'SCHEDULED') {
      return (
        <span className="pt-status-badge reserved">
          예약중
        </span>
      );
    }

    if (room.status === 'ENDED') {
      return (
        <span className="pt-status-badge ended">
          종료
        </span>
      );
    }
    
    return null;
  };

  /**
   * 인원 초과 여부
   */
  const isFull = room.participants.max 
    ? room.participants.current >= room.participants.max 
    : false;

  /**
   * 시작 가능 여부 (예약 시간 10분 전부터)
   */
  const canStartRoom = (): boolean => {
    if (!room.scheduledAt || room.status !== 'SCHEDULED') return false;
    
    const now = Date.now();
    const scheduledTime = new Date(room.scheduledAt).getTime();
    const diffMinutes = (scheduledTime - now) / (1000 * 60);
    
    return diffMinutes <= 10 && diffMinutes > -60;
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
              {room.isPrivate && (
                <span className="pt-status-badge private">
                  <Lock size={10} />
                  비공개
                </span>
              )}
              {renderStatusBadge()}
            </div>
          </div>

          {/* 방 설명 */}
          {roomDetail?.description && (
            <p className="pt-detail-description">{roomDetail.description}</p>
          )}

          {/* 상세 정보 */}
          <div className="pt-detail-info-list">
            {/* 트레이너 */}
            <div className="pt-detail-info-item">
              <User className="pt-detail-info-icon" />
              <span className="pt-detail-info-label">트레이너</span>
              <span className="pt-detail-info-value">{room.trainer.nickname}</span>
            </div>

            {/* 일시 */}
            <div className="pt-detail-info-item">
              {room.status === 'LIVE' ? (
                <Video className="pt-detail-info-icon" />
              ) : (
                <Calendar className="pt-detail-info-icon" />
              )}
              <span className="pt-detail-info-label">일시</span>
              <span className="pt-detail-info-value">
                {room.status === 'LIVE' 
                  ? '지금 진행중'
                  : room.status === 'ENDED'
                    ? roomDetail?.startedAt
                      ? formatDateTime(roomDetail.startedAt)
                      : room.scheduledAt
                        ? formatDateTime(room.scheduledAt)
                        : '-'
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
                {room.status === 'LIVE' 
                  ? `${room.participants.current}/${room.participants.max ?? '∞'}명`
                  : `최대 ${room.participants.max ?? '∞'}명`
                }
                {room.status === 'LIVE' && isFull && (
                  <span style={{ color: 'var(--color-error)', marginLeft: '8px' }}>(마감)</span>
                )}
              </span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="pt-detail-actions">
            {/* 진행중인 방 - 참여하기 */}
            {room.status === 'LIVE' && (
              <button 
                className="pt-action-btn primary"
                onClick={handleJoinClick}
                disabled={isFull}
              >
                <Video size={20} />
                {isFull ? '인원 마감' : '참여하기'}
              </button>
            )}

            {/* 예약중인 방 - 트레이너 전용 */}
            {room.status === 'SCHEDULED' && isTrainer && isMyRoom && (
              <>    
                {/* 입장 코드 표시 (비공개 방) */}
                {room.isPrivate && (
                  <div className="pt-entry-code-display">
                    <span className="pt-entry-code-label">입장 코드</span>
                    <span className="pt-entry-code-value">
                      {roomDetail?.entryCode || (isLoading ? '로딩중...' : '-')}
                    </span>
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
                
                {/* 예약 취소 버튼 */}
                <button 
                  className="pt-action-btn danger"
                  onClick={() => onCancelRoom?.(room)}
                  disabled={isLoading}
                >
                  <X size={20} />
                  예약 취소
                </button>
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
                      참여하기
                    </button>
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
