/**
 * ExercisePlanCreate.tsx
 * 운동 계획 생성 폼 컴포넌트
 * - 운동할 요일 선택
 * - 1주 단위 계획 생성
 * - 온보딩 정보 기반 AI 추천
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Dumbbell, X } from 'lucide-react';
import { getProfile, getInjuries } from '../../../api/me';
import type { InjuryItem, InjuryLevel } from '../../../api/types/me';

/**
 * Props 타입 정의
 */
interface PlanExerciseCreateProps {
  onBack: () => void;
  onGenerate: (dates: string[], additionalRequest: string) => void;
}

/**
 * 요일 데이터
 */
const WEEK_DAYS = [
  { id: 0, label: '일' },
  { id: 1, label: '월' },
  { id: 2, label: '화' },
  { id: 3, label: '수' },
  { id: 4, label: '목' },
  { id: 5, label: '금' },
  { id: 6, label: '토' },
];

/**
 * 부상 레벨 한글 매핑
 */
const INJURY_LEVEL_LABELS: Record<InjuryLevel, string> = {
  MILD: '경미',
  CAUTION: '주의',
  SEVERE: '심각',
};

/**
 * weeklyDays에 따른 기본 요일 선택
 * 1일: 수
 * 2일: 화, 목
 * 3일: 월, 수, 금
 * 4일: 월, 화, 목, 금
 * 5일: 월, 화, 수, 목, 금
 * 6일: 월, 화, 수, 목, 금, 토
 * 7일: 전체
 */
const getDefaultDaysByWeeklyDays = (weeklyDays: number): number[] => {
  switch (weeklyDays) {
    case 1:
      return [3]; // 수
    case 2:
      return [2, 4]; // 화, 목
    case 3:
      return [1, 3, 5]; // 월, 수, 금
    case 4:
      return [1, 2, 4, 5]; // 월, 화, 목, 금
    case 5:
      return [1, 2, 3, 4, 5]; // 월~금
    case 6:
      return [1, 2, 3, 4, 5, 6]; // 월~토
    case 7:
      return [0, 1, 2, 3, 4, 5, 6]; // 전체
    default:
      return [1, 3, 5]; // 기본: 월, 수, 금
  }
};

/**
 * 선택된 요일을 이번 주 날짜 문자열로 변환
 * @param selectedDays 선택된 요일 배열 (0: 일요일 ~ 6: 토요일)
 * @returns ISO 날짜 문자열 배열 (예: ["2026-01-17", "2026-01-19"])
 */
const convertDaysToDateStrings = (selectedDays: number[]): string[] => {
  const today = new Date();
  const currentDayOfWeek = today.getDay();

  return selectedDays.map(dayId => {
    let diff = dayId - currentDayOfWeek;
    /* 지난 요일이면 다음 주로 */
    if (diff < 0) diff += 7;

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    return targetDate.toISOString().split('T')[0];
  }).sort();
};

/**
 * 부상 정보를 문자열로 변환
 */
const formatInjuriesToString = (injuries: InjuryItem[]): string => {
  if (injuries.length === 0) return '';

  const injuryTexts = injuries.map(injury => {
    const levelLabel = INJURY_LEVEL_LABELS[injury.injuryLevel];
    return `${injury.injuryPart}(${levelLabel})`;
  });

  return `부상 이력: ${injuryTexts.join(', ')}. 해당 부위에 무리가 가지 않는 운동으로 구성해주세요.`;
};

/**
 * PlanExerciseCreate 컴포넌트
 */
