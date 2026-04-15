import React from 'react';

interface LoadingSpinnerProps {
  /** Văn bản hiển thị kèm theo (Ví dụ: "Đang tải sự kiện...") */
  text?: string;
  /** Chế độ toàn màn hình (Overlay) hay chỉ hiển thị tại chỗ (Inline) */
  fullPage?: boolean;
  /** Kích thước của Spinner: 'sm' | 'md' | 'lg' */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * LoadingSpinner - Component dùng chung cho toàn hệ thống VeriTix
 * Thiết kế theo phong cách Web3/Blockchain: Glow effect + Smooth Animation
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Đang tải...',
  fullPage = false,
  size = 'md',
}) => {
  // Định nghĩa kích thước SVG dựa trên prop size
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const containerClasses = fullPage
    ? 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070a11]/80 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center py-12 w-full';

  return (
    <div className={containerClasses} style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="relative">
        {/* Vòng sáng (Glow Effect) phía sau - tạo cảm giác hiện đại */}
        <div className={`absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse`} />

        {/* Spinner chính - dùng Tailwind v4 animate-spin */}
        <div
          className={`
          ${sizeClasses[size]}
          rounded-full 
          border-t-emerald-500 
          border-r-transparent 
          border-b-emerald-500/30 
          border-l-transparent 
          animate-spin
        `}
        />
      </div>

      {text && (
        <p className="mt-4 text-sm font-medium text-slate-400 tracking-wide animate-pulse">
          {text}
        </p>
      )}

      {/* Style nội bộ cho animation nếu global.css chưa có */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
