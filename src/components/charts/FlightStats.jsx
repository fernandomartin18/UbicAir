import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { API_ENDPOINTS } from '../../config/api';
import '../../css/charts.css';

function FlightStats() {
  const [stats, setStats] = useState({
    totalFlights: 0,
    avgDepDelay: 0,
    avgArrDelay: 0,
    avgAirTime: 0,
    avgDistance: 0,
    onTimePercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.ESTADISTICAS);
      
      if (!response.ok) {
        throw new Error('Error al cargar las estadísticas');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const data = result.data;
        setStats({
          totalFlights: data.totalVuelos || 0,
          avgDepDelay: data.retrasoPromedioSalida || 0,
          avgArrDelay: data.retrasoPromedioLlegada || 0,
          avgAirTime: data.tiempoPromedioVuelo || 0,
          avgDistance: data.distanciaPromedio || 0,
          onTimePercentage: data.porcentajePuntualidad || 0
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flight stats:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Retraso Salida', value: parseFloat(stats.avgDepDelay.toFixed(2)) },
    { name: 'Retraso Llegada', value: parseFloat(stats.avgArrDelay.toFixed(2)) },
  ];

  if (loading) {
    return <div className="chart-loading">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="chart-error">Error: {error}</div>;
  }

  return (
    <>
      <div className="chart-container">
        <h2 className="chart-title">Estadísticas Generales</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total de Vuelos</h3>
            <p className="stat-value">{stats.totalFlights.toLocaleString()}</p>
          </div>
          
          <div className="stat-card">
            <h3>Puntualidad</h3>
            <p className="stat-value">{stats.onTimePercentage.toFixed(1)}%</p>
          </div>
          
          <div className="stat-card">
            <h3>Tiempo Vuelo Promedio</h3>
            <p className="stat-value">{stats.avgAirTime.toFixed(1)} min</p>
          </div>
          
          <div className="stat-card">
            <h3>Distancia Promedio</h3>
            <p className="stat-value">{stats.avgDistance.toFixed(0)} km</p>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Retrasos Promedio</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#238af0ff" name="Minutos de retraso" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default FlightStats;
