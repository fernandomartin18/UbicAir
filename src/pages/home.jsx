import '../css/home.css'
import Profile from '../components/profile'
import Navbar from '../components/Navbar'
import FlightStats from '../components/charts/FlightStats'
import DelayAnalysis from '../components/charts/DelayAnalysis'
import AirlineComparison from '../components/charts/AirlineComparison'
import PopularRoutes from '../components/charts/PopularRoutes'
import TimeAnalysis from '../components/charts/TimeAnalysis'

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <Profile />
      <h1>UbicAir</h1>
      
      {/* Sección: Vista General */}
      <section id="vista-general" className="dashboard-section-group">
        <h2 className="section-title">📊 Vista General</h2>
        <div className="dashboard-grid">
          <FlightStats />
        </div>
      </section>

      {/* Sección: Análisis de Retrasos */}
      <section id="retrasos" className="dashboard-section-group">
        <h2 className="section-title">⏱️ Análisis de Retrasos</h2>
        <div className="dashboard-grid">
          <DelayAnalysis />
        </div>
      </section>

      {/* Sección: Aerolíneas */}
      <section id="aerolineas" className="dashboard-section-group">
        <h2 className="section-title">✈️ Comparación de Aerolíneas</h2>
        <div className="dashboard-grid">
          <AirlineComparison />
        </div>
      </section>

      {/* Sección: Rutas */}
      <section id="rutas" className="dashboard-section-group">
        <h2 className="section-title">🗺️ Rutas Más Frecuentes</h2>
        <div className="dashboard-grid">
          <PopularRoutes />
        </div>
      </section>

      {/* Sección: Análisis Temporal */}
      <section id="temporal" className="dashboard-section-group">
        <h2 className="section-title">📅 Análisis Temporal</h2>
        <div className="dashboard-grid">
          <TimeAnalysis />
        </div>
      </section>
    </div>
  )
}

export default Home
