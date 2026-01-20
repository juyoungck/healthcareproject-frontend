/**
 * VideoCallRoom.tsx
 * 화상통화 UI 컴포넌트
 * WebRTC 연결 UI (PT-011 ~ PT-014)
 * TODO: 실제 WebRTC 연결은 백엔드 연동 시 구현
 */

import { useState, useEffect, useRef } from 'react';
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
import { Participant, PTRoom } from '../../../data/pts';
import { useJanus, JanusParticipant } from '../../../hooks/useJanus';

/**
 * Props 타입 정의
 */
interface VideoCallRoomProps {
  room: PTRoom;
  onLeave: () => void;
  isTrainer?: boolean;
  userName?: string;
}

/**
 * 연결 상태 타입
 */
type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'failed';

/**
 * VideoCallRoom 컴포넌트
 */
export default function VideoCallRoom({ 
    room, 
    onLeave, 
    isTrainer = false,
    userName = '사용자'
 }: VideoCallRoomProps) {

  /**
   * 비디오 엘리먼트 참조
   */
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  /**
   * Janus 훅 사용
   */
  const {
    connectionStatus,
    localStream,
    participants,
    connect,
    disconnect,
    toggleAudio,
    toggleMic,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    isAudioMuted,
    isMicMuted,
    isVideoOff,
    isScreenSharing
  } = useJanus({
    roomId: room.id,  // 30000번대 숫자 ID
    displayName: userName,
    trainerName: room.trainerName,
    onError: (error) => {
      console.error('Janus 에러:', error);
    }
  });

  /**
   * UI 상태
   */
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [mainVideoId, setMainVideoId] = useState<string>('local');
  const [callDuration, setCallDuration] = useState(0);

  /**
   * 트레이너 입장 시 메인 화면으로 설정
   */
  useEffect(() => {
    const trainer = participants.find(p => p.isTrainer && !p.isLocal);
    if (trainer && mainVideoId === 'local') {
      setMainVideoId(trainer.id);
    }
  }, [participants]);

  /**
   * 컴포넌트 마운트 시 연결 시작
   */
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  /**
   * 로컬 스트림을 비디오 엘리먼트에 연결
   */
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

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
   * 헤드셋(소리 듣기) 토글
   */
  const handleToggleAudio = () => {
    toggleAudio();
  };

  /**
   * 마이크 토글
   */
  const handleToggleMic = () => {
    toggleMic();
  };

  /**
   * 카메라 토글
   */
  const handleToggleVideo = () => {
    toggleVideo();
  };

  /**
   * 화면 공유 토글
   */
  const handleToggleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
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
    disconnect();
    onLeave();
  };

  /**
   * 재연결 시도
   */
  const handleRetry = () => {
    connect();
  };

  /**
   * 원격 비디오 ref 설정
   */
  const setRemoteVideoRef = (id: string, element: HTMLVideoElement | null) => {
    if (element) {
      remoteVideoRefs.current.set(id, element);
      /* 참가자의 스트림 연결 */
      const participant = participants.find(p => p.id === id);
      if (participant?.stream) {
        element.srcObject = participant.stream;
      }
    } else {
      remoteVideoRefs.current.delete(id);
    }
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
   * 메인 비디오에 표시할 참가자 찾기
   */
  const mainParticipant = participants.find(p => p.id === mainVideoId) || participants[0];

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
          {mainParticipant ? (
            mainParticipant.isLocal ? (
              /* 내 영상 */
              localStream ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="vc-video-placeholder">
                  <User size={64} />
                </div>
              )
            ) : (
              /* 다른 참가자 영상 */
              mainParticipant.stream ? (
                <video
                  ref={(el) => el && setRemoteVideoRef(mainParticipant.id, el)}
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="vc-video-placeholder">
                  <User size={64} />
                </div>
              )
            )
          ) : (
            <div className="vc-video-placeholder">
              <User size={64} />
            </div>
          )}
          <span className="vc-video-name">
            {mainParticipant?.name || '대기중'}
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
                {participant.stream ? (
                  <video
                    ref={(el) => el && setRemoteVideoRef(participant.id, el)}
                    autoPlay
                    playsInline
                    muted={participant.isLocal || !isAudioMuted}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="vc-sub-video-placeholder">
                    <User size={24} />
                  </div>
                )}
                <span className="vc-sub-video-name">
                  {participant.name}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* 화면 공유 시 오버레이 */}
      {isScreenSharing && (
        <div className="videocall-screenshare-badge">
          <Monitor size={16} />
          화면 공유 중
        </div>
      )}

      {/* 연결 상태 오버레이 */}
      {renderConnectionOverlay()}

      {/* 컨트롤 바 */}
      <div className="videocall-controls">
        {/* 헤드셋 */}
        <button 
          className={`videocall-control-btn ${!isAudioMuted ? 'active' : ''}`}
          onClick={handleToggleAudio}
        >
          {isAudioMuted ? (
            <HeadphoneOff className="videocall-control-icon" /> 
          ) : ( 
            <Headphones className="videocall-control-icon" />
          )}
        </button>
        
        {/* 마이크 */}
        <button 
          className={`videocall-control-btn ${!isMicMuted ? 'active' : ''}`}
          onClick={handleToggleMic}
        >
          {isMicMuted ? (
            <MicOff className="videocall-control-icon" />
          ) : (
            <Mic className="videocall-control-icon" />
          )}
        </button>

        {/* 카메라 */}
        <button 
          className={`videocall-control-btn ${!isVideoOff ? 'active' : ''}`}
          onClick={handleToggleVideo}
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
            onClick={handleToggleScreenShare}
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
