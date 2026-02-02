/**
 * html.ts
 * HTML 관련 유틸리티 함수
 */

/**
 * HTML 태그를 제거하고 순수 텍스트만 반환
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};
