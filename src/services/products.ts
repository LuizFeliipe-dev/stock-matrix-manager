
const API_BASE_URL = 'https://33kg2j8r-3000.brs.devtunnels.ms';
import { getAuthHeader } from '@/utils/auth';
import { Item } from '@/types/item';

export const productService = {
  // Get all products
  getAll: async (): Promise<Item[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter produtos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getById: async (id: string | number): Promise<Item> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter produto');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Create new product
  create: async (productData: Omit<Item, 'id'>): Promise<Item> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar produto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  update: async (id: string | number, productData: Partial<Item>): Promise<Item> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar produto');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Toggle product status (active/inactive)
  toggleStatus: async (id: number, active: boolean): Promise<Item> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar status do produto');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error toggling product ${id} status:`, error);
      throw error;
    }
  },
};
