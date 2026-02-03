/**
 * useOnboardingForm.ts
 * 온보딩 폼 상태 관리 및 유효성 검사 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { saveOnboarding } from '../../api/me';
import type { OnboardingRequest, OnboardingInjury } from '../../api/types/me';
import type {
  OnboardingData,
  OnboardingStep,
  InjuryItem,
  CompleteMessage
} from '../../api/types/onboarding';
import { ONBOARDING_STEPS, INITIAL_ONBOARDING_DATA } from '../../constants/onboarding';

/**
 * Props 타입
 */
interface UseOnboardingFormProps {
  initialData?: OnboardingData | null;
  isEditMode?: boolean;
  onComplete: () => void;
}

/**
 * 반환 타입
 */
interface UseOnboardingFormReturn {
  /** 상태 */
  currentStep: OnboardingStep;
  currentStepIndex: number;
  data: OnboardingData;
  error: string;
  isLoading: boolean;
  showCompleteModal: boolean;
  completeMessage: CompleteMessage;

  /** 네비게이션 */
  handleNext: () => void;
  handlePrev: () => void;

  /** 데이터 수정 */
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  toggleAllergy: (allergyValue: string) => void;
  handleHasInjuryChange: (hasInjury: boolean) => void;
  addInjury: () => void;
  removeInjury: (id: number) => void;
  updateInjury: (id: number, field: 'part' | 'severity', value: string) => void;

  /** 완료 */
  handleComplete: () => Promise<void>;
  handleCompleteModalConfirm: () => void;
}

/**
 * 데이터 변환 함수들
 */
const convertExperienceLevel = (level: string | null): 'BEGINNER' | 'ELEMENTARY' | 'INTERMEDIATE' | 'ADVANCED' => {
  switch (level) {
    case 'beginner': return 'BEGINNER';
    case 'elementary': return 'ELEMENTARY';
    case 'intermediate': return 'INTERMEDIATE';
    case 'advanced': return 'ADVANCED';
    default: return 'BEGINNER';
  }
};

const convertGoalType = (goal: string | null): 'DIET' | 'BULK' | 'FLEXIBILITY' | 'MAINTAIN' => {
  switch (goal) {
    case 'weight_loss': return 'DIET';
    case 'strength': return 'BULK';
    case 'flexibility': return 'FLEXIBILITY';
    case 'endurance': return 'MAINTAIN';
    default: return 'MAINTAIN';
  }
};

const convertSessionMinutes = (time: string | null): number => {
  switch (time) {
    case '30min': return 30;
    case '1hour': return 60;
    case '1hour30': return 90;
    case '2hour': return 120;
    default: return 60;
  }
};

const convertInjuryLevel = (severity: string | null): 'MILD' | 'CAUTION' | 'SEVERE' => {
  switch (severity) {
    case 'mild': return 'MILD';
    case 'caution': return 'CAUTION';
    case 'severe': return 'SEVERE';
    default: return 'MILD';
  }
};

/**
 * useOnboardingForm 훅
 */
