/**
 * BoardList.tsx
 * 게시판 목록 컴포넌트
 * - 카테고리 필터 (전체/자유/질문/정보)
 * - 제목/작성자 검색
 * - 무한 스크롤
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, FileText } from 'lucide-react';

/**
 * 게시글 타입 정의
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
 * 카테고리 타입 정의
 */
type CategoryType = 'all' | 'free' | 'question' | 'info';

/**
 * 검색 타입 정의
 */
type SearchType = 'title' | 'author';

/**
 * Props 타입 정의
 */
interface BoardListProps {
  onSelectPost: (postId: number) => void;
  onWritePost: () => void;
}

/**
 * 카테고리 라벨 매핑
 */
const CATEGORY_LABELS: Record<string, string> = {
  all: '전체',
  free: '자유',
  question: '질문',
  info: '정보'
};

/**
 * 더미 데이터 (API 연동 전 테스트용)
 * TODO: 실제 API 연동 시 제거
 */
const DUMMY_POSTS: Post[] = [
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
 * 한 번에 로드할 게시글 수
 */
const POSTS_PER_LOAD = 10;

/**
 * BoardList 컴포넌트
 */
export default function BoardList({ onSelectPost, onWritePost }: BoardListProps) {
  /**
   * 상태 관리
   */
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchType, setSearchType] = useState<SearchType>('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 무한 스크롤 감지용 ref
   */
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  /**
   * 카테고리/검색 필터링된 전체 게시글
   */
  const getFilteredPosts = useCallback(() => {
    return DUMMY_POSTS.filter(post => {
      /* 카테고리 필터 */
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }
      
      /* 검색어 필터 */
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (searchType === 'title') {
          return post.title.toLowerCase().includes(query);
        } else {
          return post.author.toLowerCase().includes(query);
        }
      }
      
      return true;
    });
  }, [selectedCategory, searchQuery, searchType]);

  /**
   * 게시글 더 불러오기
   */
  const loadMorePosts = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    /* API 호출 시뮬레이션 */
    setTimeout(() => {
      const filteredPosts = getFilteredPosts();
      const currentLength = displayedPosts.length;
      const nextPosts = filteredPosts.slice(currentLength, currentLength + POSTS_PER_LOAD);

      if (nextPosts.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedPosts(prev => [...prev, ...nextPosts]);
        if (currentLength + nextPosts.length >= filteredPosts.length) {
          setHasMore(false);
        }
      }

      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, displayedPosts.length, getFilteredPosts]);

  /**
   * 카테고리/검색 변경 시 목록 초기화
   */
  useEffect(() => {
    setDisplayedPosts([]);
    setHasMore(true);
  }, [selectedCategory, searchQuery, searchType]);

  /**
   * 초기 로드 및 필터 변경 시 첫 페이지 로드
   */
  useEffect(() => {
    if (displayedPosts.length === 0 && hasMore) {
      loadMorePosts();
    }
  }, [displayedPosts.length, hasMore, loadMorePosts]);

  /**
   * Intersection Observer 설정
   */
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMorePosts]);

  /**
   * 검색 실행
   */
  const handleSearch = () => {
    setDisplayedPosts([]);
    setHasMore(true);
  };

  /**
   * 엔터키 검색
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 카테고리 변경
   */
  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  /**
   * 날짜 포맷 (YYYY.MM.DD HH:mm:ss)
   */
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="board-container">
      {/* 헤더 */}
      <div className="board-header">
        <h1 className="board-title">게시판</h1>
      </div>

      {/* 카테고리 탭 */}
      <div className="board-tabs">
        {(['all', 'free', 'question', 'info'] as CategoryType[]).map((category) => (
          <button
            key={category}
            className={`board-tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      {/* 검색 영역 */}
      <div className="board-search">
        <select
          className="board-search-select"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as SearchType)}
        >
          <option value="title">제목</option>
          <option value="author">작성자</option>
        </select>
        <input
          type="text"
          className="board-search-input"
          placeholder={searchType === 'title' ? '제목으로 검색' : '작성자로 검색'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="board-search-btn" onClick={handleSearch}>
          <Search size={18} />
        </button>
      </div>

      {/* 게시글 목록 */}
      <div className="board-list">
        {displayedPosts.length === 0 && !isLoading ? (
          <div className="board-list-empty">
            <FileText className="board-list-empty-icon" />
            <p className="board-list-empty-text">
              {searchQuery ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
            </p>
          </div>
        ) : (
          <>
            {displayedPosts.map((post) => (
              <button
                key={post.id}
                className="board-item"
                onClick={() => onSelectPost(post.id)}
              >
                {/* 좌측: 카테고리 뱃지 */}
                <span className={`board-category-badge ${post.category}`}>
                  {CATEGORY_LABELS[post.category]}
                </span>
                
                {/* 우측: 콘텐츠 영역 */}
                <div className="board-item-content">
                  {/* 상단: 제목 + 댓글수 */}
                  <div className="board-item-row">
                    <span className="board-item-title">{post.title}</span>
                    {post.commentCount > 0 && (
                      <span className="board-item-comment-count">[{post.commentCount}]</span>
                    )}
                  </div>
                  {/* 하단: 작성자 | 날짜 | 조회수 */}
                  <div className="board-item-meta">
                    <span>{post.author}</span>
                    <span className="board-item-divider">|</span>
                    <span>{formatDate(post.date)}</span>
                    <span className="board-item-divider">|</span>
                    <span>조회 {post.views}</span>
                  </div>
                </div>
              </button>
            ))}

            {/* 무한 스크롤 감지 영역 */}
            <div ref={loadMoreRef} className="board-load-more">
              {isLoading && (
                <div className="board-loading">
                  <div className="board-loading-spinner"></div>
                  <span>불러오는 중...</span>
                </div>
              )}
              {!hasMore && displayedPosts.length > 0 && (
                <p className="board-end-message">모든 게시글을 불러왔습니다.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* 글쓰기 플로팅 버튼 */}
      <button className="board-write-fab" onClick={onWritePost}>
        <FileText size={24} />
      </button>
    </div>
  );
}