/**
 * report.ts
 * 신고 API 타입 정의
 */

/**
 * 신고 타입
 */
export type ReportType = 'POST' | 'COMMENT' | 'PT_ROOM';

/**
 * 신고 요청
 */
export interface ReportRequest {
    type: ReportType;
    id: number;
    cause: string;
}

/**
 * 신고 응답
 */
export interface ReportResponse {
    message: string;
    createdAt: string;
}