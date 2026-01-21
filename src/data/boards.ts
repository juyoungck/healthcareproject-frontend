/**
 * board.ts
 * 게시판 데이터 및 타입 정의
 * TODO: API 연동 시 더미 데이터 제거
 */

/**
 * 카테고리 타입 정의
 */
export type CategoryType = 'all' | 'free' | 'question' | 'info';

/**
 * 검색 타입 정의
 */
export type SearchType = 'title' | 'author';

/**
 * 게시글 목록 타입 정의
 */
export interface Post {
  id: number;
  category: 'free' | 'question' | 'info';
  title: string;
  author: string;
  authorId: number;
  date: string;
  views: number;
  commentCount: number;
}

/**
 * 대댓글 타입 정의
 */
export interface Reply {
  id: number;
  authorId: number;
  author: string;
  content: string;
  date: string;
}

/**
 * 댓글 타입 정의
 */
export interface Comment {
  id: number;
  authorId: number;
  author: string;
  content: string;
  date: string;
  replies: Reply[];
}

/**
 * 게시글 상세 타입 정의
 */
export interface PostDetail {
  id: number;
  category: 'free' | 'question' | 'info';
  title: string;
  content: string;
  images: string[];
  author: string;
  authorId: number;
  date: string;
  views: number;
  comments: Comment[];
}

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
 * 신고 사유 목록
 */
export const REPORT_REASONS = [
  '스팸/광고',
  '욕설/비방',
  '음란물',
  '개인정보 노출',
  '기타'
];

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