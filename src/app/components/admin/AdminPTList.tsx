/**
 * AdminPTList.tsx
 * 화상PT 관리 컴포넌트
 * - 전체 화상PT 방 목록 조회
 * - 상태별 필터 (전체/진행중/예약/종료)
 * - 부적절 방 강제 종료/삭제
 */

import { useState } from 'react';
import { Search, Eye, XCircle, Trash2, Users, Video } from 'lucide-react';
import type { AdminPTRoom, PTRoomStatus } from '../../../types/admin';
import { adminPTRooms } from '../../../data/admin';
import AdminPTDetailModal from './AdminPTDetailModal';
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
 * AdminPTList 컴포넌트
 * ===========================================
 */

export default function AdminPTList() {
  /**
   * 상태 관리
   */
  const [ptRooms, setPTRooms] = useState<AdminPTRoom[]>(adminPTRooms);
  const [filterStatus, setFilterStatus] = useState<PTRoomStatus | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<AdminPTRoom | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  /**
   * 필터링된 목록
   */
  const filteredRooms = ptRooms.filter((room) => {
    /* 상태 필터 */
    if (filterStatus !== 'all' && room.status !== filterStatus) {
      return false;
    }
    /* 검색 필터 */
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
   * 강제 종료 핸들러
   */
  const handleForceEnd = (id: number) => {
    if (!confirm('해당 화상PT를 강제 종료하시겠습니까?\n참여자들에게 알림이 전송됩니다.')) return;

    setPTRooms((prev) =>
      prev.map((room) =>
        room.id === id ? { ...room, status: 'ended' as PTRoomStatus } : room
      )
    );

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/pt-rooms/${id}/force-end`, { method: 'POST' }); */
  };

  /**
   * 삭제 핸들러
   */
  const handleDelete = (id: number) => {
    if (!confirm('해당 화상PT 방을 삭제하시겠습니까?\n예약자들에게 취소 알림이 전송됩니다.')) return;

    setPTRooms((prev) => prev.filter((room) => room.id !== id));

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/pt-rooms/${id}`, { method: 'DELETE' }); */
  };

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

  return (
    <div className="admin-pt-list">
      <h2 className="admin-section-title">화상PT 관리</h2>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          {/* 상태 필터 */}
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

        {/* 검색 */}
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
                        onClick={() => alert('상세 보기 (TODO)')}
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
    </div>
  );
}