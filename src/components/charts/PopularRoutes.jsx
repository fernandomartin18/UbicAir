import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import '../../css/charts.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

function PopularRoutes() {
  const [topRoutes, setTopRoutes] = useState([]);
  const [routesByDistance, setRoutesByDistance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutesData();
  }, []);

  const fetchRoutesData = async () => {
    try {
      // Aquí deberías hacer la llamada a tu API
      // const response = await fetch('API_ENDPOINT/routes');
      // const data = await response.json();
      
      // Datos de ejemplo - reemplazar con datos reales de la API
      const mockTopRoutes = [
        { 
          route: 'CDG → HND', 
          flights: 15420, 
          avgDelay: 8.5,
          distance: 2475,
          onTimeRate: 78
        },
        { 
          route: 'JFK → LHR', 
          flights: 14200, 
          avgDelay: 9.2,
          distance: 5585,
          onTimeRate: 75
        },
        { 
          route: 'LAX → SYD', 
          flights: 12800, 
          avgDelay: 10.1,
          distance: 12050,
          onTimeRate: 72
        },
        { 
          route: 'DXB → SIN', 
          flights: 11500, 
          avgDelay: 7.8,
          distance: 5890,
          onTimeRate: 80
        },
        { 
          route: 'ORD → FRA', 
          flights: 10900, 
          avgDelay: 8.9,
          distance: 7100,
          onTimeRate: 76
        },
        { 
          route: 'ATL → CDG', 
          flights: 10200, 
          avgDelay: 9.5,
          distance: 7020,
          onTimeRate: 74
        },
        { 
          route: 'SFO → NRT', 
          flights: 9800, 
          avgDelay: 7.2,
          distance: 8280,
          onTimeRate: 81
        },
        { 
          route: 'LHR → JFK', 
          flights: 9500, 
          avgDelay: 8.7,
          distance: 5585,
          onTimeRate: 77
        },
      ];

      const mockDistanceCategories = [
        { category: 'Corta (< 1000 km)', flights: 280000, value: 28 },
        { category: 'Media (1000-3000 km)', flights: 350000, value: 35 },
        { category: 'Larga (3000-6000 km)', flights: 250000, value: 25 },
        { category: 'Ultra Larga (> 6000 km)', flights: 120000, value: 12 },
      ];
      
      setTopRoutes(mockTopRoutes);
      setRoutesByDistance(mockDistanceCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching routes data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="chart-loading">Cargando rutas populares...</div>;
  }

  return (
    <div className="chart-container">
      <h2 className="chart-title">Rutas Más Frecuentes</h2>
      
      <div className="chart-wrapper">
        <h3>Top 8 Rutas por Número de Vuelos</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topRoutes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="route" 
              angle={-45} 
              textAnchor="end" 
              height={100}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="flights" fill="#8884d8" name="Número de Vuelos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="charts-row">
        <div className="chart-wrapper half-width">
          <h3>Distribución por Distancia</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={routesByDistance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, value }) => `${category.split(' ')[0]}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {routesByDistance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper half-width">
          <h3>Puntualidad por Ruta Top</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topRoutes.slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="route" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTimeRate" fill="#4CAF50" name="% Puntualidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="routes-table">
        <h3>Detalle de Rutas Principales</h3>
        <table>
          <thead>
            <tr>
              <th>Ruta</th>
              <th>Vuelos</th>
              <th>Distancia (km)</th>
              <th>Retraso Prom.</th>
              <th>% Puntual</th>
            </tr>
          </thead>
          <tbody>
            {topRoutes.map((route, index) => (
              <tr key={index}>
                <td><strong>{route.route}</strong></td>
                <td>{route.flights.toLocaleString()}</td>
                <td>{route.distance.toLocaleString()}</td>
                <td>{route.avgDelay.toFixed(1)} min</td>
                <td className={route.onTimeRate >= 75 ? 'good' : 'warning'}>
                  {route.onTimeRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PopularRoutes;
