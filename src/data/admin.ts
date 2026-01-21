/**
 * admin.ts
 * 관리자 패널 더미 데이터
 */

import type {
  TrainerApplication,
  AdminUser,
  AdminPost,
  Report,
  AdminExercise,
  AdminFood,
  AdminPTRoom,
  DashboardStats,
  TodayActivity,
  HealthCheckItem,
  ErrorLog,
} from '../types/admin';

/**
 * ===========================================
 * 대시보드 통계
 * ===========================================
 */

export const dashboardStats: DashboardStats = {
  totalUsers: 156,
  activeUsers: 142,
  inactiveUsers: 14,
  totalPosts: 89,
  visiblePosts: 82,
  hiddenPosts: 7,
  pendingTrainers: 5,
  approvedTrainers: 12,
  rejectedTrainers: 3,
  totalPTRooms: 47,
  livePTRooms: 3,
  scheduledPTRooms: 44,
};

export const todayActivity: TodayActivity = {
  newUsers: 3,
  newTrainerApplications: 2,
  newPosts: 7,
};

/**
 * ===========================================
 * 트레이너 신청 목록
 * ===========================================
 */

export const trainerApplications: TrainerApplication[] = [
  {
    id: 1,
    userId: 101,
    userName: '김철수',
    userEmail: 'chulsoo@example.com',
    introduction: '헬스 트레이너 5년 경력입니다. 생활체육지도사 2급 보유.',
    documents: ['certificate1.pdf', 'career.pdf'],
    status: 'PENDING',
    createdAt: '2025-01-20T10:30:00',
  },
  {
    id: 2,
    userId: 102,
    userName: '이영희',
    userEmail: 'younghee@example.com',
    introduction: '필라테스 강사 3년, 요가 강사 2년 경력.',
    documents: ['pilates_cert.jpg', 'yoga_cert.jpg'],
    status: 'PENDING',
    createdAt: '2025-01-19T14:20:00',
  },
  {
    id: 3,
    userId: 103,
    userName: '박지민',
    userEmail: 'jimin@example.com',
    introduction: '크로스핏 코치 4년 경력.',
    documents: ['crossfit.pdf'],
    status: 'APPROVED',
    createdAt: '2025-01-15T09:00:00',
    reviewedAt: '2025-01-16T11:00:00',
  },
];

/**
 * ===========================================
 * 회원 목록
 * ===========================================
 */

export const adminUsers: AdminUser[] = [
  {
    id: 1,
    email: 'user1@example.com',
    nickname: '운동초보',
    role: 'user',
    status: 'active',
    createdAt: '2025-01-10T08:00:00',
    lastLoginAt: '2025-01-21T09:30:00',
  },
  {
    id: 2,
    email: 'trainer1@example.com',
    nickname: '근육왕',
    role: 'trainer',
    status: 'active',
    createdAt: '2025-01-05T10:00:00',
    lastLoginAt: '2025-01-21T08:00:00',
  },
  {
    id: 3,
    email: 'banned@example.com',
    nickname: '차단유저',
    role: 'user',
    status: 'banned',
    createdAt: '2025-01-01T12:00:00',
  },
];

/**
 * ===========================================
 * 게시글 목록
 * ===========================================
 */

export const adminPosts: AdminPost[] = [
  {
    id: 1,
    title: '오늘 운동 루틴 공유합니다',
    authorName: '운동초보',
    category: '자유',
    status: 'visible',
    reportCount: 0,
    createdAt: '2025-01-21T10:00:00',
  },
  {
    id: 2,
    title: '단백질 보충제 추천해주세요',
    authorName: '헬린이',
    category: '질문',
    status: 'visible',
    reportCount: 0,
    createdAt: '2025-01-20T15:30:00',
  },
  {
    id: 3,
    title: '부적절한 게시글',
    authorName: '악성유저',
    category: '자유',
    status: 'hidden',
    reportCount: 5,
    createdAt: '2025-01-19T12:00:00',
  },
];

/**
 * ===========================================
 * 신고 목록
 * ===========================================
 */

