import { useOutletContext } from 'react-router-dom';
import type { EventDetailContext } from '../../../types/organizer.type';

/* ══════════════════════════════════════════
   EventSummaryPage — Trang "Tổng kết"
   
   Mockup ref: image2.png, image3.png
   - Doanh thu tab (Doanh thu / Doanh số bán lại vé)
   - 2 donut ring cards: Doanh thu + Số vé đã bán
   - Thống kê chi tiết bên dưới
   ══════════════════════════════════════════ */

/* ── SVG Donut Ring ── */
const DonutRing: React.FC<{
  percent: number;
  color: string;
  size?: number;
}> = ({ percent, color, size = 100 }) => {
  const r = (size - 10) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="8"
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      {/* Center text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-bold"
        fill={color}
      >
        {percent}%
      </text>
    </svg>
  );
};

import React from 'react';

export default function EventSummaryPage() {
  const { event } = useOutletContext<EventDetailContext>();

  if (!event) return null;

  const ticketsSold = event.currentMinted;
  const maxSupply = event.maxSupply;
  const ticketPercent = maxSupply > 0 ? Math.round((ticketsSold / maxSupply) * 100) : 0;
  const price = parseFloat(event.price || '0');
  const revenueETH = ticketsSold * price;

  // Stat cards data
  const stats = [
    {
      label: 'Tổng vé phát hành',
      value: maxSupply.toLocaleString('vi-VN'),
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <rect x="1" y="1" width="9" height="9" rx="1.5" />
          <rect x="14" y="1" width="9" height="9" rx="1.5" />
          <rect x="1" y="14" width="9" height="9" rx="1.5" />
          <rect x="14" y="14" width="9" height="9" rx="1.5" />
        </svg>
      ),
      color: 'text-violet-400',
      bg: 'bg-violet-500/[0.08]',
    },
    {
      label: 'Giá vé',
      value: `Ξ ${event.price}`,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      color: 'text-sky-400',
      bg: 'bg-sky-500/[0.08]',
    },
    {
      label: 'Phí bán lại',
      value: `${event.maxResellPercentage}%`,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      color: 'text-amber-400',
      bg: 'bg-amber-500/[0.08]',
    },
    {
      label: 'Blockchain',
      value: event.isOnChain ? 'Verified' : 'Pending',
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      color: event.isOnChain ? 'text-emerald-400' : 'text-slate-500',
      bg: event.isOnChain ? 'bg-emerald-500/[0.08]' : 'bg-slate-500/[0.06]',
    },
  ];

  return (
    <div className="max-w-[960px] animate-[vtx-fade_0.35s_ease]">
      {/* ── Section: Doanh thu ── */}
      <h2 className="text-lg font-bold text-white mb-4">Doanh thu</h2>

      {/* Donut Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Revenue Card */}
        <div
          className="
          bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5
          flex items-center justify-between gap-4
          hover:border-white/[0.1] transition-colors
        "
        >
          <div>
            <p className="text-[13px] text-slate-500 mb-1">Doanh thu</p>
            <p className="text-2xl font-bold text-white font-mono">Ξ {revenueETH.toFixed(4)}</p>
            <p className="text-[12px] text-slate-600 mt-1">
              Tổng: Ξ {(maxSupply * price).toFixed(4)}
            </p>
          </div>
          <DonutRing percent={ticketPercent} color="#eab308" size={90} />
        </div>

        {/* Tickets Sold Card */}
        <div
          className="
          bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5
          flex items-center justify-between gap-4
          hover:border-white/[0.1] transition-colors
        "
        >
          <div>
            <p className="text-[13px] text-slate-500 mb-1">Số vé đã bán</p>
            <p className="text-2xl font-bold text-white font-mono">
              {ticketsSold.toLocaleString('vi-VN')}
              <span className="text-base text-slate-600 font-normal ml-1">vé</span>
            </p>
            <p className="text-[12px] text-slate-600 mt-1">
              Tổng: {maxSupply.toLocaleString('vi-VN')} vé
            </p>
          </div>
          <DonutRing percent={ticketPercent} color="#f59e0b" size={90} />
        </div>
      </div>

      {/* ── Section: Chi tiết ── */}
      <h2 className="text-lg font-bold text-white mb-4">Chi tiết</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="
              bg-[#0d1117] border border-white/[0.06] rounded-xl p-4
              hover:border-white/[0.1] transition-colors
            "
          >
            <div
              className={`${s.color} ${s.bg} w-8 h-8 rounded-lg flex items-center justify-center mb-3`}
            >
              {s.icon}
            </div>
            <p className="text-[11px] text-slate-600 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-[15px] font-bold text-white font-mono truncate">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Section: Thông tin sự kiện ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5">
        <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4">
          Thông tin sự kiện
        </h3>
        <div className="flex flex-col divide-y divide-white/[0.04]">
          {[
            ['Địa điểm', event.location],
            ['Mô tả', event.description || '—'],
            ['Ví tổ chức', event.organizerWallet],
            ['Ngày tạo', new Date(event.createdAt).toLocaleDateString('vi-VN')],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-start py-3 gap-4">
              <span className="text-[13px] text-slate-600 shrink-0">{label}</span>
              <span className="text-[13px] text-slate-300 text-right break-all">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
