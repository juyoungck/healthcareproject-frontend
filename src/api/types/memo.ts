/**
 * memo.ts
 * 메모 API 타입 정의
 */

/**
 * ===========================================
 * 메모 아이템
 * ===========================================
 */

/**
 * 메모 정보
 */
export interface MemoItem {
  memoId: number | null;
  date: string;
  content: string;
}

/**
 * ===========================================
 * 메모 조회 응답
 * GET /api/memos/{date}
 * ===========================================
 */

export interface GetMemoResponse {
  message: string;
  memo: MemoItem | null;
}

/**
 * ===========================================
 * 메모 저장/수정/삭제
 * PUT /api/memos/{date}
 * ===========================================
 */

/**
 * 메모 저장 요청
 */
export interface PutMemoRequest {
  content: string;
}

/**
 * 메모 저장 응답
 */
export interface PutMemoResponse {
  message: string;
  memo: MemoItem | null;
}