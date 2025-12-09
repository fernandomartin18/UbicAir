import { MdClose, MdAccessTime, MdStraighten, MdFlight, MdCalendarToday, MdStar } from 'react-icons/md';
import { LuStarOff } from 'react-icons/lu';
import '../css/FlightSearch.css';

function FlightDetailsModal({ flight, isOpen, onClose, isFavorite = false, onToggleFavorite }) {
  if (!isOpen || !flight) return null;

  const getDelayClass = (delay) => {
    if (delay <= 0) return 'delay-green';
    if (delay >= 5 && delay <= 15) return 'delay-yellow';
    if (delay > 15) return 'delay-red';
    return 'delay-green';
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {onToggleFavorite && isFavorite && (
            <button 
              className="modal-favorite-btn remove"
              onClick={onToggleFavorite}
              title="Eliminar de favoritos"
            >
              <LuStarOff />
            </button>
          )}
          {onToggleFavorite && !isFavorite && (
            <button 
              className="modal-favorite-btn add"
              onClick={onToggleFavorite}
              title="Agregar a favoritos"
            >
              <MdStar />
            </button>
          )}
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>
        
        <h2 className="modal-title">Detalles del Vuelo</h2>
        
        <div className="modal-info-cards">
          <div className="modal-info-card">
            <MdFlight className="info-card-icon" />
            <div className="info-card-content">
              <span className="info-card-label">Aerolínea</span>
              <p className="info-card-value">{flight.AIRLINE}</p>
            </div>
          </div>

          <div className="modal-info-card">
            <MdCalendarToday className="info-card-icon" />
            <div className="info-card-content">
              <span className="info-card-label">Fecha del Vuelo</span>
              <p className="info-card-value">{formatDate(flight.FL_DATE)}</p>
            </div>
          </div>
        </div>

        <div className="modal-route">
          <div className="modal-airport">
            <h4>Origen</h4>
            <p className="airport-code-large">{flight.ORIGIN}</p>
            <p className="time-large">{formatTime(flight.DEP_TIME)}</p>
            {flight.DEP_DELAY !== undefined && flight.DEP_DELAY !== null && (
              <span className={`delay-badge ${getDelayClass(flight.DEP_DELAY)}`}>
                {flight.DEP_DELAY <= 0 ? 'A tiempo' : `Retraso: +${flight.DEP_DELAY} min`}
              </span>
            )}
          </div>
          
          <div className="modal-arrow">
            <div className="arrow-line"></div>
            <span className="plane-emoji">✈️</span>
          </div>

          <div className="modal-airport">
            <h4>Destino</h4>
            <p className="airport-code-large">{flight.DEST}</p>
            <p className="time-large">{formatTime(flight.ARR_TIME)}</p>
            {flight.ARR_DELAY !== undefined && flight.ARR_DELAY !== null && (
              <span className={`delay-badge ${getDelayClass(flight.ARR_DELAY)}`}>
                {flight.ARR_DELAY <= 0 ? 'A tiempo' : `Retraso: +${flight.ARR_DELAY} min`}
              </span>
            )}
          </div>
        </div>

        <div className="modal-details-grid">
          <div className="modal-detail">
            <MdAccessTime className="detail-icon" />
            <div>
              <span className="detail-label">Duración</span>
              <p className="detail-value">{flight.AIR_TIME} minutos</p>
            </div>
          </div>

          <div className="modal-detail">
            <MdStraighten className="detail-icon" />
            <div>
              <span className="detail-label">Distancia</span>
              <p className="detail-value">{flight.DISTANCE} km</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightDetailsModal;
