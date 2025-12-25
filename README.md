# UbicAir - Frontend

Aplicación web de visualización y análisis de vuelos en tiempo real, construida con React y Vite.

## 📋 Descripción

UbicAir es una plataforma interactiva que permite a los usuarios:
- 🗺️ Visualizar vuelos en tiempo real en un radar interactivo
- 📊 Analizar estadísticas de vuelos, retrasos y aerolíneas
- 🔍 Buscar y filtrar vuelos por diferentes criterios
- ⭐ Guardar vuelos favoritos para un acceso rápido
- 📈 Consultar análisis temporales y rutas populares

## 🚀 Tecnologías

- **React 19** - Framework de UI
- **Vite** - Build tool y dev server
- **React Router** - Navegación entre páginas
- **Leaflet** - Mapas interactivos
- **React-Leaflet** - Integración de Leaflet con React
- **Recharts** - Gráficos y visualizaciones
- **Axios** - Cliente HTTP
- **React Icons** - Biblioteca de iconos

## 📦 Instalación

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/fernandomartin18/UbicAir.git
cd UbicAir
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3000
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── charts/         # Componentes de gráficos
│   │   ├── AirlineComparison.jsx
│   │   ├── DelayAnalysis.jsx
│   │   ├── FlightStats.jsx
│   │   ├── PopularRoutes.jsx
│   │   └── TimeAnalysis.jsx
│   ├── FavoriteFlights.jsx
│   ├── FlightDetailsModal.jsx
│   ├── FlightRadarLive.jsx
│   ├── FlightSearch.jsx
│   ├── Navbar.jsx
│   └── profile.jsx
├── pages/              # Páginas principales
│   ├── FlightRadar.jsx
│   ├── home.jsx
│   ├── login.jsx
│   └── signup.jsx
├── context/            # Context API
│   └── FavoritesContext.jsx
├── config/             # Configuración
│   └── api.js
├── css/                # Estilos
└── styles/             # Temas y estilos globales
```

## 🎯 Funcionalidades Principales

### 🗺️ Radar de Vuelos en Tiempo Real
- Visualización de vuelos activos en un mapa interactivo
- Marcadores de aviones con orientación según la dirección de vuelo
- Información detallada de cada vuelo (aerolínea, aeropuertos, altura, velocidad)
- Rutas de vuelo visualizadas con líneas entre origen y destino
- Búsqueda y filtrado de vuelos en el mapa
- Actualización automática de posiciones

### 📊 Dashboard de Análisis
- **Estadísticas Generales**: Total de vuelos, retrasos, cancelaciones
- **Análisis de Retrasos**: Distribución y promedios de retrasos
- **Comparación de Aerolíneas**: Rankings y métricas por aerolínea
- **Rutas Populares**: Conexiones más frecuentes
- **Análisis Temporal**: Patrones por hora del día y día de la semana

### 🔍 Búsqueda de Vuelos
- Filtros por aeropuerto de origen y destino
- Filtro por fecha
- Filtro por aerolínea
- Resultados en tiempo real

### ⭐ Gestión de Favoritos
- Guardar vuelos favoritos
- Acceso rápido desde el dashboard
- Persistencia de favoritos por usuario

### 👤 Sistema de Usuarios
- Registro de nuevos usuarios
- Inicio de sesión
- Perfil de usuario
- Autenticación con JWT

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción

# Linting
npm run lint         # Ejecuta ESLint
```

## 🌐 API Endpoints

La aplicación se conecta a los siguientes endpoints:

- **Usuarios**: `/api/users/register`, `/api/users/login`
- **Vuelos**: `/api/vuelos`
- **Estadísticas**: `/api/vuelos/estadisticas`
- **Análisis de Retrasos**: `/api/vuelos/analisis-retrasos`
- **Comparación Aerolíneas**: `/api/vuelos/comparacion-aerolineas`
- **Rutas Populares**: `/api/vuelos/rutas-populares`
- **Análisis Temporal**: `/api/vuelos/analisis-temporal`

## 🎨 Características de UI/UX

- Interfaz moderna y responsive
- Tema oscuro optimizado para visualización de mapas
- Animaciones fluidas y transiciones suaves
- Iconos intuitivos (React Icons)
- Gráficos interactivos (Recharts)
- Tooltips informativos
- Estados de carga personalizados

## 🔧 Configuración Avanzada

### Personalizar Puerto
Editar `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001
  }
})
```

### Configurar Proxy para API
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

## 📱 Responsive Design

La aplicación está optimizada para:
- 💻 Desktop (1920px+)
- 💻 Laptop (1366px - 1920px)
- 📱 Tablet (768px - 1366px)
- 📱 Mobile (< 768px)

## 🔐 Seguridad

- Autenticación basada en JWT
- Almacenamiento seguro de tokens en localStorage
- Validación de formularios
- Protección de rutas privadas