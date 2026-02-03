/// <reference types="vite/client" />

/**
 * 환경변수 타입 정의
 */
interface ImportMetaEnv {
  /** API 서버 기본 URL */
  readonly VITE_API_BASE_URL: string;

  /** 소셜 로그인 Client ID */
  readonly VITE_KAKAO_CLIENT_ID: string;
  readonly VITE_NAVER_CLIENT_ID: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  
  /** OAuth Redirect URI */
  readonly VITE_OAUTH_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}