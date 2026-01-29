/**
 * AdminPTList.tsx
 * 화상PT 관리 컴포넌트
 * 
 * API:
 * - GET /api/admin/pt-rooms (화상PT 방 목록 - 관리자 API)
 * - GET /api/pt-rooms/{ptRoomId} (화상PT 방 상세 - 일반 API)
 * - DELETE /api/admin/pt-rooms/{ptRoomId} (강제 종료 - 관리자 API)
 */

import { useState, useEffect } from 'react';
import { Search, Eye, XCircle, Users, Video, X, User, Calendar, Lock, Unlock, Key } from 'lucide-react';
import apiClient from '../../../api/client';

/**
 * ===========================================
 * 관리자 화상PT 타입 정의
 * ===========================================
 */
type AdminPTRoomStatus = 'LIVE' | 'SCHEDULED' | 'ENDED' | 'RESERVED' | 'CANCELLED' | 'FORCE_CLOSED';

interface AdminPTRoom {
  ptRoomId: number;
  trainer: {
    nickname: string;
    handle: string;
  };
  title: string;
  roomType: 'PERSONAL' | 'GROUP' | 'LIVE' | 'RESERVED';
  scheduledStartAt: string;
  maxParticipants: number;
  status: AdminPTRoomStatus;
  createdAt: string;
  isPrivate?: boolean;
  entryCode?: string | null;
  description?: string;
}

interface AdminPTRoomListResponse {
  total: number;
  list: AdminPTRoom[];
}

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */
const statusFilters: { value: AdminPTRoomStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'LIVE', label: '진행중' },
  { value: 'SCHEDULED', label: '예약' },
  { value: 'ENDED', label: '종료' },
];

/**
 * ===========================================
 * 라벨 변환 함수
 * ===========================================
 */
const getStatusLabel = (status: AdminPTRoomStatus) => {
  switch (status) {
    case 'LIVE':
      return '진행중';
    case 'SCHEDULED':
    case 'RESERVED':
      return '예약';
    case 'ENDED':
    case 'CANCELLED':
      return '종료';
    case 'FORCE_CLOSED':
      return '강제종료';
    default:
      return status;
  }
};

const getStatusClass = (status: AdminPTRoomStatus) => {
  switch (status) {
    case 'LIVE':
      return 'status-live';
    case 'SCHEDULED':
    case 'RESERVED':
      return 'status-scheduled';
    case 'ENDED':
    case 'CANCELLED':
      return 'status-ended';
    case 'FORCE_CLOSED':
      return 'status-force-closed';
    default:
      return '';
  }
};

const getRoomTypeLabel = (roomType: string) => {
  switch (roomType) {
    case 'PERSONAL':
      return '개인';
    case 'GROUP':
      return '그룹';
    case 'LIVE':
      return '실시간';
    case 'RESERVED':
      return '예약';
    default:
      return roomType;
  }
};

/**
 * ===========================================
 * 날짜 포맷
 * ===========================================
 */
