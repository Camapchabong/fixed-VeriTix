import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

type Props = {
  onMenuClick?: () => void;
  showMenuBtn?: boolean;
};

const OrganizerHeader: React.FC<Props> = ({ onMenuClick, showMenuBtn = false }) => {
  const navigate = useNavigate();
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDdOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070a11]/80 border-b border-white/[0.04]">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          {showMenuBtn && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors md:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-2 text-[13px]">
            <span className="text-slate-600">Organizer</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-700"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-slate-400 font-medium">Dashboard</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Bell */}
          <button className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#070a11]" />
          </button>

          {/* Tạo sự kiện */}
          <button
            onClick={() => navigate(ROUTES.ORGANIZER_CREATE_EVENT)}
            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-[13px] md:text-sm font-semibold rounded-xl transition-all shadow-[0_2px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:-translate-y-px active:translate-y-0"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="hidden sm:inline">Tạo sự kiện</span>
          </button>

          {/* Account */}
          <div ref={ddRef} className="relative">
            <button
              onClick={() => setDdOpen(!ddOpen)}
              className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer border border-transparent hover:border-white/[0.06]"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400/30 to-blue-600/30 flex items-center justify-center text-[11px] font-bold text-sky-400 border border-sky-400/10">
                OR
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <span className="text-[13px] font-medium text-slate-300">Tài khoản</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-slate-500 transition-transform duration-200 ${ddOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {ddOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-[#0f1629] border border-white/[0.08] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden animate-[fadeSlideDown_0.2s_ease-out]">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-semibold text-slate-200">Organizer</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">0x1a2b...3c4d</p>
                </div>
                <div className="py-1.5">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors text-left">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Thông tin cá nhân
                  </button>
                </div>
                <div className="border-t border-white/[0.06] py-1.5">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.06] transition-colors text-left">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default OrganizerHeader;
