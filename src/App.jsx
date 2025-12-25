import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './css/App.css'
import Login from './pages/Login'
import Signup from './pages/signup'
import Home from './pages/home'
import FlightRadar from './pages/FlightRadar'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/radar" element={<FlightRadar />} />
      </Routes>
    </Router>
  )
}

export default App
