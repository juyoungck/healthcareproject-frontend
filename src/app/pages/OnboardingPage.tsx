/**
 * OnboardingPage.tsx
 * 온보딩 페이지 컴포넌트
 * - 신체정보 입력 (키, 몸무게, 나이, 성별, 알레르기)
 * - 운동경력 및 목표 선택
 * - 부상이력 입력
 * - 운동주기 설정
 * - 입력 정보 확인 및 완료
 */

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Ruler,
  Weight,
  Calendar,
  Users,
  AlertTriangle,
  Target,
  Dumbbell,
  Clock,
  X,
  Plus,
  Trash2
} from 'lucide-react';

/**
 * Props 타입 정의
 */
interface OnboardingPageProps {
  onComplete: () => void;
  onSkip: () => void;
  initialData?: OnboardingData | null;  // 수정 시 기존 데이터
  isEditMode?: boolean;  // 수정 모드 여부
  onEditComplete?: () => void;
}

/**
 * 온보딩 단계
 */
type OnboardingStep = 'body' | 'exercise' | 'injury' | 'schedule' | 'confirm';

/**
 * 부상 정보 타입
 */
interface InjuryItem {
  id: number;
  part: string;
  severity: 'mild' | 'caution' | 'severe' | null;
}

/**
 * 온보딩 데이터 타입
 */
export interface OnboardingData {
  height: string;
  weight: string;
  age: string;
  gender: 'male' | 'female' | null;
  allergies: string[];
  exerciseLevel: 'beginner' | 'elementary' | 'intermediate' | 'advanced' | null;
  exerciseGoal: 'strength' | 'weight_loss' | 'flexibility' | 'endurance' | null;
  hasInjury: boolean;
  injuries: InjuryItem[];
  exerciseDays: number;
  exerciseTime: '30min' | '1hour' | '1hour30' | '2hour' | null;
}


/**
 * 초기 데이터
 */
const INITIAL_DATA: OnboardingData = {
  height: '',
  weight: '',
  age: '',
  gender: null,
  allergies: [],
  exerciseLevel: null,
  exerciseGoal: null,
  hasInjury: false,
  injuries: [],
  exerciseDays: 3,
  exerciseTime: null
};

/**
 * 알레르기 옵션 목록
 */
const ALLERGY_OPTIONS = [
  '밀', '메밀', '땅콩', '견과류', '갑각류', '연체류', '생선', 
  '계란', '우유', '소고기', '돼지고기', '닭고기', '아황산류'
];

/**
 * OnboardingPage 컴포넌트
 */
