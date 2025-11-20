import '../css/home.css'
import Profile from '../components/profile'
import FlightStats from '../components/charts/FlightStats'
import DelayAnalysis from '../components/charts/DelayAnalysis'
import AirlineComparison from '../components/charts/AirlineComparison'
import PopularRoutes from '../components/charts/PopularRoutes'
import TimeAnalysis from '../components/charts/TimeAnalysis'

function Home() {
  return (
    <div className="home-container">
      <Profile />
      <h1>Welcome to UbicAir</h1>
      <p>Your flight simulation platform</p>
      
      <div className="dashboard-section">
        <FlightStats />
        <DelayAnalysis />
        <AirlineComparison />
        <PopularRoutes />
        <TimeAnalysis />
      </div>
    </div>
  )
}

export default Home
