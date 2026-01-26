/**
 * AdminBoardList.tsx
 * 게시글 관리 컴포넌트
 * 
 * API:
 * - GET /api/admin/board (게시글 목록)
 * - GET /api/board/posts/{postId} (게시글 상세)
 * - POST /api/admin/board/notice (공지 등록)
 * - DELETE /api/admin/board/post/{postId} (삭제)
 */

import { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import type { AdminPost, PostCategory, PostStatus } from '../../../api/types/admin';
import { getAdminPosts, createNotice } from '../../../api/admin';
import { getPostDetail } from '../../../api/board';

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

/**
 * ===========================================
 * 라벨 변환 함수
 * ===========================================
 */
const getCategoryLabel = (category: string): string => {
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
      return '비공개';
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
  /** 상태 관리 */
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<PostCategory | 'ALL'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  /**
   * 게시글 목록 조회
   */
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: {
        category?: PostCategory;
        keyword?: string;
      } = {};

      if (filterCategory !== 'ALL') {
        params.category = filterCategory;
      }
      if (searchKeyword) {
        params.keyword = searchKeyword;
      }

      const response = await getAdminPosts(params);
      setPosts(response.list);
      setTotal(response.total);
    } catch (err) {
      console.error('게시글 목록 조회 실패:', err);
      setError('게시글 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 초기 로드 및 필터 변경 시 재조회
   */
  useEffect(() => {
    fetchPosts();
  }, [filterCategory]);

  /**
   * 검색 실행 (Enter 키 또는 버튼 클릭)
   */
  const handleSearch = () => {
    fetchPosts();
  };

  /**
   * 검색 키 입력 핸들러
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 정렬 (공지사항 우선)
   */
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isNotice && !b.isNotice) return -1;
    if (!a.isNotice && b.isNotice) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  /**
   * 게시글 상세 보기 state (content 포함)
   */
  const [selectedPost, setSelectedPost] = useState<(AdminPost & { content?: string }) | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  /**
   * 게시글 상세 조회 (content 가져오기)
   */
  const handleViewDetail = async (post: AdminPost) => {
    setSelectedPost({ ...post, content: undefined });
    setIsDetailLoading(true);
    
    try {
      const detail = await getPostDetail(post.postId);
      setSelectedPost({ ...post, content: detail.content });
    } catch (err) {
      console.error('게시글 상세 조회 실패:', err);
      setSelectedPost({ ...post, content: '(내용을 불러올 수 없습니다)' });
    } finally {
      setIsDetailLoading(false);
    }
  };

  /**
   * 공지사항 등록 핸들러
   */
  const handleCreateNotice = async (data: { title: string; content: string }) => {
    try {
      await createNotice({
        category: 'NOTICE',
        title: data.title,
        content: data.content,
        isNotice: true,
      });
      setIsNoticeModalOpen(false);
      fetchPosts();
      alert('공지사항이 등록되었습니다.');
    } catch (err) {
      console.error('공지사항 등록 실패:', err);
      alert('공지사항 등록에 실패했습니다.');
    }
  };

  /**
   * 로딩 상태
   */
  if (isLoading) {
    return (
      <div className="admin-board-page">
        <h2 className="admin-section-title">게시글 관리</h2>
        <div className="admin-loading">로딩 중...</div>
      </div>
    );
  }

  /**
   * 에러 상태
   */
  if (error) {
    return (
      <div className="admin-board-page">
        <h2 className="admin-section-title">게시글 관리</h2>
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={fetchPosts} className="admin-btn primary">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-board-page">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">게시글 관리</h2>
          <p className="admin-section-count">전체 {total}건</p>
        </div>
        <button
          className="admin-add-btn"
          onClick={() => setIsNoticeModalOpen(true)}
        >
          <Plus size={18} /> 공지 등록
        </button>
      </div>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
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

        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="제목 또는 작성자 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearchKeyDown}
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
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {sortedPosts.length === 0 ? (
              <tr>
                <td colSpan={7} className="admin-table-empty">
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              sortedPosts.map((post) => (
                <tr 
                  key={post.postId} 
                  className={`${post.isNotice ? 'pinned-row' : ''} admin-clickable-row`}
                  onClick={() => handleViewDetail(post)}
                >
                  <td>{post.postId}</td>
                  <td>
                    <span className={`admin-category-badge category-${post.category.toLowerCase()}`}>
                      {getCategoryLabel(post.category)}
                    </span>
                  </td>
                  <td className="admin-table-title">{post.title}</td>
                  <td>
                    <div className="admin-author-info">
                      <span className="admin-nickname">{post.author.nickname}</span>
                      <span className="admin-handle">@{post.author.handle}</span>
                    </div>
                  </td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>{post.viewCount}</td>
                  <td>
                    {post.isNotice ? (
                      <span className="admin-notice-label">공지</span>
                    ) : (
                      <span className={`admin-status-badge status-${post.status.toLowerCase()}`}>
                        {getStatusLabel(post.status)}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 공지 등록 모달 */}
      {isNoticeModalOpen && (
        <NoticeModal
          onClose={() => setIsNoticeModalOpen(false)}
          onSave={handleCreateNotice}
        />
      )}

      {/* 게시글 상세 모달 */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          isLoading={isDetailLoading}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}

/**
 * ===========================================
 * 공지 등록 모달
 * ===========================================
 */
interface NoticeModalProps {
  onClose: () => void;
  onSave: (data: { title: string; content: string }) => void;
}

function NoticeModal({ onClose, onSave }: NoticeModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    if (isSubmitting) return; // 중복 클릭 방지
    
    setIsSubmitting(true);
    onSave({
      title: title.trim(),
      content: content.trim(),
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal-container">
        {/* 헤더 */}
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">공지사항 등록</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="admin-modal-content">
          <div className="admin-form-group">
            <label className="admin-form-label">제목 *</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="공지사항 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">내용 *</label>
            <textarea
              className="admin-form-textarea"
              placeholder="공지사항 내용을 입력하세요"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="admin-modal-footer">
          <button className="admin-btn secondary" onClick={onClose} disabled={isSubmitting}>
            취소
          </button>
          <button className="admin-btn primary" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ===========================================
 * 게시글 상세 모달 컴포넌트
 * ===========================================
 */
interface PostDetailModalProps {
  post: AdminPost & { content?: string };
  isLoading: boolean;
  onClose: () => void;
}

function PostDetailModal({ post, isLoading, onClose }: PostDetailModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal-container" style={{ maxWidth: '700px' }}>
        {/* 헤더 */}
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">게시글 상세</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="admin-modal-content">
          {/* 카테고리 & 상태 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {post.isNotice ? (
              <span className="admin-notice-label">공지</span>
            ) : (
              <>
                <span className={`admin-category-badge category-${post.category.toLowerCase()}`}>
                  {getCategoryLabel(post.category)}
                </span>
                <span className={`admin-status-badge status-${post.status.toLowerCase()}`}>
                  {getStatusLabel(post.status)}
                </span>
              </>
            )}
          </div>

          {/* 제목 */}
          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
            {post.title}
          </h4>

          {/* 작성자 & 작성일 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', color: '#666' }}>
            <div>
              <span style={{ fontWeight: '500', color: '#333' }}>{post.author.nickname}</span>
              <span style={{ marginLeft: '8px' }}>@{post.author.handle}</span>
            </div>
            <div>
              <span>{formatDate(post.createdAt)}</span>
              <span style={{ marginLeft: '16px' }}>조회 {post.viewCount}</span>
            </div>
          </div>

          {/* 구분선 */}
          <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', marginBottom: '20px' }} />

          {/* 내용 */}
          <div style={{ 
            minHeight: '200px', 
            lineHeight: '1.7', 
            color: '#333',
            whiteSpace: 'pre-wrap'
          }}>
            {isLoading ? '로딩 중...' : (post.content || '(내용 없음)')}
          </div>
        </div>

        {/* 푸터 */}
        <div className="admin-modal-footer">
          <button className="admin-btn secondary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}