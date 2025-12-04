import { useState, useEffect, useRef } from 'react';
import { MdSearch, MdFlight, MdClose, MdAccessTime, MdCalendarToday, MdStraighten } from 'react-icons/md';
import { API_ENDPOINTS } from '../config/api';
import '../css/FlightSearch.css';

function FlightSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef(null);

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
        console.log('Respuesta recibida:', data);
        const vuelos = data.data?.vuelos || data.data || [];
        console.log('Vuelos filtrados:', vuelos.length);
        setFilteredFlights(vuelos);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error al buscar vuelos:', error);
    } finally {
      setIsSearching(false);
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

  const getDelayClass = (delay) => {
    if (delay <= 0) return 'delay-green';
    if (delay >= 5 && delay <= 15) return 'delay-yellow';
    if (delay > 15) return 'delay-red';
    return 'delay-green'; // Por defecto
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
                  </div>
                  <div className="flight-item-route">
                    <span className="airport-code">{flight.ORIGIN}</span>
                    <span className="arrow">→</span>
                    <span className="airport-code">{flight.DEST}</span>
                  </div>
                  <div className="flight-item-date">{formatDate(flight.FL_DATE)}</div>
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
      {showModal && selectedFlight && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <MdClose />
            </button>
            
            <h2 className="modal-title">Detalles del Vuelo</h2>
            
            <div className="modal-info-cards">
              <div className="modal-info-card">
                <MdFlight className="info-card-icon" />
                <div className="info-card-content">
                  <span className="info-card-label">Aerolínea</span>
                  <p className="info-card-value">{selectedFlight.AIRLINE}</p>
                </div>
              </div>

              <div className="modal-info-card">
                <MdCalendarToday className="info-card-icon" />
                <div className="info-card-content">
                  <span className="info-card-label">Fecha del Vuelo</span>
                  <p className="info-card-value">{formatDate(selectedFlight.FL_DATE)}</p>
                </div>
              </div>
            </div>

            <div className="modal-route">
              <div className="modal-airport">
                <h4>Origen</h4>
                <p className="airport-code-large">{selectedFlight.ORIGIN}</p>
                <p className="time-large">{formatTime(selectedFlight.DEP_TIME)}</p>
                {selectedFlight.DEP_DELAY !== undefined && selectedFlight.DEP_DELAY !== null && (
                  <span className={`delay-badge ${getDelayClass(selectedFlight.DEP_DELAY)}`}>
                    {selectedFlight.DEP_DELAY <= 0 ? 'A tiempo' : `Retraso: +${selectedFlight.DEP_DELAY} min`}
                  </span>
                )}
              </div>
              
              <div className="modal-arrow">
                <div className="arrow-line"></div>
                <span className="plane-emoji">✈️</span>
              </div>

              <div className="modal-airport">
                <h4>Destino</h4>
                <p className="airport-code-large">{selectedFlight.DEST}</p>
                <p className="time-large">{formatTime(selectedFlight.ARR_TIME)}</p>
                {selectedFlight.ARR_DELAY !== undefined && selectedFlight.ARR_DELAY !== null && (
                  <span className={`delay-badge ${getDelayClass(selectedFlight.ARR_DELAY)}`}>
                    {selectedFlight.ARR_DELAY <= 0 ? 'A tiempo' : `Retraso: +${selectedFlight.ARR_DELAY} min`}
                  </span>
                )}
              </div>
            </div>

            <div className="modal-details-grid">
              <div className="modal-detail">
                <MdAccessTime className="detail-icon" />
                <div>
                  <span className="detail-label">Duración</span>
                  <p className="detail-value">{selectedFlight.AIR_TIME} minutos</p>
                </div>
              </div>

              <div className="modal-detail">
                <MdStraighten className="detail-icon" />
                <div>
                  <span className="detail-label">Distancia</span>
                  <p className="detail-value">{selectedFlight.DISTANCE} km</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightSearch;
