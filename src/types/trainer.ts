/**
 * trainer.ts
 * 트레이너 관련 타입 정의
 */

/**
 * 트레이너 신청 상태
 */
export type TrainerStatus = 'none' | 'pending' | 'approved' | 'rejected';

/**
 * 트레이너 신청 데이터
 */
export interface TrainerApplication {
  id: string;
  userId: string;
  introduction: string;           /* 전문 분야, 경력 사항, 소개 문구 */
  files: TrainerFile[];           /* 자격증/경력증명서 파일 (최대 5개) */
  status: TrainerStatus;
  rejectionReason?: string;       /* 거절 사유 */
  appliedAt: string;              /* 신청일 */
  reviewedAt?: string;            /* 심사일 */
}

/**
 * 트레이너 신청 파일
 */
export interface TrainerFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf';
  size: number;                   /* bytes */
}