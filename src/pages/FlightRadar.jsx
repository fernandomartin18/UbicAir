import { useState } from 'react'
import { MdRadar } from 'react-icons/md'
import Profile from '../components/profile'
import FlightRadarLive from '../components/FlightRadarLive'
import '../css/flightRadar.css'

function FlightRadar() {
  return (
    <div className="radar-container">
      <Profile />
      <FlightRadarLive />
    </div>
  )
}

export default FlightRadar
