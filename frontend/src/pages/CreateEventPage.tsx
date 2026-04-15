import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import OrganizerSidebar, { MobileSidebar } from '../components/organizer/OrganizerSidebar';
import { StepIndicator, STEPS } from '../components/organizer/CreateEventSteps';
import type { EventFormData } from '../components/organizer/CreateEventSteps';
import Step1EventInfo from '../components/organizer/Step1EventInfo';
import Step2TicketConfig from '../components/organizer/Step2TicketConfig';
import Step3PaymentPublish from '../components/organizer/Step3PaymentPublish';

/* ══════════════════════════════════════════════════════════════════
   Veritix — Tạo Sự Kiện (3-Step Wizard)
   React + Tailwind · Component-based · Responsive
   ══════════════════════════════════════════════════════════════════ */

const API_URL = import.meta.env.VITE_API_URL || '';
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

const CREATE_ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'uint256', name: 'price', type: 'uint256' },
      { internalType: 'uint256', name: 'maxSupply', type: 'uint256' },
      { internalType: 'uint256', name: 'maxResellPercentage', type: 'uint256' },
    ],
    name: 'createEvent',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'eventId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'address', name: 'organizer', type: 'address' },
    ],
    name: 'EventCreated',
    type: 'event',
  },
] as const;

const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<EventFormData>({
    name: '',
    category: '',
    locationType: 'offline',
    venueName: '',
    city: '',
    ward: '',
    address: '',
    description: '',
    orgName: '',
    orgInfo: '',
    price: '',
    maxSupply: '',
    resaleRoyalty: 10,
    saleStartDate: '',
    saleStartTime: '09:00',
    saleEndDate: '',
    saleEndTime: '23:59',
    eventStartDate: '',
    eventStartTime: '18:00',
    eventEndDate: '',
    eventEndTime: '22:00',
    earlyBirdPrice: '',
    earlyBirdQty: '',
    vipPrice: '',
    vipQty: '',
    bankName: '',
    bankAccount: '',
    bankOwner: '',
    bankBranch: '',
    paymentNote: '',
  });

  /* File states */
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  const set = useCallback(
    (k: keyof EventFormData, v: string | number) => {
      setForm((p) => ({ ...p, [k]: v }));
      if (errors[k])
        setErrors((p) => {
          const n = { ...p };
          delete n[k];
          return n;
        });
    },
    [errors]
  );

  const filePrev = (f: File | null, setF: (f: File | null) => void, setP: (s: string) => void) => {
    setF(f);
    if (f) {
      const r = new FileReader();
      r.onloadend = () => setP(r.result as string);
      r.readAsDataURL(f);
    } else setP('');
  };

  /* ── Body/Root overrides ── */
  useEffect(() => {
    const b = document.body,
      r = document.getElementById('root');
    const p = {
      bg: b.style.backgroundColor,
      c: b.style.color,
      mw: r?.style.maxWidth || '',
      m: r?.style.margin || '',
      pd: r?.style.padding || '',
      ta: r?.style.textAlign || '',
    };
    b.style.backgroundColor = '#070a11';
    b.style.color = '#f1f5f9';
    if (r) {
      r.style.maxWidth = 'none';
      r.style.margin = '0';
      r.style.padding = '0';
      r.style.textAlign = 'left';
    }
    return () => {
      b.style.backgroundColor = p.bg;
      b.style.color = p.c;
      if (r) {
        r.style.maxWidth = p.mw;
        r.style.margin = p.m;
        r.style.padding = p.pd;
        r.style.textAlign = p.ta;
      }
    };
  }, []);

  /* ── Responsive ── */
  useEffect(() => {
    const ck = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      if (w < 768) setSidebarExpanded(true);
      if (w >= 768 && w < 1024) setSidebarExpanded(false);
      if (w >= 1024) setSidebarExpanded(true);
    };
    ck();
    window.addEventListener('resize', ck);
    return () => window.removeEventListener('resize', ck);
  }, []);

  /* ── Validation ── */
  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = 'Vui lòng nhập tên sự kiện';
      if (!form.category) e.category = 'Vui lòng chọn thể loại';
      if (form.locationType === 'offline' && !form.venueName.trim())
        e.venueName = 'Vui lòng nhập địa điểm';
      if (!form.description.trim()) e.description = 'Vui lòng nhập mô tả';
    }
    if (s === 2) {
      if (!form.price && form.price !== '0') e.price = 'Vui lòng nhập giá vé';
      if (!form.maxSupply) e.maxSupply = 'Vui lòng nhập số lượng';
      if (!form.saleStartDate) e.saleStartDate = 'Chọn ngày bắt đầu bán';
      if (!form.saleEndDate) e.saleEndDate = 'Chọn ngày kết thúc bán';
      if (!form.eventStartDate) e.eventStartDate = 'Chọn ngày sự kiện';
    }
    setErrors(e);
    if (Object.keys(e).length > 0) toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) {
      setStep((s) => Math.min(s + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const prev = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!window.ethereum) {
      toast.error('Vui lòng cài MetaMask!');
      return;
    }
    if (!CONTRACT_ADDRESS) {
      toast.error('Contract chưa cấu hình .env');
      return;
    }
    if (!form.bankName || !form.bankAccount || !form.bankOwner) {
      toast.error('Vui lòng nhập đầy đủ thông tin thanh toán');
      return;
    }

    try {
      setLoading(true);
      setStatusMsg('Đang kết nối MetaMask...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CREATE_ABI, signer);
      setStatusMsg('Vui lòng xác nhận giao dịch trên MetaMask...');
      const tx = await contract.createEvent(
        form.name,
        ethers.parseEther(form.price || '0'),
        Number(form.maxSupply || 0),
        Number(form.resaleRoyalty)
      );
      setStatusMsg('Đang chờ xác nhận từ blockchain...');
      const receipt = await tx.wait();

      let eventId: string | null = null;
      const iface = new ethers.Interface(CREATE_ABI);
      for (const log of receipt.logs) {
        try {
          const p = iface.parseLog({ topics: log.topics as string[], data: log.data });
          if (p?.name === 'EventCreated') {
            eventId = p.args.eventId.toString();
            break;
          }
        } catch {}
      }
      toast.success(`On-chain thành công! Event #${eventId || 'N/A'}`);

      if (eventId) {
        setStatusMsg('Đang upload dữ liệu lên server...');
        const fd = new FormData();
        if (bannerFile) fd.append('banner', bannerFile);
        if (posterFile) fd.append('poster', posterFile);
        if (logoFile) fd.append('logo', logoFile);
        fd.append('description', form.description);
        fd.append('category', form.category);
        fd.append('orgName', form.orgName);
        fd.append('bankName', form.bankName);
        fd.append('bankAccount', form.bankAccount);
        fd.append('bankOwner', form.bankOwner);
        fd.append('bankBranch', form.bankBranch);
        fd.append('paymentNote', form.paymentNote);
        const tk = localStorage.getItem('token');
        const h: Record<string, string> = {};
        if (tk) h['Authorization'] = `Bearer ${tk}`;
        await fetch(`${API_URL}/api/events/${eventId}`, { method: 'PUT', headers: h, body: fd });
      }
      toast.success('Tạo sự kiện thành công!');
      setTimeout(() => navigate('/organizer-dashboard'), 1200);
    } catch (err: any) {
      toast.error(err?.reason || err?.message || 'Lỗi giao dịch');
      setStatusMsg('');
    } finally {
      setLoading(false);
    }
  };

  const sidebarW = isMobile ? 0 : sidebarExpanded ? 220 : 68;

  return (
    <>
      {/* ── Global animations & overrides ── */}
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes vtx-spin{to{transform:rotate(360deg)}}
      @keyframes vtx-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes vtx-pulse{0%,100%{opacity:1}50%{opacity:.4}}
      @keyframes vtx-tooltip-in{from{opacity:0;transform:translateY(-50%) translateX(-6px)}to{opacity:1;transform:translateY(-50%) translateX(0)}}
      .vtx-toggle-btn:hover{color:#38bdf8!important;background:rgba(56,189,248,.15)!important}
      input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;background:#3b82f6;border-radius:50%;border:2.5px solid #fff;box-shadow:0 0 10px rgba(59,130,246,.3);cursor:pointer;transition:transform .15s}
      input[type="range"]::-webkit-slider-thumb:hover{transform:scale(1.2)}
      input[type="range"]::-moz-range-thumb{width:18px;height:18px;background:#3b82f6;border-radius:50%;border:2.5px solid #fff;cursor:pointer}
      input[type=date]::-webkit-calendar-picker-indicator,input[type=time]::-webkit-calendar-picker-indicator{filter:invert(1) brightness(0.6)}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:99px}
      ::placeholder{color:#334155}
    `}</style>

      <ToastContainer position="top-right" autoClose={3500} theme="dark" />

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.025) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="flex min-h-screen bg-[#070a11] text-slate-100 font-['Inter',sans-serif] relative z-[1]">
        {/* ── Sidebar ── */}
        {!isMobile && (
          <OrganizerSidebar
            expanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded((p) => !p)}
          />
        )}
        {isMobile && (
          <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        )}

        {/* ── Main ── */}
        <main
          className="flex-1 overflow-auto transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] min-w-0"
          style={{ marginLeft: sidebarW }}
        >
          <div className="max-w-[880px] mx-auto px-3.5 md:px-8 py-5 md:py-11 pb-16 md:pb-20">
            {/* Mobile hamburger */}
            {isMobile && (
              <div className="mb-4">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="bg-[#0d1117] border border-white/[0.06] rounded-lg p-[7px] text-slate-400 cursor-pointer flex items-center justify-center hover:bg-white/[0.04] transition-colors"
                >
                  <MenuIcon />
                </button>
              </div>
            )}

            {/* ── Stepper ── */}
            <StepIndicator
              currentStep={step}
              onStepClick={(s) => {
                if (step > s) setStep(s);
              }}
            />

            {/* ── Step Title ── */}
            <div className="mb-5 md:mb-7 animate-[vtx-fade_0.4s_ease]">
              <h1 className="text-[22px] md:text-[28px] font-extrabold text-white tracking-tight">
                {STEPS[step - 1].label}
              </h1>
              <p className="text-[13px] text-slate-600 mt-1.5">
                {step === 1 && 'Nhập thông tin cơ bản về sự kiện của bạn'}
                {step === 2 && 'Cấu hình loại vé, giá, số lượng và thời gian bán'}
                {step === 3 && 'Nhập thông tin thanh toán, kiểm tra và phát hành lên blockchain'}
              </p>
            </div>

            {/* ── Steps ── */}
            {step === 1 && (
              <Step1EventInfo
                form={form}
                errors={errors}
                set={set}
                posterPreview={posterPreview}
                bannerPreview={bannerPreview}
                logoPreview={logoPreview}
                onPoster={(f) => filePrev(f, setPosterFile, setPosterPreview)}
                onBanner={(f) => filePrev(f, setBannerFile, setBannerPreview)}
                onLogo={(f) => filePrev(f, setLogoFile, setLogoPreview)}
              />
            )}
            {step === 2 && <Step2TicketConfig form={form} errors={errors} set={set} />}
            {step === 3 && (
              <Step3PaymentPublish
                form={form}
                errors={errors}
                set={set}
                bannerFile={bannerFile}
                loading={loading}
                statusMsg={statusMsg}
                onSubmit={handleSubmit}
              />
            )}

            {/* ── Navigation ── */}
            <div
              className={`flex items-center mt-5 md:mt-7 gap-3 ${step === 1 ? 'justify-end' : 'justify-between'}`}
            >
              {step > 1 && (
                <button
                  type="button"
                  onClick={prev}
                  className="px-7 py-3 rounded-[10px] bg-transparent border border-white/10 text-slate-500 text-sm font-medium cursor-pointer transition-all duration-200 hover:border-blue-500 hover:text-slate-100"
                >
                  ← Quay lại
                </button>
              )}
              {step < 3 && (
                <button
                  type="button"
                  onClick={next}
                  className="px-8 py-3 rounded-[10px] bg-blue-500 border-none text-white text-sm font-semibold cursor-pointer transition-all duration-200 shadow-[0_4px_16px_rgba(59,130,246,0.25)] hover:bg-blue-600 hover:-translate-y-0.5"
                >
                  Tiếp tục →
                </button>
              )}
            </div>

            {/* Footer */}
            <p className="text-center text-[10px] tracking-[0.18em] uppercase text-slate-800 mt-10">
              Powered by Ethereum · ERC-721 NFT Standard
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
