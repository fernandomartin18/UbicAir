import { useState, useEffect, useContext } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { API_ENDPOINTS } from '../../config/api';
import { LoadingContext } from '../../pages/Home';
import '../../css/charts.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

function PopularRoutes() {
  const [topRoutes, setTopRoutes] = useState([]);
  const [routesByDistance, setRoutesByDistance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadingContext = useContext(LoadingContext);

  useEffect(() => {
    fetchRoutesData();
  }, []);

  const fetchRoutesData = async () => {
    try {
      setLoading(true);
      loadingContext?.updateLoadingState('routes', true);
      const response = await fetch(API_ENDPOINTS.RUTAS_POPULARES);
      
      if (!response.ok) {
        throw new Error('Error al cargar rutas populares');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const routes = result.data.rutasPopulares.map(ruta => ({
          route: ruta.ruta,
          flights: ruta.totalVuelos,
          avgDelay: ruta.retrasoPromedio,
          distance: ruta.distancia,
          onTimeRate: ruta.porcentajePuntualidad
        }));

        const distanceData = result.data.distribucionDistancia.map(dist => ({
          category: dist.categoria,
          flights: dist.totalVuelos,
          value: dist.porcentaje
        }));
        
        setTopRoutes(routes);
        setRoutesByDistance(distanceData);
      }
      
      setLoading(false);
      loadingContext?.updateLoadingState('routes', false);
    } catch (error) {
      console.error('Error fetching routes data:', error);
      setError(error.message);
      setLoading(false);
      loadingContext?.updateLoadingState('routes', false);
    }
  };

  if (loading) {
    return <div className="chart-loading">Cargando rutas populares...</div>;
  }

  if (error) {
    return <div className="chart-error">Error: {error}</div>;
  }

  return (
    <>
      <div className="chart-container">
        <h2 className="chart-title">Rutas con Mayor Tráfico</h2>
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

      <div className="chart-container">
        <h2 className="chart-title">Distribución por Distancia</h2>
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
              nameKey="category"
            >
              {routesByDistance.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Puntualidad por Ruta</h2>
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

      <div className="chart-container">
        <h2 className="chart-title">Detalle de Rutas Principales</h2>
        <div className="routes-table">
          <div className="table-wrapper">
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
            </table>
            <div className="table-body-scroll">
              <table>
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
        </div>
      </div>
    </>
  );
}

export default PopularRoutes;