export default function PlanExerciseCreate({ 
  onBack, 
  onGenerate 
}: PlanExerciseCreateProps) {
  /**
   * 선택된 요일 상태 (0: 일요일 ~ 6: 토요일)
   */
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3, 5]);

  /**
   * 부상 정보 (API 요청 시 자동 포함)
   */
  const [injuries, setInjuries] = useState<InjuryItem[]>([]);

  /**
   * 추가 요청사항
   */
  const [additionalRequest, setAdditionalRequest] = useState<string>('');

  /**
   * 로딩 상태
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 온보딩 완료 여부
   */
  const [hasOnboardingData, setHasOnboardingData] = useState(true);

  /**
   * 사용자 온보딩 정보 불러오기
   */
  useEffect(() => {
    const loadUserData = async () => {
      try {
        /* 프로필 정보 (운동 주기) */
        const profile = await getProfile();
        console.log('프로필 응답:', profile);

        /* 온보딩 완료 여부 확인 (필수 값 체크) */
        if (!profile || !profile.heightCm || !profile.weightKg || !profile.age) {
          setHasOnboardingData(false);
          setIsLoading(false);
          return;
        }
        setHasOnboardingData(true);
        
        if (profile?.weeklyDays) {
          setSelectedDays(getDefaultDaysByWeeklyDays(profile.weeklyDays));
        }

        /* 부상 정보 */
        const injuriesData = await getInjuries();
        console.log('부상 정보 응답:', injuriesData);
        if (injuriesData?.injuries) {
          setInjuries(injuriesData.injuries);
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        setHasOnboardingData(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  /**
   * 요일 토글 핸들러
   */
  const handleDayToggle = (dayId: number) => {
    setSelectedDays(prev => {
      if (prev.includes(dayId)) {
        return prev.filter(d => d !== dayId);
      } else {
        return [...prev, dayId].sort((a, b) => a - b);
      }
    });
  };

  /**
   * 계획 생성 핸들러
   */
  const handleGenerate = () => {
    if (selectedDays.length === 0) {
      alert('운동할 요일을 최소 1일 이상 선택해주세요.');
      return;
    }

    const dateStrings = convertDaysToDateStrings(selectedDays);

    /* 부상 정보 + 사용자 추가 요청사항 합치기 */
    const injuryText = formatInjuriesToString(injuries);
    const userRequest = additionalRequest.trim();

    let combinedRequest = '';
    if (injuryText && userRequest) {
      combinedRequest = `${injuryText}\n추가 요청: ${userRequest}`;
    } else if (injuryText) {
      combinedRequest = injuryText;
    } else if (userRequest) {
      combinedRequest = userRequest;
    }

    onGenerate(dateStrings, combinedRequest);
  };

  if (isLoading) {
    return (
      <div className="exercise-plan-container">
        <div className="exercise-plan-loading">정보를 불러오는 중...</div>
      </div>
    );
  }

  /* 온보딩 미완료 시 안내 팝업 */
  if (!hasOnboardingData) {
    return (
      <div className="exercise-plan-container">
        {/* 헤더 */}
        <header className="exercise-plan-header">
          <button className="exercise-plan-back-btn" onClick={onBack}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="exercise-plan-title">운동 계획 생성</h1>
          <div className="exercise-plan-header-spacer" />
        </header>

        {/* 온보딩 필요 안내 */}
        <main className="exercise-plan-content">
          <div className="onboarding-required-popup">
            <button className="onboarding-required-close" onClick={onBack}>
              <X size={20} />
            </button>
            <div className="onboarding-required-icon">⚠️</div>
            <h2 className="onboarding-required-title">온보딩 정보가 필요합니다</h2>
            <p className="onboarding-required-desc">
              AI 운동 계획을 생성하려면<br />
              먼저 신체 정보를 입력해주세요
            </p>
            <button 
              className="onboarding-required-btn"
              onClick={onBack}
            >
              돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="exercise-plan-container">
      {/* 헤더 */}
      <header className="exercise-plan-header">
        <button className="exercise-plan-back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="exercise-plan-title">운동 계획 생성</h1>
        <div className="exercise-plan-header-spacer" />
      </header>

      {/* 메인 콘텐츠 */}
      <main className="exercise-plan-content">
        {/* 소개 배너 */}
        <div className="exercise-plan-banner">
          <Dumbbell className="exercise-plan-banner-icon" />
          <p className="exercise-plan-banner-text">맞춤형 운동 계획을 생성합니다!</p>
        </div>

        {/* 요일 선택 섹션 */}
        <section className="exercise-plan-section">
          <h2 className="exercise-plan-section-title">운동할 요일을 선택하세요</h2>
          <p className="exercise-plan-section-desc">선택한 요일에 맞춰 운동 계획을 생성합니다</p>

          {/* 요일 버튼 그리드 */}
          <div className="exercise-plan-days-grid">
            {WEEK_DAYS.map(day => (
              <button
                key={day.id}
                className={`exercise-plan-day-btn ${selectedDays.includes(day.id) ? 'selected' : ''}`}
                onClick={() => handleDayToggle(day.id)}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* 선택된 요일 표시 */}
          <p className="exercise-plan-selected-info">
            선택된 요일: {selectedDays.length}일 (주 {selectedDays.length}회 운동)
          </p>
        </section>

        {/* 부상 정보 표시 (있을 경우) */}
        {injuries.length > 0 && (
          <section className="exercise-plan-injury-info">
            <h3 className="exercise-plan-injury-title">🩹 등록된 부상 정보</h3>
            <ul className="exercise-plan-injury-list">
              {injuries.map(injury => (
                <li key={injury.injuryId} className="exercise-plan-injury-item">
                  <span className="exercise-plan-injury-part">{injury.injuryPart}</span>
                  <span className={`exercise-plan-injury-level ${injury.injuryLevel.toLowerCase()}`}>
                    {INJURY_LEVEL_LABELS[injury.injuryLevel]}
                  </span>
                </li>
              ))}
            </ul>
            <p className="exercise-plan-injury-note">
              * 부상 정보가 AI 계획 생성 시 자동으로 반영됩니다
            </p>
          </section>
        )}

        {/* 추가 요청사항 */}
        <section className="exercise-plan-section">
          <h2 className="exercise-plan-section-title">추가 요청사항 (선택)</h2>
          <textarea
            className="exercise-plan-textarea"
            placeholder="예: 상체 위주로 해주세요, 유산소 포함해주세요..."
            value={additionalRequest}
            onChange={(e) => setAdditionalRequest(e.target.value)}
            rows={3}
          />
        </section>

        {/* 고려사항 안내 */}
        <section className="exercise-plan-notice">
          <h3 className="exercise-plan-notice-title">
            <Calendar size={18} />
            계획 생성 시 고려사항
          </h3>
          <ul className="exercise-plan-notice-list">
            <li>온보딩 시 입력한 운동 목표</li>
            <li>현재 운동 경력 수준</li>
            <li>부상 이력 및 주의사항</li>
            <li>희망하는 1회 운동 시간</li>
          </ul>
        </section>
      </main>

      {/* 하단 버튼 */}
      <footer className="exercise-plan-footer">
        <button 
          className="exercise-plan-generate-btn"
          onClick={handleGenerate}
          disabled={selectedDays.length === 0}
        >
          <Calendar size={20} />
          AI 운동 계획 생성하기
        </button>
      </footer>
    </div>
  );
}