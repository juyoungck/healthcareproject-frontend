/**
 * BoardPage.tsx
 * 게시판 메인 페이지 컴포넌트
 * 게시글 목록/상세/작성/수정 페이지 간 라우팅 관리
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BoardList from '../components/board/BoardList';
import BoardDetail from '../components/board/BoardDetail';
import BoardWrite from '../components/board/BoardWrite';

/**
 * 페이지 뷰 타입 정의
 */
type ViewType = 'list' | 'detail' | 'write' | 'edit';

/**
 * BoardPage 컴포넌트
 * 게시판 내 페이지 전환 관리
 */
export default function BoardPage() {
  /**
   * Context에서 사용자 정보 가져오기
   */
  const { user } = useAuth();

  /**
   * 현재 뷰 상태
   */
  const [currentView, setCurrentView] = useState<ViewType>('list');
  
  /**
   * 선택된 게시글 ID
   */
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  
  /**
   * 목록 새로고침 키 (삭제 후 목록 갱신용)
   */
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * 게시글 선택 핸들러
   */
  const handleSelectPost = (postId: number) => {
    setSelectedPostId(postId);
    setCurrentView('detail');
  };

  /**
   * 글쓰기 페이지 이동
   */
  const handleWritePost = () => {
    setCurrentView('write');
  };

  /**
   * 목록으로 돌아가기
   */
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPostId(null);
  };

  /**
   * 게시글 수정 페이지 이동
   */
  const handleEditPost = () => {
    setCurrentView('edit');
  };

  /**
   * 게시글 삭제 완료
   */
  const handleDeletePost = () => {
    setCurrentView('list');
    setSelectedPostId(null);
    setRefreshKey(prev => prev + 1);
  };

  /**
   * 글 작성/수정 완료
   */
  const handleSubmitComplete = () => {
    setCurrentView('list');
    setSelectedPostId(null);
    setRefreshKey(prev => prev + 1);
  };

  /**
   * 현재 뷰에 따른 컴포넌트 렌더링
   */
  const renderContent = () => {
    switch (currentView) {
      case 'list':
        return (
          <BoardList
            key={refreshKey}
            onSelectPost={handleSelectPost}
            onWritePost={handleWritePost}
          />
        );

      case 'detail':
        if (!selectedPostId) {
          setCurrentView('list');
          return null;
        }
        return (
          <BoardDetail
            postId={selectedPostId}
            currentUserHandle={user?.handle || ''}
            onBack={handleBackToList}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        );

      case 'write':
        return (
          <BoardWrite
            mode="create"
            onBack={handleBackToList}
            onSubmit={handleSubmitComplete}
          />
        );

      case 'edit':
        if (!selectedPostId) {
          setCurrentView('list');
          return null;
        }
        return (
          <BoardWrite
            mode="edit"
            postId={selectedPostId}
            onBack={() => setCurrentView('detail')}
            onSubmit={() => {
              setCurrentView('detail');
              /* 상세 페이지에서 새 데이터 로드 필요 */
            }}
          />
        );

      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
}