export const reports: Report[] = [
  {
    id: 1,
    type: 'post',
    targetId: 3,
    targetTitle: '부적절한 게시글',
    reporterName: '신고자1',
    reason: '욕설 및 비방',
    status: 'pending',
    createdAt: '2025-01-19T13:00:00',
  },
  {
    id: 2,
    type: 'comment',
    targetId: 15,
    targetTitle: '악성 댓글입니다...',
    reporterName: '신고자2',
    reason: '스팸/광고',
    status: 'processed',
    createdAt: '2025-01-18T10:00:00',
  },
];

/**
 * ===========================================
 * 운동 목록
 * ===========================================
 */

export const adminExercises: AdminExercise[] = [
  {
    id: 1,
    name: '벤치프레스',
    part: 'upper',
    level: 'intermediate',
    description: '가슴 운동의 기본이 되는 운동입니다.',
    videoUrl: 'https://youtube.com/watch?v=example1',
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 2,
    name: '스쿼트',
    part: 'lower',
    level: 'beginner',
    description: '하체 운동의 왕이라 불리는 운동입니다.',
    videoUrl: 'https://youtube.com/watch?v=example2',
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 3,
    name: '플랭크',
    part: 'core',
    level: 'beginner',
    description: '코어 안정성을 기르는 기본 운동입니다.',
    createdAt: '2025-01-01T00:00:00',
  },
];

/**
 * ===========================================
 * 식단 목록
 * ===========================================
 */

export const adminFoods: AdminFood[] = [
  {
    id: 1,
    name: '닭가슴살',
    calories: 165,
    carbs: 0,
    protein: 31,
    fat: 3.6,
    allergies: [],
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 2,
    name: '현미밥',
    calories: 350,
    carbs: 76,
    protein: 7,
    fat: 2.7,
    allergies: [],
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 3,
    name: '그릭요거트',
    calories: 100,
    carbs: 6,
    protein: 17,
    fat: 0.7,
    allergies: ['유제품'],
    createdAt: '2025-01-01T00:00:00',
  },
];

/**
 * ===========================================
 * 화상PT 방 목록
 * ===========================================
 */

export const adminPTRooms: AdminPTRoom[] = [
  {
    id: 1,
    title: '초보자 홈트레이닝',
    trainerName: '김트레이너',
    status: 'live',
    participantCount: 4,
    maxParticipants: 5,
    scheduledAt: '2025-01-21T10:00:00',
    createdAt: '2025-01-20T15:00:00',
  },
  {
    id: 2,
    title: '고급 웨이트 PT',
    trainerName: '박트레이너',
    status: 'scheduled',
    participantCount: 2,
    maxParticipants: 5,
    scheduledAt: '2025-01-22T14:00:00',
    createdAt: '2025-01-19T10:00:00',
  },
];

/**
 * ===========================================
 * 시스템 헬스체크
 * ===========================================
 */

export const healthCheckItems: HealthCheckItem[] = [
  {
    name: 'API 서버',
    status: 'healthy',
    responseTime: 45,
    lastChecked: '2025-01-21T12:00:00',
  },
  {
    name: '데이터베이스',
    status: 'healthy',
    responseTime: 12,
    lastChecked: '2025-01-21T12:00:00',
  },
  {
    name: 'Redis 캐시',
    status: 'healthy',
    responseTime: 3,
    lastChecked: '2025-01-21T12:00:00',
  },
  {
    name: 'WebRTC 서버',
    status: 'healthy',
    responseTime: 78,
    lastChecked: '2025-01-21T12:00:00',
  },
];

export const errorLogs: ErrorLog[] = [
  {
    id: 1,
    level: 'error',
    message: 'Database connection timeout',
    endpoint: '/api/users',
    createdAt: '2025-01-21T11:30:00',
  },
  {
    id: 2,
    level: 'warning',
    message: 'Slow query detected (>1000ms)',
    endpoint: '/api/posts',
    createdAt: '2025-01-21T10:45:00',
  },
  {
    id: 3,
    level: 'info',
    message: 'Server restarted',
    createdAt: '2025-01-21T09:00:00',
  },
];