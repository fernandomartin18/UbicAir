import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import { MdSearch, MdClose } from 'react-icons/md';
import 'leaflet/dist/leaflet.css';
import '../css/FlightRadarLive.css';

// Iconos personalizados para los aviones con tamaño adaptativo
const createPlaneIcon = (rotation = 0, color = '#667eea', zoomLevel = 6) => {
  let size = 36;
  if (zoomLevel <= 4) size = 28;
  else if (zoomLevel >= 8) size = 48;
  
  const anchor = size / 2;
  
  return L.divIcon({
    html: `
      <div style="width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${rotation}deg); transform-origin: center;">
          <path d="M21,16v-2l-8-5V3.5C13,2.67,12.33,2,11.5,2S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5L21,16z"/>
        </svg>
      </div>
    `,
    className: 'plane-icon',
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
    popupAnchor: [0, -anchor]
  });
};

// Componente para ajustar vista del mapa solo en la carga inicial y escuchar zoom
const MapUpdater = ({ flights, onZoomChange }) => {
  const map = useMap();
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    // Solo ajustar el mapa la primera vez que hay vuelos
    if (flights && flights.length > 0 && !hasInitialized.current) {
      const bounds = flights.map(f => [f.latitude, f.longitude]);
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
        hasInitialized.current = true;
      }
    }
  }, [flights, map]);
  
  useEffect(() => {
    // Escuchar cambios de zoom
    const handleZoom = () => {
      onZoomChange(map.getZoom());
    };
    
    map.on('zoomend', handleZoom);
    
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map, onZoomChange]);
  
  return null;
};

/**
 * Componente de visualización en tiempo real de vuelos IoT
 * Muestra los vuelos activos del simulador en un mapa interactivo
 */
