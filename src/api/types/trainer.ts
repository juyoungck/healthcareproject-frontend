/**
 * trainer.ts
 * 트레이너 관련 API 타입 정의
 */

/**
 * ===========================================
 * 트레이너 신청 (POST /api/trainer/application)
 * ===========================================
 */

/**
 * 트레이너 신청 요청
 */
export interface TrainerApplicationRequest {
  /** 자격증/경력 증빙 파일 URL (최대 5개) */
  licenseUrls: string[];
  /** 트레이너 소개 */
  bio?: string;
}

/**
 * 트레이너 신청 응답
 */
export interface TrainerApplicationResponse {
  /** 처리 결과 메시지 */
  message: string;
  /** 트레이너 신청 상태 */
  applicationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

/**
 * ===========================================
 * 트레이너 소개문구 수정 (PATCH /api/trainer/bio)
 * ===========================================
 */

/**
 * 트레이너 소개문구 수정 요청
 */
export interface TrainerBioUpdateRequest {
  /** 트레이너 소개 (빈 문자열이면 삭제) */
  bio: string;
}