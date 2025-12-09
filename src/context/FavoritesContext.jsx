import { createContext, useState, useContext, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!userId || !token) {
        setFavorites([]);
        return;
      }

      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.data?.favorites || []);
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (flight) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!userId || !token) return false;

      const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}/favorites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          flight: {
            ORIGIN: flight.ORIGIN,
            DEST: flight.DEST,
            AIRLINE: flight.AIRLINE,
            FL_DATE: flight.FL_DATE,
            DEP_TIME: flight.DEP_TIME,
            ARR_TIME: flight.ARR_TIME,
            AIR_TIME: flight.AIR_TIME,
            DISTANCE: flight.DISTANCE,
            DEP_DELAY: flight.DEP_DELAY,
            ARR_DELAY: flight.ARR_DELAY
          }
        })
      });

      if (response.ok) {
        await loadFavorites(); // Recargar favoritos
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al agregar favorito:', error);
      return false;
    }
  };

  const removeFavorite = async (flight, skipConfirmation = false) => {
    if (!skipConfirmation) {
      const confirmDelete = window.confirm(
        `¿Estás seguro de que quieres eliminar este vuelo de tus favoritos?\n\n${flight.ORIGIN} → ${flight.DEST} (${flight.AIRLINE})`
      );
      
      if (!confirmDelete) {
        return false;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!userId || !token) return false;

      const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}/favorites`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          flight: {
            ORIGIN: flight.ORIGIN,
            DEST: flight.DEST,
            AIRLINE: flight.AIRLINE,
            FL_DATE: flight.FL_DATE,
            DEP_TIME: flight.DEP_TIME,
            ARR_TIME: flight.ARR_TIME,
            AIR_TIME: flight.AIR_TIME,
            DISTANCE: flight.DISTANCE,
            DEP_DELAY: flight.DEP_DELAY,
            ARR_DELAY: flight.ARR_DELAY
          }
        })
      });

      if (response.ok) {
        await loadFavorites(); // Recargar favoritos
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      return false;
    }
  };

  const isFavorite = (flight) => {
    if (!flight || !Array.isArray(favorites)) return false;
    
    return favorites.some(fav => {
      const favDate = new Date(fav.FL_DATE).toISOString().split('T')[0];
      const flightDate = new Date(flight.FL_DATE).toISOString().split('T')[0];
      
      return fav.ORIGIN === flight.ORIGIN && 
             fav.DEST === flight.DEST && 
             fav.AIRLINE === flight.AIRLINE &&
             favDate === flightDate;
    });
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      loading,
      addFavorite,
      removeFavorite,
      isFavorite,
      loadFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }
  return context;
}
