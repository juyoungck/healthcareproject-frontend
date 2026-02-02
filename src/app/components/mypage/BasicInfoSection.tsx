/**
 * BasicInfoSection.tsx
 * 기본 정보 섹션 (이메일, 전화번호, 가입일)
 */

import { Mail, Phone, Calendar, Edit2 } from 'lucide-react';
import { formatDate } from '../../../utils/format';

/**
 * Props 타입 정의
 */
interface BasicInfoSectionProps {
  email: string | undefined;
  phoneNumber: string | null | undefined;
  createdAt: string | undefined;
  onEditPhoneNumber: () => void;
}

/**
 * BasicInfoSection 컴포넌트
 */
export default function BasicInfoSection({
  email,
  phoneNumber,
  createdAt,
  onEditPhoneNumber,
}: BasicInfoSectionProps) {
  return (
    <div className="mypage-section">
      <h3 className="mypage-section-title">기본 정보</h3>
      <div className="mypage-info-list">
        <div className="mypage-info-item">
          <Mail size={18} className="mypage-info-icon" />
          <span className="mypage-info-label">이메일</span>
          <span className="mypage-info-value">{email}</span>
        </div>
        <div className="mypage-info-item">
          <Phone size={18} className="mypage-info-icon" />
          <span className="mypage-info-label">전화번호</span>
          <button className="mypage-edit-btn" onClick={onEditPhoneNumber}>
            <Edit2 size={14} />
          </button>
          <span className="mypage-info-value">{phoneNumber || '-'}</span>
        </div>
        <div className="mypage-info-item">
          <Calendar size={18} className="mypage-info-icon" />
          <span className="mypage-info-label">가입일</span>
          <span className="mypage-info-value">{formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
