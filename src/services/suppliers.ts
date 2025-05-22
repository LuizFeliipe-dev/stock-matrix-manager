
const API_BASE_URL = 'https://33kg2j8r-3000.brs.devtunnels.ms';
import { getAuthHeader } from '@/utils/auth';

export interface SupplierContact {
  id?: string;
  name: string;
  role?: string;
  email: string;
  phone: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  active: boolean;
  contacts: SupplierContact[];
}

export const supplierService = {
  // Get all suppliers
  getAll: async (): Promise<Supplier[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter fornecedores');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  // Get supplier by ID
  getById: async (id: string): Promise<Supplier> => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/${id}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter fornecedor');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching supplier ${id}:`, error);
      throw error;
    }
  },

  // Create new supplier
  create: async (supplierData: Omit<Supplier, 'id'>): Promise<Supplier> => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar fornecedor');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  // Update supplier
  update: async (id: string, supplierData: Partial<Supplier>): Promise<Supplier> => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar fornecedor');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating supplier ${id}:`, error);
      throw error;
    }
  },
};
