/**
 * BoardList.tsx
 * 게시판 목록 컴포넌트
 * - 카테고리 필터 (전체/자유/질문/정보)
 * - 제목/작성자 검색
 * - 무한 스크롤
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, FileText } from 'lucide-react';
import { 
  Post, 
  CategoryType, 
  SearchType, 
  CATEGORY_LABELS, 
  DUMMY_POSTS 
} from '../../../data/boards';

/**
 * Props 타입 정의
 */
interface BoardListProps {
  onSelectPost: (postId: number) => void;
  onWritePost: () => void;
}

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