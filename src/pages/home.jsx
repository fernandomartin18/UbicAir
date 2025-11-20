import { useState, useEffect } from 'react'
import { MdDashboard, MdAccessTime, MdFlight, MdMap, MdCalendarToday } from 'react-icons/md'
import '../css/home.css'
import Profile from '../components/profile'
import Navbar from '../components/Navbar'
import FlightStats from '../components/charts/FlightStats'
import DelayAnalysis from '../components/charts/DelayAnalysis'
import AirlineComparison from '../components/charts/AirlineComparison'
import PopularRoutes from '../components/charts/PopularRoutes'
import TimeAnalysis from '../components/charts/TimeAnalysis'

function Home() {
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 0;
      const fadeEnd = 250;
      
      if (scrollY <= fadeStart) {
        setScrollOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setScrollOpacity(0);
      } else {
        const opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
        setScrollOpacity(opacity);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <Profile />
      
      {/* Hero Section */}
      <div 
        className="hero-section" 
        style={{ 
          opacity: scrollOpacity,
          pointerEvents: scrollOpacity < 0.1 ? 'none' : 'auto'
        }}
      >
        <h1 className="hero-title">UbicAir</h1>
        <p className="hero-subtitle">Análisis de datos de vuelos en tiempo real</p>
      </div>
      
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
  )
}

export default Home
