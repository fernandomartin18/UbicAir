import { useState, useEffect } from 'react';
import { MdStar, MdFlight, MdClose } from 'react-icons/md';
import { API_ENDPOINTS } from '../config/api';
import FlightDetailsModal from './FlightDetailsModal';
import '../css/FlightSearch.css';

function FavoriteFlights() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchFavorites();
  }, [refreshKey]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      // Si no hay usuario logueado, no cargar favoritos
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
      console.error('Error al obtener favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (e, flight) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

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
        closeModal();
        setFavorites(favorites.filter(fav => 
          !(fav.ORIGIN === flight.ORIGIN && 
            fav.DEST === flight.DEST && 
            fav.AIRLINE === flight.AIRLINE &&
            new Date(fav.FL_DATE).toISOString().split('T')[0] === new Date(flight.FL_DATE).toISOString().split('T')[0])
        ));
      }
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  const openModal = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFlight(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flight-search-container favorites-container">
        <div className="favorites-header">
          <h2 className="favorites-title">
            <MdStar className="favorites-icon" /> Mis Vuelos Favoritos
          </h2>
          <span className="favorites-count">0 vuelos</span>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="loading-text">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  // Siempre mostrar la sección, incluso si está vacía
  return (
    <div className="flight-search-container favorites-container">
      <div className="favorites-header">
        <h2 className="favorites-title">
          <MdStar className="favorites-icon" /> Vuelos Favoritos
        </h2>
        <span className="favorites-count">
          {favorites.length} vuelo{favorites.length !== 1 ? 's' : ''}
        </span>
      </div>

      {favorites.length > 0 ? (
        <div className="flights-list favorites-list">
          {favorites.map((flight, index) => (
            <div key={index} className="favorite-flight-item">
              <div className="favorite-flight-info" onClick={() => openModal(flight)}>
                <div className="favorite-flight-route">
                  <span className="airport-code">{flight.ORIGIN}</span>
                  <span className="arrow">→</span>
                  <span className="airport-code">{flight.DEST}</span>
                </div>
                <div className="favorite-flight-details">
                  <span className="airline-name">{flight.AIRLINE}</span>
                  <span className="flight-date">{formatDate(flight.FL_DATE)}</span>
                </div>
              </div>
              <button 
                className="remove-favorite-btn"
                onClick={(e) => removeFavorite(e, flight)}
                title="Eliminar de favoritos"
              >
                <MdClose />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <MdFlight className="no-results-icon" />
          <p>No tienes vuelos marcados como favoritos</p>
        </div>
      )}

      <FlightDetailsModal
        flight={selectedFlight}
        isOpen={showModal}
        onClose={closeModal}
        isFavorite={true}
        onToggleFavorite={(e) => removeFavorite(e, selectedFlight)}
      />
    </div>
  );
}

export default FavoriteFlights;
