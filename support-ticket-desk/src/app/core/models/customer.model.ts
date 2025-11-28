export type SlaLevel = 'Gold' | 'Silver' | 'Bronze';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  slaLevel: SlaLevel;
  isActive: boolean;
}

export interface CustomerFormData {
  name: string;
  email: string;
  company: string;
  slaLevel: SlaLevel;
  isActive: boolean;
}

