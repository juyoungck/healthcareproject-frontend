/**
 * AdminMemberPage.tsx
 * 회원 관리 페이지
 * - 전체 회원 목록 조회/검색
 * - 유형별 필터 (전체/일반/트레이너)
 * - 상태별 필터 (전체/활성/비활성/차단)
 * - 회원 상세 정보 및 차단/강제 탈퇴
 */

import { useState } from 'react';
import { Search, Eye, Ban, UserX } from 'lucide-react';
import type { AdminUser, UserRole, UserStatus } from '../../../types/admin';
import { adminUsers } from '../../../data/admin';
import AdminMemberDetailModal from './AdminMemberDetailModal';

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */

const roleFilters: { value: UserRole | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'user', label: '일반회원' },
  { value: 'trainer', label: '트레이너' },
  { value: 'admin', label: '관리자' },
];

const statusFilters: { value: UserStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'banned', label: '차단' },
];

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

const getStatusClass = (status: UserStatus) => {
  switch (status) {
    case 'active':
      return 'status-active';
    case 'inactive':
      return 'status-inactive';
    case 'banned':
      return 'status-banned';
    default:
      return '';
  }
};

/**
 * ===========================================
 * AdminMemberPage 컴포넌트
 * ===========================================
 */

export default function AdminMemberPage() {
  /**
   * 상태 관리
   */
  const [members, setMembers] = useState<AdminUser[]>(adminUsers);
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedMember, setSelectedMember] = useState<AdminUser | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  /**
   * 필터링된 목록
   */
  const filteredMembers = members.filter((member) => {
    /* 역할 필터 */
    if (filterRole !== 'all' && member.role !== filterRole) {
      return false;
    }
    /* 상태 필터 */
    if (filterStatus !== 'all' && member.status !== filterStatus) {
      return false;
    }
    /* 검색 필터 */
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        member.nickname.toLowerCase().includes(keyword) ||
        member.email.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

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
  const handleBan = (id: number) => {
    if (!confirm('해당 회원을 차단하시겠습니까?')) return;

    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, status: 'banned' as UserStatus } : member
      )
    );
    setIsDetailModalOpen(false);

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/members/${id}/ban`, { method: 'POST' }); */
  };

  /**
   * 차단 해제 핸들러
   */
  const handleUnban = (id: number) => {
    if (!confirm('해당 회원의 차단을 해제하시겠습니까?')) return;

    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, status: 'active' as UserStatus } : member
      )
    );
    setIsDetailModalOpen(false);

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/members/${id}/unban`, { method: 'POST' }); */
  };

  /**
   * 강제 탈퇴 핸들러
   */
  const handleDelete = (id: number) => {
    if (!confirm('해당 회원을 강제 탈퇴시키겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return;

    setMembers((prev) => prev.filter((member) => member.id !== id));
    setIsDetailModalOpen(false);

    /* TODO: API 연동 */
    /* await fetch(`/api/admin/members/${id}`, { method: 'DELETE' }); */
  };

  /**
   * 날짜 포맷
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="admin-member-page">
      <h2 className="admin-section-title">회원 관리</h2>

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

          {/* 상태 필터 */}
          <select
            className="admin-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as UserStatus | 'all')}
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        {/* 검색 */}
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="닉네임 또는 이메일 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>닉네임</th>
              <th>이메일</th>
              <th>유형</th>
              <th>상태</th>
              <th>가입일</th>
              <th>최근 로그인</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-table-empty">
                  회원이 없습니다.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.nickname}</td>
                  <td>{member.email}</td>
                  <td>
                    <span className={`admin-role-badge role-${member.role}`}>
                      {getRoleLabel(member.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-status-badge ${getStatusClass(member.status)}`}>
                      {getStatusLabel(member.status)}
                    </span>
                  </td>
                  <td>{formatDate(member.createdAt)}</td>
                  <td>{member.lastLoginAt ? formatDate(member.lastLoginAt) : '-'}</td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn view"
                        onClick={() => handleViewDetail(member)}
                        title="상세보기"
                      >
                        <Eye size={16} />
                      </button>
                      {member.status !== 'banned' ? (
                        <button
                          className="admin-action-btn ban"
                          onClick={() => handleBan(member.id)}
                          title="차단"
                        >
                          <Ban size={16} />
                        </button>
                      ) : (
                        <button
                          className="admin-action-btn unban"
                          onClick={() => handleUnban(member.id)}
                          title="차단해제"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      <button
                        className="admin-action-btn delete"
                        onClick={() => handleDelete(member.id)}
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
        <AdminMemberDetailModal
          member={selectedMember}
          onClose={() => setIsDetailModalOpen(false)}
          onBan={handleBan}
          onUnban={handleUnban}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}