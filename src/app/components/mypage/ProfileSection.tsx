/**
 * ProfileSection.tsx
 * 마이페이지 프로필 섹션 (이미지, 닉네임, 핸들, 역할)
 */

import { User, Camera, Edit2 } from 'lucide-react';
import { getUserRoleLabel, getUserRoleClass } from '../../../utils/label';

/**
 * Props 타입 정의
 */
interface ProfileSectionProps {
  profileImageUrl: string | null | undefined;
  nickname: string | undefined;
  handle: string | undefined;
  role: string | undefined;
  isUploadingImage: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowProfileSheet: () => void;
  onEditNickname: () => void;
}

/**
 * ProfileSection 컴포넌트
 */
export default function ProfileSection({
  profileImageUrl,
  nickname,
  handle,
  role,
  isUploadingImage,
  fileInputRef,
  onImageUpload,
  onShowProfileSheet,
  onEditNickname,
}: ProfileSectionProps) {
  return (
    <div className="mypage-profile-section">
      <div className="mypage-profile-image-wrapper">
        {profileImageUrl ? (
          <img src={profileImageUrl} alt="프로필" className="mypage-profile-image" />
        ) : (
          <User size={48} className="mypage-profile-placeholder" />
        )}
        <>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={onImageUpload}
            style={{ display: 'none' }}
          />
          <button
            className="mypage-profile-edit-btn"
            onClick={onShowProfileSheet}
            disabled={isUploadingImage}
          >
            {isUploadingImage ? (
              <div className="mypage-image-spinner" />
            ) : (
              <Camera size={16} />
            )}
          </button>
        </>
      </div>
      <div className="mypage-profile-info">
        <div className="mypage-nickname-row">
          <h2 className="mypage-nickname">{nickname}</h2>
          <button className="mypage-edit-btn" onClick={onEditNickname}>
            <Edit2 size={14} />
          </button>
        </div>
        <span className="mypage-handle">@{handle}</span>
        <span className={`mypage-user-type ${getUserRoleClass(role)}`}>
          {getUserRoleLabel(role)}
        </span>
      </div>
    </div>
  );
}
