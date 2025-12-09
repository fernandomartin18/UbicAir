import { useState } from 'react';
import { MdStar, MdFlight } from 'react-icons/md';
import { LuStarOff } from 'react-icons/lu';
import { useFavorites } from '../context/FavoritesContext';
import FlightDetailsModal from './FlightDetailsModal';
import '../css/FlightSearch.css';

function FavoriteFlights() {
  const { favorites, loading, removeFavorite } = useFavorites();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRemoveFavorite = async (e, flight) => {
    e.stopPropagation();
    const success = await removeFavorite(flight);
    if (success && showModal) {
      closeModal();
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

  // No mostrar nada mientras carga
  if (loading) {
    return null;
  }

  // No mostrar la sección si no hay favoritos
  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="flight-search-container favorites-container">
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
              onClick={(e) => handleRemoveFavorite(e, flight)}
              title="Eliminar de favoritos"
            >
              <LuStarOff />
            </button>
          </div>
        ))}
      </div>

      <FlightDetailsModal
        flight={selectedFlight}
        isOpen={showModal}
        onClose={closeModal}
        isFavorite={true}
        onToggleFavorite={(e) => handleRemoveFavorite(e, selectedFlight)}
      />
    </div>
  );
}

export default FavoriteFlights;
