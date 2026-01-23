/**
 * VideoCallRoom.tsx
 * 화상통화 UI 컴포넌트
 * WebRTC 연결 UI (PT-011 ~ PT-014)
 * TODO: 실제 WebRTC 연결은 백엔드 연동 시 구현
 */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
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
  User,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { useJanus, RoomEndReason } from '../../../hooks/useJanus';
import { leavePTRoom, updatePTRoomStatus, getPTRoomParticipants } from '../../../api/pt';
import type { GetPTRoomDetailResponse, PTParticipantUser } from '../../../api/types/pt';

/**
 * Props 타입 정의
 */
interface VideoCallRoomProps {
  room: GetPTRoomDetailResponse;
  onLeave: () => void;
  isTrainer?: boolean;
  userName?: string;
  userProfileImage?: string | null;
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
    userName = '사용자',
    userProfileImage = null
 }: VideoCallRoomProps) {
  const { user: userInfo } = useAuth();

  /**
   * 비디오 엘리먼트 참조
   */
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const subLocalVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  /**
   * Janus 훅 사용
   * janusRoomKey를 숫자로 변환
   */
  const janusRoomId = room.janusRoomKey ? parseInt(room.janusRoomKey, 10) : 30000 + room.ptRoomId;

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
    roomId: janusRoomId,
    displayName: userName || '사용자',
    trainerName: room.trainer.nickname,
    onError: (error) => {
      console.error('Janus 에러:', error);
    },
    onRoomDestroyed: (reason) => {
      console.log('방이 종료되어 퇴장합니다. 사유:', reason);
      if (!isTrainer) {
        setRoomEndReason(reason);
      } else {
        onLeave();
      }
    }
  });

  /**
   * UI 상태
   */
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [mainVideoId, setMainVideoId] = useState<string>('local');
  const [callDuration, setCallDuration] = useState(0);
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [roomEndReason, setRoomEndReason] = useState<RoomEndReason | null>(null);

  /* 참여자 프로필 정보 */
  const [participantProfiles, setParticipantProfiles] = useState<Map<string, PTParticipantUser>>(new Map());

  /**
   * 트레이너 입장 시 메인 화면으로 설정
   */
  useEffect(() => {
    if (isTrainer) return;
    
    const trainer = participants.find(p => p.isTrainer && !p.isLocal);

    /* 디버깅용 로그 */
    console.log('참가자 목록:', participants.map(p => ({ id: p.id, name: p.name, isTrainer: p.isTrainer, isLocal: p.isLocal })));
    console.log('찾은 트레이너:', trainer);
    
    if (trainer) {
      setMainVideoId(trainer.id);
    }
  }, [participants, isTrainer]);

  /**
   * 참여자 프로필 정보 주기적 조회
   */
  useEffect(() => {
    if (connectionStatus !== 'connected') return;

    const fetchParticipantProfiles = async () => {
      try {
        const response = await getPTRoomParticipants(room.ptRoomId);
        const profileMap = new Map<string, PTParticipantUser>();
        
        response.users.forEach(user => {
          profileMap.set(user.handle, user);
        });
        
        setParticipantProfiles(profileMap);
      } catch (err) {
        console.error('참여자 프로필 조회 실패:', err);
      }
    };

    /* 초기 조회 */
    fetchParticipantProfiles();

    /* 10초마다 갱신 (참여자 변경 감지) */
    const interval = setInterval(fetchParticipantProfiles, 10000);

    return () => clearInterval(interval);
  }, [connectionStatus, room.ptRoomId]);

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
    if (localStream) {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      if (subLocalVideoRef.current) {
        subLocalVideoRef.current.srcObject = localStream;
      }
    }
  }, [localStream, mainVideoId]);

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
   * 참가자의 프로필 이미지 URL 가져오기
   */
  const getParticipantProfileImage = (participant: typeof participants[0]): string | null => {
    /* 로컬(나)인 경우 내 프로필 사용 */
    if (participant.isLocal) {
      return userInfo?.profileImageUrl || null;
    }
    
    /* 트레이너인 경우 room에서 가져옴 */
    if (participant.isTrainer) {
      return room.trainer.profileImageUrl || null;
    }
    
    /* 그 외 참가자는 API에서 가져온 프로필 사용 */
    /* participant.name이 nickname이므로, 프로필 맵에서 nickname으로 찾기 */
    for (const [, profile] of participantProfiles) {
      if (profile.nickname === participant.name) {
        return profile.profileImageUrl || null;
      }
    }
    
    return null;
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
   * 입장 코드 복사
   */
  const handleCopyEntryCode = async () => {
    if (!room.entryCode) return;
    
    try {
      await navigator.clipboard.writeText(room.entryCode);
      setIsCodeCopied(true);
      setTimeout(() => setIsCodeCopied(false), 2000);
    } catch (err) {
      console.error('코드 복사 실패:', err);
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
  const handleLeaveConfirm = async () => {
    setShowLeaveConfirm(false);
    disconnect();
    
    try {
      /* 트레이너인 경우 방 종료 후 퇴장 */
      if (isTrainer) {
        await updatePTRoomStatus(room.ptRoomId, { status: 'ENDED' });
      }
      await leavePTRoom(room.ptRoomId);
    } catch (err) {
      console.error('퇴장 API 호출 실패:', err);
    }
    
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

        <div className="videocall-header-right">
          {room.isPrivate && room.entryCode && (
            <div className="videocall-entry-code">
              <Lock size={12} />
              <span className="videocall-entry-code-value">{room.entryCode}</span>
              <button 
                className="videocall-entry-code-copy"
                onClick={handleCopyEntryCode}
              >
                {isCodeCopied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          )}
          
          {connectionStatus === 'connected' && (
            <div className="videocall-timer">
              {formatDuration(callDuration)}
            </div>
          )}
        </div>
      </header>

      {/* 비디오 영역 */}
      <div className="vc-video-layout">
        {/* 메인 비디오 */}
        <div className="vc-main-video">
          {mainParticipant ? (
            mainParticipant.isLocal ? (
              /* 내 영상 (메인) */
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: localStream && !isVideoOff ? 'block' : 'none'
                }}
              />
            ) : (
              /* 다른 참가자 영상 (메인) */
              <video
                key={`main-${mainParticipant.id}`}
                ref={(el) => {
                  if (el && mainParticipant.stream) {
                    el.srcObject = mainParticipant.stream;
                  }
                }}
                autoPlay
                playsInline
                muted={isAudioMuted}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: localStream ? 'block' : 'none'
                }}
              />
            )
          ) : null}
          
          {/* 스트림 없을 때 플레이스홀더 */}
          {(!mainParticipant || (mainParticipant.isLocal ? !localStream || isVideoOff : !mainParticipant.stream)) && (
            <div className="vc-video-placeholder">
              {mainParticipant && getParticipantProfileImage(mainParticipant) ? (
                <img 
                  src={getParticipantProfileImage(mainParticipant)!} 
                  alt={mainParticipant.name} 
                  className="vc-video-profile-img" 
                />
              ) : (
                <User size={48} className="mypage-profile-placeholder" />
              )}
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
                {participant.isLocal ? (
                  /* 내 영상 (서브) */
                  <>
                    <video
                      ref={subLocalVideoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        display: localStream && !isVideoOff ? 'block' : 'none'
                      }}
                    />
                    {(!localStream || isVideoOff) && (
                    <div className="vc-sub-video-placeholder">
                      {getParticipantProfileImage(participant) ? (
                        <img 
                          src={getParticipantProfileImage(participant)!} 
                          alt={participant.name} 
                          className="vc-sub-video-profile-img"
                        />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                  )}
                </>
                ) : (
                  /* 다른 참가자 영상 (서브) */
                  <>
                    <video
                      key={`sub-${participant.id}`}
                      ref={(el) => {
                        if (el && participant.stream) {
                          el.srcObject = participant.stream;
                        }
                      }}
                      autoPlay
                      playsInline
                      muted={isAudioMuted}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        display: participant.stream ? 'block' : 'none'
                      }}
                    />
                    {!participant.stream && (
                    <div className="vc-sub-video-placeholder">
                      {getParticipantProfileImage(participant) ? (
                        <img 
                          src={getParticipantProfileImage(participant)!} 
                          alt={participant.name} 
                          className="vc-sub-video-profile-img"
                        />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                  )}
                </>
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

        {/* 방 종료 알림 팝업 (일반 유저용) */}
        {roomEndReason && (
          <div className="modal-overlay" style={{ zIndex: 'var(--z-modal)' }}>
            <div className="vc-leave-popup">
              <div className={`vc-leave-popup-icon ${roomEndReason === 'ADMIN_CLOSED' ? 'admin' : 'ended'}`}>
                <Phone size={32} />
              </div>
              <h3 className="vc-leave-popup-title">
                {roomEndReason === 'ADMIN_CLOSED' 
                  ? 'PT가 강제 종료되었습니다' 
                  : 'PT가 종료되었습니다'
                }
              </h3>
              <p className="vc-leave-popup-desc">
                {roomEndReason === 'ADMIN_CLOSED' 
                  ? '관리자에 의해 화상PT가 강제 종료되었습니다.'
                  : '트레이너가 화상PT를 종료했습니다.'
                }
              </p>
              <div className="vc-leave-popup-actions">
                <button 
                  className="vc-leave-popup-btn confirm"
                  onClick={() => {
                    setRoomEndReason(null);
                    onLeave();
                  }}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
