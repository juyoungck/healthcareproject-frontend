/**
 * TrainerProfileModal.tsx
 * 트레이너 프로필 상세 모달
 */

import { X, User } from 'lucide-react';
import type { PTTrainerInfo } from '../../../api/types/pt';

interface TrainerProfileModalProps {
  trainer: PTTrainerInfo;
  onClose: () => void;
}

export default function TrainerProfileModal({ trainer, onClose }: TrainerProfileModalProps) {
  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="trainer-profile-modal">
        {/* 닫기 버튼 */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* 프로필 이미지 */}
        <div className="trainer-profile-image-wrapper">
          {trainer.profileImageUrl ? (
            <img 
              src={trainer.profileImageUrl} 
              alt={trainer.nickname}
              className="trainer-profile-image"
            />
          ) : (
            <div className="trainer-profile-placeholder">
              <User size={48} />
            </div>
          )}
        </div>

        {/* 트레이너 정보 */}
        <div className="trainer-profile-info">
          <h2 className="trainer-profile-name">{trainer.nickname} 트레이너</h2>
          <span className="trainer-profile-handle">@{trainer.handle}</span>
        </div>

        {/* 소개 */}
        <div className="trainer-profile-bio">
          {trainer.bio ? (
            <p>{trainer.bio}</p>
          ) : (
            <p className="trainer-profile-bio-empty">소개가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}