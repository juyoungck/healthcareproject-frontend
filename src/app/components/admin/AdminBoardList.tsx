/**
 * AdminBoardList.tsx
 * 게시글 관리 컴포넌트
 * 
 * API: GET /api/admin/board
 * Query: page, size, category, status, keyword
 * 
 * TODO: 백엔드 완성 후 API 연동
 * - DELETE /api/admin/board/post/{postId} (신고 처리/삭제)
 * - POST /api/admin/board/notice (공지사항 등록)
 */

import { useState } from 'react';
import { Search, Eye, EyeOff, Trash2, Pin } from 'lucide-react';

/**
 * ===========================================
 * API 응답 타입 (백엔드 명세 기준)
 * ===========================================
 */
type PostCategory = 'FREE' | 'QUESTION' | 'INFO' | 'NOTICE';
type PostStatus = 'POSTED' | 'DELETED';

interface AdminBoardPost {
  postId: number;
  author: {
    nickname: string;
    handle: string;
  };
  category: PostCategory;
  title: string;
  viewCount: number;
  isNotice: boolean;
  status: PostStatus;
  createdAt: string;
  /* 프론트 추가 필드 (백엔드 미정) */
  reportCount?: number;
  isPinned?: boolean;
}

/**
 * ===========================================
 * 더미 데이터 (API 응답 형식)
 * ===========================================
 */
const DUMMY_POSTS: AdminBoardPost[] = [
  {
    postId: 1,
    author: { nickname: '관리자', handle: 'admin' },
    category: 'NOTICE',
    title: '[공지] 서비스 이용 규칙 안내',
    viewCount: 1520,
    isNotice: true,
    status: 'POSTED',
    createdAt: '2025-01-20T10:00:00Z',
    reportCount: 0,
    isPinned: true,
  },
  {
    postId: 2,
    author: { nickname: '운동러버', handle: 'user1921' },
    category: 'FREE',
    title: '오늘 운동 인증합니다! 헬스장 다녀왔어요',
    viewCount: 150,
    isNotice: false,
    status: 'POSTED',
    createdAt: '2025-01-21T15:30:00Z',
    reportCount: 0,
    isPinned: false,
  },
  {
    postId: 3,
    author: { nickname: '헬린이', handle: 'newbie123' },
    category: 'QUESTION',
    title: '초보자 추천 운동 루틴이 있을까요?',
    viewCount: 28,
    isNotice: false,
    status: 'POSTED',
    createdAt: '2025-01-21T14:22:00Z',
    reportCount: 0,
    isPinned: false,
  },
  {
    postId: 4,
    author: { nickname: '악성유저', handle: 'baduser99' },
    category: 'FREE',
    title: '부적절한 게시글입니다 (신고됨)',
    viewCount: 156,
    isNotice: false,
    status: 'DELETED',
    createdAt: '2025-01-20T12:00:00Z',
    reportCount: 5,
    isPinned: false,
  },
  {
    postId: 5,
    author: { nickname: '영양사김', handle: 'dietkim' },
    category: 'INFO',
    title: '단백질 섭취 타이밍에 대한 정보 공유',
    viewCount: 156,
    isNotice: false,
    status: 'POSTED',
    createdAt: '2025-01-19T18:45:00Z',
    reportCount: 0,
    isPinned: false,
  },
];

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */
const categoryFilters: { value: PostCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'NOTICE', label: '공지' },
  { value: 'FREE', label: '자유' },
  { value: 'QUESTION', label: '질문' },
  { value: 'INFO', label: '정보' },
];

const statusFilters: { value: PostStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'POSTED', label: '공개' },
  { value: 'DELETED', label: '삭제' },
];

/**
 * ===========================================
 * 라벨 변환 함수
 * ===========================================
 */
const getCategoryLabel = (category: PostCategory): string => {
  switch (category) {
    case 'NOTICE':
      return '공지';
    case 'FREE':
      return '자유';
    case 'QUESTION':
      return '질문';
    case 'INFO':
      return '정보';
    default:
      return category;
  }
};

const getStatusLabel = (status: PostStatus): string => {
  switch (status) {
    case 'POSTED':
      return '공개';
    case 'DELETED':
      return '삭제';
    default:
      return status;
  }
};

