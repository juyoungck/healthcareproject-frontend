/**
 * AdminBoardPage.tsx
 * 게시글 관리 페이지
 * - 전체 게시글 조회/검색
 * - 카테고리별 필터 (전체/자유/질문/정보)
 * - 상태별 필터 (전체/공개/숨김)
 * - 부적절 게시글 삭제/숨김
 * - 공지사항 등록/관리
 */

import { useState } from 'react';
import { Search, Eye, EyeOff, Trash2, Pin } from 'lucide-react';
import type { PostStatus } from '../../../types/admin';
import { CATEGORY_LABELS } from '../../../data/boards';

/**
 * ===========================================
 * 관리자용 게시글 타입
 * ===========================================
 */

interface AdminBoardPost {
  id: number;
  category: 'free' | 'question' | 'info' | 'notice';
  title: string;
  author: string;
  authorId: number;
  date: string;
  views: number;
  commentCount: number;
  status: PostStatus;
  reportCount: number;
  isPinned: boolean;
}

/**
 * ===========================================
 * 더미 데이터
 * ===========================================
 */

const ADMIN_POSTS: AdminBoardPost[] = [
  {
    id: 1,
    category: 'notice',
    title: '[공지] 서비스 이용 규칙 안내',
    author: '관리자',
    authorId: 0,
    date: '2025-01-20T10:00:00',
    views: 1520,
    commentCount: 0,
    status: 'visible',
    reportCount: 0,
    isPinned: true,
  },
  {
    id: 2,
    category: 'free',
    title: '오늘 운동 인증합니다! 헬스장 다녀왔어요',
    author: '운동러버',
    authorId: 1,
    date: '2025-01-21T15:30:00',
    views: 42,
    commentCount: 5,
    status: 'visible',
    reportCount: 0,
    isPinned: false,
  },
  {
    id: 3,
    category: 'question',
    title: '초보자 추천 운동 루틴이 있을까요?',
    author: '헬린이',
    authorId: 2,
    date: '2025-01-21T14:22:00',
    views: 28,
    commentCount: 12,
    status: 'visible',
    reportCount: 0,
    isPinned: false,
  },
  {
    id: 4,
    category: 'free',
    title: '부적절한 게시글입니다 (신고됨)',
    author: '악성유저',
    authorId: 99,
    date: '2025-01-20T12:00:00',
    views: 156,
    commentCount: 3,
    status: 'hidden',
    reportCount: 5,
    isPinned: false,
  },
  {
    id: 5,
    category: 'info',
    title: '단백질 섭취 타이밍에 대한 정보 공유',
    author: '영양사김',
    authorId: 3,
    date: '2025-01-19T18:45:00',
    views: 156,
    commentCount: 8,
    status: 'visible',
    reportCount: 0,
    isPinned: false,
  },
];

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */

type CategoryFilter = 'all' | 'free' | 'question' | 'info' | 'notice';

const categoryFilters: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'notice', label: '공지' },
  { value: 'free', label: '자유' },
  { value: 'question', label: '질문' },
  { value: 'info', label: '정보' },
];

const statusFilters: { value: PostStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'visible', label: '공개' },
  { value: 'hidden', label: '숨김' },
];

/**
 * ===========================================
 * 라벨 변환 함수
 * ===========================================
 */

const getCategoryLabel = (category: string) => {
  if (category === 'notice') return '공지';
  return CATEGORY_LABELS[category] || category;
};

const getStatusLabel = (status: PostStatus) => {
  switch (status) {
    case 'visible':
      return '공개';
    case 'hidden':
      return '숨김';
    case 'deleted':
      return '삭제';
    default:
      return status;
  }
};

/**
 * ===========================================
 * AdminBoardPage 컴포넌트
 * ===========================================
 */

