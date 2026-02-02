/**
 * VideoPTPage.tsx
 * 화상PT 페이지 컴포넌트
 * 방 목록, 검색, 필터 기능
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Video, Calendar, Plus } from 'lucide-react';
import PTRoomCard from '../components/pt/PTRoomCard';
import PTRoomDetailModal from '../components/pt/PTRoomDetailModal';
import PTCreateRoomModal, { CreateRoomData } from '../components/pt/PTCreateRoomModal';
import VideoCallRoom from '../components/pt/VideoCallRoom';
import {
  getPTRoomList,
  getPTRoomDetail,
  createPTRoom,
  joinPTRoom,
  updatePTRoomStatus,
} from '../../api/pt';
import { getApiErrorMessage, extractAxiosError } from '../../api/apiError';
import type {
  PTRoomListItem,
  GetPTRoomDetailResponse,
  PTFilterType,
} from '../../api/types/pt';
import { filterToTab } from '../../api/types/pt';

/**
 * 필터 타입
 */
type FilterType = PTFilterType;

/**
 * Props 타입 정의
 */
interface VideoPTPageProps {
  initialFilter?: string | null;
}

/**
 * VideoPTPage 컴포넌트
 */
export default function VideoPTPage({
  initialFilter,
}: VideoPTPageProps) {
  const { user } = useAuth();
  const isTrainer = user?.role === 'TRAINER';

  /* 상태 관리 */
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [rooms, setRooms] = useState<PTRoomListItem[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<PTRoomListItem | null>(null);
  const [roomDetail, setRoomDetail] = useState<GetPTRoomDetailResponse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inVideoCall, setInVideoCall] = useState(false);
  const [activeCallRoom, setActiveCallRoom] = useState<GetPTRoomDetailResponse | null>(null);

  /* 로딩/에러 상태 */
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 초기 필터 적용
   */
  useEffect(() => {
    if (initialFilter) {
      setActiveFilter(initialFilter as FilterType);
    }
  }, [initialFilter]);

  /**
   * 방 목록 조회
   */
  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPTRoomList({
        tab: filterToTab[activeFilter],
        q: searchQuery || undefined,
      });
      setRooms(response.items);

    } catch (err) {
      setError(getApiErrorMessage(err, '방 목록을 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, searchQuery]);

  /**
   * 필터/검색어 변경 시 목록 조회
   */
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  /**
   * 방 카드 클릭 핸들러
   */
  const handleRoomClick = async (room: PTRoomListItem) => {
    setSelectedRoom(room);
    setShowDetailModal(true);
    setIsDetailLoading(true);
    setRoomDetail(null);

    try {
      const detail = await getPTRoomDetail(room.ptRoomId);
      setRoomDetail(detail);
    } catch {
      /** 상세 조회 실패는 조용히 처리 */
    } finally {
      setIsDetailLoading(false);
    }
  };

  /**
   * 상세 모달 닫기
   */
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRoom(null);
    setRoomDetail(null);
  };

  /**
   * 방 참여 핸들러
   */
  const handleJoinRoom = async (room: PTRoomListItem, entryCode?: string) => {
    setIsActionLoading(true);

    try {
      await joinPTRoom(room.ptRoomId, { entryCode: entryCode || null });
      const roomDetail = await getPTRoomDetail(room.ptRoomId);
      setActiveCallRoom(roomDetail);
      setInVideoCall(true);
      closeDetailModal();
    } catch (err) {
      const { code, message } = extractAxiosError(err, '방 입장에 실패했습니다.');

      /* 강퇴된 사용자 재입장 시도 */
      if (code === 'KICKED') {
        alert('강퇴된 방에는 다시 입장할 수 없습니다.');
        return;
      }

      /* 비공개 방 입장 코드 오류는 모달에서 처리하도록 에러 전파 */
      if (entryCode) {
        throw err;
      }
      /* 그 외 에러는 alert으로 표시 */
      alert(message);
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * 방 생성 핸들러
   */
  const handleCreateRoom = async (data: CreateRoomData) => {
    setIsActionLoading(true);

    try {
      const createdRoom = await createPTRoom({
        roomType: data.roomType,
        title: data.title,
        description: data.description,
        scheduledAt: data.scheduledAt,
        maxParticipants: data.maxParticipants,
        isPrivate: data.isPrivate,
      });

      setShowCreateModal(false);

      /* 실시간 방인 경우 바로 화상통화로 이동 */
      if (data.roomType === 'LIVE') {
        /* 생성된 방 상세 정보로 입장 */
        const roomDetail = await getPTRoomDetail(createdRoom.ptRoomId);
        setActiveCallRoom(roomDetail);
        setInVideoCall(true);
      } else {
        alert('예약 방이 생성되었습니다!');
        fetchRooms(); /* 목록 새로고침 */
      }
    } catch (err) {
      alert(getApiErrorMessage(err, '방 생성에 실패했습니다.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * 방 시작 핸들러 (트레이너 전용)
   */
  const handleStartRoom = async (room: PTRoomListItem) => {
    setIsActionLoading(true);

    try {
      /* 상태를 LIVE로 변경 */
      await updatePTRoomStatus(room.ptRoomId, { status: 'LIVE' });

      /* 변경된 방 상세 정보 조회 후 입장 */
      const roomDetail = await getPTRoomDetail(room.ptRoomId);
      setActiveCallRoom(roomDetail);
      setInVideoCall(true);
      closeDetailModal();
    } catch (err) {
      alert(getApiErrorMessage(err, '방 시작에 실패했습니다.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * 방 취소 핸들러 (트레이너 전용)
   */
  const handleCancelRoom = async (room: PTRoomListItem) => {
    if (!confirm('정말로 이 예약을 취소하시겠습니까?')) {
      return;
    }

    setIsActionLoading(true);

    try {
      await updatePTRoomStatus(room.ptRoomId, { status: 'CANCELLED' });
      alert('예약이 취소되었습니다.');
      closeDetailModal();
      fetchRooms();
    } catch (err) {
      alert(getApiErrorMessage(err, '예약 취소에 실패했습니다.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * 화상통화 종료 핸들러
   */
  const handleLeaveCall = () => {
    setInVideoCall(false);
    setActiveCallRoom(null);
    fetchRooms();
  };

  /**
   * 화상통화 중일 때 화상통화 UI 렌더링
   */
  if (inVideoCall && activeCallRoom) {
    return (
      <VideoCallRoom
        room={activeCallRoom}
        onLeave={handleLeaveCall}
        isTrainer={isTrainer}
        userName={isTrainer ? `[트레이너] ${user?.nickname}` : user?.nickname || '사용자'}
        userProfileImage={user?.profileImageUrl}
      />
    );
  }

  return (
    <div className="pt-page">
      {/* 페이지 헤더 */}
      <div className="pt-page-header">
        {/* 검색 입력 */}
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="트레이너 또는 방 제목 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 필터 버튼 그룹 */}
        <div className="filter-group">
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            전체
          </button>
          <button
            className={`filter-btn ${activeFilter === 'live' ? 'active' : ''}`}
            onClick={() => setActiveFilter('live')}
          >
            <Video size={14} />
            진행중
          </button>
          <button
            className={`filter-btn ${activeFilter === 'reserved' ? 'active' : ''}`}
            onClick={() => setActiveFilter('reserved')}
          >
            <Calendar size={14} />
            예약중
          </button>
          {/* 트레이너 전용 필터 */}
          {isTrainer && (
            <button
              className={`filter-btn ${activeFilter === 'myRoom' ? 'active' : ''}`}
              onClick={() => setActiveFilter('myRoom')}
            >
              내 PT
            </button>
          )}
        </div>
      </div>

      {/* 방 목록 */}
      <div className="pt-room-list">
        {isLoading ? (
          <div className="pt-loading">로딩 중...</div>
        ) : error ? (
          <div className="pt-error">{error}</div>
        ) : rooms.length > 0 ? (
          rooms.map(room => (
            <PTRoomCard
              key={room.ptRoomId}
              room={room}
              onClick={handleRoomClick}
            />
          ))
        ) : (
          /* 빈 상태 */
          <div className="pt-empty-state">
            <Video className="pt-empty-icon" />
            <h3 className="pt-empty-title">
              등록된 화상PT가 없습니다
            </h3>
            <p className="pt-empty-desc">
              새로운 화상PT가 등록되면 여기에 표시됩니다
            </p>
          </div>
        )}
      </div>

      {/* 트레이너인 경우 FAB 버튼 표시 */}
      {isTrainer && (
        <button
          className="pt-fab"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="pt-fab-icon" />
        </button>
      )}

      {/* 방 상세 모달 */}
      {showDetailModal && selectedRoom && (
        <PTRoomDetailModal
          room={selectedRoom}
          roomDetail={roomDetail}
          onClose={closeDetailModal}
          onJoin={handleJoinRoom}
          isTrainer={isTrainer}
          isMyRoom={selectedRoom.trainer.handle === user?.handle}
          onStartRoom={handleStartRoom}
          onCancelRoom={handleCancelRoom}
          isLoading={isDetailLoading || isActionLoading}
        />
      )}

      {/* 방 생성 모달 */}
      {showCreateModal && (
        <PTCreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRoom}
          isLoading={isActionLoading}
        />
      )}
    </div>
  );
}