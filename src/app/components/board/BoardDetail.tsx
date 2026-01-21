/**
 * BoardDetail.tsx
 * 게시글 상세 컴포넌트
 * - 게시글 내용 표시 (제목, 본문, 이미지)
 * - 조회수 증가
 * - 댓글/대댓글 CRUD
 * - 수정/삭제 (본인 글만)
 * - 신고 기능
 */

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Eye,
  MessageSquare,
  Edit2,
  Trash2,
  Flag,
  Send,
  CornerDownRight,
  X,
  AlertTriangle
} from 'lucide-react';
import {
  CATEGORY_LABELS,
  REPORT_REASONS,
  CATEGORY_MAP
} from '../../../data/boards';
import { getPostDetail, deletePost, createComment, deleteComment, reportContent } from '../../../api/board';
import { PostDetailResponse, CommentResponse } from '../../../api/types/board';

/**
 * Props 타입 정의
 */
interface BoardDetailProps {
  postId: number;
  currentUserId: number;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * BoardDetail 컴포넌트
 */
export default function BoardDetail({
  postId,
  currentUserId,
  onBack,
  onEdit,
  onDelete
}: BoardDetailProps) {
  /**
   * 상태 관리
   */
  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'post' | 'comment' | 'reply'; id: number } | null>(null);

  /**
   * 본인 글 여부 확인
   */
  const isAuthor = post?.author?.handle === localStorage.getItem('userHandle');

