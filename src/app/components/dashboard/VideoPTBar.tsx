/**
 * VideoPTBar.tsx
 * 실시간 화상PT 바 컴포넌트
 */

import { Video } from 'lucide-react';

/**
 * Props 타입 정의
 */
interface VideoPTBarProps {
  livePTCount: number;
  onClick: () => void;
}

/**
 * VideoPTBar 컴포넌트
 */
export default function VideoPTBar({ livePTCount, onClick }: VideoPTBarProps) {
  return (
    <div className="video-call-bar" onClick={onClick}>
      <div className="video-call-content">
        <div className="video-call-left">
          <Video className="video-call-icon" />
          <div>
            <p className="video-call-title">실시간 화상 PT</p>
            <p className="video-call-subtitle">진행중인 PT를 확인하세요</p>
          </div>
        </div>
        <span className="video-call-count">{livePTCount}건</span>
      </div>
    </div>
  );
}
