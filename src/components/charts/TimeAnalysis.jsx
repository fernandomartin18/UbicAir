import { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import '../../css/charts.css';

function TimeAnalysis() {
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [peakHours, setPeakHours] = useState({ departure: '', arrival: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeData();
  }, []);

  const fetchTimeData = async () => {
    try {
      // Aquí deberías hacer la llamada a tu API
      // const response = await fetch('API_ENDPOINT/time-analysis');
      // const data = await response.json();
      
      // Datos de ejemplo - reemplazar con datos reales de la API
      const mockHourlyData = [
        { hour: '00:00', departures: 1200, arrivals: 2800, delay: 5.2 },
        { hour: '02:00', departures: 800, arrivals: 1500, delay: 4.8 },
        { hour: '04:00', departures: 1500, arrivals: 2200, delay: 5.5 },
        { hour: '06:00', departures: 8500, arrivals: 7200, delay: 8.2 },
        { hour: '08:00', departures: 15200, arrivals: 14800, delay: 12.5 },
        { hour: '10:00', departures: 18500, arrivals: 17200, delay: 10.8 },
        { hour: '12:00', departures: 22000, arrivals: 21500, delay: 11.2 },
        { hour: '14:00', departures: 20500, arrivals: 19800, delay: 9.8 },
        { hour: '16:00', departures: 19000, arrivals: 18500, delay: 10.5 },
        { hour: '18:00', departures: 17500, arrivals: 19200, delay: 11.8 },
        { hour: '20:00', departures: 12000, arrivals: 15500, delay: 9.2 },
        { hour: '22:00', departures: 5500, arrivals: 8200, delay: 7.5 },
      ];

      const mockWeeklyData = [
        { day: 'Lun', flights: 142000, avgDelay: 9.2, onTime: 76 },
        { day: 'Mar', flights: 138000, avgDelay: 8.8, onTime: 77 },
        { day: 'Mié', flights: 140000, avgDelay: 9.0, onTime: 76 },
        { day: 'Jue', flights: 145000, avgDelay: 9.5, onTime: 75 },
        { day: 'Vie', flights: 155000, avgDelay: 10.8, onTime: 72 },
        { day: 'Sáb', flights: 135000, avgDelay: 8.5, onTime: 78 },
        { day: 'Dom', flights: 145000, avgDelay: 9.2, onTime: 76 },
      ];

      const peakDeparture = mockHourlyData.reduce((max, item) => 
        item.departures > max.departures ? item : max
      );
      const peakArrival = mockHourlyData.reduce((max, item) => 
        item.arrivals > max.arrivals ? item : max
      );
      
      setHourlyData(mockHourlyData);
      setWeeklyData(mockWeeklyData);
      setPeakHours({ 
        departure: peakDeparture.hour, 
        arrival: peakArrival.hour 
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching time data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="chart-loading">Cargando análisis temporal...</div>;
  }

  return (
    <div className="chart-container">
      <h2 className="chart-title">Análisis Temporal de Vuelos</h2>
      
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

      <div className="chart-wrapper">
        <h3>Tráfico Aéreo por Hora del Día</h3>
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

      <div className="chart-wrapper">
        <h3>Retrasos Promedio por Hora</h3>
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

      <div className="chart-wrapper">
        <h3>Análisis Semanal</h3>
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

      <div className="insights">
        <h3>Insights Temporales</h3>
        <ul>
          <li>El período de mayor tráfico es entre las 10:00 y las 14:00</li>
          <li>Los retrasos son más frecuentes durante las horas pico de la mañana (8:00-10:00)</li>
          <li>Los viernes tienen el mayor volumen de vuelos pero menor puntualidad</li>
          <li>Los sábados muestran la mejor tasa de puntualidad</li>
          <li>Las madrugadas (2:00-4:00) tienen los menores retrasos promedio</li>
        </ul>
      </div>
    </div>
  );
}

export default TimeAnalysis;
