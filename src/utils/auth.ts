
export const getAuthHeader = () => {
  const token = localStorage.getItem('malldre_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Função auxiliar para verificar se o token está presente
export const hasAuthToken = (): boolean => {
  return !!localStorage.getItem('malldre_token');
};
