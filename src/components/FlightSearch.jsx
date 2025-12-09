import { useState, useEffect, useRef } from 'react';
import { MdSearch, MdFlight, MdClose, MdStar } from 'react-icons/md';
import { API_ENDPOINTS } from '../config/api';
import { useFavorites } from '../context/FavoritesContext';
import FlightDetailsModal from './FlightDetailsModal';
import '../css/FlightSearch.css';

function FlightSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites();
  const debounceTimer = useRef(null);

  // Buscar mientras el usuario escribe
  useEffect(() => {
    // Buscar automáticamente mientras el usuario escribe
    if (searchTerm.trim().length >= 2) {
      // Cancelar el timer anterior
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      setIsSearching(true);

      // Esperar 500ms después de que el usuario deje de escribir
      debounceTimer.current = setTimeout(() => {
        searchFlights(searchTerm);
      }, 500);
    } else {
      setFilteredFlights([]);
      setShowResults(false);
      setIsSearching(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  const searchFlights = async (term) => {
    try {
      const token = localStorage.getItem('token');
      
      // Usar el parámetro search que busca en origen O destino
      const url = `${API_ENDPOINTS.VUELOS}?search=${encodeURIComponent(term)}`;
      console.log('Buscando con URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const vuelos = data.data?.vuelos || data.data || [];
        setFilteredFlights(vuelos);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error al buscar vuelos:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleFavorite = async (e, flight) => {
    e.stopPropagation();
    
    if (isFavorite(flight)) {
      await removeFavorite(flight, true); // true = skip confirmation for quick toggle
    } else {
      await addFavorite(flight);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredFlights([]);
    setShowResults(false);
    setIsSearching(false);
  };

  const openModal = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFlight(null);
  };

  return (
    <div className="flight-search-container">
      <div className="search-box">
        <MdSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por código de aeropuerto (ej: MAD, JFK, BCN)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="spinner-small" style={{ opacity: isSearching ? 1 : 0, visibility: isSearching ? 'visible' : 'hidden' }}></div>
        <button 
          className="clear-button" 
          onClick={clearSearch}
          style={{ opacity: searchTerm ? 1 : 0, visibility: searchTerm ? 'visible' : 'hidden', pointerEvents: searchTerm ? 'auto' : 'none' }}
        >
          <MdClose />
        </button>
      </div>

      {showResults && (
        <div className="search-results">
          <div className="results-header">
            <h3>Resultados</h3>
            <span className="results-count">
              {filteredFlights.length} vuelo{filteredFlights.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredFlights.length > 0 ? (
            <div className="flights-list">
              {filteredFlights.map((flight, index) => (
                <div key={index} className="flight-item" onClick={() => openModal(flight)}>
                  <div className="flight-item-header">
                    <MdFlight className="flight-icon" />
                    <span className="airline-name">{flight.AIRLINE}</span>
                    <button 
                      className={`star-button ${isFavorite(flight) ? 'active' : ''}`}
                      onClick={(e) => handleToggleFavorite(e, flight)}
                    >
                      <MdStar />
                    </button>
                  </div>
                  <div className="flight-item-route">
                    <span className="airport-code">{flight.ORIGIN}</span>
                    <span className="arrow">→</span>
                    <span className="airport-code">{flight.DEST}</span>
                  </div>
                  <div className="flight-item-date">{new Date(flight.FL_DATE).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <MdFlight className="no-results-icon" />
              <p>No se encontraron vuelos</p>
            </div>
          )}
        </div>
      )}

      {/* Modal con información detallada */}
      <FlightDetailsModal
        flight={selectedFlight}
        isOpen={showModal}
        onClose={closeModal}
        isFavorite={selectedFlight ? isFavorite(selectedFlight) : false}
        onToggleFavorite={selectedFlight ? (e) => handleToggleFavorite(e, selectedFlight) : null}
      />
    </div>
  );
}

export default FlightSearch;
