/**
 * OnboardingPage.tsx
 * 온보딩 페이지 컴포넌트
 * - 신체정보 입력 (키, 몸무게, 나이, 성별, 알레르기)
 * - 운동경력 및 목표 선택
 * - 부상이력 입력
 * - 운동주기 설정
 * - 입력 정보 확인 및 완료
 */

import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { useOnboardingForm } from '../../hooks/onboarding/useOnboardingForm';
import { ONBOARDING_STEPS, STEP_TITLES } from '../../constants/onboarding';
import type { OnboardingData } from '../../api/types/onboarding';

/* 단계별 컴포넌트 */
import BodyStep from '../components/onboarding/BodyStep';
import ExerciseStep from '../components/onboarding/ExerciseStep';
import InjuryStep from '../components/onboarding/InjuryStep';
import ScheduleStep from '../components/onboarding/ScheduleStep';
import ConfirmStep from '../components/onboarding/ConfirmStep';
import CompleteModal from '../components/onboarding/CompleteModal';

/**
 * Props 타입 정의
 */
interface OnboardingPageProps {
  onComplete: () => void;
  onSkip: () => void;
  initialData?: OnboardingData | null;
  isEditMode?: boolean;
  onEditComplete?: () => void;
}

/**
 * OnboardingPage 컴포넌트
 */
export default function OnboardingPage({
  onComplete,
  onSkip,
  initialData = null,
  isEditMode = false
}: OnboardingPageProps) {
  /** 온보딩 폼 훅 */
  const {
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
  } = useOnboardingForm({
    initialData,
    isEditMode,
    onComplete
  });

  /**
   * 단계별 콘텐츠 렌더링
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 'body':
        return (
          <BodyStep
            data={data}
            setData={setData}
            toggleAllergy={toggleAllergy}
          />
        );
      case 'exercise':
        return (
          <ExerciseStep
            data={data}
            setData={setData}
          />
        );
      case 'injury':
        return (
          <InjuryStep
            data={data}
            handleHasInjuryChange={handleHasInjuryChange}
            addInjury={addInjury}
            removeInjury={removeInjury}
            updateInjury={updateInjury}
          />
        );
      case 'schedule':
        return (
          <ScheduleStep
            data={data}
            setData={setData}
          />
        );
      case 'confirm':
        return <ConfirmStep data={data} />;
      default:
        return null;
    }
  };

  /** 로딩 중일 때 */
  if (isLoading && !data.heightCm) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-loading">
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      {/* 헤더 */}
      <header className="onboarding-header">
        <div className="onboarding-header-content">
          {currentStepIndex > 0 ? (
            <button className="onboarding-back-btn" onClick={handlePrev}>
              <ArrowLeft size={24} />
            </button>
          ) : (
            <div style={{ width: 40 }} />
          )}
          <h1 className="onboarding-title">{STEP_TITLES[currentStep]}</h1>
          <button className="onboarding-skip-btn" onClick={onSkip}>
            <X size={24} />
          </button>
        </div>

        {/* 진행률 바 */}
        <div className="onboarding-progress">
          <div
            className="onboarding-progress-bar"
            style={{ width: `${((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100}%` }}
          />
        </div>
      </header>

      {/* 콘텐츠 */}
      <main className="onboarding-main">
        {renderStepContent()}
      </main>

      {/* 하단 버튼 */}
      <footer className="onboarding-footer">
        {/* 에러 메시지 */}
        {error && <p className="onboarding-error">{error}</p>}

        {currentStep === 'confirm' ? (
          <button
            className="onboarding-complete-btn"
            onClick={handleComplete}
            disabled={isLoading}
          >
            {isLoading ? (
              '저장 중...'
            ) : (
              <>
                <Check size={20} />
                {isEditMode ? '수정 완료' : '완료'}
              </>
            )}
          </button>
        ) : (
          <button className="onboarding-next-btn" onClick={handleNext}>
            다음
            <ArrowRight size={20} />
          </button>
        )}
      </footer>

      {/* 완료 팝업 */}
      {showCompleteModal && (
        <CompleteModal
          message={completeMessage}
          onConfirm={handleCompleteModalConfirm}
        />
      )}
    </div>
  );
}

/** OnboardingData 타입 재export (다른 파일에서 사용) */
export type { OnboardingData } from '../../api/types/onboarding';
