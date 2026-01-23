/**
 * AdminMemberList.tsx
 * 회원 관리 컴포넌트 (목록 + 상세 모달 통합)
 * - 전체 회원 목록 조회/검색
 * - 유형별 필터 (전체/일반/트레이너/관리자)
 * - 회원 상세 정보 및 차단/강제 탈퇴
 */

import { useState, useEffect } from 'react';
import { Search, Eye, Ban, UserX, X, Mail, Calendar, Shield, AtSign } from 'lucide-react';
import type { AdminUser, UserRole, UserStatus } from '../../../api/types/admin';
import { getAdminUsers, banUser, unbanUser, deleteUser } from '../../../api/admin';

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */
const roleFilters: { value: UserRole | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'USER', label: '일반회원' },
  { value: 'TRAINER', label: '트레이너' },
  { value: 'ADMIN', label: '관리자' },
];

/**
 * ===========================================
 * 라벨 변환 함수
 * ===========================================
 */
const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'USER':
      return '일반회원';
    case 'TRAINER':
      return '트레이너';
    case 'ADMIN':
      return '관리자';
    default:
      return role;
  }
};

const getStatusLabel = (status: UserStatus): string => {
  switch (status) {
    case 'ACTIVE':
      return '활성';
    case 'STOP':
      return '정지';
    case 'SLEEP':
      return '휴면';
    default:
      return status;
  }
};

const getStatusClass = (status: UserStatus): string => {
  switch (status) {
    case 'ACTIVE':
      return 'status-active';
    case 'STOP':
      return 'status-stop';
    case 'SLEEP':
      return 'status-sleep';
    default:
      return '';
  }
};

/**
 * ===========================================
 * 날짜 포맷 함수
 * ===========================================
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatDateTime = (dateString: string): string => {
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
 * ===========================================
 * AdminMemberList 컴포넌트
 * ===========================================
 */
