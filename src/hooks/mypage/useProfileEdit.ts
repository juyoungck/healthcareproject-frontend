/**
 * useProfileEdit.ts
 * 프로필 수정 관련 커스텀 훅 (닉네임, 전화번호)
 */

import { useState, useCallback } from 'react';
import { updateNickname, updatePhoneNumber } from '../../api/me';
import { getApiErrorMessage } from '../../api/apiError';
import { formatPhoneNumber } from '../../utils/format';

/**
 * 반환 타입 인터페이스
 */
interface UseProfileEditReturn {
  /* 닉네임 수정 */
  showNicknameModal: boolean;
  editNickname: string;
  isUpdatingNickname: boolean;
  setShowNicknameModal: (show: boolean) => void;
  setEditNickname: (nickname: string) => void;
  handleEditNickname: (onSuccess: (nickname: string) => void) => Promise<void>;

  /* 전화번호 수정 */
  showPhoneModal: boolean;
  editPhoneNumber: string;
  isUpdatingPhoneNumber: boolean;
  setShowPhoneModal: (show: boolean) => void;
  setEditPhoneNumber: (phone: string) => void;
  handleEditPhoneNumber: (onSuccess: (phone: string) => void) => Promise<void>;
}

/**
 * 프로필 수정 훅
 */
export function useProfileEdit(): UseProfileEditReturn {
  /** 닉네임 상태 */
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);

  /** 전화번호 상태 */
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [isUpdatingPhoneNumber, setIsUpdatingPhoneNumber] = useState(false);

  /** 닉네임 수정 핸들러 */
  const handleEditNickname = useCallback(async (onSuccess: (nickname: string) => void) => {
    if (!editNickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setIsUpdatingNickname(true);

    try {
      await updateNickname({ nickname: editNickname });
      onSuccess(editNickname);
      setShowNicknameModal(false);
      alert('닉네임이 수정되었습니다.');
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, '닉네임 수정에 실패했습니다.'));
    } finally {
      setIsUpdatingNickname(false);
    }
  }, [editNickname]);

  /** 전화번호 수정 핸들러 */
  const handleEditPhoneNumber = useCallback(async (onSuccess: (phone: string) => void) => {
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (editPhoneNumber && !phoneRegex.test(editPhoneNumber.replace(/-/g, ''))) {
      alert('올바른 전화번호 형식이 아닙니다.');
      return;
    }

    const formattedPhone = editPhoneNumber ? formatPhoneNumber(editPhoneNumber) : '';

    setIsUpdatingPhoneNumber(true);

    try {
      await updatePhoneNumber({ phoneNumber: formattedPhone });
      onSuccess(formattedPhone);
      setShowPhoneModal(false);
      alert('전화번호가 수정되었습니다.');
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, '전화번호 수정에 실패했습니다.'));
    } finally {
      setIsUpdatingPhoneNumber(false);
    }
  }, [editPhoneNumber]);

  return {
    showNicknameModal,
    editNickname,
    isUpdatingNickname,
    setShowNicknameModal,
    setEditNickname,
    handleEditNickname,
    showPhoneModal,
    editPhoneNumber,
    isUpdatingPhoneNumber,
    setShowPhoneModal,
    setEditPhoneNumber,
    handleEditPhoneNumber,
  };
}
