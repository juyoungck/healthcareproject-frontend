/**
 * pt.ts
 * 화상PT API 관련 타입 정의
 * - 백엔드 API 명세와 동기화
 */

/**
 * ===========================================
 * 공통 타입
 * ===========================================
 */

/**
 * 방 상태 타입
 */
export type PTRoomStatus = 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED';

/**
 * 방 타입
 */
export type PTRoomType = 'RESERVED' | 'LIVE';

/**
 * 트레이너 정보
 */
export interface PTTrainerInfo {
  nickname: string;
  handle: string;
  profileImageUrl?: string | null;
}

/**
 * 참여자 정보
 */
export interface PTParticipantUser {
  nickname: string;
  handle: string;
  profileImageUrl?: string | null;
  role?: 'TRAINER' | 'USER';
}

/**
 * 참여자 목록 (방 상세/생성 응답용)
 */
export interface PTParticipants {
  count: number;
  users: PTParticipantUser[];
}

/**
 * 참여자 수 정보 (리스트용)
 */
export interface PTParticipantsCount {
  current: number;
  max: number | null;
}

/**
 * ===========================================
 * 방 생성 API (POST /api/pt-rooms/create)
 * ===========================================
 */

export interface CreatePTRoomRequest {
  roomType: PTRoomType;
  title: string;
  description?: string;
  scheduledAt?: string | null;
  maxParticipants?: number | null;
  isPrivate: boolean;
}

export interface CreatePTRoomResponse {
  ptRoomId: number;
  title: string;
  description: string;
  scheduledAt: string | null;
  trainer: PTTrainerInfo;
  entryCode: string | null;
  isPrivate: boolean;
  roomType: PTRoomType;
  status: PTRoomStatus;
  janusRoomKey: string | null;
  maxParticipants: number | null;
  participants: PTParticipants;
}

/**
 * ===========================================
 * 방 목록 조회 API (GET /api/pt-rooms)
 * ===========================================
 */

export type PTRoomTab = 'ALL' | 'LIVE' | 'RESERVED' | 'MY_RESERVATIONS' | 'MY_PT';

export interface GetPTRoomListParams {
  tab?: PTRoomTab;
  q?: string;
  cursorId?: number;
  size?: number;
}

export interface PTRoomListItem {
  ptRoomId: number;
  title: string;
  roomType: PTRoomType;
  status: PTRoomStatus;
  scheduledAt: string | null;
  isPrivate: boolean;
  trainer: PTTrainerInfo;
  participants: PTParticipantsCount;
}

export interface PTRoomPageInfo {
  nextCursorId: number | null;
  hasNext: boolean;
  size: number;
}

export interface GetPTRoomListResponse {
  items: PTRoomListItem[];
  pageInfo: PTRoomPageInfo;
}

/**
 * ===========================================
 * 방 상세 조회 API (GET /api/pt-rooms/{ptRoomId})
 * ===========================================
 */

export interface GetPTRoomDetailResponse {
  ptRoomId: number;
  title: string;
  description: string;
  scheduledAt: string | null;
  trainer: PTTrainerInfo;
  entryCode: string | null;
  isPrivate: boolean;
  roomType: PTRoomType;
  status: PTRoomStatus;
  janusRoomKey: string | null;
  maxParticipants: number | null;
  participants: PTParticipants;
}

/**
 * ===========================================
 * 방 입장 API (POST /api/pt-rooms/{ptRoomId}/join)
 * ===========================================
 */

export interface JoinPTRoomRequest {
  entryCode?: string | null;
}

export type JoinPTRoomResponse = GetPTRoomDetailResponse;

/**
 * ===========================================
 * 방 퇴장 API (POST /api/pt-rooms/{ptRoomId}/leave)
 * ===========================================
 */

export interface LeavePTRoomResponse {
  ptRoomId: number;
  status: string;
  leftAt: string;
}

/**
 * ===========================================
 * 방 상태 전이 API (PATCH /api/pt-rooms/{ptRoomId}/status)
 * ===========================================
 */

export interface UpdatePTRoomStatusRequest {
  status: 'LIVE' | 'ENDED';
}

export interface UpdatePTRoomStatusResponse {
  ptRoomId: number;
  status: PTRoomStatus;
  scheduledAt: string | null;
}

/**
 * ===========================================
 * 참여자 목록 조회 API (GET /api/pt-rooms/{ptRoomId}/participants)
 * ===========================================
 */

export interface GetPTRoomParticipantsResponse {
  ptRoomId: number;
  count: number;
  users: PTParticipantUser[];
}

/**
 * ===========================================
 * 예약 생성 API (POST /api/pt-reservations)
 * ===========================================
 */

export interface CreatePTReservationRequest {
  entryCode?: string | null;
}

export interface CreatePTReservationResponse {
  ptReservationId: number;
  ptRoomId: number;
  status: 'REQUESTED' | 'CANCELLED';
  reservedAt: string;
}

/**
 * ===========================================
 * 예약 취소 API (POST /api/pt-reservations/cancel)
 * ===========================================
 */

export interface CancelPTReservationResponse {
  ptRoomId: number;
  status: 'CANCELLED';
  cancelledAt: string;
}

/**
 * ===========================================
 * 예약자 목록 조회 API (GET /api/pt-rooms/{ptRoomId}/reservations)
 * ===========================================
 */

export interface PTReservedUser {
  ptReservationId: string;
  user: {
    userHandle: string;
    nickname: string;
    profileImageUrl: string | null;
  };
  createdAt: string;
}

export interface GetPTReservationsResponse {
  reservedUser: PTReservedUser[];
}

/**
 * ===========================================
 * 강퇴 API (POST /api/pt-rooms/{ptRoomId}/kick)
 * ===========================================
 */

export interface KickPTParticipantRequest {
  targetHandle: string;
}

export interface KickPTParticipantResponse {
  ptRoomId: number;
  kickedUser: {
    handle: string;
    nickname: string;
    profileImageUrl: string | null;
  };
  kickedAt: string;
  participants: {
    count: number;
  };
}

/**
 * ===========================================
 * 프론트엔드 UI용 타입
 * ===========================================
 */

/**
 * 필터 타입 (UI용)
 */
export type PTFilterType = 'all' | 'live' | 'reserved' | 'my-reservation' | 'myRoom';

/**
 * 필터 ↔ API 탭 변환 맵
 */
export const filterToTab: Record<PTFilterType, PTRoomTab> = {
  'all': 'ALL',
  'live': 'LIVE',
  'reserved': 'RESERVED',
  'my-reservation': 'MY_RESERVATIONS',
  'myRoom': 'MY_PT',
};

export const tabToFilter: Record<PTRoomTab, PTFilterType> = {
  'ALL': 'all',
  'LIVE': 'live',
  'RESERVED': 'reserved',
  'MY_RESERVATIONS': 'my-reservation',
  'MY_PT': 'myRoom',
};