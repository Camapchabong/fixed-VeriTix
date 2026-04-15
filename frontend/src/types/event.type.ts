export interface IEvent {
  _id: string;
  onChainId: number;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  startDate: string;
  price: number;
  maxSupply: number;
  soldCount: number;
  organizerWallet: string;
}
