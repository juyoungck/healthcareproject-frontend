/**
 * memo.ts
 * 메모 API 함수
 */

import apiClient from './client';
import {
  GetMemoResponse,
  PutMemoRequest,
  PutMemoResponse,
} from './types/memo';

/**
 * ===========================================
 * 메모 조회
 * GET /api/memos/{date}
 * ===========================================
 */

/**
 * 특정 날짜의 메모 조회
 * @param date - 조회할 날짜 (YYYY-MM-DD)
 * @returns 메모 정보
 */
export const getMemo = async (date: string): Promise<GetMemoResponse> => {
  const response = await apiClient.get<{ success: boolean; data: GetMemoResponse }>(
    `/api/memos/${date}`
  );
  return response.data.data;
};

/**
 * ===========================================
 * 메모 저장/수정/삭제 (CUD)
 * PUT /api/memos/{date}
 * - content가 빈 문자열이면 삭제
 * - 아니면 upsert (생성 또는 수정)
 * ===========================================
 */

/**
 * 메모 저장/수정/삭제
 * @param date - 대상 날짜 (YYYY-MM-DD)
 * @param content - 메모 내용 (빈 문자열이면 삭제)
 * @returns 처리 결과
 */
export const putMemo = async (
  date: string,
  content: string
): Promise<PutMemoResponse> => {
  const request: PutMemoRequest = { content };
  const response = await apiClient.put<{ success: boolean; data: PutMemoResponse }>(
    `/api/memos/${date}`,
    request
  );
  return response.data.data;
};