/**
 * ProfileImageSheet.tsx
 * 프로필 이미지 선택 바텀시트
 */

import { ImagePlus, RotateCcw } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface ProfileImageSheetProps {
  onChangePhoto: () => void;
  onResetPhoto: () => void;
  onClose: () => void;
}

/**
 * ProfileImageSheet 컴포넌트
 */
export default function ProfileImageSheet({
  onChangePhoto,
  onResetPhoto,
  onClose,
}: ProfileImageSheetProps) {
  return (
    <div className="profile-bottom-sheet-overlay" onClick={onClose}>
      <div className="profile-bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="profile-bottom-sheet-handle" />
        <div className="profile-bottom-sheet-menu">
          <button className="profile-bottom-sheet-item" onClick={onChangePhoto}>
            <ImagePlus size={20} />
            <span>사진 변경하기</span>
          </button>
          <button className="profile-bottom-sheet-item" onClick={onResetPhoto}>
            <RotateCcw size={20} />
            <span>기본 사진으로 변경</span>
          </button>
        </div>
        <div className="profile-bottom-sheet-divider" />
        <button className="profile-bottom-sheet-cancel" onClick={onClose}>
          취소
        </button>
      </div>
    </div>
  );
}
