/**
 * BoardWrite.tsx
 * 게시글 작성/수정 컴포넌트
 * - 카테고리 선택
 * - 제목/내용 입력
 * - Toast UI Editor 사용 (인라인 이미지 첨부)
 */

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

/* Toast UI Editor */
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

/**
 * 카테고리 타입 정의
 */
type CategoryType = 'free' | 'question' | 'info';

/**
 * Props 타입 정의
 */
interface BoardWriteProps {
  mode: 'create' | 'edit';
  postId?: number;
  onBack: () => void;
  onSubmit: () => void;
}

/**
 * 카테고리 옵션
 */
const CATEGORY_OPTIONS: { value: CategoryType; label: string }[] = [
  { value: 'free', label: '자유' },
  { value: 'question', label: '질문' },
  { value: 'info', label: '정보' }
];

/**
 * 최대 이미지 수
 */
const MAX_IMAGES = 5;

/**
 * BoardWrite 컴포넌트
 */
export default function BoardWrite({ mode, postId, onBack, onSubmit }: BoardWriteProps) {
  /**
   * 상태 관리
   */
  const [category, setCategory] = useState<CategoryType>('free');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageCount, setImageCount] = useState(0);

  /**
   * Toast UI Editor ref
   */
  const editorRef = useRef<Editor>(null);

  /**
   * 수정 모드일 경우 기존 데이터 로드
   */
  useEffect(() => {
    if (mode === 'edit' && postId) {
      /* TODO: API 호출하여 기존 게시글 데이터 로드 */
      console.log('게시글 데이터 로드:', postId);
      /* 임시 데이터 */
      setCategory('free');
      setTitle('오늘 운동 인증합니다! 헬스장 다녀왔어요');
      
      /* 에디터에 내용 설정 */
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.getInstance().setHTML('<p>안녕하세요! 오늘도 열심히 운동하고 왔습니다.</p>');
        }
      }, 100);
    }
  }, [mode, postId]);

  /**
   * 이미지 업로드 훅 (Toast UI Editor)
   */
  const handleImageUpload = async (
    blob: Blob,
    callback: (url: string, altText: string) => void
  ) => {
    /* 이미지 개수 체크 */
    if (imageCount >= MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있습니다.`);
      return;
    }

    /* 이미지 파일 검증 */
    if (!blob.type.startsWith('image/')) {
      alert('이미지 파일만 첨부할 수 있습니다.');
      return;
    }

    /* 파일 크기 제한 (5MB) */
    if (blob.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB 이하만 가능합니다.');
      return;
    }

    try {
      /* TODO: 실제 서버 업로드 API 호출 */
      /* 현재는 로컬 미리보기 URL 사용 */
      const localUrl = URL.createObjectURL(blob);
      
      /* 이미지 카운트 증가 */
      setImageCount(prev => prev + 1);
      
      /* 콜백으로 이미지 URL 전달 */
      callback(localUrl, '첨부 이미지');
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = async () => {
    /* 유효성 검사 */
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const editorInstance = editorRef.current?.getInstance();
    const content = editorInstance?.getHTML() || '';

    if (!content.trim() || content === '<p><br></p>') {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      /* TODO: API 호출 */
      const postData = {
        category,
        title,
        content,
        /* HTML 형식으로 저장 (이미지 인라인 포함) */
      };

      console.log('게시글 제출:', postData);

      /* 임시: 1초 후 완료 처리 */
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert(mode === 'create' ? '게시글이 등록되었습니다.' : '게시글이 수정되었습니다.');
      onSubmit();
    } catch (error) {
      console.error('게시글 제출 실패:', error);
      alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="board-write">
      {/* 헤더 */}
      <div className="board-write-header">
        <button className="board-write-back" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="board-write-title">
          {mode === 'create' ? '글쓰기' : '글 수정'}
        </h1>
      </div>

      {/* 카테고리 선택 */}
      <div className="board-write-category">
        <label className="board-write-label">카테고리</label>
        <div className="board-write-category-options">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`board-write-category-option ${category === option.value ? 'active' : ''}`}
              onClick={() => setCategory(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 제목 입력 */}
      <div className="board-write-input-group">
        <label className="board-write-label">제목</label>
        <input
          type="text"
          className="board-write-input"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>

      {/* Toast UI Editor */}
      <div className="board-write-input-group">
        <label className="board-write-label">
          내용 
          <span className="board-write-image-info">
            (이미지 {imageCount}/{MAX_IMAGES}장)
          </span>
        </label>
        <div className="board-write-editor">
          <Editor
            ref={editorRef}
            initialValue=""
            placeholder="내용을 입력하세요"
            previewStyle="vertical"
            height="400px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            toolbarItems={[
              ['heading', 'bold', 'italic', 'strike', 'hr', 'ul'],
              ['image', 'link'],
            ]}
            hooks={{
              addImageBlobHook: handleImageUpload,
            }}
            language="ko-KR"
          />
        </div>
      </div>

      {/* 작성 버튼 */}
      <button
        className="board-write-submit"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? (mode === 'create' ? '등록 중...' : '수정 중...') 
          : (mode === 'create' ? '등록하기' : '수정완료')
        }
      </button>
    </div>
  );
}
