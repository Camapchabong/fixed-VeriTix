import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { EventDetailContext } from '../../../types/organizer.type';

/* ══════════════════════════════════════════
   EventCheckInPage — Trang "Check-in"
   
   Mockup ref: image4.png
   - Donut ring: Đã check-in / Đã bán
   - Side cards: Trong sự kiện, Đã ra ngoài
   - Table chi tiết: Loại vé, Giá bán, Đã check-in, Tỉ lệ
   ══════════════════════════════════════════ */

/* ── Donut Ring (reused pattern) ── */
const DonutRing: React.FC<{
  percent: number;
  color: string;
  size?: number;
}> = ({ percent, color, size = 110 }) => {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="9"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-bold"
        fill={color}
      >
        {percent} %
      </text>
    </svg>
  );
};

export default function EventCheckInPage() {
  const { event } = useOutletContext<EventDetailContext>();
  if (!event) return null;

  // Mock check-in data (backend chưa có list API)
  const totalSold = event.currentMinted;
  const checkedIn = 0; // TODO: fetch from API when available
  const insideNow = 0;
  const leftVenue = 0;
  const checkinPercent = totalSold > 0 ? Math.round((checkedIn / totalSold) * 100) : 0;
  const price = parseFloat(event.price || '0');

  return (
    <div className="max-w-[960px] animate-[vtx-fade_0.35s_ease]">
      <h2 className="text-lg font-bold text-white mb-5">Check-in</h2>

      {/* ── Overview Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 mb-6">
        {/* Donut Card */}
        <div
          className="
          bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5
          flex items-center justify-between gap-6
        "
        >
          <div>
            <p className="text-[13px] text-slate-500 mb-1">Đã check-in</p>
            <p className="text-2xl font-bold text-white font-mono">
              {checkedIn.toLocaleString('vi-VN')}
              <span className="text-base text-slate-600 font-normal ml-1">vé</span>
            </p>
            <p className="text-[12px] text-slate-600 mt-1.5">
              Đã bán {totalSold.toLocaleString('vi-VN')} vé
            </p>
          </div>
          <DonutRing percent={checkinPercent} color="#eab308" />
        </div>

        {/* Side Stats */}
        <div className="flex flex-col gap-3">
          {/* In venue */}
          <div
            className="
            flex-1 bg-[#0d1117] border border-white/[0.06] rounded-xl
            px-5 py-4 flex items-center justify-between
          "
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/[0.1] flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="text-emerald-400"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="text-[13px] text-slate-400">Trong sự kiện</span>
            </div>
            <span className="text-xl font-bold text-emerald-400 font-mono">{insideNow}</span>
          </div>

          {/* Left venue */}
          <div
            className="
            flex-1 bg-[#0d1117] border border-white/[0.06] rounded-xl
            px-5 py-4 flex items-center justify-between
          "
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/[0.1] flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="text-rose-400"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <span className="text-[13px] text-slate-400">Đã ra ngoài</span>
            </div>
            <span className="text-xl font-bold text-rose-400 font-mono">{leftVenue}</span>
          </div>
        </div>
      </div>

      {/* ── Detail Table ── */}
      <h3 className="text-[15px] font-bold text-white mb-3">Chi tiết</h3>
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Loại vé', 'Giá bán', 'Đã check-in', 'Tỉ lệ check-in'].map((h) => (
                <th
                  key={h}
                  className="text-left text-[12px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
              <td className="px-5 py-4 text-[13px] text-slate-200 font-medium">Vé tiêu chuẩn</td>
              <td className="px-5 py-4 text-[13px] text-slate-400 font-mono">
                Ξ {price.toFixed(4)}
              </td>
              <td className="px-5 py-4 text-[13px] text-slate-400 font-mono">
                {checkedIn} / {totalSold}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {/* Progress bar */}
                  <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                      style={{ width: `${checkinPercent}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-semibold text-amber-400 font-mono w-10 text-right">
                    {checkinPercent}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Empty hint ── */}
      {checkedIn === 0 && (
        <div className="mt-6 text-center py-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-slate-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <p className="text-[13px] text-slate-600">Chưa có ai check-in</p>
          <p className="text-[11px] text-slate-700 mt-1">
            Dữ liệu sẽ cập nhật khi khách quét mã QR
          </p>
        </div>
      )}
    </div>
  );
}
