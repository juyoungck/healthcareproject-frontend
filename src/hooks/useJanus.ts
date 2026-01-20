/**
 * useJanus.ts
 * Janus WebRTC 연결 관리 커스텀 훅
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Janus 서버 URL
 * TODO: 환경변수로 분리 권장
 */
const JANUS_SERVER = 'https://janus.jsflux.co.kr/janus';

/**
 * 참가자 타입
 */
export interface JanusParticipant {
  id: string;
  name: string;
  stream?: MediaStream;
  isLocal: boolean;
  isTrainer?: boolean;
  isAudioMuted?: boolean;
  isMicMuted?: boolean;
  isVideoOff?: boolean;
}

/**
 * 연결 상태 타입
 */
export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'failed';

/**
 * useJanus 훅 옵션
 */
interface UseJanusOptions {
  roomId: number;
  displayName: string;
  trainerName?: string;
  onError?: (error: string) => void;
}

/**
 * useJanus 훅 반환 타입
 */
interface UseJanusReturn {
  /* 상태 */
  connectionStatus: ConnectionStatus;
  localStream: MediaStream | null;
  participants: JanusParticipant[];
  
  /* 액션 */
  connect: () => void;
  disconnect: () => void;
  toggleAudio: () => void;
  toggleMic: () => void;
  toggleVideo: () => void;
  startScreenShare: () => void;
  stopScreenShare: () => void;
  
  /* 미디어 상태 */
  isAudioMuted: boolean;
  isMicMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
}

/**
 * Janus WebRTC 연결 관리 훅
 */
