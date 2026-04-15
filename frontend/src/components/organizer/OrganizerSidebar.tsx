import React, { createContext, useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ORGANIZER_NAV_ITEMS } from '../../constants/sidebar';

/* ══════════════════════════════════════════
   OrganizerSidebar — Collapsible + Mobile Drawer
   Veritix Organizer Dashboard

   Refactored:
   - <a href="#"> → NavLink (react-router-dom)
   - Dùng ORGANIZER_NAV_ITEMS từ constants/sidebar.ts
   - Active state tự detect từ URL
   - Tailwind CSS thay inline styles
   ══════════════════════════════════════════ */

/* ── SVG Icons ── */
const ChevronLeft = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const XIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Context cho expanded state ── */
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

/* ── SidebarItem (NavLink + tooltip khi thu gọn) ── */
const SidebarItem: React.FC<{
  icon: string;
  text: string;
  to: string;
}> = ({ icon, text, to }) => {
  const { expanded } = useContext(SidebarContext);
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink
      to={to}
      end={to === '/organizer/events'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={({ isActive }) => `
        relative flex items-center rounded-lg text-[13.5px] font-medium
        no-underline whitespace-nowrap transition-all duration-200
        ${expanded ? 'gap-2.5 px-3 py-2.5' : 'justify-center px-0 py-2.5'}
        ${
          isActive
            ? 'text-sky-400 bg-sky-400/10'
            : 'text-slate-400 hover:text-slate-100 hover:bg-[#1a2235]'
        }
      `}
    >
      {/* Icon */}
      <span className="text-[15px] opacity-80 shrink-0 w-5 text-center">{icon}</span>

      {/* Label — ẩn khi collapsed */}
      <span
        className="overflow-hidden transition-all duration-300"
        style={{
          width: expanded ? 150 : 0,
          opacity: expanded ? 1 : 0,
        }}
      >
        {text}
      </span>

      {/* Tooltip khi sidebar thu gọn */}
      {!expanded && hovered && (
        <div
          className="
          absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 z-[200]
          bg-[#1e293b] text-slate-100 px-3.5 py-1.5 rounded-lg
          text-[12.5px] font-medium whitespace-nowrap pointer-events-none
          border border-sky-400/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.5)]
          animate-[vtx-tooltip-in_0.15s_ease-out]
        "
        >
          {text}
          {/* Arrow */}
          <div
            className="
            absolute -left-[5px] top-1/2 -translate-y-1/2 rotate-45
            w-2.5 h-2.5 bg-[#1e293b]
            border-l border-b border-sky-400/[0.18]
          "
          />
        </div>
      )}
    </NavLink>
  );
};

/* ══════════════════════════════════════════
   Desktop Sidebar (collapsible, fixed bên trái)
   ══════════════════════════════════════════ */
type OrganizerSidebarProps = {
  expanded: boolean;
  onToggle: () => void;
};