const FlightRadarLive = () => {
  const [activeFlights, setActiveFlights] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [mapZoom, setMapZoom] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const intervalRef = useRef(null);

  // Configuración de la API
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  /**
   * Obtener token de autenticación
   */
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  /**
   * Obtener vuelos activos del simulador IoT
   */
  const fetchActiveFlights = async () => {
    try {
      const response = await axios.get(`${API_URL}/telemetry/active`);

      if (response.data.success) {
        setActiveFlights(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error al obtener vuelos activos:', err);
      setError('Error al cargar datos de vuelos');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener estadísticas de telemetría
   */
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/telemetry/stats`);

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
    }
  };

  /**
   * Iniciar actualización automática cada 3 segundos
   */
  useEffect(() => {
    fetchActiveFlights();
    fetchStats();

    // Actualizar cada 3 segundos
    intervalRef.current = setInterval(() => {
      fetchActiveFlights();
    }, 3000);

    // Actualizar estadísticas cada 10 segundos
    const statsInterval = setInterval(() => {
      fetchStats();
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearInterval(statsInterval);
    };
  }, []);

  /**
   * Calcular color del avión según progreso
   */
  const getFlightColor = (progress) => {
    if (progress < 30) return '#667eea';
    if (progress < 70) return '#3351d5ff';
    if (progress <= 100) return '#0724a3ff'; 
    return '#667eea';
  };

  /**
   * Calcular rotación del icono según dirección del vuelo
   */
  const calculateRotation = (flight) => {
    // Obtener coordenadas de origen y destino desde la configuración
    const airports = {
      'MAD': { lat: 40.4719, lng: -3.5626 },
      'BCN': { lat: 41.2971, lng: 2.0785 },
      'LHR': { lat: 51.4700, lng: -0.4543 },
      'CDG': { lat: 49.0097, lng: 2.5479 },
      'JFK': { lat: 40.6413, lng: -73.7781 },
      'FRA': { lat: 50.0379, lng: 8.5622 },
      'AMS': { lat: 52.3105, lng: 4.7683 },
      'FCO': { lat: 41.8003, lng: 12.2389 },
      'DXB': { lat: 25.2532, lng: 55.3657 },
      'LAX': { lat: 33.9416, lng: -118.4085 }
    };

    const dest = airports[flight.destination];
    if (!dest) return 0;

    // Calcular la diferencia en coordenadas
    const dLat = dest.lat - flight.latitude;
    const dLng = dest.lng - flight.longitude;
    let angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
    angle = (angle + 360) % 360;
    
    return angle;
  };

  /**
   * Formatear tiempo transcurrido
   */
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES');
  };

  /**
   * Filtrar vuelos por término de búsqueda
   */
  const filteredFlights = useMemo(() => {
    if (!searchTerm.trim()) {
      return activeFlights;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return activeFlights.filter(flight => 
      flight.flightId.toLowerCase().includes(term) ||
      flight.origin.toLowerCase().includes(term) ||
      flight.destination.toLowerCase().includes(term)
    );
  }, [activeFlights, searchTerm]);

  /**
   * Ordenar vuelos por progreso (memorizado para evitar re-renders)
   */
  const sortedFlights = useMemo(() => {
    return [...filteredFlights].sort((a, b) => b.progress - a.progress);
  }, [filteredFlights]);

  if (loading) {
    return (
      <div className="flight-radar-live">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando datos de vuelos en tiempo real...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flight-radar-live">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchActiveFlights} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flight-radar-live">
      <div className="radar-header">
        <h1>Radar de Vuelos IoT</h1>
        <div className="radar-stats">
          {stats && (
            <>
              <div className="stat-item">
                <span className="stat-label">Vuelos Activos:</span>
                <span className="stat-value">{stats.vuelosActivos}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mapa Interactivo */}
      <div className="map-container">
        {activeFlights.length === 0 ? (
          <div className="no-flights-map">
            <p>No hay vuelos activos en este momento</p>
            <p className="hint">Inicia el simulador IoT para ver vuelos en tiempo real</p>
          </div>
        ) : (
          <MapContainer 
            center={[45, 10]} 
            zoom={4} 
            style={{ height: '600px', width: '100%', borderRadius: '12px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapUpdater flights={activeFlights} onZoomChange={setMapZoom} />

            {activeFlights.map((flight) => {
              const rotation = calculateRotation(flight);
              const color = getFlightColor(flight.progress);

              return (
                <div key={flight._id}>
                  {/* Marcador del avión */}
                  <Marker 
                    position={[flight.latitude, flight.longitude]}
                    icon={createPlaneIcon(rotation, color, mapZoom)}
                    eventHandlers={{
                      click: () => setSelectedFlight(flight)
                    }}
                  >
                    <Popup>
                      <div className="flight-popup">
                        <h3>✈️ {flight.flightId}</h3>
                        <p><strong>{flight.origin} → {flight.destination}</strong></p>
                        <hr />
                        <p>📍 Posición: {flight.latitude.toFixed(4)}°, {flight.longitude.toFixed(4)}°</p>
                        <p>📏 Altitud: {flight.altitude.toLocaleString()} ft</p>
                        <p>⚡ Velocidad: {flight.speed.toLocaleString()} km/h</p>
                        <p>⛽ Combustible: {flight.fuel.toLocaleString()} L</p>
                        <p>📊 Progreso: {flight.progress}%</p>
                        <div className="progress-bar-mini">
                          <div 
                            className="progress-fill-mini"
                            style={{ width: `${flight.progress}%`, backgroundColor: color }}
                          ></div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </div>
              );
            })}
          </MapContainer>
        )}
      </div>

      {/* Panel lateral con detalles de vuelos */}
      <div className="flights-container">
        {activeFlights.length > 0 && (
          <>
            <h2 className="flights-section-title">Tarjetas de información de vuelos</h2>
            
            {/* Buscador de vuelos */}
            <div className="flight-radar-search">
              <div className="search-box">
                <MdSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar por origen, destino o número de vuelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="clear-button" 
                    onClick={() => setSearchTerm('')}
                  >
                    <MdClose />
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="search-results-count">
                  {sortedFlights.length} vuelo{sortedFlights.length !== 1 ? 's' : ''} encontrado{sortedFlights.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            <div className="flights-grid">
            {sortedFlights.map((flight) => (
              <div 
                key={flight._id} 
                className="flight-card"
                style={{ borderLeftColor: getFlightColor(flight.progress) }}
              >
                <div className="flight-header">
                  <h3 className="flight-id">✈️ {flight.flightId}</h3>
                  <span className="flight-time">{formatTimestamp(flight.timestamp)}</span>
                </div>

                <div className="flight-route">
                  <span className="airport origin">{flight.origin}</span>
                  <span className="route-arrow">→</span>
                  <span className="airport destination">{flight.destination}</span>
                </div>

                <div className="flight-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${flight.progress}%`,
                        backgroundColor: getFlightColor(flight.progress)
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">{flight.progress}%</span>
                </div>

                <div className="flight-details">
                  <div className="detail-row">
                    <span className="detail-label">📍 Posición:</span>
                    <span className="detail-value">
                      {flight.latitude.toFixed(4)}°, {flight.longitude.toFixed(4)}°
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📏 Altitud:</span>
                    <span className="detail-value">{flight.altitude.toLocaleString()} ft</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">⚡ Velocidad:</span>
                    <span className="detail-value">{flight.speed.toLocaleString()} km/h</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">⛽ Combustible:</span>
                    <span className="detail-value">{flight.fuel.toLocaleString()} L</span>
                  </div>
                </div>

                <div className="flight-status">
                  {flight.progress < 10 && (
                    <span className="status-badge status-takeoff">🛫 Despegue</span>
                  )}
                  {flight.progress >= 10 && flight.progress < 90 && (
                    <span className="status-badge status-cruise">✈️ Crucero</span>
                  )}
                  {flight.progress >= 90 && (
                    <span className="status-badge status-landing">🛬 Aproximación</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>

      <div className="radar-footer">
        <p className="live-indicator">
          <span className="pulse"></span>
          Actualización en tiempo real (cada 3 segundos)
        </p>
      </div>
    </div>
  );
};

export default FlightRadarLive;
