/**
 * board.ts
 * 게시판 데이터 및 타입 정의
 * TODO: API 연동 시 더미 데이터 제거
 */

/**
 * 카테고리 타입 정의
 */
export type CategoryType = 'all' | 'free' | 'question' | 'info';

/**
 * 검색 타입 정의
 */
export type SearchType = 'title' | 'author';

/**
 * 게시글 목록 타입 정의
 */
export interface Post {
  id: number;
  category: 'free' | 'question' | 'info';
  title: string;
  author: string;
  authorId: number;
  date: string;
  views: number;
  commentCount: number;
}

/**
 * 대댓글 타입 정의
 */
export interface Reply {
  id: number;
  authorId: number;
  author: string;
  content: string;
  date: string;
}

/**
 * 댓글 타입 정의
 */
export interface Comment {
  id: number;
  authorId: number;
  author: string;
  content: string;
  date: string;
  replies: Reply[];
}

/**
 * 게시글 상세 타입 정의
 */
export interface PostDetail {
  id: number;
  category: 'free' | 'question' | 'info';
  title: string;
  content: string;
  images: string[];
  author: string;
  authorId: number;
  date: string;
  views: number;
  comments: Comment[];
}

/**
 * 카테고리 라벨 매핑
 */
export const CATEGORY_LABELS: Record<string, string> = {
  all: '전체',
  free: '자유',
  question: '질문',
  info: '정보'
};

/**
 * 신고 사유 목록
 */
export const REPORT_REASONS = [
  '스팸/광고',
  '욕설/비방',
  '음란물',
  '개인정보 노출',
  '기타'
];

/**
 * 프론트 카테고리 ↔ 백엔드 카테고리 매핑
 */
export const CATEGORY_MAP = {
  toBackend: {
    'all': 'ALL',
    'free': 'FREE',
    'question': 'QUESTION',
    'info': 'INFO',
  } as const,
  toFrontend: {
    'ALL': 'all',
    'FREE': 'free',
    'QUESTION': 'question',
    'INFO': 'info',
  } as const,
};

/**
 * 더미 게시글 목록 데이터
 * TODO: API 연동 시 삭제
 */
