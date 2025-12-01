// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Usuarios
  REGISTER: `${API_URL}/api/users/register`,
  LOGIN: `${API_URL}/api/users/login`,
  USERS: `${API_URL}/api/users`,
  
  // Vuelos
  VUELOS: `${API_URL}/api/vuelos`,
  ESTADISTICAS: `${API_URL}/api/vuelos/estadisticas`,
  ANALISIS_RETRASOS: `${API_URL}/api/vuelos/analisis-retrasos`,
  COMPARACION_AEROLINEAS: `${API_URL}/api/vuelos/comparacion-aerolineas`,
};

export default API_URL;
