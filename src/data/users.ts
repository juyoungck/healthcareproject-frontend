export const DUMMY_USERS: User[] = [
  /**
   * 일반회원 계정
   */
  {
    id: 'user-001',
    email: 'user@test.com',
    nickname: '운동초보',
    phone: '010-1234-5678',
    profileImage: '',
    userType: 'general',
    trainerStatus: 'none',
    createdAt: '2024-01-01',
    onboarding: {
      height: 175,
      weight: 70,
      age: 28,
      gender: '남성',
      exerciseLevel: '초급',
      exerciseGoal: '체중감량',
      injuryHistory: '없음',
      exerciseDays: 3,
      exerciseTime: '1시간',
      allergies: ['갑각류', '땅콩'],
    },
    socialAccounts: {
      kakao: true,
      naver: false,
      google: false,
    },
  },
  /**
   * 트레이너 승인 대기중
   */
  {
    id: 'user-002',
    email: 'user@test.com',
    nickname: '운동초보',
    phone: '010-1234-5678',
    profileImage: '',
    userType: 'general',
    trainerStatus: 'pending',
    createdAt: '2024-01-01',
    onboarding: {
      height: 175,
      weight: 70,
      age: 28,
      gender: '남성',
      exerciseLevel: '초급',
      exerciseGoal: '체중감량',
      injuryHistory: '없음',
      exerciseDays: 3,
      exerciseTime: '1시간',
      allergies: ['갑각류', '땅콩'],
    },
    socialAccounts: {
      kakao: true,
      naver: false,
      google: false,
    },
  },
  /**
   * 트레이너 계정
   */
  {
    id: 'trainer-001',
    email: 'trainer@test.com',
    nickname: '김트레이너',
    phone: '010-9876-5432',
    profileImage: '',
    userType: 'trainer',
    trainerStatus: 'approved',
    createdAt: '2023-06-15',
    onboarding: {
      height: 180,
      weight: 78,
      age: 32,
      gender: '남성',
      exerciseLevel: '고급',
      exerciseGoal: '근력강화',
      injuryHistory: '없음',
      exerciseDays: 5,
      exerciseTime: '2시간',
      allergies: [],
    },
    socialAccounts: {
      kakao: true,
      naver: true,
      google: true,
    },
  },
];



/* 일반회원으로 테스트 */
// export const CURRENT_USER: User = DUMMY_USERS[0];

/* 트레이너 승인 대기중 테스트 */
export const CURRENT_USER: User = DUMMY_USERS[1];

/* 트레이너로 테스트 */
// export const CURRENT_USER: User = DUMMY_USERS[2];

/**
 * 현재 사용자 정보 (기존 코드 호환용)
 */
export const IS_CURRENT_USER_TRAINER = CURRENT_USER.userType === 'trainer';
export const CURRENT_USER_ID = CURRENT_USER.id;
export const CURRENT_USER_TRAINER_STATUS = CURRENT_USER.trainerStatus;