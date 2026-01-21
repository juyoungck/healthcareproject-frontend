/**
 * AdminPTDetailModal.tsx
 * 화상PT 상세 모달
 * - 방 정보 상세 조회
 * - 참여자 목록 확인
 * - 강제 종료/삭제 처리
 */

import { X, User, Calendar, Clock, Users, Video } from 'lucide-react';
import type { AdminPTRoom, PTRoomStatus } from '../../../types/admin';

/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface AdminPTDetailModalProps {
  room: AdminPTRoom;
  onClose: () => void;
  onForceEnd: (id: number) => void;
  onDelete: (id: number) => void;
}

/**
 * ===========================================
 * 라벨 변환 함수
 * ===========================================
 */

const getStatusLabel = (status: PTRoomStatus) => {
  switch (status) {
    case 'live':
      return '진행중';
    case 'scheduled':
      return '예약';
    case 'ended':
      return '종료';
    default:
      return status;
  }
};

/**
 * ===========================================
 * 더미 참여자 데이터
 * ===========================================
 */

const DUMMY_PARTICIPANTS = [
  { id: 1, nickname: '운동초보', joinedAt: '2025-01-21T10:05:00' },
  { id: 2, nickname: '헬린이', joinedAt: '2025-01-21T10:03:00' },
  { id: 3, nickname: '근육맨', joinedAt: '2025-01-21T10:08:00' },
];

/**
 * ===========================================
 * AdminPTDetailModal 컴포넌트
 * ===========================================
 */

export default function AdminPTDetailModal({
  room,
  onClose,
  onForceEnd,
  onDelete,
}: AdminPTDetailModalProps) {
  /**
   * 날짜 포맷
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * 강제 종료 핸들러
   */
  const handleForceEnd = () => {
    if (confirm('해당 화상PT를 강제 종료하시겠습니까?\n참여자들에게 알림이 전송됩니다.')) {
      onForceEnd(room.id);
    }
  };

  /**
   * 삭제 핸들러
   */
  const handleDelete = () => {
    if (confirm('해당 화상PT 방을 삭제하시겠습니까?\n예약자들에게 취소 알림이 전송됩니다.')) {
      onDelete(room.id);
    }
  };

  /**
   * 오버레이 클릭 핸들러
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal-container">
        {/* 헤더 */}
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">화상PT 상세</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="admin-modal-content">
          {/* 방 정보 */}
          <div className="admin-detail-section">
            <h4 className="admin-detail-label">방 정보</h4>
            <div className="admin-pt-info-card">
              <div className="admin-pt-info-header">
                <h5 className="admin-pt-info-title">{room.title}</h5>
                <span className={`admin-status-badge status-${room.status}`}>
                  {getStatusLabel(room.status)}
                </span>
              </div>
              <div className="admin-detail-list">
                <div className="admin-detail-row">
                  <User size={16} />
                  <span className="admin-detail-key">트레이너</span>
                  <span className="admin-detail-value">{room.trainerName}</span>
                </div>
                <div className="admin-detail-row">
                  <Calendar size={16} />
                  <span className="admin-detail-key">예약일시</span>
                  <span className="admin-detail-value">{formatDate(room.scheduledAt)}</span>
                </div>
                <div className="admin-detail-row">
                  <Clock size={16} />
                  <span className="admin-detail-key">생성일</span>
                  <span className="admin-detail-value">{formatDate(room.createdAt)}</span>
                </div>
                <div className="admin-detail-row">
                  <Users size={16} />
                  <span className="admin-detail-key">참여인원</span>
                  <span className="admin-detail-value">
                    {room.participantCount} / {room.maxParticipants}명
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 참여자 목록 */}
          <div className="admin-detail-section">
            <h4 className="admin-detail-label">
              참여자 목록 ({room.participantCount}명)
            </h4>
            {room.participantCount > 0 ? (
              <ul className="admin-participant-list">
                {DUMMY_PARTICIPANTS.slice(0, room.participantCount).map((participant) => (
                  <li key={participant.id} className="admin-participant-item">
                    <div className="admin-participant-avatar">
                      <User size={16} />
                    </div>
                    <div className="admin-participant-info">
                      <span className="admin-participant-name">{participant.nickname}</span>
                      <span className="admin-participant-time">
                        {formatDate(participant.joinedAt)} 참여
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-empty-text">참여자가 없습니다.</p>
            )}
          </div>

          {/* 진행중 경고 */}
          {room.status === 'live' && (
            <div className="admin-detail-section">
              <div className="admin-live-warning">
                <Video size={18} />
                현재 진행중인 화상PT입니다. 강제 종료 시 모든 참여자의 연결이 끊어집니다.
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="admin-modal-footer">
          <button className="admin-btn secondary" onClick={onClose}>
            닫기
          </button>
          {room.status === 'live' ? (
            <button className="admin-btn danger" onClick={handleForceEnd}>
              강제 종료
            </button>
          ) : room.status === 'scheduled' ? (
            <button className="admin-btn danger" onClick={handleDelete}>
              삭제
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}