const OrganizerSidebar: React.FC<OrganizerSidebarProps> = ({ expanded, onToggle }) => {
  const navigate = useNavigate();

  return (
    <aside
      className="
        fixed top-0 left-0 bottom-0 z-50
        bg-[#111827] border-r border-sky-400/[0.12]
        flex flex-col py-6
        transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        overflow-hidden
      "
      style={{ width: expanded ? 220 : 68 }}
    >
      {/* ── Logo + Toggle ── */}
      <div
        className={`
          border-b border-sky-400/[0.12] flex items-center min-h-[44px]
          ${expanded ? 'px-5 pb-5 justify-between gap-2' : 'pb-5 justify-center'}
        `}
      >
        {/* Logo text — ẩn khi collapsed */}
        <div
          className="overflow-hidden whitespace-nowrap cursor-pointer transition-all duration-300"
          style={{ width: expanded ? 120 : 0, opacity: expanded ? 1 : 0 }}
          onClick={() => navigate('/organizer')}
        >
          <span className="text-[15px] font-bold tracking-[0.04em] text-sky-400">Veritix</span>
          <p className="text-[11px] text-slate-400 mt-0.5 tracking-[0.06em] uppercase">
            Organizer Center
          </p>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="
            bg-sky-400/[0.08] border border-sky-400/[0.15] rounded-lg
            p-1.5 text-slate-400 cursor-pointer shrink-0
            flex items-center justify-center
            transition-colors duration-150
            hover:text-slate-200 hover:bg-sky-400/[0.14]
          "
        >
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* ── Navigation ── */}
      <SidebarContext.Provider value={{ expanded }}>
        <nav
          className={`
            flex-1 flex flex-col gap-1 pt-4
            ${expanded ? 'px-3' : 'px-2.5'}
          `}
        >
          {ORGANIZER_NAV_ITEMS.map((item) => (
            <SidebarItem key={item.key} icon={item.icon} text={item.label} to={item.path} />
          ))}
        </nav>
      </SidebarContext.Provider>

      {/* ── Footer (user info) ── */}
      <div
        className={`
          border-t border-sky-400/[0.12] pt-4 flex items-center gap-2.5
          ${expanded ? 'px-5 justify-start' : 'justify-center'}
        `}
      >
        {/* Avatar */}
        <div
          className="
          w-[34px] h-[34px] rounded-lg shrink-0
          bg-sky-400/[0.15] flex items-center justify-center
          text-[13px] font-bold text-sky-400
        "
        >
          OR
        </div>

        {/* Name — ẩn khi collapsed */}
        <div
          className="overflow-hidden whitespace-nowrap transition-all duration-300"
          style={{ width: expanded ? 140 : 0, opacity: expanded ? 1 : 0 }}
        >
          <p className="text-[13px] font-semibold text-slate-100 truncate">Organizer</p>
          <p className="text-[11px] text-slate-400 truncate">dashboard@veritix.io</p>
        </div>
      </div>
    </aside>
  );
};

/* ══════════════════════════════════════════
   Mobile Sidebar Drawer (overlay)
   ══════════════════════════════════════════ */
type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ open, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-[100] w-[270px]
          bg-[#111827] border-r border-sky-400/[0.12]
          flex flex-col py-6
          transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${open ? 'translate-x-0 shadow-[8px_0_40px_rgba(0,0,0,0.5)]' : '-translate-x-full shadow-none'}
        `}
      >
        {/* Header */}
        <div className="px-5 pb-5 border-b border-sky-400/[0.12] flex items-center justify-between">
          <div>
            <span className="text-[15px] font-bold tracking-[0.04em] text-sky-400">Veritix</span>
            <p className="text-[11px] text-slate-400 mt-0.5 tracking-[0.06em] uppercase">
              Organizer Center
            </p>
          </div>
          <button
            onClick={onClose}
            className="
              bg-sky-400/[0.08] border border-sky-400/[0.15] rounded-lg
              p-1.5 text-slate-400 cursor-pointer
              flex items-center justify-center
              hover:text-slate-200 hover:bg-sky-400/[0.14]
              transition-colors duration-150
            "
          >
            <XIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-4 flex flex-col gap-1">
          {ORGANIZER_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === '/organizer/events'}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3.5 py-3 rounded-lg
                text-[14px] font-medium no-underline
                transition-colors duration-150
                ${
                  isActive
                    ? 'text-sky-400 bg-sky-400/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#1a2235]'
                }
              `}
            >
              <span className="text-[16px] opacity-80">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 pt-4 border-t border-sky-400/[0.12] flex items-center gap-2.5">
          <div
            className="
            w-[34px] h-[34px] rounded-lg shrink-0
            bg-sky-400/[0.15] flex items-center justify-center
            text-[13px] font-bold text-sky-400
          "
          >
            OR
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-100">Organizer</p>
            <p className="text-[11px] text-slate-400">dashboard@veritix.io</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default OrganizerSidebar;