  /**
   * 게시글 상세 데이터 로드
   */
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const data = await getPostDetail(postId);
        setPost(data);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        alert('게시글을 불러오는데 실패했습니다.');
        onBack();
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  /**
   * 날짜 포맷
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

  /**
   * 댓글 작성
   */
  const handleAddComment = async () => {
    if (!newComment.trim() || !post) return;

    try {
      await createComment(postId, {
        parentId: null,
        content: newComment.trim(),
      });

      /* 게시글 다시 로드 */
      const data = await getPostDetail(postId);
      setPost(data);
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  /**
   * 대댓글 작성
   */
  const handleAddReply = async (commentId: number) => {
    if (!replyContent.trim() || !post) return;

    try {
      await createComment(postId, {
        parentId: commentId,
        content: replyContent.trim(),
      });

      /* 게시글 다시 로드 */
      const data = await getPostDetail(postId);
      setPost(data);
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('답글 작성 실패:', error);
      alert('답글 작성에 실패했습니다.');
    }
  };

  /**
   * 삭제 확인 모달 열기
   */
  const handleDeleteClick = (type: 'post' | 'comment' | 'reply', id: number) => {
    setDeleteTarget({ type, id });
    setShowDeleteModal(true);
  };

  /**
   * 삭제 확인
   */
  const handleConfirmDelete = async () => {
    if (!deleteTarget || !post) return;

    try {
      if (deleteTarget.type === 'post') {
        await deletePost(postId);
        onDelete();
      } else {
        /* 댓글/대댓글 삭제 */
        await deleteComment(postId, deleteTarget.id);
        const data = await getPostDetail(postId);
        setPost(data);
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }

    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  /**
   * 신고 제출
   */
  const handleReport = async () => {
    if (!selectedReportReason) return;

    try {
      await reportContent({
        targetType: 'POST',
        targetId: postId,
        reason: selectedReportReason,
      });
      setShowReportModal(false);
      setSelectedReportReason('');
    } catch (error) {
      console.error('신고 실패:', error);
    }
  };

  /**
   * 총 댓글 수 계산 (대댓글 포함)
   */
  const getTotalCommentCount = (comments: CommentResponse[]): number => {
    return comments.reduce((acc, comment) => {
      return acc + 1 + (comment.children?.length || 0);
    }, 0);
  };

  /**
   * 댓글 작성자가 글 작성자인지 확인
   */
  const isPostAuthor = (commentAuthorHandle: string): boolean => {
    return post?.author?.handle === commentAuthorHandle;
  };

  /**
   * 현재 사용자가 댓글 작성자인지 확인
   */
  const isCommentAuthor = (commentAuthorHandle: string): boolean => {
    return localStorage.getItem('userHandle') === commentAuthorHandle;
  };

  /* 로딩 중 */
  if (isLoading) {
    return (
      <div className="board-detail">
        <div className="board-loading">
          <div className="board-loading-spinner"></div>
          <span>불러오는 중...</span>
        </div>
      </div>
    );
  }

  /* 게시글 없음 */
  if (!post) {
    return (
      <div className="board-detail">
        <p>게시글을 찾을 수 없습니다.</p>
        <button onClick={onBack}>목록으로</button>
      </div>
    );
  }

  const totalCommentCount = getTotalCommentCount(post.comments);

  return (
    <div className="board-detail">
      {/* 뒤로가기 버튼 */}
      <button className="board-back-btn" onClick={onBack}>
        <ArrowLeft size={18} />
        <span>목록으로</span>
      </button>

      {/* 게시글 헤더 */}
      <div className="board-detail-header">
        <div className="board-detail-category">
          <span className={`board-category-badge ${CATEGORY_MAP.toFrontend[post.category]}`}>
            {CATEGORY_LABELS[CATEGORY_MAP.toFrontend[post.category]]}
          </span>
        </div>
        <h1 className="board-detail-title">{post.title}</h1>
        <div className="board-detail-meta">
          <span className="board-detail-author">{post.author.nickname}</span>
          <div className="board-detail-stats">
            <span>{formatDate(post.createdAt)}</span>
            <span className="board-detail-stat">
              <Eye size={14} />
              {post.viewCount}
            </span>
            <span className="board-detail-stat">
              <MessageSquare size={14} />
              {totalCommentCount}
            </span>
          </div>
        </div>
      </div>

      {/* 게시글 본문 */}
      {/* 게시글 본문 */}
      <div
        className="board-detail-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 액션 버튼 */}
      <div className="board-detail-actions">
        {isAuthor ? (
          <>
            <button className="board-action-btn edit" onClick={onEdit}>
              <Edit2 size={14} />
              수정
            </button>
            <button
              className="board-action-btn delete"
              onClick={() => handleDeleteClick('post', post.postId)}
            >
              <Trash2 size={14} />
              삭제
            </button>
          </>
        ) : (
          <button
            className="board-action-btn report"
            onClick={() => setShowReportModal(true)}
          >
            <Flag size={14} />
            신고
          </button>
        )}
      </div>

      {/* 댓글 섹션 */}
      <div className="board-comments">
        <div className="board-comments-header">
          <MessageSquare size={18} />
          <span>댓글</span>
          <span className="board-comments-count">{totalCommentCount}</span>
        </div>

        {/* 댓글 입력 */}
        <div className="board-comment-form">
          <textarea
            className="board-comment-input"
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
          />
          <button
            className="board-comment-submit"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Send size={16} />
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="board-comment-list">
          {post.comments.map((comment) => (
            <div key={comment.commentId}>
              {/* 댓글 */}
              <div className="board-comment-item">
                <div className="board-comment-header">
                  <span className={`board-comment-author ${isPostAuthor(comment.author.handle) ? 'is-writer' : ''}`}>
                    {comment.author.nickname}
                  </span>
                  <span className="board-comment-date">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="board-comment-content">{comment.content}</p>
                <div className="board-comment-actions">
                  <button
                    className="board-comment-action"
                    onClick={() => setReplyingTo(replyingTo === comment.commentId ? null : comment.commentId)}
                  >
                    <CornerDownRight size={12} />
                    답글
                  </button>
                  <div className="board-comment-actions-right">
                    {isCommentAuthor(comment.author.handle) && (
                      <button
                        className="board-comment-action delete"
                        onClick={() => handleDeleteClick('comment', comment.commentId)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>

                {/* 대댓글 입력 폼 */}
                {replyingTo === comment.commentId && (
                  <div className="board-reply-form">
                    <input
                      type="text"
                      className="board-reply-input"
                      placeholder="답글을 입력하세요"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleAddReply(comment.commentId);
                      }}
                    />
                    <button
                      className="board-reply-submit"
                      onClick={() => handleAddReply(comment.commentId)}
                    >
                      등록
                    </button>
                    <button
                      className="board-reply-cancel"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                    >
                      취소
                    </button>
                  </div>
                )}
              </div>

              {/* 대댓글 목록 */}
              {comment.children?.map((reply) => (
                <div key={reply.commentId} className="board-comment-item reply">
                  <div className="board-comment-header">
                    <span className={`board-comment-author ${isPostAuthor(reply.author.handle) ? 'is-writer' : ''}`}>
                      {reply.author.nickname}
                    </span>
                    <span className="board-comment-date">{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="board-comment-content">{reply.content}</p>
                  <div className="board-comment-actions">
                    <div className="board-comment-actions-right">
                      {isCommentAuthor(reply.author.handle) && (
                        <button
                          className="board-comment-action delete"
                          onClick={() => handleDeleteClick('reply', reply.commentId)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="board-delete-modal-content">
              <AlertTriangle className="board-delete-modal-icon" />
              <h2 className="board-delete-modal-title">
                {deleteTarget?.type === 'post' ? '게시글 삭제' : '댓글 삭제'}
              </h2>
              <p className="board-delete-modal-desc">
                {deleteTarget?.type === 'post'
                  ? '게시글을 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.'
                  : '댓글을 삭제하시겠습니까?'
                }
              </p>
              <div className="board-delete-modal-actions">
                <button
                  className="board-delete-modal-cancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  취소
                </button>
                <button
                  className="board-delete-modal-confirm"
                  onClick={handleConfirmDelete}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 신고 모달 */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">신고하기</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowReportModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-form">
              <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
                신고 사유를 선택해주세요
              </p>
              <div className="board-report-options">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason}
                    className={`board-report-option ${selectedReportReason === reason ? 'selected' : ''}`}
                    onClick={() => setSelectedReportReason(reason)}
                  >
                    <div className="board-report-radio" />
                    <span className="board-report-label">{reason}</span>
                  </button>
                ))}
              </div>
              <button
                className="form-submit-btn"
                onClick={handleReport}
                disabled={!selectedReportReason}
              >
                신고하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}