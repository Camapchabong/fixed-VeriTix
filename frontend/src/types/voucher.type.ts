export type DiscountType = 'PERCENTAGE' | 'FIXED';
export type VoucherStatus = 'ACTIVE' | 'EXPIRED' | 'DISABLED';

export interface IVoucher {
  _id: string;
  eventId: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxUsage: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: VoucherStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IVoucherHistory {
  _id: string;
  voucherId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  changes: Record<string, { old: unknown; new: unknown }>;
  updatedBy: string;
  updatedAt: string;
}

export interface VoucherFormData {
  code: string;
  discountType: DiscountType;
  discountValue: number | string;
  maxUsage: number | string;
  startDate: string;
  endDate: string;
}