const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
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
  /** 상태 관리 */
  const [ptRooms, setPTRooms] = useState<AdminPTRoom[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<AdminPTRoomStatus | 'ALL'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<AdminPTRoom | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  /** 강제종료 모달 */
  const [isForceEndModalOpen, setIsForceEndModalOpen] = useState(false);
  const [forceEndTargetId, setForceEndTargetId] = useState<number | null>(null);
  const [forceEndReason, setForceEndReason] = useState('');

  /**
   * 화상PT 목록 조회 (GET /api/admin/pt-rooms)
   */
  const fetchPTRooms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: {
        status?: AdminPTRoomStatus;
        q?: string;
      } = {};

      if (filterStatus !== 'ALL') {
        params.status = filterStatus;
      }
      if (searchKeyword) {
        params.q = searchKeyword;
      }

      const response = await apiClient.get<{ data: AdminPTRoomListResponse }>('/api/admin/pt-rooms', { params });
      setPTRooms(response.data.data.list);
      setTotal(response.data.data.total);
    } catch (err) {
      console.error('화상PT 목록 조회 실패:', err);
      setError('화상PT 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 초기 로드 및 필터 변경 시 재조회
   */
  useEffect(() => {
    fetchPTRooms();
  }, [filterStatus]);

  /**
   * 검색 실행 (Enter 키)
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchPTRooms();
    }
  };

  /**
   * 상세 보기 핸들러 (목록 API 데이터 사용)
   */
  const handleViewDetail = (room: AdminPTRoom) => {
    setSelectedRoom(room);
    setIsDetailModalOpen(true);
  };

  /**
   * 강제 종료 모달 열기
   */
  const openForceEndModal = (ptRoomId: number) => {
    setForceEndTargetId(ptRoomId);
    setForceEndReason('');
    setIsForceEndModalOpen(true);
  };

  /**
   * 강제 종료 실행 (DELETE /api/admin/pt-rooms/{ptRoomId})
   */
  const handleForceEnd = async () => {
    if (!forceEndTargetId) return;
    if (!forceEndReason.trim()) {
      alert('강제 종료 사유를 입력해주세요.');
      return;
    }

    try {
      await apiClient.delete(`/api/admin/pt-rooms/${forceEndTargetId}`, {
        data: { reason: forceEndReason }
      });
      setIsForceEndModalOpen(false);
      setIsDetailModalOpen(false);
      fetchPTRooms();
      alert('화상PT가 강제 종료되었습니다.');
    } catch (err) {
      console.error('화상PT 강제 종료 실패:', err);
      alert('화상PT 강제 종료에 실패했습니다.');
    }
  };

  /**
   * 로딩 상태
   */
  if (isLoading) {
    return (
      <div className="admin-pt-list">
        <h2 className="admin-section-title">화상PT 관리</h2>
        <div className="admin-loading">로딩 중...</div>
      </div>
    );
  }

  /**
   * 에러 상태
   */
  if (error) {
    return (
      <div className="admin-pt-list">
        <h2 className="admin-section-title">화상PT 관리</h2>
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={fetchPTRooms} className="admin-btn primary">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-pt-list">
      {/* 헤더 영역 */}
      <div className="admin-header-row">
        <div className="admin-header-left">
          <h2 className="admin-section-title">화상PT 관리</h2>
          <span className="admin-section-count">전체 {total}건</span>
        </div>
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="트레이너 또는 제목 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          <div className="admin-filter-tabs">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                className={`admin-filter-btn ${filterStatus === filter.value ? 'active' : ''}`}
                onClick={() => setFilterStatus(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>트레이너</th>
              <th>제목</th>
              <th>정원</th>
              <th>예약일시</th>
              <th>공개</th>
              <th>타입</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {ptRooms.length === 0 ? (
              <tr>
                <td colSpan={9} className="admin-table-empty">
                  화상PT 방이 없습니다.
                </td>
              </tr>
            ) : (
              ptRooms.map((room) => {
                const isEnded = room.status === 'ENDED' || room.status === 'CANCELLED' || room.status === 'FORCE_CLOSED';
                return (
                  <tr key={room.ptRoomId}>
                    <td>{room.ptRoomId}</td>
                    <td>
                      <div className="admin-author-info">
                        <span className="admin-nickname">{room.trainer.nickname}</span>
                        <span className="admin-handle">@{room.trainer.handle}</span>
                      </div>
                    </td>
                    <td className="admin-table-name">
                      {room.title}
                    </td>
                    <td>
                      <div className="admin-participant-count">
                        <Users size={14} />
                        {room.maxParticipants}명
                      </div>
                    </td>
                    <td>{formatDate(room.scheduledStartAt)}</td>
                    <td>
                      {room.isPrivate ? (
                        <span className="admin-status-badge status-inactive">
                          <Lock size={14} /> 비공개
                        </span>
                      ) : (
                        <span className="admin-public-badge">
                          <Unlock size={14} /> 공개
                        </span>
                      )}
                    </td>
                    <td>{getRoomTypeLabel(room.roomType)}</td>
                    <td>
                      <span className={`admin-status-badge ${getStatusClass(room.status)}`}>
                        {getStatusLabel(room.status)}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-buttons">
                        <button
                          className="admin-action-btn view"
                          onClick={() => handleViewDetail(room)}
                          title="상세보기"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={`admin-action-btn ${isEnded ? 'delete disabled' : 'delete'}`}
                          onClick={() => {
                            if (!isEnded) openForceEndModal(room.ptRoomId);
                          }}
                          title={isEnded ? '종료됨' : '강제종료'}
                          disabled={isEnded}
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 상세 모달 */}
      {isDetailModalOpen && selectedRoom && (
        <PTDetailModal
          room={selectedRoom}
          onClose={() => setIsDetailModalOpen(false)}
          onForceEnd={openForceEndModal}
        />
      )}

      {/* 강제종료 사유 입력 모달 */}
      {isForceEndModalOpen && (
        <ForceEndModal
          onClose={() => setIsForceEndModalOpen(false)}
          onConfirm={handleForceEnd}
          reason={forceEndReason}
          setReason={setForceEndReason}
        />
      )}
    </div>
  );
}

/**
 * ===========================================
 * 화상PT 상세 모달
 * ===========================================
 */
interface PTDetailModalProps {
  room: AdminPTRoom;
  onClose: () => void;
  onForceEnd: (ptRoomId: number) => void;
}

function PTDetailModal({ room, onClose, onForceEnd }: PTDetailModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal-container" style={{ maxWidth: '600px' }}>
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
            <div className="admin-pt-info-card">
              <div className="admin-pt-info-header">
                <h5 className="admin-pt-info-title">{room.title}</h5>
                <span className={`admin-status-badge ${getStatusClass(room.status)}`}>
                  {getStatusLabel(room.status)}
                </span>
              </div>
              
              {/* 내용 - 제목 바로 아래 */}
              <div style={{ 
                padding: '12px 0',
                marginBottom: '12px',
                borderBottom: '1px solid #e5e7eb',
                color: '#666',
                fontSize: '14px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {room.description || '(내용 없음)'}
              </div>

              <div className="admin-detail-list">
                <div className="admin-detail-row">
                  <User size={16} />
                  <span className="admin-detail-key">트레이너</span>
                  <span className="admin-detail-value">
                    {room.trainer.nickname} (@{room.trainer.handle})
                  </span>
                </div>
                <div className="admin-detail-row">
                  <Video size={16} />
                  <span className="admin-detail-key">타입</span>
                  <span className="admin-detail-value">{getRoomTypeLabel(room.roomType)}</span>
                </div>
                <div className="admin-detail-row">
                  <Users size={16} />
                  <span className="admin-detail-key">정원</span>
                  <span className="admin-detail-value">{room.maxParticipants}명</span>
                </div>
                <div className="admin-detail-row">
                  {room.isPrivate ? <Lock size={16} /> : <Unlock size={16} />}
                  <span className="admin-detail-key">공개여부</span>
                  <span className="admin-detail-value">
                    {room.isPrivate ? '비공개' : '공개'}
                  </span>
                </div>
                <div className="admin-detail-row">
                  <Key size={16} />
                  <span className="admin-detail-key">입장코드</span>
                  <span className="admin-detail-value admin-entry-code">
                    {room.entryCode || '-'}
                  </span>
                </div>
                <div className="admin-detail-row">
                  <Calendar size={16} />
                  <span className="admin-detail-key">예약일시</span>
                  <span className="admin-detail-value">{formatDate(room.scheduledStartAt)}</span>
                </div>
                <div className="admin-detail-row">
                  <Calendar size={16} />
                  <span className="admin-detail-key">생성일</span>
                  <span className="admin-detail-value">{formatDate(room.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 진행중 경고 */}
          {room.status === 'LIVE' && (
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
          {(room.status === 'LIVE' || room.status === 'SCHEDULED' || room.status === 'RESERVED') && (
            <button className="admin-btn danger" onClick={() => onForceEnd(room.ptRoomId)}>
              강제 종료
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ===========================================
 * 강제종료 사유 입력 모달
 * ===========================================
 */
interface ForceEndModalProps {
  onClose: () => void;
  onConfirm: () => void;
  reason: string;
  setReason: (reason: string) => void;
}

function ForceEndModal({ onClose, onConfirm, reason, setReason }: ForceEndModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal-container" style={{ maxWidth: '450px' }}>
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">강제 종료</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="admin-modal-content">
          <p style={{ marginBottom: '16px', color: '#666' }}>
            화상PT를 강제 종료하시겠습니까?<br />
            모든 참여자의 연결이 끊어집니다.
          </p>
          
          <div className="admin-form-group">
            <label className="admin-form-label">종료 사유 *</label>
            <textarea
              className="admin-form-textarea"
              placeholder="강제 종료 사유를 입력해주세요"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        <div className="admin-modal-footer">
          <button className="admin-btn secondary" onClick={onClose}>
            취소
          </button>
          <button className="admin-btn danger" onClick={onConfirm}>
            강제 종료
          </button>
        </div>
      </div>
    </div>
  );
}