/**
 * report.ts
 * 신고 API 호출 함수
 */

import { ReportRequest, ReportResponse } from './types/report';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 게시글/댓글/화상PT 신고
 * POST /api/board/report
 */
export const reportContent = async (params: ReportRequest): Promise<ReportResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/board/report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error('신고 실패') as Error & { code?: string };
        error.code = errorData.code;
        throw error;
    }

    const result = await response.json();
    return result.data;
};