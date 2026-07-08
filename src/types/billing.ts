export type BillStatus = "in_asteptare" | "platita" | "restanta";

export type SubscriptionStatus = "activ" | "inactiv";

export type SubscriptionFrequency = "lunar" | "anual";

export type ReminderConfig = {
  enabled: boolean;
  daysBefore: number;
};

export interface Bill {
  id: string;
  provider: string;
  category: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: BillStatus;
  paymentDate?: string;
  paymentAccountId?: string;
  reminder: ReminderConfig;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  name: string;
  category: string;
  amount: number;
  frequency: SubscriptionFrequency;
  renewalDate: string;
  expirationDate?: string;
  status: SubscriptionStatus;
  automaticPayment: boolean;
  paymentAccountId?: string;
  reminder: ReminderConfig;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}