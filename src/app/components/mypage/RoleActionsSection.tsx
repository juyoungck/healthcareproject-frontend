/**
 * RoleActionSection.tsx
 * 역할별 액션 섹션 (트레이너 등록/관리자 패널)
 */

import { GraduationCap, Clock, ChevronRight, AlertTriangle, Settings } from 'lucide-react';
import type { TrainerStatus } from '../../../hooks/mypage/useTrainerProfile';
import type { UserRole } from '../../../api/types/me';

/**
 * Props 타입 정의
 */
interface RoleActionSectionProps {
  role: UserRole | undefined;
  trainerStatus: TrainerStatus;
  rejectReason: string | null | undefined;
  onTrainerApply: () => void;
  onOpenAdminPage?: () => void;
}

/**
 * RoleActionSection 컴포넌트
 */
export default function RoleActionSection({
  role,
  trainerStatus,
  rejectReason,
  onTrainerApply,
  onOpenAdminPage,
}: RoleActionSectionProps) {
  /** 관리자: 관리자 패널 버튼 */
  if (role === 'ADMIN' && onOpenAdminPage) {
    return (
      <div className="mypage-section">
        <button className="mypage-trainer-btn apply" onClick={onOpenAdminPage}>
          <Settings size={20} />
          <span>관리자 패널</span>
          <ChevronRight size={18} />
        </button>
      </div>
    );
  }

  /** 트레이너: 표시 안함 */
  if (trainerStatus === 'approved') {
    return null;
  }

  /** 일반 사용자: 트레이너 등록 관련 */
  return (
    <div className="mypage-section mypage-trainer-section">
      {trainerStatus === 'none' && (
        <button className="mypage-trainer-btn apply" onClick={onTrainerApply}>
          <GraduationCap size={20} />
          <span>트레이너로 등록하기</span>
          <ChevronRight size={18} />
        </button>
      )}

      {trainerStatus === 'pending' && (
        <button className="mypage-trainer-btn pending" disabled>
          <Clock size={20} />
          <span>관리자 승인 대기중</span>
        </button>
      )}

      {trainerStatus === 'rejected' && (
        <>
          <div className="mypage-trainer-rejected-reason">
            <AlertTriangle size={18} />
            <span>거절 사유: {rejectReason || '사유 없음'}</span>
          </div>
          <button className="mypage-trainer-btn apply" onClick={onTrainerApply}>
            <GraduationCap size={20} />
            <span>트레이너 등록 재신청</span>
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
