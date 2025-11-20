import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter 
} from 'recharts';
import '../../css/charts.css';

function DelayAnalysis() {
  const [delayData, setDelayData] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDelayData();
  }, []);

  const fetchDelayData = async () => {
    try {
      // Aquí deberías hacer la llamada a tu API
      // const response = await fetch('API_ENDPOINT/delays');
      // const data = await response.json();
      
      // Datos de ejemplo - reemplazar con datos reales de la API
      const mockMonthlyData = [
        { month: 'Ene', depDelay: 10, arrDelay: 8 },
        { month: 'Feb', depDelay: 12, arrDelay: 9 },
        { month: 'Mar', depDelay: 8, arrDelay: 6 },
        { month: 'Abr', depDelay: 7, arrDelay: 5 },
        { month: 'May', depDelay: 9, arrDelay: 7 },
        { month: 'Jun', depDelay: 11, arrDelay: 10 },
        { month: 'Jul', depDelay: 15, arrDelay: 13 },
        { month: 'Ago', depDelay: 14, arrDelay: 12 },
        { month: 'Sep', depDelay: 10, arrDelay: 8 },
        { month: 'Oct', depDelay: 8, arrDelay: 6 },
        { month: 'Nov', depDelay: 9, arrDelay: 7 },
        { month: 'Dic', depDelay: 13, arrDelay: 11 },
      ];

      const mockDistribution = [
        { range: '-30 a -15 min', count: 5000 },
        { range: '-15 a 0 min', count: 250000 },
        { range: '0-15 min', count: 450000 },
        { range: '15-30 min', count: 180000 },
        { range: '30-60 min', count: 80000 },
        { range: '60+ min', count: 35000 },
      ];
      
      setDelayData(mockMonthlyData);
      setDistribution(mockDistribution);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching delay data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="chart-loading">Cargando análisis de retrasos...</div>;
  }

  return (
    <>
      <div className="chart-container">
        <h2 className="chart-title">Tendencia Mensual de Retrasos</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={delayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
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
            <YAxis />
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
