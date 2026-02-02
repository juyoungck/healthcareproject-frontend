/**
 * report.ts
 * 신고 관련 상수 정의
 */

/**
 * 신고 사유 목록
 */
export const REPORT_REASONS = [
  '스팸/광고',
  '욕설/비방',
  '음란물',
  '개인정보 노출',
  '사기/허위정보',
  '기타'
] as const;

export type ReportReason = typeof REPORT_REASONS[number];
