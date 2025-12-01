import { useState, useEffect, useContext } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { API_ENDPOINTS } from '../../config/api';
import { LoadingContext } from '../../pages/Home';
import '../../css/charts.css';

function TimeAnalysis() {
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [peakHours, setPeakHours] = useState({ departure: '', arrival: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadingContext = useContext(LoadingContext);

  useEffect(() => {
    fetchTimeData();
  }, []);

  const fetchTimeData = async () => {
    try {
      setLoading(true);
      loadingContext?.updateLoadingState('time', true);
      const response = await fetch(API_ENDPOINTS.ANALISIS_TEMPORAL);
      
      if (!response.ok) {
        throw new Error('Error al cargar análisis temporal');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const hourly = result.data.datosPorHora.map(item => ({
          hour: item.hora,
          departures: item.salidas,
          arrivals: item.llegadas,
          delay: item.retrasoPromedio
        }));

        const weekly = result.data.datosSemana.map(item => ({
          day: item.dia,
          flights: item.totalVuelos,
          avgDelay: item.retrasoPromedio,
          onTime: item.porcentajePuntualidad
        }));
        
        setHourlyData(hourly);
        setWeeklyData(weekly);
        setPeakHours({
          departure: result.data.horasPico.salidas,
          arrival: result.data.horasPico.llegadas
        });
      }
      
      setLoading(false);
      loadingContext?.updateLoadingState('time', false);
    } catch (error) {
      console.error('Error fetching time data:', error);
      setError(error.message);
      setLoading(false);
      loadingContext?.updateLoadingState('time', false);
    }
  };

  if (loading) {
    return <div className="chart-loading">Cargando análisis temporal...</div>;
  }

  if (error) {
    return <div className="chart-error">Error: {error}</div>;
  }

  return (
    <>
      <div className="chart-container">
        <h2 className="chart-title">Horas Pico de Tráfico</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Hora Pico Salidas</h3>
            <p className="stat-value">{peakHours.departure}</p>
          </div>
          
          <div className="stat-card">
            <h3>Hora Pico Llegadas</h3>
            <p className="stat-value">{peakHours.arrival}</p>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Tráfico Aéreo por Hora del Día</h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="departures" 
              stackId="1"
              stroke="#8884d8" 
              fill="#8884d8" 
              name="Salidas"
            />
            <Area 
              type="monotone" 
              dataKey="arrivals" 
              stackId="2"
              stroke="#82ca9d" 
              fill="#82ca9d" 
              name="Llegadas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Retrasos Promedio por Hora</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="delay" 
              stroke="#ff7300" 
              strokeWidth={3}
              name="Retraso Promedio (min)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Análisis Semanal</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="flights" 
              fill="#8884d8" 
              name="Número de Vuelos" 
            />
            <Bar 
              yAxisId="right"
              dataKey="onTime" 
              fill="#82ca9d" 
              name="% Puntualidad" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default TimeAnalysis;
