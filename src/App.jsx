import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './css/App.css'
import Login from './pages/Login'
import Signup from './pages/signup'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
