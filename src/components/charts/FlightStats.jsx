import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Aquí deberías hacer la llamada a tu API
      // const response = await fetch('API_ENDPOINT/stats');
      // const data = await response.json();
      
      // Datos de ejemplo - reemplazar con datos reales de la API
      const mockData = {
        totalFlights: 1000000,
        avgDepDelay: 8.5,
        avgArrDelay: 6.2,
        avgAirTime: 145.3,
        avgDistance: 1250.5,
        onTimePercentage: 78.4
      };
      
      setStats(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flight stats:', error);
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Retraso Salida', value: stats.avgDepDelay },
    { name: 'Retraso Llegada', value: stats.avgArrDelay },
  ];

  if (loading) {
    return <div className="chart-loading">Cargando estadísticas...</div>;
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
            <p className="stat-value">{stats.onTimePercentage}%</p>
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
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default FlightStats;
