/**
 * PTRoomCard.tsx
 * 화상PT 방 카드 컴포넌트
 * 방 목록에서 각 방을 표시하는 카드
 */

import { User, Clock, Users, Lock } from 'lucide-react';
import type { PTRoomListItem } from '../../../api/types/pt';

/**
 * Props 타입 정의
 */
interface PTRoomCardProps {
  room: PTRoomListItem;
  onClick: (room: PTRoomListItem) => void;
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
 * PTRoomCard 컴포넌트
 */
export default function PTRoomCard({ room, onClick }: PTRoomCardProps) {
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
    
    return null;
  };

  /**
   * 비공개 뱃지 렌더링
   */
  const renderPrivateBadge = () => {
    if (room.isPrivate) {
      return (
        <span className="pt-status-badge private">
          <Lock size={10} />
          비공개
        </span>
      );
    }
    return null;
  };

  return (
    <div className="pt-room-card" onClick={() => onClick(room)}>
      {/* 카드 헤더 */}
      <div className="pt-room-card-header">
        <h3 className="pt-room-title">{room.title}</h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          {renderPrivateBadge()}
          {renderStatusBadge()}
        </div>
      </div>

      {/* 트레이너 정보 */}
      <div className="pt-room-trainer">
        <div className="pt-trainer-avatar">
          {room.trainer.profileImageUrl ? (
            <img 
              src={room.trainer.profileImageUrl} 
              alt={room.trainer.nickname}
              className="pt-trainer-avatar-img"
            />
          ) : (
            <User className="pt-trainer-avatar-icon" />
          )}
        </div>
        <span className="pt-trainer-name">{room.trainer.nickname} 트레이너</span>
      </div>

      {/* 메타 정보 */}
      <div className="pt-room-meta">
        {/* 시간 정보 */}
        <div className="pt-meta-item">
          <Clock className="pt-meta-icon" />
          <span>
            {room.status === 'LIVE' 
              ? '진행중' 
              : room.scheduledAt 
                ? formatDateTime(room.scheduledAt)
                : '-'
            }
          </span>
        </div>

        {/* 참여 인원 */}
        <div className="pt-meta-item">
          <Users className="pt-meta-icon" />
          <span>
            {room.status === 'LIVE' 
              ? `${room.participants.current}/${room.participants.max ?? '∞'}명`
              : `최대 ${room.participants.max ?? '∞'}명`
            }
          </span>
        </div>
      </div>
    </div>
  );
}
