/**
 * pt.ts
 * 화상PT API 함수
 */

import apiClient from './client';
import type {
  CreatePTRoomRequest,
  CreatePTRoomResponse,
  GetPTRoomListParams,
  GetPTRoomListResponse,
  GetPTRoomDetailResponse,
  JoinPTRoomRequest,
  JoinPTRoomResponse,
  LeavePTRoomResponse,
  UpdatePTRoomStatusRequest,
  UpdatePTRoomStatusResponse,
  GetPTRoomParticipantsResponse,
  KickPTParticipantRequest,
  KickPTParticipantResponse,
} from './types/pt';

/**
 * ===========================================
 * 화상PT 방 API
 * ===========================================
 */

/**
 * 화상PT 방 생성 (트레이너 전용)
 */
export const createPTRoom = async (data: CreatePTRoomRequest): Promise<CreatePTRoomResponse> => {
  const response = await apiClient.post<{ data: CreatePTRoomResponse }>('/api/pt-rooms/create', data);
  return response.data.data;
};

/**
 * 화상PT 방 목록 조회
 */
export const getPTRoomList = async (params?: GetPTRoomListParams): Promise<GetPTRoomListResponse> => {
  const response = await apiClient.get<{ data: GetPTRoomListResponse }>('/api/pt-rooms', { params });
  return response.data.data;
};

/**
 * 화상PT 방 상세 조회
 */
export const getPTRoomDetail = async (ptRoomId: number): Promise<GetPTRoomDetailResponse> => {
  const response = await apiClient.get<{ data: GetPTRoomDetailResponse }>(`/api/pt-rooms/${ptRoomId}`);
  return response.data.data;
};

/**
 * 화상PT 방 입장
 */
export const joinPTRoom = async (ptRoomId: number, data?: JoinPTRoomRequest): Promise<JoinPTRoomResponse> => {
  const response = await apiClient.post<{ data: JoinPTRoomResponse }>(
    `/api/pt-rooms/${ptRoomId}/join`,
    data || {}
  );
  return response.data.data;
};

/**
 * 화상PT 방 퇴장
 */
export const leavePTRoom = async (ptRoomId: number): Promise<LeavePTRoomResponse> => {
  const response = await apiClient.post<{ data: LeavePTRoomResponse }>(`/api/pt-rooms/${ptRoomId}/leave`);
  return response.data.data;
};

/**
 * 화상PT 방 상태 전이 (트레이너 전용)
 */
export const updatePTRoomStatus = async (
  ptRoomId: number,
  data: UpdatePTRoomStatusRequest
): Promise<UpdatePTRoomStatusResponse> => {
  const response = await apiClient.patch<{ data: UpdatePTRoomStatusResponse }>(
    `/api/pt-rooms/${ptRoomId}/status`,
    data
  );
  return response.data.data;
};

/**
 * 화상PT 참여중인 인원 조회
 */
export const getPTRoomParticipants = async (ptRoomId: number): Promise<GetPTRoomParticipantsResponse> => {
  const response = await apiClient.get<{ data: GetPTRoomParticipantsResponse }>(
    `/api/pt-rooms/${ptRoomId}/participants`
  );
  return response.data.data;
};

/**
 * 화상PT 사용자 강퇴 (트레이너 전용)
 */
export const kickPTParticipant = async (
  ptRoomId: number,
  data: KickPTParticipantRequest
): Promise<KickPTParticipantResponse> => {
  const response = await apiClient.post<{ data: KickPTParticipantResponse }>(
    `/api/pt-rooms/${ptRoomId}/kick`,
    data
  );
  return response.data.data;
};