
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

      // Log the status to help debug
      console.log('Login response status:', response.status);

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
        console.error('Resposta não é do tipo JSON');
        throw new Error('Resposta inválida do servidor');
      }

      // Log the raw response for debugging
      const rawText = await response.text();
      console.log('Raw response:', rawText);
      
      // Attempt to parse the JSON after logging the raw text
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Erro ao analisar resposta do servidor');
      }

      // Verifica se os dados necessários existem na resposta
      if (!data.token || !data.user) {
        console.error('Dados incompletos:', data);
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
