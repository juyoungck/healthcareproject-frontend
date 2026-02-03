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

import { createPost, updatePost, getPostDetail } from '../../../api/board';
import { PostCategory } from '../../../api/types/board';
import { uploadImage } from '../../../api/upload';
import { getApiErrorMessage } from '../../../api/apiError';
import { POST_TITLE_MAX_LENGTH, MAX_POST_IMAGES } from '../../../constants/validation';

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
const CATEGORY_OPTIONS: { value: PostCategory; label: string }[] = [
  { value: 'FREE', label: '자유' },
  { value: 'QUESTION', label: '질문' },
  { value: 'INFO', label: '정보' }
];


/**
 * BoardWrite 컴포넌트
 */
export default function BoardWrite({ mode, postId, onBack, onSubmit }: BoardWriteProps) {
  /**
   * 상태 관리
   */
  const [category, setCategory] = useState<PostCategory>('FREE');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Toast UI Editor ref
   */
  const editorRef = useRef<Editor>(null);

  /**
   * 수정 모드일 경우 기존 데이터 로드
   */
  useEffect(() => {
    if (mode === 'edit' && postId) {
      const fetchPostData = async () => {
        setIsLoading(true);
        try {
          const data = await getPostDetail(postId);
          setCategory(data.category);
          setTitle(data.title);
          
          /* 에디터에 내용 설정 */
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.getInstance().setHTML(data.content);
            }
          }, 100);
        } catch (error) {
          alert(getApiErrorMessage(error, '게시글을 불러오는데 실패했습니다.'));
          onBack();
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPostData();
    }
  }, [mode, postId, onBack]);

  /**
   * 이미지 업로드 훅 (Toast UI Editor)
   */
  const handleImageUpload = async (
    blob: Blob,
    callback: (url: string, altText: string) => void
  ) => {
    /* 이미지 개수 체크 */
    if (imageCount >= MAX_POST_IMAGES) {
      alert(`이미지는 최대 ${MAX_POST_IMAGES}장까지 첨부할 수 있습니다.`);
      return;
    }

    /* 이미지 파일 검증 */
    if (!blob.type.startsWith('image/')) {
      alert('이미지 파일만 첨부할 수 있습니다.');
      return;
    }

    try {
      /* Blob을 File 객체로 변환 */
      const fileName = `image_${Date.now()}.${blob.type.split('/')[1] || 'png'}`;
      const file = new File([blob], fileName, { type: blob.type });

      /* S3에 이미지 업로드 (POST 타입) */
      const imageUrl = await uploadImage(file, 'POST');
      
      /* 이미지 카운트 증가 */
      setImageCount(prev => prev + 1);
      
      /* 콜백으로 이미지 URL 전달 */
      callback(imageUrl, '첨부 이미지');
    } catch (error) {
      alert(getApiErrorMessage(error, '이미지 업로드에 실패했습니다.'));
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
      if (mode === 'create') {
        await createPost({
          category,
          title,
          content,
          isNotice: false,
        });
        alert('게시글이 등록되었습니다.');
      } else {
        await updatePost(postId!, {
          category,
          title,
          content,
          isNotice: false,
        });
        alert('게시글이 수정되었습니다.');
      }
      onSubmit();
    } catch (error) {
      alert(getApiErrorMessage(error, '게시글 등록에 실패했습니다. 다시 시도해주세요.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* 로딩 중 */
  if (isLoading) {
    return (
      <div className="board-write">
        <div className="board-loading">
          <div className="board-loading-spinner"></div>
          <span>불러오는 중...</span>
        </div>
      </div>
    );
  }

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
          maxLength={POST_TITLE_MAX_LENGTH}
        />
      </div>

      {/* Toast UI Editor */}
      <div className="board-write-input-group">
        <label className="board-write-label">
          내용 
          <span className="board-write-image-info">
            (이미지 {imageCount}/{MAX_POST_IMAGES}장)
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