export default function AdminMemberList() {
  /**
   * 상태 관리
   */
  const [members, setMembers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedMember, setSelectedMember] = useState<AdminUser | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  /**
   * 회원 목록 조회
   */
  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        role: filterRole !== 'ALL' ? filterRole : undefined,
        keyword: searchKeyword || undefined,
      };
      const response = await getAdminUsers(params);
      setMembers(response.list);
      setTotal(response.total);
    } catch (err) {
      console.error('회원 목록 조회 실패:', err);
      setError('회원 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 초기 로드 및 필터 변경 시 재조회
   */
  useEffect(() => {
    fetchMembers();
  }, [filterRole]);

  /**
   * 검색 핸들러 (엔터키 또는 버튼 클릭)
   */
  const handleSearch = () => {
    fetchMembers();
  };

  /**
   * 검색어 입력 핸들러 (엔터키)
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 상세 보기 핸들러
   */
  const handleViewDetail = (member: AdminUser) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  };

  /**
   * 차단 처리 핸들러
   */
  const handleBan = async (userId: number) => {
    if (!confirm('해당 회원을 차단하시겠습니까?')) return;

    try {
      await banUser(userId);
      setMembers((prev) =>
        prev.map((member) =>
          member.userId === userId ? { ...member, status: 'STOP' as UserStatus } : member
        )
      );
      setIsDetailModalOpen(false);
    } catch (err) {
      console.error('회원 차단 실패:', err);
      alert('회원 차단에 실패했습니다.');
    }
  };

  /**
   * 차단 해제 핸들러
   */
  const handleUnban = async (userId: number) => {
    if (!confirm('해당 회원의 차단을 해제하시겠습니까?')) return;

    try {
      await unbanUser(userId);
      setMembers((prev) =>
        prev.map((member) =>
          member.userId === userId ? { ...member, status: 'ACTIVE' as UserStatus } : member
        )
      );
      setIsDetailModalOpen(false);
    } catch (err) {
      console.error('차단 해제 실패:', err);
      alert('차단 해제에 실패했습니다.');
    }
  };

  /**
   * 강제 탈퇴 핸들러
   */
  const handleDelete = async (userId: number) => {
    if (!confirm('해당 회원을 강제 탈퇴시키겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return;

    try {
      await deleteUser(userId);
      setMembers((prev) => prev.filter((member) => member.userId !== userId));
      setTotal((prev) => prev - 1);
      setIsDetailModalOpen(false);
    } catch (err) {
      console.error('강제 탈퇴 실패:', err);
      alert('강제 탈퇴에 실패했습니다.');
    }
  };

  /**
   * 모달 닫기 핸들러
   */
  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMember(null);
  };

  /**
   * 로딩 상태
   */
  if (isLoading) {
    return (
      <div className="admin-member-page">
        <h2 className="admin-section-title">회원 관리</h2>
        <div className="admin-loading">로딩 중...</div>
      </div>
    );
  }

  /**
   * 에러 상태
   */
  if (error) {
    return (
      <div className="admin-member-page">
        <h2 className="admin-section-title">회원 관리</h2>
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={fetchMembers} className="admin-btn primary">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-member-page">
      <h2 className="admin-section-title">회원 관리</h2>
      <p className="admin-section-count">전체 {total}명</p>

      {/* 필터 영역 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          {/* 역할 필터 */}
          <div className="admin-filter-tabs">
            {roleFilters.map((filter) => (
              <button
                key={filter.value}
                className={`admin-filter-tab ${filterRole === filter.value ? 'active' : ''}`}
                onClick={() => setFilterRole(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* 검색 */}
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="닉네임 또는 이메일 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>핸들</th>
              <th>닉네임</th>
              <th>이메일</th>
              <th>유형</th>
              <th>상태</th>
              <th>가입일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-table-empty">
                  회원이 없습니다.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.userId}>
                  <td>{member.userId}</td>
                  <td className="admin-handle">@{member.handle}</td>
                  <td>{member.nickname}</td>
                  <td>{member.email}</td>
                  <td>
                    <span className={`admin-role-badge role-${member.role.toLowerCase()}`}>
                      {getRoleLabel(member.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-status-badge ${getStatusClass(member.status)}`}>
                      {getStatusLabel(member.status)}
                    </span>
                  </td>
                  <td>{formatDate(member.createdAt)}</td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn view"
                        onClick={() => handleViewDetail(member)}
                        title="상세보기"
                      >
                        <Eye size={16} />
                      </button>
                      {member.status !== 'STOP' ? (
                        <button
                          className="admin-action-btn ban"
                          onClick={() => handleBan(member.userId)}
                          title="차단"
                        >
                          <Ban size={16} />
                        </button>
                      ) : (
                        <button
                          className="admin-action-btn unban"
                          onClick={() => handleUnban(member.userId)}
                          title="차단해제"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      <button
                        className="admin-action-btn delete"
                        onClick={() => handleDelete(member.userId)}
                        title="강제탈퇴"
                      >
                        <UserX size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 상세 모달 */}
      {isDetailModalOpen && selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={handleCloseModal}
          onBan={handleBan}
          onUnban={handleUnban}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

/**
 * ===========================================
 * 회원 상세 모달 (내부 컴포넌트)
 * ===========================================
 */
interface MemberDetailModalProps {
  member: AdminUser;
  onClose: () => void;
  onBan: (userId: number) => void;
  onUnban: (userId: number) => void;
  onDelete: (userId: number) => void;
}

function MemberDetailModal({
  member,
  onClose,
  onBan,
  onUnban,
  onDelete,
}: MemberDetailModalProps) {
  /**
   * 오버레이 클릭 핸들러
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
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
              <span className="admin-member-handle">@{member.handle}</span>
              <div className="admin-member-badges">
                <span className={`admin-role-badge role-${member.role.toLowerCase()}`}>
                  {getRoleLabel(member.role)}
                </span>
                <span className={`admin-status-badge ${getStatusClass(member.status)}`}>
                  {getStatusLabel(member.status)}
                </span>
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="admin-detail-section">
            <h4 className="admin-detail-label">계정 정보</h4>
            <div className="admin-detail-list">
              <div className="admin-detail-row">
                <AtSign size={16} />
                <span className="admin-detail-key">핸들</span>
                <span className="admin-detail-value">@{member.handle}</span>
              </div>
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
                <span className="admin-detail-value">{formatDateTime(member.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* 차단 상태 안내 */}
          {member.status === 'STOP' && (
            <div className="admin-detail-section">
              <div className="admin-banned-notice">이 회원은 현재 차단된 상태입니다.</div>
            </div>
          )}

          {/* 휴면 상태 안내 */}
          {member.status === 'SLEEP' && (
            <div className="admin-detail-section">
              <div className="admin-sleep-notice">이 회원은 현재 휴면 상태입니다.</div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="admin-modal-footer">
          <button className="admin-btn secondary" onClick={onClose}>
            닫기
          </button>
          {member.status === 'STOP' ? (
            <button className="admin-btn primary" onClick={() => onUnban(member.userId)}>
              차단 해제
            </button>
          ) : (
            <button className="admin-btn warning" onClick={() => onBan(member.userId)}>
              차단
            </button>
          )}
          <button className="admin-btn danger" onClick={() => onDelete(member.userId)}>
            강제 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}