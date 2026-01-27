/**
 * ExercisePlanCreate.tsx
 * 운동 계획 생성 폼 컴포넌트
 * - 운동할 요일 선택
 * - 1주 단위 계획 생성
 * - 온보딩 정보 기반 AI 추천
 */

import { useState } from 'react';
import { ArrowLeft, Calendar, Dumbbell } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface ExercisePlanCreateProps {
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
 * 선택된 요일을 이번 주 날짜 문자열로 변환
 * @param selectedDays 선택된 요일 배열 (0: 일요일 ~ 6: 토요일)
 * @returns ISO 날짜 문자열 배열 (예: ["2026-01-17", "2026-01-19"])
 */
const convertDaysToDateStrings = (selectedDays: number[]): string[] => {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); /* 0: 일요일 ~ 6: 토요일 */
  
  return selectedDays.map(dayId => {
    /* 오늘 기준으로 해당 요일까지의 차이 계산 */
    let diff = dayId - currentDayOfWeek;
    /* 이미 지난 요일이면 다음 주로 */
    if (diff < 0) {
      diff += 7;
    }
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    
    /* ISO 날짜 문자열 반환 (YYYY-MM-DD) */
    return targetDate.toISOString().split('T')[0];
  }).sort();
};

/**
 * ExercisePlanCreate 컴포넌트
 */
export default function ExercisePlanCreate({ 
  onBack, 
  onGenerate 
}: ExercisePlanCreateProps) {
  /**
   * 선택된 요일 상태 (0: 일요일 ~ 6: 토요일)
   */
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3, 5]); // 기본: 월, 수, 금

  /**
   * 추가 요청사항 상태
   */
  const [additionalRequest, setAdditionalRequest] = useState<string>('');

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
    /* 요일을 날짜 문자열로 변환하여 전달 */
    const dateStrings = convertDaysToDateStrings(selectedDays);
    onGenerate(dateStrings, additionalRequest);
  };

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

        {/* 추가 요청사항 섹션 */}
        <section className="exercise-plan-section">
          <h2 className="exercise-plan-section-title">추가 요청사항 (선택)</h2>
          <p className="exercise-plan-section-desc">AI가 참고할 추가 요청을 입력하세요</p>
          <textarea
            className="exercise-plan-textarea"
            placeholder="예: 덤벨 운동 위주로 구성해주세요&#10;예: 유산소 운동 비중을 늘려주세요"
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
