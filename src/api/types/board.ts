/**
 * board.ts
 * 게시판 API 타입 정의
 */

/**
 * 작성자 정보
 */
export interface Author {
    nickname: string;
    handle: string;
}

/**
 * 게시글 카테고리 (백엔드 enum)
 */
export type PostCategory = 'FREE' | 'QUESTION' | 'INFO';

/**
 * 검색 기준
 */
export type SearchBy = 'TITLE' | 'CONTENT' | 'TITLE_CONTENT' | 'AUTHOR';

/**
 * 게시글 상태
 */
export type PostStatus = 'POSTED' | 'DELETED';

/**
 * 댓글 응답 타입
 */
export interface CommentResponse {
    commentId: number;
    content: string;
    author: Author;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    children: CommentResponse[];
}

/**
 * ===========================================
 * 게시글 목록 조회
 * ===========================================
 */
export interface GetPostsParams {
    category?: 'ALL' | PostCategory;
    q?: string;
    searchBy?: SearchBy;
    cursorId?: number;
    size?: number;
}

export interface PostListItem {
    postId: number;
    category: PostCategory;
    isNotice: boolean;
    title: string;
    nickname: string;
    handle: string;
    createdAt: string;
    commentCount: number;
    viewCount: number;
}

export interface GetPostsResponse {
    notices: PostListItem[];
    items: PostListItem[];
    pageInfo: {
        nextCursorId: number | null;
        hasNext: boolean;
        size: number;
    };
}

/**
 * ===========================================
 * 게시글 상세 조회 / 생성 / 수정 응답
 * ===========================================
 */
export interface PostDetailResponse {
    postId: number;
    author: Author;
    category: PostCategory;
    title: string;
    viewCount: number;
    commentCount: number;
    content: string;
    status: PostStatus;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    comments: CommentResponse[];
}

/**
 * ===========================================
 * 게시글 생성
 * ===========================================
 */
export interface CreatePostRequest {
    category: PostCategory;
    title: string;
    content: string;
    isNotice: boolean;
}

/**
 * ===========================================
 * 게시글 수정
 * ===========================================
 */
export interface UpdatePostRequest {
    category: PostCategory;
    title: string;
    content: string;
    isNotice: boolean;
}

/**
 * ===========================================
 * 게시글 삭제
 * ===========================================
 */
export interface DeletePostResponse {
    message: string;
    deletedAt: string;
}

/**
 * ===========================================
 * 댓글 작성
 * ===========================================
 */
export interface CreateCommentRequest {
    parentId: number | null;
    content: string;
}

export interface CreateCommentResponse {
    message: string;
    commentId: number;
    createdAt: string;
}

/**
 * ===========================================
 * 댓글 수정
 * ===========================================
 */
export interface UpdateCommentRequest {
    commentId: number;
    content: string;
}

export interface UpdateCommentResponse {
    message: string;
    commentId: number;
    createdAt: string;
}

/**
 * ===========================================
 * 댓글 삭제
 * ===========================================
 */
export interface DeleteCommentResponse {
    message: string;
    deletedAt: string;
}