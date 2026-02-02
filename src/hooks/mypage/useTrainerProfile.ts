/**
 * useTrainerProfile.ts
 * 트레이너 정보 관련 커스텀 훅
 */

import { useState, useCallback } from 'react';
import { getTrainerInfo } from '../../api/me';
import { updateTrainerBio, applyTrainer } from '../../api/trainer';
import { uploadTrainerDocument } from '../../api/upload';
import type { TrainerInfoResponse, UserRole } from '../../api/types/me';
import { getApiErrorMessage } from '../../api/apiError';
import type { TrainerApplyData } from '../../app/components/auth/TrainerApplyModal';

/**
 * 트레이너 상태 타입
 */
export type TrainerStatus = 'none' | 'pending' | 'approved' | 'rejected';

/**
 * 반환 타입 인터페이스
 */
interface UseTrainerProfileReturn {
  /* 상태 */
  trainerInfo: TrainerInfoResponse | null;
  isLoadingTrainerInfo: boolean;
  showBioModal: boolean;
  editBio: string;
  isUpdatingBio: boolean;
  showTrainerModal: boolean;
  isApplyingTrainer: boolean;

  /* 액션 */
  fetchTrainerInfo: (role: UserRole | undefined) => Promise<void>;
  setShowBioModal: (show: boolean) => void;
  setEditBio: (bio: string) => void;
  setShowTrainerModal: (show: boolean) => void;
  handleUpdateBio: () => Promise<void>;
  handleTrainerApply: (data: TrainerApplyData, onSuccess: () => void) => Promise<void>;
  getTrainerStatus: (role: UserRole | undefined) => TrainerStatus;
  openBioModal: () => void;
}

/**
 * 트레이너 정보 훅
 */
export function useTrainerProfile(): UseTrainerProfileReturn {
  /** 상태 */
  const [trainerInfo, setTrainerInfo] = useState<TrainerInfoResponse | null>(null);
  const [isLoadingTrainerInfo, setIsLoadingTrainerInfo] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [isUpdatingBio, setIsUpdatingBio] = useState(false);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [isApplyingTrainer, setIsApplyingTrainer] = useState(false);

  /** 트레이너 정보 로드 */
  const fetchTrainerInfo = useCallback(async (role: UserRole | undefined) => {
    if (role !== 'TRAINER' && role !== 'USER') return;

    setIsLoadingTrainerInfo(true);
    try {
      const info = await getTrainerInfo();
      setTrainerInfo(info);
      setEditBio(info.bio || '');
    } catch {
      setTrainerInfo(null);
    } finally {
      setIsLoadingTrainerInfo(false);
    }
  }, []);

  /** 트레이너 상태 반환 */
  const getTrainerStatus = useCallback((role: UserRole | undefined): TrainerStatus => {
    if (role === 'TRAINER') return 'approved';
    if (!trainerInfo) return 'none';

    switch (trainerInfo.applicationStatus) {
      case 'PENDING': return 'pending';
      case 'APPROVED': return 'approved';
      case 'REJECTED': return 'rejected';
      default: return 'none';
    }
  }, [trainerInfo]);

  /** 소개문구 모달 열기 */
  const openBioModal = useCallback(() => {
    setEditBio(trainerInfo?.bio || '');
    setShowBioModal(true);
  }, [trainerInfo?.bio]);

  /** 소개문구 수정 핸들러 */
  const handleUpdateBio = useCallback(async () => {
    setIsUpdatingBio(true);
    try {
      await updateTrainerBio({ bio: editBio });
      setTrainerInfo(prev => prev ? { ...prev, bio: editBio } : null);
      setShowBioModal(false);
      alert('소개문구가 수정되었습니다.');
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, '소개문구 수정에 실패했습니다.'));
    } finally {
      setIsUpdatingBio(false);
    }
  }, [editBio]);

  /** 트레이너 신청 핸들러 */
  const handleTrainerApply = useCallback(async (data: TrainerApplyData, onSuccess: () => void) => {
    setIsApplyingTrainer(true);

    try {
      /* 1. 파일들을 순차적으로 업로드하여 URL 배열 생성 */
      const licenseUrls: string[] = [];

      for (const file of data.files) {
        const url = await uploadTrainerDocument(file);
        licenseUrls.push(url);
      }

      /* 2. 트레이너 신청 API 호출 */
      await applyTrainer({
        licenseUrls,
        bio: data.introduction,
      });

      /* 3. 성공 처리 */
      alert('트레이너 등록 신청이 완료되었습니다.\n관리자 승인 후 트레이너로 활동할 수 있습니다.');
      setShowTrainerModal(false);

      /* 4. 성공 콜백 */
      onSuccess();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, '트레이너 신청에 실패했습니다. 다시 시도해주세요.'));
    } finally {
      setIsApplyingTrainer(false);
    }
  }, []);

  return {
    trainerInfo,
    isLoadingTrainerInfo,
    showBioModal,
    editBio,
    isUpdatingBio,
    showTrainerModal,
    isApplyingTrainer,
    fetchTrainerInfo,
    setShowBioModal,
    setEditBio,
    setShowTrainerModal,
    handleUpdateBio,
    handleTrainerApply,
    getTrainerStatus,
    openBioModal,
  };
}
