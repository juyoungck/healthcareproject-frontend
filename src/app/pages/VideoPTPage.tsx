/**
 * VideoPTPage.tsx
 * 화상PT 페이지 컴포넌트
 * 방 목록, 검색, 필터, 예약 관리 기능
 */

import { useState, useEffect } from 'react';
import { Search, Video, Calendar, Plus } from 'lucide-react';
import PTRoomCard from '../components/pt/PTRoomCard';
import PTRoomDetailModal from '../components/pt/PTRoomDetailModal';
import PTCreateRoomModal, { CreateRoomData } from '../components/pt/PTCreateRoomModal';
import VideoCallRoom from '../components/pt/VideoCallRoom';
import { 
  PTRoom, 
  DUMMY_PT_ROOMS, 
  DUMMY_MY_RESERVATIONS,
  CURRENT_USER_ID,
  IS_CURRENT_USER_TRAINER 
} from '../../data/pts';

/**
 * 필터 타입
 */
type FilterType = 'all' | 'live' | 'reserved' | 'my-reservation' | 'myRoom';

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
  /**
   * 상태 관리
   */
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedRoom, setSelectedRoom] = useState<PTRoom | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inVideoCall, setInVideoCall] = useState(false);
  const [activeCallRoom, setActiveCallRoom] = useState<PTRoom | null>(null);

  /**
   * 초기 필터 적용
   */
  useEffect(() => {
    if (initialFilter) {
      setActiveFilter(initialFilter as FilterType);
    }
  }, [initialFilter]);

  /**
   * 내 예약 방 ID 목록
   * TODO: 실제 구현 시 API에서 가져오기
   */
  const myReservationIds = DUMMY_MY_RESERVATIONS.map(r => r.roomId);

  /**
   * 필터링된 방 목록
   */
  const filteredRooms = DUMMY_PT_ROOMS.filter((room: PTRoom) => {
    /* 검색어 필터 */
    const matchesSearch = 
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.trainerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    /* 상태 필터 */
    switch (activeFilter) {
      case 'live':
        return room.status === 'live';
      case 'reserved':
        return room.status === 'reserved';
      case 'my-reservation':
        return myReservationIds.includes(room.id);
      case 'myRoom':
        return room.trainerId === CURRENT_USER_ID;
      default:
        return true;
    }
  });

  /**
   * 방 카드 클릭 핸들러
   */
  const handleRoomClick = (room: PTRoom) => {
    setSelectedRoom(room);
    setShowDetailModal(true);
  };

  /**
   * 상세 모달 닫기
   */
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRoom(null);
  };

  /**
   * 방 참여 핸들러
   */
  const handleJoinRoom = (room: PTRoom, entryCode?: string) => {
    console.log('방 참여:', room.id, entryCode);
    /* 화상통화 화면으로 전환 */
    setActiveCallRoom(room);
    setInVideoCall(true);
    closeDetailModal();
  };

  /**
   * 방 예약 핸들러
   */
  const handleReserveRoom = (room: PTRoom) => {
    console.log('방 예약:', room.id);
    /* TODO: 예약 API 호출 */
    alert('예약이 완료되었습니다!');
    closeDetailModal();
  };

  /**
   * 예약 취소 핸들러
   */
  const handleCancelReservation = (room: PTRoom) => {
    console.log('예약 취소:', room.id);
    /* TODO: 예약 취소 API 호출 */
    alert('예약이 취소되었습니다.');
    closeDetailModal();
  };

  /**
   * 방 생성 핸들러
   */
  const handleCreateRoom = (data: CreateRoomData) => {
    console.log('방 생성:', data);
    /* TODO: 방 생성 API 호출 */
    
    /* 실시간 방인 경우 바로 화상통화로 이동 */
    if (data.roomType === 'instant') {
      const newRoom: PTRoom = {
        id: `room-new-${Date.now()}`,
        title: data.title,
        description: data.description,
        trainerId: 'current-user',
        trainerName: '나',
        status: 'live',
        visibility: data.isPrivate ? 'private' : 'public',
        maxParticipants: data.maxParticipants,
        currentParticipants: 1,
        startedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      
      setActiveCallRoom(newRoom);
      setInVideoCall(true);
    } else {
      alert('예약 방이 생성되었습니다!');
    }
    
    setShowCreateModal(false);
  };

  /**
   * 방 시작 핸들러 (트레이너 전용)
   */
  const handleStartRoom = (room: PTRoom) => {
    console.log('방 시작:', room.id);
    setSelectedRoom(null);
    setActiveCallRoom(room);
  };

  /**
   * 화상통화 종료 핸들러
   */
  const handleLeaveCall = () => {
    setInVideoCall(false);
    setActiveCallRoom(null);
  };

  /**
   * 화상통화 중일 때 화상통화 UI 렌더링
   */
  if (inVideoCall && activeCallRoom) {
    return (
      <VideoCallRoom 
        room={activeCallRoom} 
        onLeave={handleLeaveCall} 
        isTrainer={IS_CURRENT_USER_TRAINER}
        userName={IS_CURRENT_USER_TRAINER ? `[트레이너] ${activeCallRoom.trainerName}` : '회원닉네임'}
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
          <button
            className={`filter-btn ${activeFilter === 'my-reservation' ? 'active' : ''}`}
            onClick={() => setActiveFilter('my-reservation')}
          >
            내 예약
          </button>
          {/* 트레이너 전용 필터 */}
          {IS_CURRENT_USER_TRAINER && (
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
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <PTRoomCard 
              key={room.id} 
              room={room} 
              onClick={handleRoomClick}
            />
          ))
        ) : (
          /* 빈 상태 */
          <div className="pt-empty-state">
            <Video className="pt-empty-icon" />
            <h3 className="pt-empty-title">
              {activeFilter === 'my-reservation' 
                ? '예약된 화상PT가 없습니다'
                : '진행 중인 화상PT가 없습니다'
              }
            </h3>
            <p className="pt-empty-desc">
              {activeFilter === 'my-reservation'
                ? '관심있는 화상PT를 예약해보세요'
                : '새로운 화상PT가 등록되면 여기에 표시됩니다'
              }
            </p>
          </div>
        )}
      </div>

      {/* 트레이너인 경우 FAB 버튼 표시 */}
      {IS_CURRENT_USER_TRAINER && (
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
          onClose={() => setSelectedRoom(null)}
          onJoin={handleJoinRoom}
          onReserve={handleReserveRoom}
          onCancelReservation={handleCancelReservation}
          isReserved={myReservationIds.includes(selectedRoom.id)}
          isTrainer={IS_CURRENT_USER_TRAINER}
          isMyRoom={selectedRoom.trainerId === CURRENT_USER_ID}
          onStartRoom={handleStartRoom}
        />
      )}

      {/* 방 생성 모달 */}
      {showCreateModal && (
        <PTCreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRoom}
        />
      )}
    </div>
  );
}