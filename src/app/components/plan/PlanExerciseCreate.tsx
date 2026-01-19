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
  onGenerate: (selectedDays: number[]) => void;
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
    onGenerate(selectedDays);
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
