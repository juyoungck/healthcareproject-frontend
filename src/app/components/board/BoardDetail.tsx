/**
 * BoardDetail.tsx
 * 게시글 상세 컴포넌트
 * - 게시글 내용 표시 (제목, 본문, 이미지)
 * - 조회수 증가
 * - 댓글/대댓글 CRUD
 * - 수정/삭제 (본인 글만)
 * - 신고 기능
 */

import { useState } from 'react';
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

/**
 * 댓글 타입 정의
 */
interface Comment {
  id: number;
  authorId: number;
  author: string;
  content: string;
  date: string;
  replies: Reply[];
}

/**
 * 대댓글 타입 정의
 */
interface Reply {
  id: number;
  authorId: number;
  author: string;
  content: string;
  date: string;
}

/**
 * 게시글 상세 타입 정의
 */
interface PostDetail {
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
 * 카테고리 라벨 매핑
 */
const CATEGORY_LABELS: Record<string, string> = {
  free: '자유',
  question: '질문',
  info: '정보'
};

/**
 * 신고 사유 목록
 */
const REPORT_REASONS = [
  '스팸/광고',
  '욕설/비방',
  '음란물',
  '개인정보 노출',
  '기타'
];

/**
 * 더미 데이터 (API 연동 전 테스트용)
 * TODO: 실제 API 연동 시 제거
 */
const DUMMY_POST: PostDetail = {
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
  const [post, setPost] = useState<PostDetail>(DUMMY_POST);
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
  const isAuthor = post.authorId === currentUserId;

  /**
   * 현재 날짜/시간 포맷 생성
   */
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  };

  /**
   * 댓글 작성
   */
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    /* TODO: 실제 API 호출로 대체 */
    const newCommentObj: Comment = {
      id: Date.now(),
      authorId: currentUserId,
      author: '나', /* TODO: 실제 유저 닉네임으로 대체 */
      content: newComment.trim(),
      date: getCurrentDateTime(),
      replies: []
    };

    setPost(prev => ({
      ...prev,
      comments: [...prev.comments, newCommentObj]
    }));
    setNewComment('');
  };

  /**
   * 대댓글 작성
   */
  const handleAddReply = (commentId: number) => {
    if (!replyContent.trim()) return;
    
    /* TODO: 실제 API 호출로 대체 */
    const newReplyObj: Reply = {
      id: Date.now(),
      authorId: currentUserId,
      author: '나', /* TODO: 실제 유저 닉네임으로 대체 */
      content: replyContent.trim(),
      date: getCurrentDateTime()
    };

    setPost(prev => ({
      ...prev,
      comments: prev.comments.map(comment => 
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, newReplyObj] }
          : comment
      )
    }));
    setReplyContent('');
    setReplyingTo(null);
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
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === 'post') {
      /* TODO: 실제 API 호출로 대체 */
      onDelete();
    } else if (deleteTarget.type === 'comment') {
      /* 댓글 삭제 */
      setPost(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== deleteTarget.id)
      }));
    } else if (deleteTarget.type === 'reply') {
      /* 대댓글 삭제 */
      setPost(prev => ({
        ...prev,
        comments: prev.comments.map(comment => ({
          ...comment,
          replies: comment.replies.filter(reply => reply.id !== deleteTarget.id)
        }))
      }));
    }
    
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  /**
   * 신고 제출
   */
  const handleReport = () => {
    if (!selectedReportReason) return;
    
    /* TODO: API 호출 */
    console.log('신고:', selectedReportReason);
    setShowReportModal(false);
    setSelectedReportReason('');
    alert('신고가 접수되었습니다.');
  };

  /**
   * 날짜 포맷
   */
  const formatDate = (dateStr: string) => {
    return dateStr;
  };

  /**
   * 총 댓글 수 계산
   */
  const totalCommentCount = post.comments.reduce(
    (acc, comment) => acc + 1 + comment.replies.length,
    0
  );

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
          <span className={`board-category-badge ${post.category}`}>
            {CATEGORY_LABELS[post.category]}
          </span>
        </div>
        <h1 className="board-detail-title">{post.title}</h1>
        <div className="board-detail-meta">
          <span className="board-detail-author">{post.author}</span>
          <div className="board-detail-stats">
            <span>{formatDate(post.date)}</span>
            <span className="board-detail-stat">
              <Eye size={14} />
              {post.views}
            </span>
            <span className="board-detail-stat">
              <MessageSquare size={14} />
              {totalCommentCount}
            </span>
          </div>
        </div>
      </div>

      {/* 게시글 본문 */}
      <div className="board-detail-content">
        {post.content.split('\n').map((line, index) => (
          <p key={index}>{line || <br />}</p>
        ))}
      </div>

      {/* 첨부 이미지 */}
      {post.images.length > 0 && (
        <div className="board-detail-images">
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`첨부 이미지 ${index + 1}`}
              className="board-detail-image"
            />
          ))}
        </div>
      )}

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
              onClick={() => handleDeleteClick('post', post.id)}
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
            <div key={comment.id}>
              {/* 댓글 */}
              <div className="board-comment-item">
                <div className="board-comment-header">
                  <span className={`board-comment-author ${comment.authorId === post.authorId ? 'is-writer' : ''}`}>
                    {comment.author}
                  </span>
                  <span className="board-comment-date">{formatDate(comment.date)}</span>
                </div>
                <p className="board-comment-content">{comment.content}</p>
                <div className="board-comment-actions">
                  <button 
                    className="board-comment-action"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <CornerDownRight size={12} />
                    답글
                  </button>
                  <div className="board-comment-actions-right">
                    {comment.authorId === currentUserId && (
                      <button 
                        className="board-comment-action delete"
                        onClick={() => handleDeleteClick('comment', comment.id)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>

                {/* 대댓글 입력 폼 */}
                {replyingTo === comment.id && (
                  <div className="board-reply-form">
                    <input
                      type="text"
                      className="board-reply-input"
                      placeholder="답글을 입력하세요"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleAddReply(comment.id);
                      }}
                    />
                    <button 
                      className="board-reply-submit"
                      onClick={() => handleAddReply(comment.id)}
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
              {comment.replies.map((reply) => (
                <div key={reply.id} className="board-comment-item reply">
                  <div className="board-comment-header">
                    <span className={`board-comment-author ${reply.authorId === post.authorId ? 'is-writer' : ''}`}>
                      {reply.author}
                    </span>
                    <span className="board-comment-date">{formatDate(reply.date)}</span>
                  </div>
                  <p className="board-comment-content">{reply.content}</p>
                  <div className="board-comment-actions">
                    <div className="board-comment-actions-right">
                      {reply.authorId === currentUserId && (
                        <button 
                          className="board-comment-action delete"
                          onClick={() => handleDeleteClick('reply', reply.id)}
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