import type { Timestamp } from "firebase/firestore";

export type EntryType = "expense" | "income";

export interface Category {
  id: string;
  name: string;
  type: EntryType;
  icon: string;
  color: string;
  createdAt?: Timestamp;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  createdAt?: Timestamp;
}

export interface Transaction {
  id: string;
  type: EntryType;
  amount: number;
  categoryId: string;
  accountId: string;
  description: string;
  date: string;
  notes?: string;
  createdAt?: Timestamp;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  createdAt?: Timestamp;
}