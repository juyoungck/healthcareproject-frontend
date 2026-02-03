/**
 * useProfileImage.ts
 * 프로필 이미지 업로드 관련 커스텀 훅
 */

import { useState, useRef, useCallback } from 'react';
import { updateProfileImage } from '../../api/me';
import { uploadImage } from '../../api/upload';
import { getApiErrorMessage } from '../../api/apiError';

/**
 * 반환 타입 인터페이스
 */
interface UseProfileImageReturn {
  /* 상태 */
  isUploadingImage: boolean;
  showProfileSheet: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;

  /* 액션 */
  setShowProfileSheet: (show: boolean) => void;
  handleChangePhoto: () => void;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (imageUrl: string) => void
  ) => Promise<void>;
  handleResetProfileImage: (
    currentImageUrl: string | null,
    onSuccess: () => void
  ) => Promise<void>;
}

/**
 * 프로필 이미지 훅
 */
export function useProfileImage(): UseProfileImageReturn {
  /** 상태 */
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showProfileSheet, setShowProfileSheet] = useState(false);

  /** ref */
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /** 사진 변경하기 클릭 핸들러 */
  const handleChangePhoto = useCallback(() => {
    setShowProfileSheet(false);
    fileInputRef.current?.click();
  }, []);

  /** 프로필 이미지 업로드 핸들러 */
  const handleImageUpload = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (imageUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    try {
      /* 1. 이미지 업로드 → URL 받기 (PROFILE 타입) */
      const imageUrl = await uploadImage(file, 'PROFILE');

      /* 2. 프로필 이미지 URL 저장 API 호출 */
      await updateProfileImage({ profileImageUrl: imageUrl });

      /* 3. 성공 콜백 */
      onSuccess(imageUrl);
      alert('프로필 이미지가 변경되었습니다.');
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, '이미지 업로드에 실패했습니다.'));
    } finally {
      setIsUploadingImage(false);
      /* input 초기화 */
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  /** 기본 사진으로 변경 핸들러 */
  const handleResetProfileImage = useCallback(async (
    currentImageUrl: string | null,
    onSuccess: () => void
  ) => {
    if (!currentImageUrl) {
      alert('이미 기본 사진입니다.');
      setShowProfileSheet(false);
      return;
    }

    if (!confirm('기본 사진으로 변경하시겠습니까?')) {
      return;
    }

    setIsUploadingImage(true);

    try {
      await updateProfileImage({ profileImageUrl: null });
      onSuccess();
      alert('기본 사진으로 변경되었습니다.');
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, '기본 사진으로 변경에 실패했습니다.'));
    } finally {
      setIsUploadingImage(false);
      setShowProfileSheet(false);
    }
  }, []);

  return {
    isUploadingImage,
    showProfileSheet,
    fileInputRef,
    setShowProfileSheet,
    handleChangePhoto,
    handleImageUpload,
    handleResetProfileImage,
  };
}
