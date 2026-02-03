/**
 * board.ts
 * 게시판 API 호출 함수
 */
import {
    GetPostsParams,
    GetPostsResponse,
    PostDetailResponse,
    CreatePostRequest,
    UpdatePostRequest,
    DeletePostResponse,
    CreateCommentRequest,
    CreateCommentResponse,
    UpdateCommentRequest,
    UpdateCommentResponse,
    DeleteCommentResponse,
} from './types/board';
import { createFetchError } from './apiError';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 게시글 목록 조회
 * GET /api/board/posts
 */
export const getPosts = async (params: GetPostsParams): Promise<GetPostsResponse> => {
    const queryParams = new URLSearchParams();

    if (params.category) queryParams.append('category', params.category);
    if (params.q) queryParams.append('q', params.q);
    if (params.searchBy) queryParams.append('searchBy', params.searchBy);
    if (params.cursorId) queryParams.append('cursorId', String(params.cursorId));
    if (params.size) queryParams.append('size', String(params.size));

    const response = await fetch(`${API_BASE_URL}/api/board/posts?${queryParams}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });

    if (!response.ok) throw await createFetchError(response, '게시글 목록을 불러오는데 실패했습니다.');
    const result = await response.json();
    return result.data;
};

/**
 * 게시글 상세 조회
 * GET /api/board/posts/{postId}
 */
export const getPostDetail = async (postId: number): Promise<PostDetailResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/board/posts/${postId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });

    if (!response.ok) throw await createFetchError(response, '게시글을 불러오는데 실패했습니다.');
    const result = await response.json();
    return result.data;
};

/**
 * 게시글 생성
 * POST /api/board/posts
 */
export const createPost = async (params: CreatePostRequest): Promise<PostDetailResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/board/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) throw await createFetchError(response, '게시글 작성에 실패했습니다.');
    const result = await response.json();
    return result.data;
};

/**
 * 게시글 수정
 * PATCH /api/board/posts/{postId}
 */
export const updatePost = async (
    postId: number,
    params: UpdatePostRequest
): Promise<PostDetailResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/board/posts/${postId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) throw await createFetchError(response, '게시글 수정에 실패했습니다.');
    const result = await response.json();
    return result.data;
};

/**
 * 게시글 삭제
 * DELETE /api/board/posts/{postId}
 */
export const deletePost = async (postId: number): Promise<DeletePostResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/board/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });

    if (!response.ok) throw await createFetchError(response, '게시글 삭제에 실패했습니다.');
    const result = await response.json();
    return result.data;
};

/**
 * 댓글 작성
 * POST /api/board/posts/{postId}/comments
 */
export const createComment = async (
    postId: number,
    params: CreateCommentRequest
): Promise<CreateCommentResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/board/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) throw await createFetchError(response, '댓글 작성에 실패했습니다.');
    const result = await response.json();
    return result.data;
};

/**
 * 댓글 수정
 * PATCH /api/board/posts/{postId}/comments/{commentId}
 */
export const updateComment = async (
    postId: number,
    params: UpdateCommentRequest
): Promise<UpdateCommentResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/board/posts/${postId}/comments/${params.commentId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) throw await createFetchError(response, '댓글 수정에 실패했습니다.');
    const result = await response.json();
    return result.data;
};

/**
 * 댓글 삭제
 * DELETE /api/board/posts/{postId}/comments/{commentId}
 */
export const deleteComment = async (
    postId: number,
    commentId: number
): Promise<DeleteCommentResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/board/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });

    if (!response.ok) throw await createFetchError(response, '댓글 삭제에 실패했습니다.');
    const result = await response.json();
    return result.data;
};

/**
 * 신고 API는 report.ts로 이동
 * 기존 import 호환을 위해 re-export
 */
export { reportContent } from './report';