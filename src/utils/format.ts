/**
 * format.ts
 * 포맷팅 유틸 함수
 */

/** 요일 라벨 */
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 날짜 문자열을 한국어 날짜 형식으로 변환
 * @param dateString - ISO 날짜 문자열
 * @returns 포맷된 날짜 (예: 2024. 1. 15.)
 */
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ko-KR');
};

/**
 * 날짜 문자열을 시간 포함 형식으로 변환
 * @param dateString - ISO 날짜 문자열
 * @returns 포맷된 날짜시간 (예: 2024.01.15 14:30:00)
 */
export const formatDateWithTime = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 날짜를 한국어 형식으로 변환 (년 포함)
 * @param date - Date 객체
 * @returns 포맷된 날짜 (예: 2024년 1월 15일 (월))
 */
export const formatDateKoreanFull = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = DAY_LABELS[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
};

/**
 * 날짜를 한국어 간략 형식으로 변환
 * @param dateString - ISO 날짜 문자열
 * @returns 포맷된 날짜 (예: 1월 15일 (월))
 */
export const formatDateKoreanShort = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = DAY_LABELS[date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
};

/**
 * 날짜를 관리자용 형식으로 변환 (시간 포함)
 * @param dateString - ISO 날짜 문자열 (null 허용)
 * @returns 포맷된 날짜시간 (예: 2024. 01. 15. 오후 2:30)
 */
export const formatDateTimeAdmin = (dateString: string | null): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 전화번호 포맷팅 (01012345678 → 010-1234-5678)
 * @param phone - 전화번호 문자열
 * @returns 포맷된 전화번호
 */
export const formatPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/-/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

/**
 * 운동 시간(분)을 라벨로 변환
 * @param minutes - 운동 시간 (분)
 * @returns 운동 시간 라벨
 */
export const formatSessionTime = (minutes: number | undefined): string => {
  if (!minutes) return '-';
  if (minutes <= 30) return '30분 이내';
  if (minutes <= 60) return '1시간';
  if (minutes <= 90) return '1시간 30분';
  return '2시간 이상';
};

/**
 * 날짜를 탭 형식으로 변환 (예: 2026-01-17 → 17(토))
 * @param dateStr - ISO 날짜 문자열 (YYYY-MM-DD)
 * @returns 탭 형식 문자열
 */
export const formatDateTab = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getDate()}(${DAY_LABELS[date.getDay()]})`;
};

/**
 * ===========================================
 * 시간 유틸리티
 * ===========================================
 */

/**
 * 초 단위 시간을 HH:MM:SS 또는 MM:SS 형식으로 변환
 * @param seconds - 초 단위 시간
 * @returns 포맷된 시간 문자열
 */
export const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * ===========================================
 * 스크롤 유틸리티
 * ===========================================
 */

/**
 * 지정된 요소를 맨 위로 스크롤
 * @param selector - 스크롤할 요소의 CSS 선택자 (기본: '.app-main')
 */
export const scrollToTop = (selector: string = '.app-main'): void => {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
