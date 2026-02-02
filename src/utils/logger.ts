/**
 * logger.ts
 * 조건부 로깅 유틸리티
 * - 개발 환경에서만 콘솔 출력
 * - 프로덕션에서는 로깅 비활성화
 */

/**
 * 개발 환경 여부 확인
 */
const isDev = import.meta.env.DEV;

/**
 * ===========================================
 * Logger 객체
 * ===========================================
 */

export const logger = {
  /**
   * 일반 로그 (개발 환경에서만 출력)
   */
  log: (...args: unknown[]): void => {
    if (isDev) {
      console.log('[DEV]', ...args);
    }
  },

  /**
   * 에러 로그 (개발 환경에서만 출력)
   */
  error: (...args: unknown[]): void => {
    if (isDev) {
      console.error('[DEV ERROR]', ...args);
    }
  },

  /**
   * 경고 로그 (개발 환경에서만 출력)
   */
  warn: (...args: unknown[]): void => {
    if (isDev) {
      console.warn('[DEV WARN]', ...args);
    }
  },

  /**
   * 정보 로그 (개발 환경에서만 출력)
   */
  info: (...args: unknown[]): void => {
    if (isDev) {
      console.info('[DEV INFO]', ...args);
    }
  },

  /**
   * 디버그 로그 (개발 환경에서만 출력)
   * - 상세한 디버깅 정보용
   */
  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * 그룹 시작 (개발 환경에서만)
   */
  group: (label: string): void => {
    if (isDev) {
      console.group(`[DEV] ${label}`);
    }
  },

  /**
   * 그룹 종료 (개발 환경에서만)
   */
  groupEnd: (): void => {
    if (isDev) {
      console.groupEnd();
    }
  },

  /**
   * 테이블 출력 (개발 환경에서만)
   */
  table: (data: unknown): void => {
    if (isDev) {
      console.table(data);
    }
  },
};

/**
 * ===========================================
 * 특정 모듈용 Logger 생성
 * ===========================================
 */

/**
 * 모듈별 프리픽스가 붙은 로거 생성
 * @param moduleName 모듈 이름
 */
export const createModuleLogger = (moduleName: string) => ({
  log: (...args: unknown[]) => logger.log(`[${moduleName}]`, ...args),
  error: (...args: unknown[]) => logger.error(`[${moduleName}]`, ...args),
  warn: (...args: unknown[]) => logger.warn(`[${moduleName}]`, ...args),
  info: (...args: unknown[]) => logger.info(`[${moduleName}]`, ...args),
  debug: (...args: unknown[]) => logger.debug(`[${moduleName}]`, ...args),
});

/**
 * ===========================================
 * 사용 예시
 * ===========================================
 * 
 * // 기본 사용
 * import { logger } from '../utils/logger';
 * logger.log('데이터 로드 완료:', data);
 * 
 * // 모듈별 로거
 * import { createModuleLogger } from '../utils/logger';
 * const log = createModuleLogger('MyPage');
 * log.log('트레이너 정보 로드 성공:', info);
 */
