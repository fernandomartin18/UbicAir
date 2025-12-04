import { useState, useEffect, useContext } from 'react';
import { 
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { API_ENDPOINTS } from '../../config/api';
import { LoadingContext } from '../../pages/Home';
import '../../css/charts.css';

function AirlineComparison() {
  const [airlineStats, setAirlineStats] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadingContext = useContext(LoadingContext);

  useEffect(() => {
    fetchAirlineData();
  }, []);

  const fetchAirlineData = async () => {
    try {
      setLoading(true);
      loadingContext?.updateLoadingState('airlines', true);
      const response = await fetch(API_ENDPOINTS.COMPARACION_AEROLINEAS);
      
      if (!response.ok) {
        throw new Error('Error al cargar comparación de aerolíneas');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const airlines = result.data.map(airline => ({
          airline: airline.aerolinea,
          flights: airline.totalVuelos,
          onTime: airline.porcentajePuntualidad,
          avgDelay: airline.retrasoPromedio,
          avgDistance: airline.distanciaPromedio
        }));

        // Datos para el gráfico radar (top 5 aerolíneas)
        const performanceData = airlines.slice(0, 5).map(airline => ({
          airline: airline.airline.split(' ')[0],
          puntualidad: airline.onTime,
          eficiencia: Math.max(0, 100 - (airline.avgDelay * 2)),
          volumen: Math.min(100, (airline.flights / 1500)),
          satisfacción: Math.max(0, airline.onTime - 5),
        }));
        
        setAirlineStats(airlines);
        setPerformanceData(performanceData);
      }
      
      setLoading(false);
      loadingContext?.updateLoadingState('airlines', false);
    } catch (error) {
      console.error('Error fetching airline data:', error);
      setError(error.message);
      setLoading(false);
      loadingContext?.updateLoadingState('airlines', false);
    }
  };

  if (loading) {
    return <div className="chart-loading">Cargando comparación de aerolíneas...</div>;
  }

  if (error) {
    return <div className="chart-error">Error: {error}</div>;
  }

  return (
    <>
      <div className="chart-container">
        <h2 className="chart-title">Puntualidad por Aerolínea</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={airlineStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="airline" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
              tick={{ fontSize: 14 }}
            />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip />
            <Legend />
            <Bar dataKey="onTime" fill="#4CAF50" name="% Vuelos Puntuales" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Volumen de Vuelos por Aerolínea</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={airlineStats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={['dataMin - 400', 'dataMax + 200']} />
            <YAxis dataKey="airline" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="flights" fill="#2196F3" name="Número de Vuelos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Rendimiento Multidimensional</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={performanceData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="airline" />
            <PolarRadiusAxis angle={90} domain={[56, 58]} />
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

      <div className="chart-container">
        <h2 className="chart-title">Resumen Detallado de Aerolíneas</h2>
        <div className="airline-table">
          <div className="table-wrapper">
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
            </table>
            <div className="table-body-scroll">
              <table>
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
        </div>
      </div>
    </>
  );
}

export default AirlineComparison;
