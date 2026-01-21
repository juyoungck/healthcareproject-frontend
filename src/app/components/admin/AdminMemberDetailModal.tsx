/**
 * AdminMemberDetailModal.tsx
 * 회원 상세 정보 모달
 * - 회원 정보 상세 조회
 * - 차단/차단해제/강제탈퇴 처리
 */

import { X, Mail, Calendar, Clock, Shield } from 'lucide-react';
import type { AdminUser, UserRole, UserStatus } from '../../../types/admin';

/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface AdminMemberDetailModalProps {
  member: AdminUser;
  onClose: () => void;
  onBan: (id: number) => void;
  onUnban: (id: number) => void;
  onDelete: (id: number) => void;
}

/**
 * ===========================================
 * 라벨 변환 함수
 * ===========================================
 */

const getRoleLabel = (role: UserRole) => {
  switch (role) {
    case 'user':
      return '일반회원';
    case 'trainer':
      return '트레이너';
    case 'admin':
      return '관리자';
    default:
      return role;
  }
};

const getStatusLabel = (status: UserStatus) => {
  switch (status) {
    case 'active':
      return '활성';
    case 'inactive':
      return '비활성';
    case 'banned':
      return '차단';
    default:
      return status;
  }
};

/**
 * ===========================================
 * AdminMemberDetailModal 컴포넌트
 * ===========================================
 */

export default function AdminMemberDetailModal({
  member,
  onClose,
  onBan,
  onUnban,
  onDelete,
}: AdminMemberDetailModalProps) {
  /**
   * 날짜 포맷
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * 오버레이 클릭 핸들러
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 차단 핸들러
   */
  const handleBan = () => {
    if (confirm('해당 회원을 차단하시겠습니까?')) {
      onBan(member.id);
    }
  };

  /**
   * 차단 해제 핸들러
   */
  const handleUnban = () => {
    if (confirm('해당 회원의 차단을 해제하시겠습니까?')) {
      onUnban(member.id);
    }
  };

  /**
   * 강제 탈퇴 핸들러
   */
  const handleDelete = () => {
    if (confirm('해당 회원을 강제 탈퇴시키겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      onDelete(member.id);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal-container">
        {/* 헤더 */}
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">회원 상세 정보</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="admin-modal-content">
          {/* 프로필 영역 */}
          <div className="admin-member-profile">
            <div className="admin-member-avatar">
              {member.profileImage ? (
                <img src={member.profileImage} alt={member.nickname} />
              ) : (
                <span>{member.nickname.charAt(0)}</span>
              )}
            </div>
            <div className="admin-member-info">
              <h4 className="admin-member-nickname">{member.nickname}</h4>
              <span className={`admin-role-badge role-${member.role}`}>
                {getRoleLabel(member.role)}
              </span>
              <span className={`admin-status-badge status-${member.status}`}>
                {getStatusLabel(member.status)}
              </span>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="admin-detail-section">
            <h4 className="admin-detail-label">계정 정보</h4>
            <div className="admin-detail-list">
              <div className="admin-detail-row">
                <Mail size={16} />
                <span className="admin-detail-key">이메일</span>
                <span className="admin-detail-value">{member.email}</span>
              </div>
              <div className="admin-detail-row">
                <Shield size={16} />
                <span className="admin-detail-key">회원 유형</span>
                <span className="admin-detail-value">{getRoleLabel(member.role)}</span>
              </div>
              <div className="admin-detail-row">
                <Calendar size={16} />
                <span className="admin-detail-key">가입일</span>
                <span className="admin-detail-value">{formatDate(member.createdAt)}</span>
              </div>
              <div className="admin-detail-row">
                <Clock size={16} />
                <span className="admin-detail-key">최근 로그인</span>
                <span className="admin-detail-value">
                  {member.lastLoginAt ? formatDate(member.lastLoginAt) : '기록 없음'}
                </span>
              </div>
            </div>
          </div>

          {/* 차단 상태 안내 */}
          {member.status === 'banned' && (
            <div className="admin-detail-section">
              <div className="admin-banned-notice">
                이 회원은 현재 차단된 상태입니다.
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="admin-modal-footer">
          <button className="admin-btn secondary" onClick={onClose}>
            닫기
          </button>
          {member.status === 'banned' ? (
            <button className="admin-btn primary" onClick={handleUnban}>
              차단 해제
            </button>
          ) : (
            <button className="admin-btn warning" onClick={handleBan}>
              차단
            </button>
          )}
          <button className="admin-btn danger" onClick={handleDelete}>
            강제 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}