export default function AdminBoardPage() {
  /**
   * 상태 관리
   */
  const [posts, setPosts] = useState<AdminBoardPost[]>(ADMIN_POSTS);
  const [filterCategory, setFilterCategory] = useState<CategoryFilter>('all');
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 필터링된 목록
   */
  const filteredPosts = posts.filter((post) => {
    /* 카테고리 필터 */
    if (filterCategory !== 'all' && post.category !== filterCategory) {
      return false;
    }
    /* 상태 필터 */
    if (filterStatus !== 'all' && post.status !== filterStatus) {
      return false;
    }
    /* 검색 필터 */
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        post.title.toLowerCase().includes(keyword) ||
        post.author.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  /**
   * 정렬 (고정 게시글 우선)
   */
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  /**
   * 숨김 처리 핸들러
   */
  const handleHide = (id: number) => {
    if (!confirm('해당 게시글을 숨김 처리하시겠습니까?')) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, status: 'hidden' as PostStatus } : post
      )
    );

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/posts/${id}/hide`, { method: 'POST' }); */
  };

  /**
   * 공개 처리 핸들러
   */
  const handleShow = (id: number) => {
    if (!confirm('해당 게시글을 공개 처리하시겠습니까?')) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, status: 'visible' as PostStatus } : post
      )
    );

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/posts/${id}/show`, { method: 'POST' }); */
  };

  /**
   * 삭제 처리 핸들러
   */
  const handleDelete = (id: number) => {
    if (!confirm('해당 게시글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return;

    setPosts((prev) => prev.filter((post) => post.id !== id));

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' }); */
  };

  /**
   * 고정 토글 핸들러
   */
  const handleTogglePin = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, isPinned: !post.isPinned } : post
      )
    );

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/posts/${id}/pin`, { method: 'POST' }); */
  };

  /**
   * 날짜 포맷
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="admin-board-page">
      <h2 className="admin-section-title">게시글 관리</h2>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          {/* 카테고리 필터 */}
          <div className="admin-filter-tabs">
            {categoryFilters.map((filter) => (
              <button
                key={filter.value}
                className={`admin-filter-tab ${filterCategory === filter.value ? 'active' : ''}`}
                onClick={() => setFilterCategory(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* 상태 필터 */}
          <select
            className="admin-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as PostStatus | 'all')}
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        {/* 검색 */}
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="제목 또는 작성자 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>카테고리</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회</th>
              <th>댓글</th>
              <th>신고</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {sortedPosts.length === 0 ? (
              <tr>
                <td colSpan={10} className="admin-table-empty">
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              sortedPosts.map((post) => (
                <tr key={post.id} className={post.isPinned ? 'pinned-row' : ''}>
                  <td>
                    {post.isPinned && <Pin size={14} className="pin-icon" />}
                    {post.id}
                  </td>
                  <td>
                    <span className={`admin-category-badge category-${post.category}`}>
                      {getCategoryLabel(post.category)}
                    </span>
                  </td>
                  <td className="admin-table-title">
                    {post.title}
                    {post.reportCount > 0 && (
                      <span className="report-badge">신고 {post.reportCount}</span>
                    )}
                  </td>
                  <td>{post.author}</td>
                  <td>{formatDate(post.date)}</td>
                  <td>{post.views}</td>
                  <td>{post.commentCount}</td>
                  <td>
                    {post.reportCount > 0 ? (
                      <span className="admin-report-count">{post.reportCount}</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <span className={`admin-status-badge status-${post.status}`}>
                      {getStatusLabel(post.status)}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className={`admin-action-btn pin ${post.isPinned ? 'active' : ''}`}
                        onClick={() => handleTogglePin(post.id)}
                        title={post.isPinned ? '고정 해제' : '상단 고정'}
                      >
                        <Pin size={16} />
                      </button>
                      {post.status === 'visible' ? (
                        <button
                          className="admin-action-btn hide"
                          onClick={() => handleHide(post.id)}
                          title="숨김"
                        >
                          <EyeOff size={16} />
                        </button>
                      ) : (
                        <button
                          className="admin-action-btn show"
                          onClick={() => handleShow(post.id)}
                          title="공개"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        className="admin-action-btn delete"
                        onClick={() => handleDelete(post.id)}
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}