export default function OnboardingPage({ 
  onComplete, 
  onSkip,
  initialData = null,
  isEditMode = false
}: OnboardingPageProps) {
  /**
   * 현재 단계
   */
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('body');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeMessage, setCompleteMessage] = useState({
    title: '',
    desc: ''
  });

  /**
   * 온보딩 데이터
   */
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);

  /**
   * 에러 메시지
   */
  const [error, setError] = useState('');

  /**
   * 로딩 상태
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 초기 데이터 로드 (수정 모드 또는 기존 데이터가 있는 경우)
   */
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else if (!isEditMode) {
      /* 
       * TODO: API 연동 - 기존 온보딩 데이터 조회
       * 최초 로그인 시 기존에 입력한 데이터가 있으면 불러오기
       */
      fetchOnboardingData();
    }
  }, [initialData, isEditMode]);

  /**
   * 온보딩 데이터 조회
   * TODO: 실제 API 연동
   */
  const fetchOnboardingData = async () => {
    setIsLoading(true);
    try {
      /* 
       * TODO: API 호출
       * const response = await api.get('/user/onboarding');
       * if (response.data) {
       *   setData(response.data);
       * }
       */
    } catch (err) {
      console.error('온보딩 데이터 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 단계 목록
   */
  const steps: OnboardingStep[] = ['body', 'exercise', 'injury', 'schedule', 'confirm'];
  const currentStepIndex = steps.indexOf(currentStep);

  /**
   * 신체정보 유효성 검사
   */
  const validateBodyStep = (): boolean => {
    if (!data.height || !data.weight || !data.age) {
      setError('키, 몸무게, 나이를 모두 입력해주세요.');
      return false;
    }
    if (Number(data.height) <= 0 || Number(data.height) > 300) {
      setError('올바른 키를 입력해주세요.');
      return false;
    }
    if (Number(data.weight) <= 0 || Number(data.weight) > 500) {
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
  };

  /**
   * 운동경력 유효성 검사
   */
  const validateExerciseStep = (): boolean => {
    if (!data.exerciseLevel) {
      setError('운동 경력을 선택해주세요.');
      return false;
    }
    if (!data.exerciseGoal) {
      setError('운동 목표를 선택해주세요.');
      return false;
    }
    return true;
  };

  /**
   * 부상이력 유효성 검사
   */
  const validateInjuryStep = (): boolean => {
    // 부상 있음 선택 시
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
  };

  /**
   * 운동주기 유효성 검사
   */
  const validateScheduleStep = (): boolean => {
    if (!data.exerciseTime) {
      setError('1회 운동 시간을 선택해주세요.');
      return false;
    }
    return true;
  };

  /**
   * 현재 단계 유효성 검사
   */
  const validateCurrentStep = (): boolean => {
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
  };

  /**
   * 다음 단계로 이동
   */
  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
      setError('');
    }
  };

  /**
   * 이전 단계로 이동
   */
  const handlePrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
      setError('');
    }
  };

  /**
   * 알레르기 토글
   */
  const toggleAllergy = (allergy: string) => {
    setData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  /**
   * 부상 추가
   */
  const addInjury = () => {
    const newInjury: InjuryItem = {
      id: Date.now(),
      part: '',
      severity: null
    };
    setData(prev => ({
      ...prev,
      injuries: [...prev.injuries, newInjury]
    }));
  };

  /**
   * 부상 삭제
   */
  const removeInjury = (id: number) => {
    setData(prev => ({
      ...prev,
      injuries: prev.injuries.filter(injury => injury.id !== id)
    }));
  };

  /**
   * 부상 정보 수정
   */
  const updateInjury = (id: number, field: 'part' | 'severity', value: string) => {
    setData(prev => ({
      ...prev,
      injuries: prev.injuries.map(injury => 
        injury.id === id 
          ? { ...injury, [field]: value }
          : injury
      )
    }));
  };

  /**
   * 부상 여부 변경
   */
  const handleHasInjuryChange = (hasInjury: boolean) => {
    if (hasInjury && data.injuries.length === 0) {
      // 있음 선택 시 기본 1개 추가
      setData(prev => ({
        ...prev,
        hasInjury: true,
        injuries: [{ id: Date.now(), part: '', severity: null }]
      }));
    } else {
      setData(prev => ({
        ...prev,
        hasInjury,
        injuries: hasInjury ? prev.injuries : []
      }));
    }
  };

  /**
   * 온보딩 완료 핸들러
   */
  const handleComplete = async () => {
    setIsLoading(true);
    try {
      /* 
       * TODO: API 연동 - 온보딩 데이터 저장
       * await api.post('/user/onboarding', data);
       */
      console.log('Onboarding data:', data);
      
      // 임시 딜레이 (API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 모드에 따라 메시지 설정
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
    } catch (err) {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
      console.error('온보딩 저장 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 수정 완료 팝업 확인 핸들러
   */
  const handleCompleteModalConfirm = () => {
    setShowCompleteModal(false);
    onComplete();
  };

  /**
   * 단계별 제목
   */
  const getStepTitle = () => {
    switch (currentStep) {
      case 'body': return '신체 정보';
      case 'exercise': return '운동 경력';
      case 'injury': return '부상 이력';
      case 'schedule': return '운동 주기';
      case 'confirm': return '정보 확인';
      default: return '';
    }
  };

  /**
   * 단계별 콘텐츠 렌더링
   */
  const renderStepContent = () => {
    switch (currentStep) {
      /* 신체 정보 입력 */
      case 'body':
        return (
          <div className="onboarding-step-content">
            <p className="onboarding-step-desc">
              맞춤 운동과 식단 추천을 위해<br />신체 정보를 입력해주세요
            </p>

            {/* 키, 몸무게, 나이 */}
            <div className="onboarding-input-grid">
              <div className="onboarding-input-group">
                <label className="onboarding-input-label">
                  <Ruler size={16} />
                  키
                </label>
                <div className="onboarding-input-wrapper">
                  <input
                    type="number"
                    className="onboarding-input"
                    placeholder="0"
                    value={data.height}
                    onChange={(e) => setData({ ...data, height: e.target.value })}
                  />
                  <span className="onboarding-input-unit">cm</span>
                </div>
              </div>

              <div className="onboarding-input-group">
                <label className="onboarding-input-label">
                  <Weight size={16} />
                  몸무게
                </label>
                <div className="onboarding-input-wrapper">
                  <input
                    type="number"
                    className="onboarding-input"
                    placeholder="0"
                    value={data.weight}
                    onChange={(e) => setData({ ...data, weight: e.target.value })}
                  />
                  <span className="onboarding-input-unit">kg</span>
                </div>
              </div>

              <div className="onboarding-input-group">
                <label className="onboarding-input-label">
                  <Calendar size={16} />
                  나이
                </label>
                <div className="onboarding-input-wrapper">
                  <input
                    type="number"
                    className="onboarding-input"
                    placeholder="0"
                    value={data.age}
                    onChange={(e) => setData({ ...data, age: e.target.value })}
                  />
                  <span className="onboarding-input-unit">세</span>
                </div>
              </div>
            </div>

            {/* 성별 선택 */}
            <div className="onboarding-section">
              <label className="onboarding-section-label">
                <Users size={16} />
                성별
              </label>
              <div className="onboarding-toggle-group">
                <button
                  className={`onboarding-toggle-btn ${data.gender === 'male' ? 'active' : ''}`}
                  onClick={() => setData({ ...data, gender: 'male' })}
                >
                  남성
                </button>
                <button
                  className={`onboarding-toggle-btn ${data.gender === 'female' ? 'active' : ''}`}
                  onClick={() => setData({ ...data, gender: 'female' })}
                >
                  여성
                </button>
              </div>
            </div>

            {/* 알레르기 선택 */}
            <div className="onboarding-section">
              <label className="onboarding-section-label">
                <AlertTriangle size={16} />
                알레르기 (선택)
              </label>
              <div className="onboarding-chip-group">
                {ALLERGY_OPTIONS.map((allergy) => (
                  <button
                    key={allergy}
                    className={`onboarding-chip ${data.allergies.includes(allergy) ? 'active' : ''}`}
                    onClick={() => toggleAllergy(allergy)}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      /* 운동 경력 및 목표 */
      case 'exercise':
        return (
          <div className="onboarding-step-content">
            <p className="onboarding-step-desc">
              운동 경력과 목표를 선택해주세요
            </p>

            {/* 운동 경력 */}
            <div className="onboarding-section">
              <label className="onboarding-section-label">
                <Dumbbell size={16} />
                운동 경력
              </label>
              <div className="onboarding-option-grid">
                {[
                  { value: 'beginner', label: '입문', desc: '운동 경험 없음' },
                  { value: 'elementary', label: '초급', desc: '1년 미만' },
                  { value: 'intermediate', label: '중급', desc: '1~3년' },
                  { value: 'advanced', label: '고급', desc: '3년 이상' }
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`onboarding-option-btn ${data.exerciseLevel === option.value ? 'active' : ''}`}
                    onClick={() => setData({ ...data, exerciseLevel: option.value as OnboardingData['exerciseLevel'] })}
                  >
                    <span className="onboarding-option-label">{option.label}</span>
                    <span className="onboarding-option-desc">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 운동 목표 */}
            <div className="onboarding-section">
              <label className="onboarding-section-label">
                <Target size={16} />
                운동 목표
              </label>
              <div className="onboarding-option-grid">
                {[
                  { value: 'strength', label: '근력 향상', desc: '근육량 증가' },
                  { value: 'weight_loss', label: '체중 감량', desc: '다이어트' },
                  { value: 'flexibility', label: '유연성', desc: '스트레칭' },
                  { value: 'endurance', label: '체력 향상', desc: '지구력 강화' }
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`onboarding-option-btn ${data.exerciseGoal === option.value ? 'active' : ''}`}
                    onClick={() => setData({ ...data, exerciseGoal: option.value as OnboardingData['exerciseGoal'] })}
                  >
                    <span className="onboarding-option-label">{option.label}</span>
                    <span className="onboarding-option-desc">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      /* 부상 이력 */
      case 'injury':
      return (
          <div className="onboarding-step-content">
          <p className="onboarding-step-desc">
              부상 이력이 있다면 알려주세요<br />안전한 운동 추천에 활용됩니다
          </p>

          {/* 부상 여부 선택 */}
          <div className="onboarding-section">
              <label className="onboarding-section-label">
              <AlertTriangle size={16} />
              부상 여부
              </label>
              <div className="onboarding-toggle-group">
              <button
                  className={`onboarding-toggle-btn ${!data.hasInjury ? 'active' : ''}`}
                  onClick={() => handleHasInjuryChange(false)}
              >
                  없음
              </button>
              <button
                  className={`onboarding-toggle-btn ${data.hasInjury ? 'active' : ''}`}
                  onClick={() => handleHasInjuryChange(true)}
              >
                  있음
              </button>
              </div>
          </div>

          {/* 부상 목록 (있음 선택 시) */}
          {data.hasInjury && (
            <div className="onboarding-section">
              <label className="onboarding-section-label">
                  부상 정보
              </label>
            
              <div className="onboarding-injury-list">
                  {data.injuries.map((injury, index) => (
                  <div key={injury.id} className="onboarding-injury-item">
                      {/* 부상 헤더 */}
                      <div className="onboarding-injury-header">
                      <span className="onboarding-injury-number">부상 {index + 1}</span>
                      {data.injuries.length > 1 && (
                          <button 
                          className="onboarding-injury-delete"
                          onClick={() => removeInjury(injury.id)}
                          >
                          <Trash2 size={16} />
                          </button>
                      )}
                      </div>

                      {/* 부상 부위 입력 */}
                      <input
                      type="text"
                      className="onboarding-text-input"
                      placeholder="부상 부위 (예: 허리, 무릎, 어깨)"
                      value={injury.part}
                      onChange={(e) => updateInjury(injury.id, 'part', e.target.value)}
                      />

                      {/* 부상 정도 선택 */}
                      <div className="onboarding-injury-severity">
                      {[
                          { value: 'mild', label: '경미' },
                          { value: 'caution', label: '주의 요함' },
                          { value: 'severe', label: '심각' }
                      ].map((option) => (
                          <button
                          key={option.value}
                          className={`onboarding-severity-btn ${injury.severity === option.value ? 'active' : ''}`}
                          onClick={() => updateInjury(injury.id, 'severity', option.value)}
                          >
                          {option.label}
                          </button>
                      ))}
                      </div>
                  </div>
                  ))}
              </div>

              {/* 부상 추가 버튼 */}
              <button className="onboarding-injury-add" onClick={addInjury}>
                  <Plus size={18} />
                  부상 추가하기
              </button>
              </div>
          )}
          </div>
      );

      /* 운동 주기 */
      case 'schedule':
        return (
          <div className="onboarding-step-content">
            <p className="onboarding-step-desc">
              일주일에 몇 번, 얼마나 운동하실 건가요?
            </p>

            {/* 주간 운동 일수 */}
            <div className="onboarding-section">
              <label className="onboarding-section-label">
                <Calendar size={16} />
                주간 운동 일수
              </label>
              <div className="onboarding-days-slider">
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={data.exerciseDays}
                  onChange={(e) => setData({ ...data, exerciseDays: parseInt(e.target.value) })}
                  className="onboarding-slider"
                />
                <div className="onboarding-days-display">
                  <span className="onboarding-days-value">{data.exerciseDays}</span>
                  <span className="onboarding-days-unit">일 / 주</span>
                </div>
              </div>
            </div>

            {/* 1회 운동 시간 */}
            <div className="onboarding-section">
              <label className="onboarding-section-label">
                <Clock size={16} />
                1회 운동 시간
              </label>
              <div className="onboarding-option-grid">
                {[
                  { value: '30min', label: '30분 이내' },
                  { value: '1hour', label: '1시간' },
                  { value: '1hour30', label: '1시간 30분' },
                  { value: '2hour', label: '2시간 이상' }
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`onboarding-time-btn ${data.exerciseTime === option.value ? 'active' : ''}`}
                    onClick={() => setData({ ...data, exerciseTime: option.value as OnboardingData['exerciseTime'] })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      /* 정보 확인 */
      case 'confirm':
        return (
          <div className="onboarding-step-content">
            <p className="onboarding-step-desc">
              입력하신 정보를 확인해주세요
            </p>

            <div className="onboarding-confirm-list">
              {/* 신체 정보 */}
              <div className="onboarding-confirm-section">
                <h4 className="onboarding-confirm-title">신체 정보</h4>
                <div className="onboarding-confirm-grid">
                  <div className="onboarding-confirm-item">
                    <span className="onboarding-confirm-label">키</span>
                    <span className="onboarding-confirm-value">{data.height}cm</span>
                  </div>
                  <div className="onboarding-confirm-item">
                    <span className="onboarding-confirm-label">몸무게</span>
                    <span className="onboarding-confirm-value">{data.weight}kg</span>
                  </div>
                  <div className="onboarding-confirm-item">
                    <span className="onboarding-confirm-label">나이</span>
                    <span className="onboarding-confirm-value">{data.age}세</span>
                  </div>
                  <div className="onboarding-confirm-item">
                    <span className="onboarding-confirm-label">성별</span>
                    <span className="onboarding-confirm-value">
                      {data.gender === 'male' ? '남성' : data.gender === 'female' ? '여성' : '-'}
                    </span>
                  </div>
                </div>
                {data.allergies.length > 0 && (
                  <div className="onboarding-confirm-tags">
                    <span className="onboarding-confirm-label">알레르기</span>
                    <div className="onboarding-confirm-tag-list">
                      {data.allergies.map((allergy) => (
                        <span key={allergy} className="onboarding-confirm-tag">{allergy}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 운동 정보 */}
              <div className="onboarding-confirm-section">
                <h4 className="onboarding-confirm-title">운동 정보</h4>
                <div className="onboarding-confirm-row">
                  <span className="onboarding-confirm-label">운동 경력</span>
                  <span className="onboarding-confirm-value">
                    {data.exerciseLevel === 'beginner' && '입문'}
                    {data.exerciseLevel === 'elementary' && '초급'}
                    {data.exerciseLevel === 'intermediate' && '중급'}
                    {data.exerciseLevel === 'advanced' && '고급'}
                  </span>
                </div>
                <div className="onboarding-confirm-row">
                  <span className="onboarding-confirm-label">운동 목표</span>
                  <span className="onboarding-confirm-value">
                    {data.exerciseGoal === 'strength' && '근력 향상'}
                    {data.exerciseGoal === 'weight_loss' && '체중 감량'}
                    {data.exerciseGoal === 'flexibility' && '유연성'}
                    {data.exerciseGoal === 'endurance' && '체력 향상'}
                  </span>
                </div>
                <div className="onboarding-confirm-row">
                  <span className="onboarding-confirm-label">운동 주기</span>
                  <span className="onboarding-confirm-value">
                    주 {data.exerciseDays}일, {
                      data.exerciseTime === '30min' ? '30분 이내' :
                      data.exerciseTime === '1hour' ? '1시간' :
                      data.exerciseTime === '1hour30' ? '1시간 30분' :
                      data.exerciseTime === '2hour' ? '2시간 이상' : '-'
                    }
                  </span>
                </div>
              </div>

              {/* 부상 정보 */}
              <div className="onboarding-confirm-section">
              <h4 className="onboarding-confirm-title">부상 이력</h4>
              {!data.hasInjury ? (
                  <div className="onboarding-confirm-row">
                  <span className="onboarding-confirm-label">부상 여부</span>
                  <span className="onboarding-confirm-value">없음</span>
                  </div>
              ) : (
                  <div className="onboarding-confirm-injuries">
                  {data.injuries.map((injury, index) => (
                      <div key={injury.id} className="onboarding-confirm-injury">
                      <span className="onboarding-confirm-injury-part">
                          {index + 1}. {injury.part}
                      </span>
                      <span className={`onboarding-confirm-injury-severity ${injury.severity}`}>
                          {injury.severity === 'mild' && '경미'}
                          {injury.severity === 'caution' && '주의 요함'}
                          {injury.severity === 'severe' && '심각'}
                      </span>
                      </div>
                  ))}
                  </div>
              )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /**
   * 로딩 중일 때
   */
  if (isLoading && !data.height) {
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
          <h1 className="onboarding-title">{getStepTitle()}</h1>
          <button className="onboarding-skip-btn" onClick={onSkip}>
              <X size={24} />
          </button>
        </div>
        
        {/* 진행률 바 */}
        <div className="onboarding-progress">
          <div 
            className="onboarding-progress-bar"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
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

      {/* 수정 완료 팝업 */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="onboarding-complete-modal">
            <div className="onboarding-complete-modal-icon">
              <Check size={32} />
            </div>
            <h3 className="onboarding-complete-modal-title">{completeMessage.title}</h3>
            <p className="onboarding-complete-modal-desc">{completeMessage.desc}</p>
            <button 
              className="onboarding-complete-modal-btn"
              onClick={handleCompleteModalConfirm}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}