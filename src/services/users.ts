
import { UserData } from '@/types/user';

const API_BASE_URL = 'https://33kg2j8r-3000.brs.devtunnels.ms';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('malldre_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const userService = {
  // Get all users
  getAll: async (): Promise<UserData[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao obter usuários');
        } else {
          throw new Error(`Falha ao obter usuários: ${response.status}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return []; // Retorna uma lista vazia se a resposta não for JSON
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getById: async (id: string): Promise<UserData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao obter usuário');
        } else {
          throw new Error(`Falha ao obter usuário: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // Create new user
  create: async (userData: Partial<UserData>): Promise<UserData> => {
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
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao criar usuário');
        } else {
          throw new Error(`Falha ao criar usuário: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  update: async (id: string, userData: Partial<UserData>): Promise<UserData> => {
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
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao atualizar usuário');
        } else {
          throw new Error(`Falha ao atualizar usuário: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
};
