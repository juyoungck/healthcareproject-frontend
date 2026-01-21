/**
 * BoardList.tsx
 * 게시판 목록 컴포넌트
 * - 카테고리 필터 (전체/자유/질문/정보)
 * - 제목/작성자 검색
 * - 무한 스크롤 (커서 기반)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, FileText, Plus } from 'lucide-react';
import {
  CategoryType,
  SearchType,
  CATEGORY_LABELS,
  CATEGORY_MAP
} from '../../../data/boards';
import { getPosts } from '../../../api/board';
import { PostListItem } from '../../../api/types/board';

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
  const [displayedPosts, setDisplayedPosts] = useState<PostListItem[]>([]);
  const [notices, setNotices] = useState<PostListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cursorId, setCursorId] = useState<number | null>(null);

  /**
   * 무한 스크롤 감지용 ref
   */
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  /**
   * 검색 타입 매핑 (프론트 → 백엔드)
   */
  const getSearchBy = (type: SearchType) => {
    return type === 'title' ? 'TITLE' : 'AUTHOR';
  };

  /**
   * API에서 게시글 목록 불러오기
   */
  const fetchPosts = useCallback(async (cursor: number | null, isReset: boolean = false) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await getPosts({
        category: CATEGORY_MAP.toBackend[selectedCategory],
        q: searchQuery || undefined,
        searchBy: searchQuery ? getSearchBy(searchType) : undefined,
        cursorId: cursor || undefined,
        size: POSTS_PER_LOAD,
      });

      if (isReset) {
        setNotices(response.notices);
        setDisplayedPosts(response.items);
      } else {
        setDisplayedPosts(prev => [...prev, ...response.items]);
      }

      setHasMore(response.pageInfo.hasNext);
      setCursorId(response.pageInfo.nextCursorId);
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchType, searchQuery, isLoading]);

  /**
   * 다음 페이지 불러오기
   */
  const loadMorePosts = useCallback(() => {
    if (isLoading || !hasMore) return;
    fetchPosts(cursorId, false);
  }, [isLoading, hasMore, cursorId, fetchPosts]);

  /**
   * 카테고리 변경 시 목록 초기화 및 재조회
   */
  useEffect(() => {
    setDisplayedPosts([]);
    setNotices([]);
    setHasMore(true);
    setCursorId(null);
    fetchPosts(null, true);
  }, [selectedCategory]);

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
    setNotices([]);
    setHasMore(true);
    setCursorId(null);
    fetchPosts(null, true);
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
 * 맨 위로 스크롤
 */
  const handleScrollToTop = () => {
    const appMain = document.querySelector('.app-main');
    if (appMain) {
      appMain.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
        {displayedPosts.length === 0 && notices.length === 0 && !isLoading ? (
          <div className="board-list-empty">
            <FileText className="board-list-empty-icon" />
            <p className="board-list-empty-text">
              {searchQuery ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
            </p>
          </div>
        ) : (
          <>
            {/* 공지사항 */}
            {notices.map((post) => (
              <button
                key={`notice-${post.postId}`}
                className="board-item notice"
                onClick={() => onSelectPost(post.postId)}
              >
                <span className="board-category-badge notice">공지</span>
                <div className="board-item-content">
                  <div className="board-item-row">
                    <span className="board-item-title">{post.title}</span>
                    {post.commentCount > 0 && (
                      <span className="board-item-comment-count">[{post.commentCount}]</span>
                    )}
                  </div>
                  <div className="board-item-meta">
                    <span>{post.nickname}</span>
                    <span className="board-item-divider">|</span>
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="board-item-divider">|</span>
                    <span>조회 {post.viewCount}</span>
                  </div>
                </div>
              </button>
            ))}

            {/* 일반 게시글 */}
            {displayedPosts.map((post) => (
              <button
                key={post.postId}
                className="board-item"
                onClick={() => onSelectPost(post.postId)}
              >
                <span className={`board-category-badge ${CATEGORY_MAP.toFrontend[post.category]}`}>
                  {CATEGORY_LABELS[CATEGORY_MAP.toFrontend[post.category]]}
                </span>
                <div className="board-item-content">
                  <div className="board-item-row">
                    <span className="board-item-title">{post.title}</span>
                    {post.commentCount > 0 && (
                      <span className="board-item-comment-count">[{post.commentCount}]</span>
                    )}
                  </div>
                  <div className="board-item-meta">
                    <span>{post.nickname}</span>
                    <span className="board-item-divider">|</span>
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="board-item-divider">|</span>
                    <span>조회 {post.viewCount}</span>
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
        <Plus size={24} />
      </button>
    </div>
  );
}