export function useOnboardingForm({
  initialData = null,
  isEditMode = false,
  onComplete
}: UseOnboardingFormProps): UseOnboardingFormReturn {
  /** 현재 단계 */
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('body');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeMessage, setCompleteMessage] = useState<CompleteMessage>({
    title: '',
    desc: ''
  });

  /** 온보딩 데이터 */
  const [data, setData] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA);

  /** 에러 메시지 */
  const [error, setError] = useState('');

  /** 로딩 상태 */
  const [isLoading, setIsLoading] = useState(false);

  /** 현재 단계 인덱스 */
  const currentStepIndex = ONBOARDING_STEPS.indexOf(currentStep);

  /** 초기 데이터 로드 */
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  /**
   * 유효성 검사 함수들
   */
  const validateBodyStep = useCallback((): boolean => {
    if (!data.heightCm || !data.weightKg || !data.age) {
      setError('키, 몸무게, 나이를 모두 입력해주세요.');
      return false;
    }
    if (Number(data.heightCm) <= 0 || Number(data.heightCm) > 300) {
      setError('올바른 키를 입력해주세요.');
      return false;
    }
    if (Number(data.weightKg) <= 0 || Number(data.weightKg) > 500) {
      setError('올바른 몸무게를 입력해주세요.');
      return false;
    }
    if (Number(data.age) <= 0 || Number(data.age) > 150) {
      setError('올바른 나이를 입력해주세요.');
      return false;
    }
    if (!data.gender) {
      setError('성별을 선택해주세요.');
      return false;
    }
    return true;
  }, [data.heightCm, data.weightKg, data.age, data.gender]);

  const validateExerciseStep = useCallback((): boolean => {
    if (!data.experienceLevel) {
      setError('운동 경력을 선택해주세요.');
      return false;
    }
    if (!data.goalType) {
      setError('운동 목표를 선택해주세요.');
      return false;
    }
    return true;
  }, [data.experienceLevel, data.goalType]);

  const validateInjuryStep = useCallback((): boolean => {
    if (data.hasInjury) {
      if (data.injuries.length === 0) {
        setError('부상 정보를 입력해주세요.');
        return false;
      }

      for (const injury of data.injuries) {
        if (!injury.part.trim()) {
          setError('부상 부위를 입력해주세요.');
          return false;
        }
        if (!injury.severity) {
          setError('부상 정도를 선택해주세요.');
          return false;
        }
      }
    }
    return true;
  }, [data.hasInjury, data.injuries]);

  const validateScheduleStep = useCallback((): boolean => {
    if (!data.sessionMinutes) {
      setError('1회 운동 시간을 선택해주세요.');
      return false;
    }
    return true;
  }, [data.sessionMinutes]);

  const validateCurrentStep = useCallback((): boolean => {
    setError('');

    switch (currentStep) {
      case 'body':
        return validateBodyStep();
      case 'exercise':
        return validateExerciseStep();
      case 'injury':
        return validateInjuryStep();
      case 'schedule':
        return validateScheduleStep();
      case 'confirm':
        return true;
      default:
        return true;
    }
  }, [currentStep, validateBodyStep, validateExerciseStep, validateInjuryStep, validateScheduleStep]);

  /**
   * 다음 단계로 이동
   */
  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) {
      return;
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < ONBOARDING_STEPS.length) {
      setCurrentStep(ONBOARDING_STEPS[nextIndex]);
      setError('');
    }
  }, [validateCurrentStep, currentStepIndex]);

  /**
   * 이전 단계로 이동
   */
  const handlePrev = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(ONBOARDING_STEPS[prevIndex]);
      setError('');
    }
  }, [currentStepIndex]);

  /**
   * 알레르기 토글
   */
  const toggleAllergy = useCallback((allergyValue: string) => {
    setData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergyValue)
        ? prev.allergies.filter(a => a !== allergyValue)
        : [...prev.allergies, allergyValue]
    }));
  }, []);

  /**
   * 부상 여부 변경
   */
  const handleHasInjuryChange = useCallback((hasInjury: boolean) => {
    if (hasInjury) {
      setData(prev => ({
        ...prev,
        hasInjury: true,
        injuries: prev.injuries.length === 0
          ? [{ id: Date.now(), part: '', severity: null }]
          : prev.injuries
      }));
    } else {
      setData(prev => ({
        ...prev,
        hasInjury: false,
        injuries: []
      }));
    }
  }, []);

  /**
   * 부상 추가
   */
  const addInjury = useCallback(() => {
    const newInjury: InjuryItem = {
      id: Date.now(),
      part: '',
      severity: null
    };
    setData(prev => ({
      ...prev,
      injuries: [...prev.injuries, newInjury]
    }));
  }, []);

  /**
   * 부상 삭제
   */
  const removeInjury = useCallback((id: number) => {
    setData(prev => ({
      ...prev,
      injuries: prev.injuries.filter(injury => injury.id !== id)
    }));
  }, []);

  /**
   * 부상 정보 수정
   */
  const updateInjury = useCallback((id: number, field: 'part' | 'severity', value: string) => {
    setData(prev => ({
      ...prev,
      injuries: prev.injuries.map(injury =>
        injury.id === id
          ? { ...injury, [field]: value }
          : injury
      )
    }));
  }, []);

  /**
   * 온보딩 완료 핸들러
   */
  const handleComplete = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const requestData: OnboardingRequest = {
        profile: {
          heightCm: Number(data.heightCm),
          weightKg: Number(data.weightKg),
          age: Number(data.age),
          gender: data.gender === 'male' ? 'MALE' : 'FEMALE',
          experienceLevel: convertExperienceLevel(data.experienceLevel),
          goalType: convertGoalType(data.goalType),
          weeklyDays: data.weeklyDays,
          sessionMinutes: convertSessionMinutes(data.sessionMinutes),
        },
        injuries: data.hasInjury
          ? data.injuries.map((injury): OnboardingInjury => ({
              injuryPart: injury.part,
              injuryLevel: convertInjuryLevel(injury.severity),
            }))
          : [],
        allergies: data.allergies,
      };

      await saveOnboarding(requestData);

      if (isEditMode) {
        setCompleteMessage({
          title: '수정 완료',
          desc: '정보가 성공적으로 수정되었습니다.'
        });
      } else {
        setCompleteMessage({
          title: '등록 완료',
          desc: '맞춤 운동과 식단을 시작해보세요!'
        });
      }

      setShowCompleteModal(true);
    } catch {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [data, isEditMode]);

  /**
   * 완료 모달 확인 핸들러
   */
  const handleCompleteModalConfirm = useCallback(() => {
    setShowCompleteModal(false);
    onComplete();
  }, [onComplete]);

  return {
    currentStep,
    currentStepIndex,
    data,
    error,
    isLoading,
    showCompleteModal,
    completeMessage,
    handleNext,
    handlePrev,
    setData,
    toggleAllergy,
    handleHasInjuryChange,
    addInjury,
    removeInjury,
    updateInjury,
    handleComplete,
    handleCompleteModalConfirm,
  };
}
