import axios, { AxiosInstance, AxiosError } from 'axios';

// Configuration de base de l'API
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Création de l'instance Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes
apiClient.interceptors.request.use(
  (config) => {
    // Ici on pourrait ajouter un token d'authentification
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Gestion des erreurs HTTP
      switch (error.response.status) {
        case 401:
          // Redirection vers login si non authentifié
          console.error('Non authentifié');
          break;
        case 403:
          console.error('Accès refusé');
          break;
        case 404:
          console.error('Ressource non trouvée');
          break;
        case 500:
          console.error('Erreur serveur');
          break;
        default:
          console.error('Erreur:', error.response.data);
      }
    } else if (error.request) {
      console.error('Pas de réponse du serveur');
    } else {
      console.error('Erreur de configuration:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Types d'erreur personnalisés
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Helper pour gérer les erreurs
export const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.detail || error.message,
      status: error.response?.status,
      code: error.code
    };
  }
  return {
    message: 'Une erreur inattendue est survenue'
  };
};

// Export des services
export { default as reportService } from './reports.service';