/**
 * ===========================================
 * 날짜 포맷
 * ===========================================
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

/**
 * ===========================================
 * AdminBoardList 컴포넌트
 * ===========================================
 */
export default function AdminBoardList() {
  const [posts, setPosts] = useState<AdminBoardPost[]>(DUMMY_POSTS);
  const [total] = useState(DUMMY_POSTS.length);
  const [filterCategory, setFilterCategory] = useState<PostCategory | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'ALL'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 필터링된 목록
   * TODO: 백엔드 완성 후 서버 필터링으로 변경
   */
  const filteredPosts = posts.filter((post) => {
    if (filterCategory !== 'ALL' && post.category !== filterCategory) {
      return false;
    }
    if (filterStatus !== 'ALL' && post.status !== filterStatus) {
      return false;
    }
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        post.title.toLowerCase().includes(keyword) ||
        post.author.nickname.toLowerCase().includes(keyword) ||
        post.author.handle.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  /**
   * 정렬 (공지사항/고정 게시글 우선)
   */
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isNotice && !b.isNotice) return -1;
    if (!a.isNotice && b.isNotice) return 1;
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  /**
   * 삭제 처리 핸들러
   * TODO: DELETE /api/admin/board/post/{postId}
   */
  const handleDelete = (postId: number) => {
    if (!confirm('해당 게시글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.postId === postId ? { ...post, status: 'DELETED' as PostStatus } : post
      )
    );
  };

  /**
   * 공개 처리 핸들러 (삭제된 게시글 복구)
   * TODO: 백엔드 API 확인 필요
   */
  const handleRestore = (postId: number) => {
    if (!confirm('해당 게시글을 복구하시겠습니까?')) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.postId === postId ? { ...post, status: 'POSTED' as PostStatus } : post
      )
    );
  };

  /**
   * 고정 토글 핸들러
   * TODO: 백엔드 API 확인 필요
   */
  const handleTogglePin = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.postId === postId ? { ...post, isPinned: !post.isPinned } : post
      )
    );
  };

  return (
    <div className="admin-board-page">
      <h2 className="admin-section-title">게시글 관리</h2>
      <p className="admin-section-count">전체 {total}건</p>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-group">
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

          <select
            className="admin-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as PostStatus | 'ALL')}
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

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
              <th>신고</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {sortedPosts.length === 0 ? (
              <tr>
                <td colSpan={9} className="admin-table-empty">
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              sortedPosts.map((post) => (
                <tr key={post.postId} className={post.isPinned || post.isNotice ? 'pinned-row' : ''}>
                  <td>
                    {(post.isPinned || post.isNotice) && <Pin size={14} className="pin-icon" />}
                    {post.postId}
                  </td>
                  <td>
                    <span className={`admin-category-badge category-${post.category.toLowerCase()}`}>
                      {getCategoryLabel(post.category)}
                    </span>
                  </td>
                  <td className="admin-table-title">
                    {post.title}
                    {post.reportCount && post.reportCount > 0 && (
                      <span className="report-badge">신고 {post.reportCount}</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-author-info">
                      <span className="admin-nickname">{post.author.nickname}</span>
                      <span className="admin-handle">@{post.author.handle}</span>
                    </div>
                  </td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>{post.viewCount}</td>
                  <td>
                    {post.reportCount && post.reportCount > 0 ? (
                      <span className="admin-report-count">{post.reportCount}</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <span className={`admin-status-badge status-${post.status.toLowerCase()}`}>
                      {getStatusLabel(post.status)}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      {!post.isNotice && (
                        <button
                          className={`admin-action-btn pin ${post.isPinned ? 'active' : ''}`}
                          onClick={() => handleTogglePin(post.postId)}
                          title={post.isPinned ? '고정 해제' : '상단 고정'}
                        >
                          <Pin size={16} />
                        </button>
                      )}
                      {post.status === 'POSTED' ? (
                        <button
                          className="admin-action-btn delete"
                          onClick={() => handleDelete(post.postId)}
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          className="admin-action-btn show"
                          onClick={() => handleRestore(post.postId)}
                          title="복구"
                        >
                          <Eye size={16} />
                        </button>
                      )}
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