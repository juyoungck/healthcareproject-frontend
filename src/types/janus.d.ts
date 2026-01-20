/**
 * janus.d.ts
 * Janus WebRTC 라이브러리 타입 정의
 */

declare global {
  interface Window {
    Janus: typeof Janus;
  }
}

declare class Janus {
  static init(options: JanusInitOptions): void;
  static isWebrtcSupported(): boolean;
  static debug(...args: any[]): void;
  static log(...args: any[]): void;
  static warn(...args: any[]): void;
  static error(...args: any[]): void;
  static randomString(length: number): string;
  static attachMediaStream(element: HTMLVideoElement, stream: MediaStream): void;

  constructor(options: JanusConstructorOptions);
  
  attach(options: JanusPluginOptions): void;
  destroy(options?: { success?: () => void; error?: (error: string) => void }): void;
  getServer(): string;
  isConnected(): boolean;
  getSessionId(): number;
}

interface JanusInitOptions {
  debug?: boolean | string | string[];
  callback?: () => void;
}

interface JanusConstructorOptions {
  server: string | string[];
  iceServers?: RTCIceServer[];
  token?: string;
  apisecret?: string;
  success?: () => void;
  error?: (error: string) => void;
  destroyed?: () => void;
}

interface JanusPluginOptions {
  plugin: string;
  opaqueId?: string;
  success?: (pluginHandle: JanusPluginHandle) => void;
  error?: (error: string) => void;
  consentDialog?: (on: boolean) => void;
  iceState?: (state: string) => void;
  mediaState?: (medium: string, on: boolean) => void;
  webrtcState?: (on: boolean) => void;
  onmessage?: (msg: any, jsep?: RTCSessionDescriptionInit) => void;
  onlocalstream?: (stream: MediaStream) => void;
  onremotestream?: (stream: MediaStream) => void;
  oncleanup?: () => void;
  ondataopen?: () => void;
  ondata?: (data: any) => void;
  slowLink?: (uplink: boolean, lost: number) => void;
}

interface JanusPluginHandle {
  getId(): number;
  getPlugin(): string;
  send(options: { message: any; jsep?: RTCSessionDescriptionInit; success?: (result: any) => void; error?: (error: string) => void }): void;
  createOffer(options: JanusOfferOptions): void;
  createAnswer(options: JanusOfferOptions): void;
  handleRemoteJsep(options: { jsep: RTCSessionDescriptionInit }): void;
  hangup(sendRequest?: boolean): void;
  detach(options?: { success?: () => void; error?: (error: string) => void }): void;
  isAudioMuted(): boolean;
  muteAudio(): void;
  unmuteAudio(): void;
  isVideoMuted(): boolean;
  muteVideo(): void;
  unmuteVideo(): void;
  webrtcStuff: {
    pc: RTCPeerConnection;
    myStream: MediaStream;
    remoteStream: MediaStream;
  };
}

interface JanusOfferOptions {
  media?: {
    audioSend?: boolean;
    audioRecv?: boolean;
    videoSend?: boolean;
    videoRecv?: boolean;
    audio?: boolean | { deviceId: string };
    video?: boolean | string | { deviceId: string; width?: number; height?: number };
    data?: boolean;
    failIfNoAudio?: boolean;
    failIfNoVideo?: boolean;
    screenshareFrameRate?: number;
  };
  trickle?: boolean;
  stream?: MediaStream;
  simulcast?: boolean;
  simulcast2?: boolean;
  success?: (jsep: RTCSessionDescriptionInit) => void;
  error?: (error: Error) => void;
}

/**
 * 원격 피드 타입 (다른 참가자)
 */
interface RemoteFeed extends JanusPluginHandle {
  rfid: number;
  rfdisplay: string;
  rfindex: number;
  videoCodec?: string;
  simulcastStarted?: boolean;
}

export { 
  Janus, 
  JanusPluginHandle, 
  JanusPluginOptions, 
  JanusOfferOptions,
  RemoteFeed 
};