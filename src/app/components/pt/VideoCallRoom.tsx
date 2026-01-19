/**
 * VideoCallRoom.tsx
 * 화상통화 UI 컴포넌트
 * WebRTC 연결 UI (PT-011 ~ PT-014)
 * TODO: 실제 WebRTC 연결은 백엔드 연동 시 구현
 */

import { useState, useEffect } from 'react';
import { 
  Headphones, 
  HeadphoneOff,
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone,
  Monitor,
  MonitorOff,
  MoreVertical,
  User
} from 'lucide-react';
import { PTRoom, Participant, DUMMY_PARTICIPANTS } from '../../../data/pts';

/**
 * Props 타입 정의
 */
interface VideoCallRoomProps {
  room: PTRoom;
  onLeave: () => void;
  isTrainer?: boolean;
}

/**
 * 연결 상태 타입
 */
type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'failed';

/**
 * VideoCallRoom 컴포넌트
 */
export default function VideoCallRoom({ room, onLeave, isTrainer = false }: VideoCallRoomProps) {
  /**
   * 미디어 상태
   */
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mainVideoId, setMainVideoId] = useState<string>('local');
  
  /**
   * UI 상태
   */
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  
  /**
   * 참여자 목록 (더미 데이터 사용)
   * TODO: 실제 WebRTC 연결에서 참여자 목록 관리
   */
  const participants = [
    { id: 'local', name: '나', isLocal: true },
    { id: 'trainer-1', name: room.trainerName, isTrainer: true },
    { id: 'user-1', name: '참여자1', isLocal: false },
    { id: 'user-2', name: '참여자2', isLocal: false },
  ];

  /**
   * 연결 상태 시뮬레이션
   * TODO: 실제 WebRTC 연결 시 삭제
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  /**
   * 통화 시간 카운터
   */
  useEffect(() => {
    if (connectionStatus !== 'connected') return;
    
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [connectionStatus]);

  /**
   * 시간 포맷팅
   */
  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * 헤드셋 토글
   */
  const toggleHead = () => {
    setIsAudioEnabled(!isAudioEnabled);
    /* TODO: 실제 헤드셋 on/off 구현 */
  };

  /**
   * 마이크 토글
   */
  const toggleMic = () => {
    setIsMuted(!isMuted);
    /* TODO: 실제 마이크 on/off 구현 */
  };

  /**
   * 카메라 토글
   */
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    /* TODO: 실제 카메라 on/off 구현 */
  };

  /**
   * 화면 공유 토글
   */
  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    setShowMoreMenu(false);
    /* TODO: 실제 화면 공유 구현 */
  };

  /**
   * 종료 버튼 클릭 핸들러
   */
  const handleLeaveClick = () => {
    setShowLeaveConfirm(true);
  };

  /**
   * 종료 확인 핸들러
   */
  const handleLeaveConfirm = () => {
    setShowLeaveConfirm(false);
    onLeave();
  };

  /**
   * 재연결 시도
   */
  const handleRetry = () => {
    setConnectionStatus('connecting');
    /* TODO: 실제 재연결 로직 */
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
  };

  /**
   * 참여자 수에 따른 그리드 클래스
   */
  const getGridClass = (): string => {
    const count = participants.length;
    if (count <= 1) return 'participants-1';
    if (count <= 2) return 'participants-2';
    if (count <= 4) return 'participants-4';
    return 'participants-6';
  };

  /**
   * 연결 상태 렌더링
   */
  const renderConnectionStatus = () => {
    if (connectionStatus === 'connected') {
      return (
        <>
          <span className="videocall-status-dot" />
          <span>연결됨</span>
        </>
      );
    }
    
    if (connectionStatus === 'connecting' || connectionStatus === 'reconnecting') {
      return (
        <>
          <span className="videocall-status-dot connecting" />
          <span>{connectionStatus === 'connecting' ? '연결 중...' : '재연결 중...'}</span>
        </>
      );
    }
    
    return (
      <>
        <span className="videocall-status-dot error" />
        <span>연결 실패</span>
      </>
    );
  };

  /**
   * 연결 오버레이 (연결 중/실패 시)
   */
  const renderConnectionOverlay = () => {
    if (connectionStatus === 'connected') return null;
    
    if (connectionStatus === 'failed') {
      return (
        <div className="videocall-connection-overlay">
          <span className="videocall-connection-text">연결에 실패했습니다</span>
          <button className="videocall-connection-retry" onClick={handleRetry}>
            다시 연결
          </button>
        </div>
      );
    }
    
    return (
      <div className="videocall-connection-overlay">
        <div className="videocall-waiting-spinner" />
        <span className="videocall-connection-text">
          {connectionStatus === 'connecting' ? '연결 중...' : '재연결 중...'}
        </span>
      </div>
    );
  };

  /**
   * 비디오 타일 렌더링
   */
  const renderVideoTile = (participant: Participant) => {
    return (
      <div key={participant.id} className="videocall-tile">
        {/* 비디오 또는 플레이스홀더 */}
        {participant.isVideoOff ? (
          <div className="videocall-placeholder">
            <div className="videocall-avatar">
              <User className="videocall-avatar-icon" />
            </div>
          </div>
        ) : (
          /* TODO: 실제 비디오 스트림 연결 */
          <div className="videocall-placeholder">
            <div className="videocall-avatar">
              <User className="videocall-avatar-icon" />
            </div>
          </div>
        )}

        {/* 트레이너 뱃지 */}
        {participant.isTrainer && (
          <span className="videocall-trainer-badge">트레이너</span>
        )}

        {/* 참여자 정보 */}
        <div className="videocall-participant-info">
          <span className="videocall-participant-name">{participant.name}</span>
          {participant.isMuted ? (
            <MicOff className="videocall-mic-status muted" />
          ) : (
            <Mic className="videocall-mic-status unmuted" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="videocall-container">
      {/* 헤더 */}
      <header className="videocall-header">
        <div className="videocall-info">
          <h1 className="videocall-title">{room.title}</h1>
          <div className="videocall-status">
            {renderConnectionStatus()}
          </div>
        </div>
        
        {connectionStatus === 'connected' && (
          <div className="videocall-timer">
            {formatDuration(callDuration)}
          </div>
        )}
      </header>

      {/* 비디오 영역 */}
      <div className="vc-video-layout">
        {/* 메인 비디오 */}
        <div className="vc-main-video">
          <div className="vc-video-placeholder">
            <User size={64} />
          </div>
          <span className="vc-video-name">
            {participants.find(p => p.id === mainVideoId)?.name || '나'}
            {mainVideoId === 'local' && ' (나)'}
          </span>
        </div>
        
        {/* 서브 비디오 목록 */}
        <div className="vc-sub-videos">
          {participants
            .filter(p => p.id !== mainVideoId)
            .map(participant => (
              <div 
                key={participant.id} 
                className="vc-sub-video"
                onClick={() => setMainVideoId(participant.id)}
              >
                <div className="vc-sub-video-placeholder">
                  <User size={24} />
                </div>
                <span className="vc-sub-video-name">
                  {participant.name}
                  {participant.isLocal && ' (나)'}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* 화면 공유 시 오버레이 */}
      {isScreenSharing && (
        <div className="videocall-screenshare">
          <div className="videocall-placeholder">
            <Monitor size={64} style={{ color: 'var(--color-gray-500)' }} />
          </div>
          <div className="videocall-screenshare-badge">
            <Monitor size={16} />
            화면 공유 중
          </div>
        </div>
      )}

      {/* 연결 상태 오버레이 */}
      {renderConnectionOverlay()}

      {/* 컨트롤 바 */}
      <div className="videocall-controls">
        {/* 헤드셋 */}
        <button 
          className={`videocall-control-btn ${!isAudioEnabled ? 'active' : ''}`}
          onClick={toggleHead}
        >
          {isAudioEnabled ? (
            <HeadphoneOff className="videocall-control-icon" /> 
          ) : ( 
            <Headphones className="videocall-control-icon" />
          )}
        </button>
        
        {/* 마이크 */}
        <button 
          className={`videocall-control-btn ${!isMuted ? 'active' : ''}`}
          onClick={toggleMic}
        >
          {isMuted ? (
            <MicOff className="videocall-control-icon" />
          ) : (
            <Mic className="videocall-control-icon" />
          )}
        </button>

        {/* 카메라 */}
        <button 
          className={`videocall-control-btn ${!isVideoOff ? 'active' : ''}`}
          onClick={toggleVideo}
        >
          {isVideoOff ? (
            <VideoOff className="videocall-control-icon" />
          ) : (
            <Video className="videocall-control-icon" />
          )}
        </button>

        {/* 화면공유 토글 - 트레이너 전용 */}
        {isTrainer && (
          <button 
            className={`videocall-control-btn ${isScreenSharing ? 'active' : ''}`}
            onClick={toggleScreenShare}
          >
            {isScreenSharing ? (
              <MonitorOff className="videocall-control-icon" />
            ) : ( 
              <Monitor className="videocall-control-icon" />
            )}
          </button>
        )}
        
        {/* 통화 종료 */}
        <button 
          className="videocall-control-btn danger"
          onClick={handleLeaveClick}
        >
          <Phone className="videocall-control-icon" />
        </button>

        {/* 종료 확인 팝업 */}
        {showLeaveConfirm && (
          <div className="modal-overlay" style={{ zIndex: 'var(--z-modal)' }} onClick={(e) => {
            if (e.target === e.currentTarget) setShowLeaveConfirm(false);
          }}>
            <div className="vc-leave-popup">
              <div className="vc-leave-popup-icon">
                <Phone size={32} />
              </div>
              <h3 className="vc-leave-popup-title">PT를 종료하시겠습니까?</h3>
              {isTrainer && (
                <p className="vc-leave-popup-desc">
                  트레이너가 PT를 종료하면<br />다른 회원들도 PT가 종료됩니다.
                </p>
              )}
              <div className="vc-leave-popup-actions">
                <button 
                  className="vc-leave-popup-btn cancel"
                  onClick={() => setShowLeaveConfirm(false)}
                >
                  취소
                </button>
                <button 
                  className="vc-leave-popup-btn confirm"
                  onClick={handleLeaveConfirm}
                >
                  종료하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
