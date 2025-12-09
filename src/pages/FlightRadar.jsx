import { useState } from 'react'
import { MdRadar } from 'react-icons/md'
import Profile from '../components/profile'
import '../css/flightRadar.css'

function FlightRadar() {
  return (
    <div className="radar-container">
      <Profile />
          <p className="radar-subtitle">
            Visualización en tiempo real de vuelos comerciales
          </p>
    </div>
  )
}

export default FlightRadar
