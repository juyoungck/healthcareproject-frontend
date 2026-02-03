/**
 * onboarding.ts
 * 온보딩 관련 타입 정의
 */

/**
 * 온보딩 단계
 */
export type OnboardingStep = 'body' | 'exercise' | 'injury' | 'schedule' | 'confirm';

/**
 * 부상 정도 (프론트엔드)
 */
export type InjurySeverity = 'mild' | 'caution' | 'severe';

/**
 * 부상 정보 타입
 */
export interface InjuryItem {
  id: number;
  part: string;
  severity: InjurySeverity | null;
}

/**
 * 온보딩 데이터 타입
 */
export interface OnboardingData {
  heightCm: string;
  weightKg: string;
  age: string;
  gender: 'male' | 'female' | null;
  allergies: string[];
  experienceLevel: 'beginner' | 'elementary' | 'intermediate' | 'advanced' | null;
  goalType: 'strength' | 'weight_loss' | 'flexibility' | 'endurance' | null;
  hasInjury: boolean;
  injuries: InjuryItem[];
  weeklyDays: number;
  sessionMinutes: '30min' | '1hour' | '1hour30' | '2hour' | null;
}

/**
 * 완료 메시지 타입
 */
export interface CompleteMessage {
  title: string;
  desc: string;
}
