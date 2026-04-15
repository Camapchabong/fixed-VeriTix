export const UserRole = {
  USER: 'user',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface IUser {
  _id: string;
  walletAddress: string;
  name?: string;
  role: UserRole;
}
