/**
 * pts.ts
 * 화상PT 관련 타입 re-export
 * - 기존 더미 데이터 삭제
 * - API 타입을 re-export하여 기존 import 경로 유지
 */

/**
 * API 타입 re-export
 */
export type {
  PTRoomStatus,
  PTRoomType,
  PTTrainerInfo,
  PTParticipantUser,
  PTParticipants,
  PTParticipantsCount,
  PTRoomListItem,
  GetPTRoomDetailResponse,
  PTFilterType,
  PTRoomTab,
} from '../api/types/pt';

export { filterToTab, tabToFilter } from '../api/types/pt';

/**
 * VideoCallRoom에서 사용하는 방 타입
 * (API 응답과 호환되도록 정의)
 */
export interface PTRoomForCall {
  ptRoomId: number;
  title: string;
  trainer: {
    nickname: string;
    handle: string;
  };
  janusRoomKey: string | null;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED';
}