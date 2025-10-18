/**
 * Financial Plan API
 * 
 * API functions for interacting with the ASP.NET backend.
 * Handles all CRUD operations for financial plan data.
 */

import { 
  FinancialPlanApiResponse, 
  ApiResponse, 
  RevenueData, 
  MarketingData, 
  SalaryData, 
  EquipmentData 
} from '../financial-plan/types';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7000/api';
const API_ENDPOINTS = {
  financialPlan: '/financial-plan',
  revenue: '/financial-plan/revenue',
  marketing: '/financial-plan/marketing',
  salary: '/financial-plan/salary',
  equipment: '/financial-plan/equipment'
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: 'Request successful'
    };
  } catch (error) {
    return {
      success: false,
      data: null as T,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Get complete financial plan data
export async function getFinancialPlan(): Promise<ApiResponse<FinancialPlanApiResponse>> {
  return apiRequest<FinancialPlanApiResponse>(API_ENDPOINTS.financialPlan);
}

// Revenue data operations
export async function getRevenueData(): Promise<ApiResponse<RevenueData[]>> {
  return apiRequest<RevenueData[]>(API_ENDPOINTS.revenue);
}

export async function createRevenueData(data: Omit<RevenueData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<RevenueData>> {
  return apiRequest<RevenueData>(API_ENDPOINTS.revenue, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateRevenueData(id: string, data: Partial<RevenueData>): Promise<ApiResponse<RevenueData>> {
  return apiRequest<RevenueData>(`${API_ENDPOINTS.revenue}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteRevenueData(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`${API_ENDPOINTS.revenue}/${id}`, {
    method: 'DELETE'
  });
}

// Marketing data operations
export async function getMarketingData(): Promise<ApiResponse<MarketingData[]>> {
  return apiRequest<MarketingData[]>(API_ENDPOINTS.marketing);
}

export async function createMarketingData(data: Omit<MarketingData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<MarketingData>> {
  return apiRequest<MarketingData>(API_ENDPOINTS.marketing, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateMarketingData(id: string, data: Partial<MarketingData>): Promise<ApiResponse<MarketingData>> {
  return apiRequest<MarketingData>(`${API_ENDPOINTS.marketing}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteMarketingData(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`${API_ENDPOINTS.marketing}/${id}`, {
    method: 'DELETE'
  });
}

// Salary data operations
export async function getSalaryData(): Promise<ApiResponse<SalaryData[]>> {
  return apiRequest<SalaryData[]>(API_ENDPOINTS.salary);
}

export async function createSalaryData(data: Omit<SalaryData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<SalaryData>> {
  return apiRequest<SalaryData>(API_ENDPOINTS.salary, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateSalaryData(id: string, data: Partial<SalaryData>): Promise<ApiResponse<SalaryData>> {
  return apiRequest<SalaryData>(`${API_ENDPOINTS.salary}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteSalaryData(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`${API_ENDPOINTS.salary}/${id}`, {
    method: 'DELETE'
  });
}

// Equipment data operations
export async function getEquipmentData(): Promise<ApiResponse<EquipmentData[]>> {
  return apiRequest<EquipmentData[]>(API_ENDPOINTS.equipment);
}

export async function createEquipmentData(data: Omit<EquipmentData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<EquipmentData>> {
  return apiRequest<EquipmentData>(API_ENDPOINTS.equipment, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateEquipmentData(id: string, data: Partial<EquipmentData>): Promise<ApiResponse<EquipmentData>> {
  return apiRequest<EquipmentData>(`${API_ENDPOINTS.equipment}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteEquipmentData(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`${API_ENDPOINTS.equipment}/${id}`, {
    method: 'DELETE'
  });
}

// Bulk operations
export async function saveAllFinancialData(data: FinancialPlanApiResponse): Promise<ApiResponse<void>> {
  return apiRequest<void>(API_ENDPOINTS.financialPlan, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function exportFinancialData(format: 'csv' | 'excel' | 'pdf' = 'excel'): Promise<ApiResponse<Blob>> {
  return apiRequest<Blob>(`${API_ENDPOINTS.financialPlan}/export?format=${format}`, {
    method: 'GET'
  });
}
