/**
 * LandingPage.tsx
 * 랜딩 페이지 컴포넌트
 * 비로그인 사용자에게 표시되는 메인 화면
 * - 로그인/회원가입 메인 버튼 2개 배치
 * - 사이트 소개 및 서비스 설명 섹션
 * - 비로그인 시 메인 서비스 접근 제한
 */

import { useState } from 'react';
import { Dumbbell, Utensils, Video, Brain, ChevronDown } from 'lucide-react';
import LoginModal from '../components/auth/LoginModal';
import SignupModal from '../components/auth/SignupModal';

/**
 * 컴포넌트 Props 타입 정의
 */
interface LandingPageProps {
  onLogin: () => void;
}

/**
 * 서비스 기능 데이터
 * 사이트 소개 섹션에 표시될 주요 기능 목록
 */
const FEATURES = [
  {
    icon: Brain,
    title: 'AI 맞춤 운동 계획',
    description: '키, 몸무게, 운동경력, 부상이력을 분석하여 나만을 위한 운동 계획을 생성합니다.',
    color: 'var(--color-workout)',
  },
  {
    icon: Utensils,
    title: 'AI 맞춤 식단 추천',
    description: '목표와 알레르기를 고려한 개인 맞춤형 식단을 추천받으세요.',
    color: 'var(--color-diet)',
  },
  {
    icon: Video,
    title: '화상 PT',
    description: '전문 트레이너와 실시간 화상 PT로 정확한 자세와 피드백을 받으세요.',
    color: 'var(--color-pt)',
  },
  {
    icon: Dumbbell,
    title: '운동 기록 관리',
    description: '매일의 운동을 기록하고 주간/월간 달성률을 확인하세요.',
    color: 'var(--color-workout)',
  },
];

/**
 * LandingPage 컴포넌트
 * 메인 랜딩 페이지 UI 렌더링
 */
export default function LandingPage({ onLogin }: LandingPageProps) {
  /**
   * 모달 상태 관리
   */
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  /**
   * 로그인 모달 열기
   */
  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
  };

  /**
   * 회원가입 모달 열기
   */
  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  /**
   * 모든 모달 닫기
   */
  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  /**
   * 로그인 성공 핸들러
   */
  const handleLoginSuccess = () => {
    closeAllModals();
    onLogin();
  };

  /**
   * 스크롤 다운 핸들러
   * 소개 섹션으로 스크롤
   */
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-container">
      {/* 히어로 섹션 - 메인 비주얼 영역 */}
      <section className="landing-hero">
        {/* 로고 및 타이틀 */}
        <div className="landing-logo">
          <Dumbbell className="landing-logo-icon" />
          <h1 className="landing-title">운동운동</h1>
        </div>

        {/* 메인 슬로건 */}
        <div className="landing-slogan">
          <h2 className="landing-slogan-main">
            AI가 만드는<br />
            나만의 운동 & 식단
          </h2>
          <p className="landing-slogan-sub">
            개인 맞춤형 운동 계획과 식단을<br />
            AI가 무료로 설계해드립니다
          </p>
        </div>

        {/* 메인 버튼 영역 - 로그인/회원가입 */}
        <div className="landing-buttons">
          <button 
            className="landing-btn landing-btn-primary"
            onClick={openLoginModal}
          >
            로그인
          </button>
          <button 
            className="landing-btn landing-btn-secondary"
            onClick={openSignupModal}
          >
            회원가입
          </button>
        </div>

        {/* 스크롤 안내 */}
        <button className="landing-scroll-hint" onClick={scrollToFeatures}>
          <span>서비스 소개</span>
          <ChevronDown className="landing-scroll-icon" />
        </button>
      </section>

      {/* 서비스 소개 섹션 */}
      <section id="features" className="landing-features">
        <h3 className="landing-features-title">
          왜 운동운동인가요?
        </h3>
        
        {/* 기능 카드 목록 */}
        <div className="landing-features-grid">
          {FEATURES.map((feature, index) => (
            <div key={index} className="landing-feature-card">
              <div 
                className="landing-feature-icon"
                style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
              >
                <feature.icon size={28} />
              </div>
              <h4 className="landing-feature-title">{feature.title}</h4>
              <p className="landing-feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* 추가 CTA */}
        <div className="landing-cta">
          <p className="landing-cta-text">
            지금 바로 시작하세요!
          </p>
          <button 
            className="landing-btn landing-btn-primary landing-btn-large"
            onClick={openSignupModal}
          >
            무료로 시작하기
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="landing-footer">
        <p className="landing-footer-text">
          © 2024 운동운동. All rights reserved.
        </p>
      </footer>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <LoginModal 
          onClose={closeAllModals}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={openSignupModal}
        />
      )}

      {/* 회원가입 모달 */}
      {showSignupModal && (
        <SignupModal 
          onClose={closeAllModals}
          onSignupSuccess={openLoginModal}
          onSwitchToLogin={openLoginModal}
        />
      )}
    </div>
  );
}
