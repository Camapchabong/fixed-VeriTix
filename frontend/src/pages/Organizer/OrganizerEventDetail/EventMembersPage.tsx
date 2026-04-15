import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { EventDetailContext, IOrganizerMember } from '../../../types/organizer.type';

/* ══════════════════════════════════════════
   EventMembersPage — Trang "Thành viên"
   
   Mockup ref: image5.png
   - Nút "+ Thêm thành viên"
   - Search bar
   - Table: Tên, Vai trò, Thành viên (email/wallet), Hành động
   - AddMemberModal popup
   ══════════════════════════════════════════ */

/* ── Mock members (backend chưa có API) ── */
const MOCK_MEMBERS: IOrganizerMember[] = [
  {
    _id: '1',
    userId: 'u1',
    walletAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    name: 'Organizer Owner',
    role: 'owner',
    addedAt: '2026-01-15T10:00:00Z',
  },
];

/* ── Role badge config ── */
const ROLE_CONFIG: Record<string, { label: string; cls: string }> = {
  owner: { label: 'Chủ sự kiện', cls: 'text-amber-400 bg-amber-500/[0.08] border-amber-500/20' },
  admin: { label: 'Quản trị viên', cls: 'text-sky-400 bg-sky-500/[0.08] border-sky-500/20' },
  staff: { label: 'Nhân viên', cls: 'text-slate-400 bg-slate-500/[0.08] border-slate-500/20' },
};

/* ── AddMemberModal ── */
const AddMemberModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onAdd: (wallet: string, role: 'admin' | 'staff') => void;
}> = ({ open, onClose, onAdd }) => {
  const [wallet, setWallet] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('staff');

  if (!open) return null;

  const handleSubmit = () => {
    if (!wallet.trim()) return;
    onAdd(wallet.trim(), role);
    setWallet('');
    setRole('staff');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="
        fixed inset-0 z-[90] flex items-center justify-center p-4
      "
      >
        <div
          className="
            bg-[#111827] border border-white/[0.08] rounded-2xl
            w-full max-w-md shadow-[0_24px_64px_rgba(0,0,0,0.5)]
            animate-[vtx-fade_0.2s_ease]
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <h3 className="text-[15px] font-bold text-white">Thêm thành viên</h3>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-medium text-slate-400 mb-2 block">
                Địa chỉ ví (Wallet Address)
              </label>
              <input
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
                className="
                  w-full bg-[#080b14] border border-white/[0.1] rounded-xl
                  px-4 py-3 text-sm text-slate-100 font-mono
                  placeholder:text-slate-700 outline-none
                  focus:border-emerald-500/40 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]
                  transition-all
                "
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-slate-400 mb-2 block">Vai trò</label>
              <div className="flex gap-2">
                {(['admin', 'staff'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`
                      flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium
                      border cursor-pointer transition-all
                      ${
                        role === r
                          ? 'bg-emerald-500/[0.1] border-emerald-500/30 text-emerald-400'
                          : 'bg-transparent border-white/[0.08] text-slate-500 hover:border-white/[0.15] hover:text-slate-300'
                      }
                    `}
                  >
                    {r === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
            <button
              onClick={onClose}
              className="
                px-4 py-2.5 rounded-xl text-[13px] font-medium
                text-slate-400 border border-white/[0.08]
                hover:bg-white/[0.04] transition-colors cursor-pointer
              "
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!wallet.trim()}
              className="
                px-5 py-2.5 rounded-xl text-[13px] font-semibold
                bg-emerald-500 text-white
                hover:bg-emerald-400 transition-all cursor-pointer
                shadow-[0_2px_12px_rgba(16,185,129,0.25)]
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              Thêm thành viên
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════ */

export default function EventMembersPage() {
  const { event } = useOutletContext<EventDetailContext>();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [members, setMembers] = useState<IOrganizerMember[]>(MOCK_MEMBERS);

  if (!event) return null;

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.walletAddress.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMember = (wallet: string, role: 'admin' | 'staff') => {
    // TODO: call API when backend ready
    const newMember: IOrganizerMember = {
      _id: Date.now().toString(),
      userId: '',
      walletAddress: wallet.toLowerCase(),
      name: `Member ${members.length + 1}`,
      role,
      addedAt: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
  };

  return (
    <div className="max-w-[960px] animate-[vtx-fade_0.35s_ease]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">Thành viên</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="
            flex items-center gap-2 px-4 py-2.5
            bg-emerald-500 hover:bg-emerald-400 text-white
            text-[13px] font-semibold rounded-xl transition-all cursor-pointer
            shadow-[0_2px_12px_rgba(16,185,129,0.25)]
          "
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
          Thêm thành viên
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative mb-5">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm thành viên..."
          className="
            w-full bg-[#0d1117] border border-white/[0.08] rounded-xl
            pl-11 pr-4 py-3 text-sm text-slate-200
            placeholder:text-slate-700 outline-none
            focus:border-emerald-500/30 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.06)]
            transition-all
          "
        />
      </div>

      {/* ── Filter badge ── */}
      <div className="flex justify-end mb-3">
        <span className="text-[12px] text-slate-500 flex items-center gap-1.5">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Tất cả ({filtered.length})
        </span>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Tên thành viên', 'Vai trò', 'Thành viên', 'Hành động'].map((h) => (
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
            {filtered.map((member) => {
              const roleCfg = ROLE_CONFIG[member.role] || ROLE_CONFIG.staff;
              return (
                <tr
                  key={member._id}
                  className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[13px] font-medium text-emerald-400">
                        {member.name}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span
                      className={`
                      inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border
                      ${roleCfg.cls}
                    `}
                    >
                      {roleCfg.label}
                    </span>
                  </td>

                  {/* Wallet */}
                  <td className="px-5 py-4">
                    <span className="text-[12px] text-slate-500 font-mono">
                      {member.walletAddress.slice(0, 6)}...{member.walletAddress.slice(-4)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    {member.role !== 'owner' ? (
                      <button className="text-[12px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer">
                        Xóa
                      </button>
                    ) : (
                      <span className="text-[12px] text-slate-700">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-[13px] text-slate-600">Không tìm thấy thành viên nào</p>
          </div>
        )}
      </div>

      {/* ── AddMemberModal ── */}
      <AddMemberModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddMember}
      />
    </div>
  );
}
