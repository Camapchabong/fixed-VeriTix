import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import OrganizerSidebar, { MobileSidebar } from '../components/organizer/OrganizerSidebar';
import OrganizerHeader from '../components/organizer/OrganizerHeader';

/* ══════════════════════════════════════════
   OrganizerLayout — Cấp 1
   Sidebar chính + Header + Outlet (page con)

   Desktop: sidebar cố định bên trái (collapsible)
   Mobile (<768px): sidebar ẩn, mở bằng hamburger menu
   ══════════════════════════════════════════ */

const SIDEBAR_EXPANDED_W = 220;
const SIDEBAR_COLLAPSED_W = 68;
const MOBILE_BREAKPOINT = 768;

export default function OrganizerLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ── Responsive detection ──
  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    setIsMobile(mobile);
    // Tự động thu sidebar khi chuyển sang mobile
    if (mobile) {
      setSidebarExpanded(false);
      setMobileOpen(false);
    }
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  // ── Handlers ──
  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarExpanded((prev) => !prev);
    }
  }, [isMobile]);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const sidebarWidth = isMobile ? 0 : sidebarExpanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  return (
    <div className="flex min-h-screen bg-[#070a11]">
      {/* ── Desktop Sidebar ── */}
      {!isMobile && <OrganizerSidebar expanded={sidebarExpanded} onToggle={handleToggleSidebar} />}

      {/* ── Mobile Sidebar Drawer ── */}
      {isMobile && <MobileSidebar open={mobileOpen} onClose={handleCloseMobile} />}

      {/* ── Main Content Area ── */}
      <main
        className="flex-1 flex flex-col min-h-screen transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Header: sticky, hiện nút hamburger trên mobile */}
        <OrganizerHeader onMenuClick={handleToggleSidebar} showMenuBtn={isMobile} />

        {/* Page content */}
        <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
