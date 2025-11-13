import '../css/home.css'
import Profile from '../components/profile'

function Home() {
  return (
    <div className="home-container">
      <Profile />
      <h1>Welcome to UbicAir</h1>
      <p>Your flight simulation platform</p>
    </div>
  )
}

export default Home
