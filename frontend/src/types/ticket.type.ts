export const TicketStatus = {
  SOLD: 'sold',
  FOR_SALE: 'for_sale',
  USED: 'used',
} as const;

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export interface ITicket {
  _id: string;
  tokenId: string;
  eventId: string;
  ownerAddress: string;
  price: number;
  status: TicketStatus;
  purchasedAt: string;
}
