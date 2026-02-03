/**
 * board.ts
 * 게시판 상수 정의
 */

/**
 * ===========================================
 * 타입 정의 (프론트엔드용)
 * ===========================================
 */

/**
 * 카테고리 타입 (프론트엔드)
 */
export type CategoryType = 'all' | 'free' | 'question' | 'info';

/**
 * 검색 타입
 */
export type SearchType = 'title' | 'author';

/**
 * ===========================================
 * 상수 정의
 * ===========================================
 */

/**
 * 카테고리 라벨 매핑
 */
export const CATEGORY_LABELS: Record<string, string> = {
  all: '전체',
  free: '자유',
  question: '질문',
  info: '정보'
};

/**
 * 프론트 카테고리 ↔ 백엔드 카테고리 매핑
 */
export const CATEGORY_MAP = {
  toBackend: {
    'all': 'ALL',
    'free': 'FREE',
    'question': 'QUESTION',
    'info': 'INFO',
  } as const,
  toFrontend: {
    'ALL': 'all',
    'FREE': 'free',
    'QUESTION': 'question',
    'INFO': 'info',
  } as const,
};
