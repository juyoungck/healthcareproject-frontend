/**
 * ptDummyData.ts
 * 화상PT 더미 데이터
 * TODO: 백엔드 연동 시 이 파일 삭제 필요
 */

/**
 * 방 상태 타입
 */
export type RoomStatus = 'live' | 'reserved' | 'ended';

/**
 * 방 공개 여부 타입
 */
export type RoomVisibility = 'public' | 'private';

/**
 * 화상PT 방 타입 정의
 */
export interface PTRoom {
  id: number;
  title: string;
  description: string;
  trainerId: string;
  trainerName: string;
  trainerProfileImage?: string;
  status: RoomStatus;
  visibility: RoomVisibility;
  entryCode?: string;           /* 비공개 방 입장 코드 */
  scheduledAt?: string;         /* 예약 일시 (ISO string) */
  startedAt?: string;           /* 시작 시간 */
  maxParticipants: number;      /* 최대 참여 인원 (트레이너 포함 최대 6인) */
  currentParticipants: number;  /* 현재 참여 인원 */
  createdAt: string;
  participants?: {
    id: string;
    nickname: string;
    reservedAt: string;
  }[];
}

/**
 * 참여자 타입 정의
 */
export interface Participant {
  id: string;
  name: string;
  profileImage?: string;
  isTrainer: boolean;
  isMicMuted: boolean;
  isAudioMuted: boolean;
  isVideoOff: boolean;
}

/**
 * 내 예약 타입 정의
 */
export interface MyReservation {
  id: string;
  roomId: number;
  room: PTRoom;
  reservedAt: string;
}

/**
 * ===========================================
 * 더미 데이터
 * TODO: 백엔드 연동 시 삭제
 * ===========================================
 */

export const DUMMY_PT_ROOMS: PTRoom[] = [
  {
    id: 30001,
    title: '초보자를 위한 홈트레이닝',
    description: '집에서도 쉽게 따라할 수 있는 전신 운동을 함께해요. 운동 기구 없이도 가능합니다!',
    trainerId: 'trainer-001',
    trainerName: '김트레이너',
    status: 'live',
    visibility: 'public',
    maxParticipants: 6,
    currentParticipants: 3,
    startedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    participants: [
      { id: 'user-1', nickname: '헬스초보', reservedAt: '2024-01-15T09:00:00' },
      { id: 'user-2', nickname: '운동왕', reservedAt: '2024-01-15T09:30:00' },
    ],
  },
  {
    id: 30002,
    title: '다이어트 식단 상담 & 운동',
    description: '체중 감량을 목표로 하시는 분들을 위한 맞춤 PT입니다. 식단 조언도 함께 드려요.',
    trainerId: 'trainer-002',
    trainerName: '박피티',
    status: 'reserved',
    visibility: 'public',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), /* 2시간 후 */
    maxParticipants: 4,
    currentParticipants: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 30003,
    title: '1:1 프리미엄 PT',
    description: '개인 맞춤 코칭을 원하시는 분을 위한 프라이빗 세션입니다.',
    trainerId: 'trainer-001',
    trainerName: '김트레이너',
    status: 'reserved',
    visibility: 'private',
    entryCode: 'ABC123',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), /* 내일 */
    maxParticipants: 4,
    currentParticipants: 3,
    createdAt: new Date().toISOString(),
    participants: [
      { id: 'user-1', nickname: '헬스초보', reservedAt: '2024-01-15T09:00:00' },
      { id: 'user-2', nickname: '운동왕', reservedAt: '2024-01-15T09:30:00' },
    ],
  },
  {
    id: 30004,
    title: '상체 근력 강화 PT',
    description: '덤벨을 활용한 상체 근력 운동을 진행합니다. 초보자도 환영!',
    trainerId: 'trainer-003',
    trainerName: '이코치',
    status: 'live',
    visibility: 'public',
    maxParticipants: 5,
    currentParticipants: 5,
    startedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 30005,
    title: '스트레칭 & 유연성 클래스',
    description: '하루의 피로를 풀어주는 스트레칭 시간입니다. 요가 매트만 준비해주세요.',
    trainerId: 'trainer-002',
    trainerName: '박피티',
    status: 'reserved',
    visibility: 'public',
    scheduledAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), /* 5시간 후 */
    maxParticipants: 6,
    currentParticipants: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 30006,
    title: '비공개 클래스',
    description: '집에서도 쉽게 따라할 수 있는 전신 운동을 함께해요. 운동 기구 없이도 가능합니다!',
    trainerId: 'trainer-003',
    trainerName: '비공개',
    status: 'live',
    visibility: 'private',
    entryCode: 'ABC123',
    maxParticipants: 6,
    currentParticipants: 3,
    startedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

/**
 * 더미 참여자 데이터
 */
export const DUMMY_PARTICIPANTS: Participant[] = [
  {
    id: 'trainer-001',
    name: '김트레이너',
    isTrainer: true,
    isAudioMuted: false,
    isMicMuted: false,
    isVideoOff: false,
  },
  {
    id: 'user-001',
    name: '홍길동',
    isTrainer: false,
    isAudioMuted: false,
    isMicMuted: false,
    isVideoOff: false,
  },
  {
    id: 'user-002',
    name: '김철수',
    isTrainer: false,
    isAudioMuted: false,
    isMicMuted: false,
    isVideoOff: false,
  },
];

/**
 * 더미 내 예약 데이터
 */
export const DUMMY_MY_RESERVATIONS: MyReservation[] = [
  {
    id: 'reservation-001',
    roomId: 30002,
    room: DUMMY_PT_ROOMS[1],
    reservedAt: new Date().toISOString(),
  },
  {
    id: 'reservation-002',
    roomId: 30005,
    room: DUMMY_PT_ROOMS[4],
    reservedAt: new Date().toISOString(),
  },
];

/**
 * 현재 사용자가 트레이너인지 여부
 * TODO: 실제 구현 시 JWT 토큰에서 확인
 */
export const IS_CURRENT_USER_TRAINER = true;

/**
 * 현재 사용자 ID
 * TODO: 실제 구현 시 JWT 토큰에서 확인
 */
export const CURRENT_USER_ID = 'trainer-001';
