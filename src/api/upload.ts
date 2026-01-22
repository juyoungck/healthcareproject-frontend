/**
 * upload.ts
 * 파일 업로드 API
 * TODO: 백엔드 업로드 서버 완성 후 실제 API 연동
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 이미지 업로드
 * POST /api/upload/image
 */
export const uploadImage = async (file: File): Promise<string> => {
    
  /* TODO: 실제 API 연동 시 아래 코드로 교체 */
  /*
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error('이미지 업로드 실패');
  const result = await response.json();
  return result.data.url;
  */

  /* 임시: 로컬 Blob URL 반환 */
  return URL.createObjectURL(file);
};