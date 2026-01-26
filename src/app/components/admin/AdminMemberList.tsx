/**
 * AdminMemberList.tsx
 * 회원 관리 컴포넌트 (목록 + 상세 모달 통합)
 * - 전체 회원 목록 조회/검색
 * - 유형별 필터 (전체/일반/트레이너/관리자)
 * - 회원 상세 정보 및 차단/강제 탈퇴
 */

import { useState, useEffect } from 'react';
import { Search, Ban, X, Mail, Calendar, Shield, AtSign } from 'lucide-react';
import type { AdminUser, UserRole, UserStatus } from '../../../api/types/admin';
import { getAdminUsers, banUser, unbanUser } from '../../../api/admin';

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
      alert('회원이 차단되었습니다.');
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
      alert('차단이 해제되었습니다.');
    } catch (err) {
      console.error('차단 해제 실패:', err);
      alert('차단 해제에 실패했습니다.');
    }
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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}