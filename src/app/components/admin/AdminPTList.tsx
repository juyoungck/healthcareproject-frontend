/**
 * AdminPTList.tsx
 * 화상PT 관리 컴포넌트 (목록 + 상세 모달 통합)
 * 
 * TODO: 백엔드 완성 후 API 연동
 * - GET /api/admin/pt-rooms/{ptRoomId} (상세 조회)
 * - DELETE /api/admin/pt-rooms/{ptRoomId} (강제 종료/삭제)
 */

import { useState } from 'react';
import { Search, Eye, XCircle, Trash2, Users, Video, X, User, Calendar, Clock } from 'lucide-react';
import type { AdminPTRoom, PTRoomStatus } from '../../../types/admin';
import { adminPTRooms } from '../../../data/admin';

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */
const statusFilters: { value: PTRoomStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'live', label: '진행중' },
  { value: 'scheduled', label: '예약' },
  { value: 'ended', label: '종료' },
];

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

const getStatusClass = (status: PTRoomStatus) => {
  switch (status) {
    case 'live':
      return 'status-live';
    case 'scheduled':
      return 'status-scheduled';
    case 'ended':
      return 'status-ended';
    default:
      return '';
  }
};

/**
 * ===========================================
 * 날짜 포맷
 * ===========================================
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
 * ===========================================
 * AdminPTList 컴포넌트
 * ===========================================
 */
export default function AdminPTList() {
  const [ptRooms, setPTRooms] = useState<AdminPTRoom[]>(adminPTRooms);
  const [filterStatus, setFilterStatus] = useState<PTRoomStatus | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<AdminPTRoom | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  /**
   * 필터링된 목록
   */
  const filteredRooms = ptRooms.filter((room) => {
    if (filterStatus !== 'all' && room.status !== filterStatus) {
      return false;
    }
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        room.title.toLowerCase().includes(keyword) ||
        room.trainerName.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  /**
   * 상세 보기 핸들러
   */
  const handleViewDetail = (room: AdminPTRoom) => {
    setSelectedRoom(room);
    setIsDetailModalOpen(true);
  };

  /**
   * 강제 종료 핸들러
   * TODO: DELETE /api/admin/pt-rooms/{ptRoomId}
   */
  const handleForceEnd = (id: number) => {
    if (!confirm('해당 화상PT를 강제 종료하시겠습니까?\n참여자들에게 알림이 전송됩니다.')) return;

    setPTRooms((prev) =>
      prev.map((room) =>
        room.id === id ? { ...room, status: 'ended' as PTRoomStatus } : room
      )
    );
    setIsDetailModalOpen(false);
  };

  /**
   * 삭제 핸들러
   * TODO: DELETE /api/admin/pt-rooms/{ptRoomId}
   */
  const handleDelete = (id: number) => {
    if (!confirm('해당 화상PT 방을 삭제하시겠습니까?\n예약자들에게 취소 알림이 전송됩니다.')) return;

    setPTRooms((prev) => prev.filter((room) => room.id !== id));
    setIsDetailModalOpen(false);
  };

  return (
    <div className="admin-pt-list">
      <h2 className="admin-section-title">화상PT 관리</h2>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          <div className="admin-filter-tabs">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                className={`admin-filter-tab ${filterStatus === filter.value ? 'active' : ''}`}
                onClick={() => setFilterStatus(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="제목 또는 트레이너 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>트레이너</th>
              <th>상태</th>
              <th>참여인원</th>
              <th>예약일시</th>
              <th>생성일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-table-empty">
                  화상PT 방이 없습니다.
                </td>
              </tr>
            ) : (
              filteredRooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td className="admin-table-name">
                    {room.status === 'live' && (
                      <span className="admin-live-indicator">
                        <Video size={14} />
                      </span>
                    )}
                    {room.title}
                  </td>
                  <td>{room.trainerName}</td>
                  <td>
                    <span className={`admin-status-badge ${getStatusClass(room.status)}`}>
                      {getStatusLabel(room.status)}
                    </span>
                  </td>
                  <td>
                    <div className="admin-participant-count">
                      <Users size={14} />
                      {room.participantCount} / {room.maxParticipants}
                    </div>
                  </td>
                  <td>{formatDate(room.scheduledAt)}</td>
                  <td>{formatDate(room.createdAt)}</td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn view"
                        onClick={() => handleViewDetail(room)}
                        title="상세보기"
                      >
                        <Eye size={16} />
                      </button>
                      {room.status === 'live' && (
                        <button
                          className="admin-action-btn force-end"
                          onClick={() => handleForceEnd(room.id)}
                          title="강제종료"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      {room.status !== 'live' && (
                        <button
                          className="admin-action-btn delete"
                          onClick={() => handleDelete(room.id)}
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 상세 모달 (통합) */}
      {isDetailModalOpen && selectedRoom && (
        <PTDetailModal
          room={selectedRoom}
          onClose={() => setIsDetailModalOpen(false)}
          onForceEnd={handleForceEnd}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

/**
 * ===========================================
 * 화상PT 상세 모달 (내부 컴포넌트로 통합)
 * ===========================================
 */
const DUMMY_PARTICIPANTS = [
  { id: 1, nickname: '운동초보', joinedAt: '2025-01-21T10:05:00' },
  { id: 2, nickname: '헬린이', joinedAt: '2025-01-21T10:03:00' },
  { id: 3, nickname: '근육맨', joinedAt: '2025-01-21T10:08:00' },
];

interface PTDetailModalProps {
  room: AdminPTRoom;
  onClose: () => void;
  onForceEnd: (id: number) => void;
  onDelete: (id: number) => void;
}

function PTDetailModal({ room, onClose, onForceEnd, onDelete }: PTDetailModalProps) {
  const handleForceEnd = () => {
    if (confirm('해당 화상PT를 강제 종료하시겠습니까?\n참여자들에게 알림이 전송됩니다.')) {
      onForceEnd(room.id);
    }
  };

  const handleDelete = () => {
    if (confirm('해당 화상PT 방을 삭제하시겠습니까?\n예약자들에게 취소 알림이 전송됩니다.')) {
      onDelete(room.id);
    }
  };

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