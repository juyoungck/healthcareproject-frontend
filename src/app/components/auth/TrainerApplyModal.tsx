/**
 * TrainerApplyModal.tsx
 * 트레이너 등록 신청 모달
 * - 자격증/경력증명서 파일 업로드 (최대 5개)
 * - 소개 문구 작성
 */

import { useState, useRef } from 'react';
import { X, Upload, FileText, Image, Trash2 } from 'lucide-react';
/**
 * ===========================================
 * Props 타입 정의
 * ===========================================
 */

interface TrainerApplyModalProps {
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 신청 완료 핸들러 */
  onSubmit: (data: TrainerApplyData) => void;
}

/**
 * 트레이너 신청 데이터
 */
export interface TrainerApplyData {
  introduction: string;
  files: File[];
}

/**
 * ===========================================
 * TrainerApplyModal 컴포넌트
 * ===========================================
 */

export default function TrainerApplyModal({
  onClose,
  onSubmit,
}: TrainerApplyModalProps) {
  /**
   * 상태 관리
   */
  const [introduction, setIntroduction] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ name: string; type: 'image' | 'pdf' }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 파일 선택 핸들러
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: File[] = [];
    const newPreviews: { name: string; type: 'image' | 'pdf' }[] = [];

    Array.from(selectedFiles).forEach((file) => {
      /* 최대 5개 제한 */
      if (files.length + newFiles.length >= 5) return;

      /* 이미지 또는 PDF만 허용 */
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (isImage || isPdf) {
        newFiles.push(file);
        newPreviews.push({
          name: file.name,
          type: isImage ? 'image' : 'pdf',
        });
      }
    });

    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    /* input 초기화 */
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * 파일 삭제 핸들러
   */
  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * 신청 제출 핸들러
   */
  const handleSubmit = () => {
    if (!introduction.trim()) {
      alert('소개 문구를 작성해주세요.');
      return;
    }

    if (files.length === 0) {
      alert('자격증 또는 경력증명서를 최소 1개 이상 첨부해주세요.');
      return;
    }

    onSubmit({
      introduction: introduction.trim(),
      files,
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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container trainer-apply-modal">
        {/* 헤더 */}
        <div className="modal-header">
          <h2 className="modal-title">트레이너 등록 신청</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="modal-content">
          {/* 파일 업로드 섹션 */}
          <div className="trainer-apply-section">
            <label className="trainer-apply-label">
              자격증 / 경력증명서
              <span className="trainer-apply-label-sub">
                (최대 5개, 이미지 또는 PDF)
              </span>
            </label>

            {/* 파일 업로드 버튼 */}
            <button
              className="trainer-apply-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={files.length >= 5}
            >
              <Upload size={20} />
              파일 첨부하기
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {/* 첨부된 파일 목록 */}
            {previews.length > 0 && (
              <ul className="trainer-apply-file-list">
                {previews.map((preview, index) => (
                  <li key={index} className="trainer-apply-file-item">
                    <div className="trainer-apply-file-info">
                      {preview.type === 'image' ? (
                        <Image size={18} className="trainer-apply-file-icon" />
                      ) : (
                        <FileText size={18} className="trainer-apply-file-icon" />
                      )}
                      <span className="trainer-apply-file-name">{preview.name}</span>
                    </div>
                    <button
                      className="trainer-apply-file-remove"
                      onClick={() => handleFileRemove(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 소개 문구 섹션 */}
          <div className="trainer-apply-section">
            <label className="trainer-apply-label">소개</label>
            <textarea
              className="trainer-apply-textarea"
              placeholder="전문 분야, 경력 사항, 소개 문구를 작성하세요."
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows={6}
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            취소
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            신청하기
          </button>
        </div>
      </div>
    </div>
  );
}