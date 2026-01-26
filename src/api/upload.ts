/**
 * upload.ts
 * 파일 업로드 API
 * - AWS S3 Presigned URL 방식 사용
 */

import apiClient from './client';

/**
 * ===========================================
 * 타입 정의
 * ===========================================
 */

/**
 * 업로드 타입
 */
export type UploadType = 'PROFILE' | 'POST' | 'TRAINER';

/**
 * Presigned URL 요청 DTO
 */
interface PresignedUrlRequest {
  uploadType: UploadType;
  fileName: string;
  fileSize: number;
  contentType: string;
}

/**
 * Presigned URL 응답 DTO
 */
interface PresignedUrlResponse {
  presignedUrl: string;
  fileUrl: string;
  fileKey: string;
}

/**
 * API 응답 래퍼
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * ===========================================
 * 상수 정의
 * ===========================================
 */

/**
 * 최대 파일 크기 (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * 업로드 타입별 허용 확장자
 */
const ALLOWED_EXTENSIONS: Record<UploadType, string[]> = {
  PROFILE: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  POST: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  TRAINER: [
    'jpg', 'jpeg', 'png', 'gif', 'webp',
    'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'hwp'
  ],
};

/**
 * 업로드 타입별 허용 MIME 타입
 */
const ALLOWED_MIME_TYPES: Record<UploadType, string[]> = {
  PROFILE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  POST: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  TRAINER: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/x-hwp',
    'application/haansofthwp',
  ],
};

/**
 * ===========================================
 * 유틸리티 함수
 * ===========================================
 */

/**
 * 파일 확장자 추출
 */
const getFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return fileName.substring(lastDotIndex + 1).toLowerCase();
};

/**
 * 파일 유효성 검사
 */
const validateFile = (file: File, uploadType: UploadType): void => {
  /* 파일 크기 검사 */
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('파일 크기가 10MB를 초과합니다.');
  }

  /* 확장자 검사 */
  const extension = getFileExtension(file.name);
  if (!ALLOWED_EXTENSIONS[uploadType].includes(extension)) {
    throw new Error(`지원하지 않는 파일 형식입니다. (허용: ${ALLOWED_EXTENSIONS[uploadType].join(', ')})`);
  }

  /* MIME 타입 검사 */
  if (!ALLOWED_MIME_TYPES[uploadType].includes(file.type)) {
    throw new Error('파일 형식이 올바르지 않습니다.');
  }
};

/**
 * ===========================================
 * API 함수
 * ===========================================
 */

/**
 * Presigned URL 발급
 * POST /api/upload/presigned-url
 */
const getPresignedUrl = async (request: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
  const response = await apiClient.post<ApiResponse<PresignedUrlResponse>>(
    '/api/upload/presigned-url',
    request
  );
  return response.data.data;
};

/**
 * S3에 파일 직접 업로드
 */
const uploadToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error('파일 업로드에 실패했습니다.');
  }
};

/**
 * ===========================================
 * 메인 업로드 함수
 * ===========================================
 */

/**
 * 파일 업로드 (통합)
 * @param file 업로드할 파일
 * @param uploadType 업로드 타입 (PROFILE, POST, TRAINER)
 * @returns 업로드된 파일의 S3 URL
 */
export const uploadFile = async (file: File, uploadType: UploadType): Promise<string> => {
  /* 1. 파일 유효성 검사 */
  validateFile(file, uploadType);

  /* 2. Presigned URL 발급 */
  const presignedData = await getPresignedUrl({
    uploadType,
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type,
  });

  /* 3. S3에 파일 업로드 */
  await uploadToS3(presignedData.presignedUrl, file);

  /* 4. 최종 파일 URL 반환 */
  return presignedData.fileUrl;
};

/**
 * 이미지 업로드 (프로필/게시판용)
 * @param file 업로드할 이미지 파일
 * @param type 업로드 타입 (기본값: POST)
 * @returns 업로드된 이미지의 S3 URL
 */
export const uploadImage = async (file: File, type: 'PROFILE' | 'POST' = 'POST'): Promise<string> => {
  return uploadFile(file, type);
};

/**
 * 트레이너 증빙자료 업로드
 * @param file 업로드할 파일 (이미지 또는 문서)
 * @returns 업로드된 파일의 S3 URL
 */
export const uploadTrainerDocument = async (file: File): Promise<string> => {
  return uploadFile(file, 'TRAINER');
};

/**
 * 다중 파일 업로드
 * @param files 업로드할 파일 배열
 * @param uploadType 업로드 타입
 * @returns 업로드된 파일 URL 배열
 */
export const uploadMultipleFiles = async (files: File[], uploadType: UploadType): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadFile(file, uploadType));
  return Promise.all(uploadPromises);
};