/**
 * Financial Plan Types
 * 
 * Defines all TypeScript interfaces and types for the financial plan module.
 * This ensures type safety across components, hooks, and API functions.
 */

// Base financial data structure
export interface FinancialData {
  id: string;
  category: string;
  description: string;
  monthlyData: MonthlyData[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

// Monthly data structure
export interface MonthlyData {
  month: number;
  year: number;
  value: number;
  isEditable: boolean;
}

// Tab-specific data types
export interface RevenueData extends FinancialData {
  revenueStreams: string[];
  incomePerModel: number;
  userCount: number;
}

export interface MarketingData extends FinancialData {
  channels: string[];
  budget: number;
  targetAudience: string;
}

export interface SalaryData extends FinancialData {
  jobTitle: string;
  baseSalary: number;
  benefits: number;
  bonus: number;
}

export interface EquipmentData extends FinancialData {
  equipmentType: string;
  quantity: number;
  unitCost: number;
  maintenanceCost: number;
}

// Tab configuration
export interface TabConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  component: React.ComponentType<any>;
}

// Financial plan state
export interface FinancialPlanState {
  activeTab: string;
  isLoading: boolean;
  error: string | null;
  data: {
    revenue: RevenueData[];
    marketing: MarketingData[];
    salary: SalaryData[];
    equipment: EquipmentData[];
  };
}

// Financial plan actions
export interface FinancialPlanActions {
  setActiveTab: (tabId: string) => void;
  updateData: (tabId: string, data: FinancialData[]) => void;
  addRow: (tabId: string, data: Partial<FinancialData>) => void;
  deleteRow: (tabId: string, id: string) => void;
  refreshData: () => Promise<void>;
  saveData: () => Promise<void>;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface FinancialPlanApiResponse {
  revenue: RevenueData[];
  marketing: MarketingData[];
  salary: SalaryData[];
  equipment: EquipmentData[];
}

// Cell editor types
export interface CellEditorProps {
  value: any;
  onChange: (value: any) => void;
  isEditable: boolean;
  type: 'text' | 'number' | 'currency' | 'percentage';
}

// Table column configuration
export interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'percentage' | 'date';
  width?: number;
  isEditable?: boolean;
  isRequired?: boolean;
}

// Summary data types
export interface SummaryData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  growthRate: number;
  projections: {
    month: number;
    revenue: number;
    expenses: number;
    netIncome: number;
  }[];
}

// Hook return types
export interface UseFinancialPlanReturn {
  state: FinancialPlanState;
  actions: FinancialPlanActions;
}

export interface UseTabDataReturn<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  updateData: (data: T[]) => void;
  addRow: (data: Partial<T>) => void;
  deleteRow: (id: string) => void;
  refreshData: () => Promise<void>;
}
