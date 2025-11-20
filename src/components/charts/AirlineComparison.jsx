import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import '../../css/charts.css';

function AirlineComparison() {
  const [airlineStats, setAirlineStats] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAirlineData();
  }, []);

  const fetchAirlineData = async () => {
    try {
      // Aquí deberías hacer la llamada a tu API
      // const response = await fetch('API_ENDPOINT/airlines');
      // const data = await response.json();
      
      // Datos de ejemplo - reemplazar con datos reales de la API
      const mockAirlineStats = [
        { 
          airline: 'Alaska Airlines', 
          flights: 85000, 
          onTime: 82, 
          avgDelay: 7.2,
          avgDistance: 1850 
        },
        { 
          airline: 'American Airlines', 
          flights: 120000, 
          onTime: 76, 
          avgDelay: 9.8,
          avgDistance: 1650 
        },
        { 
          airline: 'Delta Airlines', 
          flights: 95000, 
          onTime: 79, 
          avgDelay: 8.1,
          avgDistance: 1720 
        },
        { 
          airline: 'United Airlines', 
          flights: 110000, 
          onTime: 75, 
          avgDelay: 10.2,
          avgDistance: 1680 
        },
        { 
          airline: 'Southwest Airlines', 
          flights: 130000, 
          onTime: 80, 
          avgDelay: 8.5,
          avgDistance: 1200 
        },
      ];

      const mockPerformanceData = mockAirlineStats.slice(0, 5).map(airline => ({
        airline: airline.airline.split(' ')[0],
        puntualidad: airline.onTime,
        eficiencia: 100 - (airline.avgDelay * 2),
        volumen: (airline.flights / 1500),
        satisfacción: airline.onTime - 5,
      }));
      
      setAirlineStats(mockAirlineStats);
      setPerformanceData(mockPerformanceData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching airline data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="chart-loading">Cargando comparación de aerolíneas...</div>;
  }

  return (
    <div className="chart-container">
      <h2 className="chart-title">Comparación de Aerolíneas</h2>
      
      <div className="chart-wrapper">
        <h3>Puntualidad por Aerolínea (%)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={airlineStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="airline" 
              angle={-45} 
              textAnchor="end" 
              height={100}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="onTime" fill="#4CAF50" name="% Vuelos Puntuales" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-wrapper">
        <h3>Número de Vuelos por Aerolínea</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={airlineStats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="airline" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="flights" fill="#2196F3" name="Número de Vuelos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-wrapper">
        <h3>Rendimiento Multidimensional</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={performanceData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="airline" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar 
              name="Métricas" 
              dataKey="puntualidad" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6} 
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="airline-table">
        <h3>Resumen Detallado</h3>
        <table>
          <thead>
            <tr>
              <th>Aerolínea</th>
              <th>Vuelos</th>
              <th>% Puntual</th>
              <th>Retraso Prom.</th>
              <th>Dist. Prom.</th>
            </tr>
          </thead>
          <tbody>
            {airlineStats.map((airline, index) => (
              <tr key={index}>
                <td>{airline.airline}</td>
                <td>{airline.flights.toLocaleString()}</td>
                <td>{airline.onTime}%</td>
                <td>{airline.avgDelay.toFixed(1)} min</td>
                <td>{airline.avgDistance.toFixed(0)} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AirlineComparison;
