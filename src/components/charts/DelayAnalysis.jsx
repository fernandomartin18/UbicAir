import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter 
} from 'recharts';
import { API_ENDPOINTS } from '../../config/api';
import '../../css/charts.css';

function DelayAnalysis() {
  const [delayData, setDelayData] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDelayData();
  }, []);

  const fetchDelayData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.ANALISIS_RETRASOS);
      
      if (!response.ok) {
        throw new Error('Error al cargar el análisis de retrasos');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const data = result.data;
        
        // Transformar datos para los gráficos
        const monthlyData = data.retrasosPorMes.map(item => ({
          month: item.mes,
          depDelay: item.retrasoPromedioSalida,
          arrDelay: item.retrasoPromedioLlegada
        }));
        
        const distributionData = data.distribucionRetrasos.map(item => ({
          range: item.rango,
          count: item.cantidad
        }));
        
        setDelayData(monthlyData);
        setDistribution(distributionData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching delay data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="chart-loading">Cargando análisis de retrasos...</div>;
  }

  if (error) {
    return <div className="chart-error">Error: {error}</div>;
  }

  return (
    <>
      <div className="chart-container">
        <h2 className="chart-title">Tendencia Mensual de Retrasos</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={delayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="depDelay" 
              stroke="#ff7300" 
              name="Retraso Salida"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="arrDelay" 
              stroke="#387908" 
              name="Retraso Llegada"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Distribución de Retrasos</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={distribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis label={{ value: 'Número de Vuelos', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" name="Número de Vuelos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default DelayAnalysis;
