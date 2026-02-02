/**
 * TrainerBioSection.tsx
 * 트레이너 소개문구 섹션
 */

import { ChevronRight } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface TrainerBioSectionProps {
  bio: string | null | undefined;
  onEdit: () => void;
}

/**
 * TrainerBioSection 컴포넌트
 */
export default function TrainerBioSection({ bio, onEdit }: TrainerBioSectionProps) {
  return (
    <div className="mypage-section">
      <div className="mypage-section-header">
        <h3 className="mypage-section-title">트레이너 소개</h3>
        <button className="mypage-section-edit" onClick={onEdit}>
          수정
          <ChevronRight size={16} />
        </button>
      </div>
      <p className="mypage-trainer-bio">
        {bio || '소개문구를 입력해주세요.'}
      </p>
    </div>
  );
}
