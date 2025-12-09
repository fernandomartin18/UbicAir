import { useState, useEffect, createContext } from 'react'
import { MdDashboard, MdAccessTime, MdFlight, MdMap, MdCalendarToday, MdStar, MdRadar } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import '../css/home.css'
import Profile from '../components/profile'
import Navbar from '../components/Navbar'
import FlightSearch from '../components/FlightSearch'
import FavoriteFlights from '../components/FavoriteFlights'
import FlightStats from '../components/charts/FlightStats'
import DelayAnalysis from '../components/charts/DelayAnalysis'
import AirlineComparison from '../components/charts/AirlineComparison'
import PopularRoutes from '../components/charts/PopularRoutes'
import TimeAnalysis from '../components/charts/TimeAnalysis'
import { FavoritesProvider, useFavorites } from '../context/FavoritesContext'

export const LoadingContext = createContext();

function FavoritesSection() {
  const { favorites } = useFavorites();
  
  if (favorites.length === 0) {
    return null;
  }
  
  return (
    <section id="favoritos" className="dashboard-section-group">
      <h2 className="section-title">
        <MdStar className="section-icon" /> Vuelos Favoritos
      </h2>
      <FavoriteFlights />
    </section>
  );
}

function Home() {
  const navigate = useNavigate();
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    stats: true,
    delays: true,
    airlines: true,
    routes: true,
    time: true
  });
  const [showContent, setShowContent] = useState(false);

  const handleRadarClick = () => {
    navigate('/radar');
  };

  const updateLoadingState = (component, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [component]: isLoading
    }));
  };

  useEffect(() => {
    const allLoaded = Object.values(loadingStates).every(state => !state);
    if (allLoaded && !allDataLoaded) {
      setAllDataLoaded(true);
      // Esperar un poco antes de iniciar la animación de desaparición
      setTimeout(() => {
        setShowContent(true);
      }, 500);
    }
  }, [loadingStates, allDataLoaded]);

  return (
    <FavoritesProvider>
      <LoadingContext.Provider value={{ updateLoadingState }}>
        <div className="home-container">
          <Navbar />
          <Profile />
        
        {/* Hero Section - Pantalla de carga */}
        <div 
          className={`hero-section-loading ${showContent ? 'fade-out' : ''}`}
          style={{ 
            display: showContent ? 'none' : 'flex'
          }}
        >
          <h1 className="hero-title">UbicAir</h1>
          <p className="hero-subtitle">Análisis de datos de vuelos en tiempo real</p>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="loading-text">Cargando datos...</p>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className={`main-content ${showContent ? 'fade-in' : ''}`}>
          {/* Sección: Inicio */}
          <section id="inicio" className="dashboard-section-group">
            {/* Card Radar de Vuelos */}
            <div className="radar-card-container">
              <div className="radar-card" onClick={handleRadarClick}>
                <span className="new-badge">NEW</span>
                <div className="radar-card-content">
                  <MdRadar className="radar-card-icon" />
                  <div className="radar-card-text">
                    <h3 className="radar-card-title">Radar de Vuelos</h3>
                    <p className="radar-card-subtitle">Visualiza vuelos en tiempo real</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Componente de búsqueda */}
            <FlightSearch />

            {/* Sección: Vuelos Favoritos */}
            <FavoritesSection />
          </section>
          
          {/* Sección: Vista General */}
          <section id="vista-general" className="dashboard-section-group">
            <h2 className="section-title">
              <MdDashboard className="section-icon" /> Vista General
            </h2>
            <div className="dashboard-grid">
              <FlightStats />
            </div>
          </section>

          {/* Sección: Análisis de Retrasos */}
          <section id="retrasos" className="dashboard-section-group">
            <h2 className="section-title">
              <MdAccessTime className="section-icon" /> Análisis de Retrasos
            </h2>
            <div className="dashboard-grid">
              <DelayAnalysis />
            </div>
          </section>

          {/* Sección: Aerolíneas */}
          <section id="aerolineas" className="dashboard-section-group">
            <h2 className="section-title">
              <MdFlight className="section-icon" /> Comparación de Aerolíneas
            </h2>
            <div className="dashboard-grid">
              <AirlineComparison />
            </div>
          </section>

          {/* Sección: Rutas */}
          <section id="rutas" className="dashboard-section-group">
            <h2 className="section-title">
              <MdMap className="section-icon" /> Rutas Más Frecuentes
            </h2>
            <div className="dashboard-grid">
              <PopularRoutes />
            </div>
          </section>

          {/* Sección: Análisis Temporal */}
          <section id="temporal" className="dashboard-section-group">
            <h2 className="section-title">
              <MdCalendarToday className="section-icon" /> Análisis Temporal
            </h2>
            <div className="dashboard-grid">
              <TimeAnalysis />
            </div>
          </section>
        </div>
      </div>
      </LoadingContext.Provider>
    </FavoritesProvider>
  )
}

export default Home