export const DUMMY_POSTS: Post[] = [
  {
    id: 1,
    category: 'free',
    title: '오늘 운동 인증합니다! 헬스장 다녀왔어요',
    author: '운동러버',
    authorId: 1,
    date: '2025-01-14 15:30:45',
    views: 42,
    commentCount: 5
  },
  {
    id: 2,
    category: 'question',
    title: '초보자 추천 운동 루틴이 있을까요?',
    author: '헬린이',
    authorId: 2,
    date: '2025-01-14 14:22:10',
    views: 28,
    commentCount: 12
  },
  {
    id: 3,
    category: 'info',
    title: '단백질 섭취 타이밍에 대한 정보 공유',
    author: '영양사김',
    authorId: 3,
    date: '2025-01-13 18:45:30',
    views: 156,
    commentCount: 8
  },
  {
    id: 4,
    category: 'free',
    title: '다이어트 3개월차 후기입니다',
    author: '다이어터',
    authorId: 4,
    date: '2025-01-13 12:10:55',
    views: 89,
    commentCount: 15
  },
  {
    id: 5,
    category: 'question',
    title: '화상PT 처음인데 어떻게 준비하나요?',
    author: 'PT초보',
    authorId: 5,
    date: '2025-01-12 09:33:22',
    views: 34,
    commentCount: 7
  },
  {
    id: 6,
    category: 'info',
    title: '홈트레이닝 추천 장비 모음',
    author: '홈트마스터',
    authorId: 6,
    date: '2025-01-12 08:15:00',
    views: 203,
    commentCount: 22
  },
  {
    id: 7,
    category: 'free',
    title: '운동 시작한지 1년 후기',
    author: '1년차러너',
    authorId: 7,
    date: '2025-01-11 20:45:33',
    views: 312,
    commentCount: 45
  },
  {
    id: 8,
    category: 'question',
    title: '어깨 통증이 있는데 운동해도 될까요?',
    author: '어깨아파요',
    authorId: 8,
    date: '2025-01-11 16:20:18',
    views: 67,
    commentCount: 9
  },
  {
    id: 9,
    category: 'info',
    title: '체중 감량을 위한 유산소 운동 가이드',
    author: '유산소왕',
    authorId: 9,
    date: '2025-01-10 14:55:42',
    views: 445,
    commentCount: 31
  },
  {
    id: 10,
    category: 'free',
    title: '오운완! 스쿼트 개인 최고 기록 달성',
    author: '스쿼트러버',
    authorId: 10,
    date: '2025-01-10 11:30:00',
    views: 178,
    commentCount: 18
  },
  {
    id: 11,
    category: 'question',
    title: '런닝머신 vs 야외 러닝 어떤게 더 좋나요?',
    author: '러닝맨',
    authorId: 11,
    date: '2025-01-09 19:20:30',
    views: 92,
    commentCount: 14
  },
  {
    id: 12,
    category: 'info',
    title: '근육 회복에 좋은 음식 TOP 10',
    author: '헬스셰프',
    authorId: 12,
    date: '2025-01-09 15:45:12',
    views: 387,
    commentCount: 27
  },
  {
    id: 13,
    category: 'free',
    title: '헬스장 에티켓 지켜주세요 ㅠㅠ',
    author: '매너맨',
    authorId: 13,
    date: '2025-01-09 10:10:05',
    views: 521,
    commentCount: 63
  },
  {
    id: 14,
    category: 'question',
    title: '공복 유산소 효과 있나요?',
    author: '새벽러너',
    authorId: 14,
    date: '2025-01-08 22:35:48',
    views: 145,
    commentCount: 19
  },
  {
    id: 15,
    category: 'info',
    title: '올바른 데드리프트 자세 가이드',
    author: '자세교정사',
    authorId: 15,
    date: '2025-01-08 17:20:33',
    views: 634,
    commentCount: 42
  },
  {
    id: 16,
    category: 'free',
    title: '6개월 바디프로필 도전기',
    author: '바디챌린저',
    authorId: 16,
    date: '2025-01-08 13:50:20',
    views: 289,
    commentCount: 35
  },
  {
    id: 17,
    category: 'question',
    title: '프로틴 추천해주세요!',
    author: '단백질러버',
    authorId: 17,
    date: '2025-01-07 21:15:55',
    views: 176,
    commentCount: 28
  },
  {
    id: 18,
    category: 'info',
    title: '스트레칭의 중요성과 루틴 공유',
    author: '유연해지자',
    authorId: 18,
    date: '2025-01-07 16:40:10',
    views: 223,
    commentCount: 16
  },
  {
    id: 19,
    category: 'free',
    title: '드디어 풀업 10개 성공했습니다!',
    author: '풀업도전자',
    authorId: 19,
    date: '2025-01-07 11:25:45',
    views: 198,
    commentCount: 24
  },
  {
    id: 20,
    category: 'question',
    title: '헬스장 PT vs 화상PT 뭐가 나을까요?',
    author: 'PT고민중',
    authorId: 20,
    date: '2025-01-06 20:55:30',
    views: 267,
    commentCount: 31
  },
  {
    id: 21,
    category: 'info',
    title: '벌크업 식단 예시 공유합니다',
    author: '벌크업장인',
    authorId: 21,
    date: '2025-01-06 15:30:22',
    views: 412,
    commentCount: 38
  },
  {
    id: 22,
    category: 'free',
    title: '운동 브이로그 시작했어요!',
    author: '운동유튜버',
    authorId: 22,
    date: '2025-01-06 10:05:18',
    views: 156,
    commentCount: 12
  },
  {
    id: 23,
    category: 'question',
    title: '무릎 보호대 추천 부탁드려요',
    author: '무릎조심',
    authorId: 23,
    date: '2025-01-05 19:45:55',
    views: 89,
    commentCount: 11
  },
  {
    id: 24,
    category: 'info',
    title: '효과적인 복근 운동 5가지',
    author: '식스팩목표',
    authorId: 24,
    date: '2025-01-05 14:20:40',
    views: 567,
    commentCount: 44
  },
  {
    id: 25,
    category: 'free',
    title: '1년 전 vs 지금 비교 사진',
    author: '변화의증거',
    authorId: 25,
    date: '2025-01-05 09:10:30',
    views: 892,
    commentCount: 76
  }
];

/**
 * 더미 게시글 상세 데이터
 * TODO: API 연동 시 삭제
 */
export const DUMMY_POST_DETAIL: PostDetail = {
  id: 1,
  category: 'free',
  title: '오늘 운동 인증합니다! 헬스장 다녀왔어요',
  content: `안녕하세요! 오늘도 열심히 운동하고 왔습니다.

오늘 루틴은 가슴/삼두 위주로 진행했어요.
- 벤치프레스 4세트
- 인클라인 덤벨프레스 4세트
- 케이블 크로스오버 3세트
- 트라이셉스 푸시다운 4세트

다들 화이팅하세요! 💪`,
  images: [],
  author: '운동러버',
  authorId: 1,
  date: '2025-01-14 14:30',
  views: 42,
  comments: [
    {
      id: 1,
      authorId: 2,
      author: '헬린이',
      content: '대단하시네요! 저도 열심히 해야겠어요',
      date: '2025-01-14 15:00',
      replies: [
        {
          id: 11,
          authorId: 1,
          author: '운동러버',
          content: '감사합니다! 화이팅이에요 💪',
          date: '2025-01-14 15:10'
        }
      ]
    },
    {
      id: 2,
      authorId: 3,
      author: '피트니스킹',
      content: '벤치프레스 무게는 얼마로 하셨나요?',
      date: '2025-01-14 16:20',
      replies: []
    }
  ]
};