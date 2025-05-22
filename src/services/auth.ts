
const API_BASE_URL = 'https://33kg2j8r-3000.brs.devtunnels.ms';

import { User } from '../types/auth';

interface LoginResponse {
  user: User;
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Verifica se a resposta contém dados JSON antes de tentar analisá-la
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha na autenticação');
        } else {
          throw new Error(`Falha na autenticação: ${response.status}`);
        }
      }

      // Verifica se a resposta contém dados JSON antes de tentar analisá-la
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta inválida do servidor');
      }

      const data = await response.json();

      // Verifica se os dados necessários existem na resposta
      if (!data.token || !data.user) {
        throw new Error('Resposta incompleta do servidor');
      }

      // Salvar token para uso em futuras requisições
      localStorage.setItem('malldre_token', data.token);
      localStorage.setItem('malldre_user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem('malldre_token');
    localStorage.removeItem('malldre_user');
  },

  // Método para obter o cabeçalho de autorização
  getAuthHeader: (): Record<string, string> => {
    const token = localStorage.getItem('malldre_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },
};
