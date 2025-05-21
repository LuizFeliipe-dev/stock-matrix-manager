
import { User } from '../lib/auth';

const API_BASE_URL = 'https://33kg2j8r-3000.brs.devtunnels.ms';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('malldre_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const userService = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter usuários');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter usuário');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // Create new user
  create: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar usuário');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar usuário');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
};