export function useJanus({ roomId, displayName, trainerName, onError }: UseJanusOptions): UseJanusReturn {
  /**
   * Janus 인스턴스 참조
   */
  const janusRef = useRef<any>(null);
  const publisherRef = useRef<any>(null);
  const feedsRef = useRef<Map<number, any>>(new Map());
  
  /**
   * 상태
   */
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<JanusParticipant[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  /**
   * 내 ID 및 private_id 참조
   */
  const myIdRef = useRef<number | null>(null);
  const myPvtIdRef = useRef<number | null>(null);

  /**
   * 새 원격 피드 구독
   */
  const subscribeToFeed = useCallback((id: number, display: string, audio: string, video: string) => {
    if (!janusRef.current) return;
    
    janusRef.current.attach({
      plugin: 'janus.plugin.videoroom',
      opaqueId: `subscriber-${window.Janus.randomString(12)}`,
      
      success: (pluginHandle: any) => {
        const remoteFeed = pluginHandle;
        remoteFeed.rfid = id;
        remoteFeed.rfdisplay = display;
        
        feedsRef.current.set(id, remoteFeed);
        
        /* 구독 요청 */
        const subscribe = {
          request: 'join',
          room: roomId,
          ptype: 'subscriber',
          feed: id,
          private_id: myPvtIdRef.current
        };
        
        remoteFeed.send({ message: subscribe });
      },
      
      error: (error: string) => {
        console.error('원격 피드 연결 에러:', error);
        onError?.(error);
      },
      
      onmessage: (msg: any, jsep: any) => {
        if (jsep) {
          const feed = feedsRef.current.get(id);
          if (feed) {
            feed.createAnswer({
              jsep: jsep,
              media: { audioSend: false, videoSend: false },
              success: (jsep: any) => {
                feed.send({ message: { request: 'start', room: roomId }, jsep: jsep });
              },
              error: (error: Error) => {
                console.error('Answer 생성 에러:', error);
              }
            });
          }
        }
      },
      
      onremotestream: (stream: MediaStream) => {
        const isTrainerParticipant = trainerName ? display.includes(trainerName) : false;
  
        /* 참가자 목록에 추가 */
        setParticipants(prev => {
          const exists = prev.find(p => p.id === `remote-${id}`);
          if (exists) {
            return prev.map(p => 
              p.id === `remote-${id}` ? { ...p, stream, isTrainer: isTrainerParticipant } : p
            );
          }
          return [...prev, {
            id: `remote-${id}`,
            name: display,
            stream,
            isLocal: false,
            isTrainer: isTrainerParticipant,
            isAudioMuted: false,
            isMicMuted: false,
            isVideoOff: false
          }];
        });
      },
      
      oncleanup: () => {
        /* 참가자 목록에서 제거 */
        setParticipants(prev => prev.filter(p => p.id !== `remote-${id}`));
        feedsRef.current.delete(id);
      }
    });
  }, [roomId, onError]);

  /**
   * Janus 연결
   */
  const connect = useCallback(() => {
    if (connectionStatus === 'connecting' || connectionStatus === 'connected') return;
    
    setConnectionStatus('connecting');
    
    /* Janus 초기화 */
    window.Janus.init({
      debug: 'all',
      callback: () => {
        /* Janus 세션 생성 */
        janusRef.current = new window.Janus({
          server: JANUS_SERVER,
          
          success: () => {
            /* VideoRoom 플러그인 연결 */
            janusRef.current.attach({
              plugin: 'janus.plugin.videoroom',
              opaqueId: `publisher-${window.Janus.randomString(12)}`,
              
              success: (pluginHandle: any) => {
                publisherRef.current = pluginHandle;
                
                /* 방 생성 시도 (이미 있으면 무시됨) */
                const createRoom = {
                  request: 'create',
                  room: roomId,
                  permanent: false,
                  publishers: 6,
                  bitrate: 128000,
                  fir_freq: 10,
                  ptype: 'publisher',
                  description: 'PT Room',
                  is_private: false
                };
                
                pluginHandle.send({
                  message: createRoom,
                  success: () => {
                    /* 방 참여 */
                    const join = {
                      request: 'join',
                      room: roomId,
                      ptype: 'publisher',
                      display: displayName
                    };
                    pluginHandle.send({ message: join });
                  }
                });
              },
              
              error: (error: string) => {
                console.error('플러그인 연결 에러:', error);
                setConnectionStatus('failed');
                onError?.(error);
              },
              
              onmessage: (msg: any, jsep: any) => {
                const event = msg.videoroom;
                
                if (event === 'joined') {
                  /* 방 입장 성공 */
                  myIdRef.current = msg.id;
                  myPvtIdRef.current = msg.private_id;
                  
                  /* 내 영상 송출 시작 */
                  publishOwnFeed();
                  
                  /* 기존 참가자 구독 */
                  if (msg.publishers) {
                    msg.publishers.forEach((pub: any) => {
                      subscribeToFeed(pub.id, pub.display, pub.audio_codec, pub.video_codec);
                    });
                  }
                  
                } else if (event === 'event') {
                  /* 새 참가자 입장 */
                  if (msg.publishers) {
                    msg.publishers.forEach((pub: any) => {
                      subscribeToFeed(pub.id, pub.display, pub.audio_codec, pub.video_codec);
                    });
                  }
                  
                  /* 참가자 퇴장 */
                  if (msg.leaving) {
                    const feed = feedsRef.current.get(msg.leaving);
                    if (feed) {
                      feed.detach();
                      feedsRef.current.delete(msg.leaving);
                      setParticipants(prev => prev.filter(p => p.id !== `remote-${msg.leaving}`));
                    }
                  }
                  
                  if (msg.unpublished) {
                    if (msg.unpublished === 'ok') {
                      publisherRef.current?.hangup();
                    } else {
                      const feed = feedsRef.current.get(msg.unpublished);
                      if (feed) {
                        feed.detach();
                        feedsRef.current.delete(msg.unpublished);
                        setParticipants(prev => prev.filter(p => p.id !== `remote-${msg.unpublished}`));
                      }
                    }
                  }
                }
                
                if (jsep) {
                  publisherRef.current?.handleRemoteJsep({ jsep });
                }
              },
              
              onlocalstream: (stream: MediaStream) => {
                setLocalStream(stream);
                setConnectionStatus('connected');
                
                /* 로컬 참가자 추가 */
                setParticipants(prev => {
                  const exists = prev.find(p => p.id === 'local');
                  if (exists) {
                    return prev.map(p => p.id === 'local' ? { ...p, stream } : p);
                  }
                  return [{
                    id: 'local',
                    name: displayName + ' (나)',
                    stream,
                    isLocal: true,
                    isAudioMuted: false,
                    isMicMuted: false,
                    isVideoOff: false
                  }, ...prev];
                });
              },
              
              oncleanup: () => {
                setLocalStream(null);
              }
            });
          },
          
          error: (error: string) => {
            console.error('Janus 연결 에러:', error);
            setConnectionStatus('failed');
            onError?.(error);
          },
          
          destroyed: () => {
            setConnectionStatus('idle');
          }
        });
      }
    });
  }, [roomId, displayName, connectionStatus, subscribeToFeed, onError]);

  /**
   * 내 영상 송출
   */
  const publishOwnFeed = useCallback(() => {
    publisherRef.current?.createOffer({
      media: {
        audioRecv: false,
        videoRecv: false,
        audioSend: true,
        videoSend: true
      },
      success: (jsep: any) => {
        const publish = { request: 'configure', audio: true, video: true };
        publisherRef.current?.send({ message: publish, jsep });
      },
      error: (error: Error) => {
        console.error('Offer 생성 에러:', error);
        onError?.(error.message);
      }
    });
  }, [onError]);

  /**
   * 연결 해제
   */
  const disconnect = useCallback(() => {
    /* 모든 원격 피드 해제 */
    feedsRef.current.forEach(feed => {
      feed.detach();
    });
    feedsRef.current.clear();
    
    /* 퍼블리셔 해제 */
    if (publisherRef.current) {
      publisherRef.current.send({ message: { request: 'unpublish' } });
      publisherRef.current = null;
    }
    
    /* Janus 세션 종료 */
    if (janusRef.current) {
      janusRef.current.destroy();
      janusRef.current = null;
    }
    
    setParticipants([]);
    setLocalStream(null);
    setConnectionStatus('idle');
  }, []);

  /**
   * 소리 듣기 토글 (헤드셋)
   */
  const toggleAudio = useCallback(() => {
    setIsAudioMuted(prev => !prev);
  }, []);

  /**
   * 오디오 토글
   */
  const toggleMic = useCallback(() => {
    if (publisherRef.current) {
      if (isMicMuted) {
        publisherRef.current.unmuteAudio();
      } else {
        publisherRef.current.muteAudio();
      }
      setIsMicMuted(!isMicMuted);
    }
  }, [isMicMuted]);

  /**
   * 비디오 토글
   */
  const toggleVideo = useCallback(() => {
    if (publisherRef.current) {
      if (isVideoOff) {
        publisherRef.current.unmuteVideo();
      } else {
        publisherRef.current.muteVideo();
      }
      setIsVideoOff(!isVideoOff);
    }
  }, [isVideoOff]);

  /**
   * 화면공유 시작
   */
  const startScreenShare = useCallback(() => {
    if (!publisherRef.current) return;
    
    publisherRef.current.createOffer({
      media: {
        video: 'screen',
        audioSend: true,
        videoSend: true,
        audioRecv: false,
        videoRecv: false
      },
      success: (jsep: any) => {
        publisherRef.current.send({
          message: { request: 'configure', audio: true, video: true },
          jsep
        });
        setIsScreenSharing(true);
      },
      error: (error: Error) => {
        console.error('화면공유 에러:', error);
        onError?.(error.message);
      }
    });
  }, [onError]);

  /**
   * 화면공유 중지
   */
  const stopScreenShare = useCallback(() => {
    if (!publisherRef.current) return;
    
    publisherRef.current.createOffer({
      media: {
        audioSend: true,
        videoSend: true,
        audioRecv: false,
        videoRecv: false
      },
      success: (jsep: any) => {
        publisherRef.current.send({
          message: { request: 'configure', audio: true, video: true },
          jsep
        });
        setIsScreenSharing(false);
      },
      error: (error: Error) => {
        console.error('화면공유 중지 에러:', error);
      }
    });
  }, []);

  /**
   * 컴포넌트 언마운트 시 정리
   */
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
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
  };
}