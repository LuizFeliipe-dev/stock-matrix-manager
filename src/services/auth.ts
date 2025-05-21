
const API_BASE_URL = 'https://33kg2j8r-3000.brs.devtunnels.ms';

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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha na autenticação');
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem('malldre_token');
    localStorage.removeItem('malldre_user');
  },
};
