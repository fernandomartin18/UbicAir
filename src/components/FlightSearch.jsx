import { useState, useEffect, useRef } from 'react';
import { MdSearch, MdFlight, MdClose, MdStar } from 'react-icons/md';
import { API_ENDPOINTS } from '../config/api';
import FlightDetailsModal from './FlightDetailsModal';
import '../css/FlightSearch.css';

function FlightSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const debounceTimer = useRef(null);

  // Cargar favoritos al montar el componente
  useEffect(() => {
    loadFavorites();
  }, []);

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

  const loadFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!userId || !token) return;

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
    }
  };

  const isFavoriteFlight = (flight) => {
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

  const toggleFavorite = async (e, flight) => {
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!userId || !token) {
        console.error('No hay sesión activa');
        return;
      }

      if (isFavoriteFlight(flight)) {
        // Eliminar de favoritos
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
          setFavorites(favorites.filter(fav => 
            !(fav.ORIGIN === flight.ORIGIN && 
              fav.DEST === flight.DEST && 
              fav.AIRLINE === flight.AIRLINE &&
              fav.FL_DATE === flight.FL_DATE)
          ));
        }
      } else {
        // Agregar a favoritos
        const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}/favorites`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ flight })
        });

        if (response.ok) {
          setFavorites([...favorites, flight]);
        }
      }
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
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
                      className={`star-button ${isFavoriteFlight(flight) ? 'active' : ''}`}
                      onClick={(e) => toggleFavorite(e, flight)}
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
        isFavorite={selectedFlight ? isFavoriteFlight(selectedFlight) : false}
        onToggleFavorite={selectedFlight ? () => toggleFavorite(new Event('click'), selectedFlight) : null}
      />
    </div>
  );
}

export default FlightSearch;
