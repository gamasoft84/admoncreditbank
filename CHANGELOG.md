# Changelog

Todos los cambios importantes en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2025-07-20

### Agregado
- 🎉 Lanzamiento inicial del sistema PréstamoBnk
- 💰 Sistema completo de cálculo de préstamos con estándares mexicanos
- 📊 Dashboard con resumen de préstamos y estadísticas
- 🧮 Calculadora de préstamos en tiempo real
- 📋 Gestión completa de préstamos (crear, editar, eliminar)
- 📱 Interfaz responsive con Tailwind CSS
- 🏦 Cálculos financieros específicos para México:
  - Comisión de apertura 1.8% + IVA 16%
  - IVA sobre intereses mensuales
  - Formato de moneda mexicana (MXN)
  - Fechas en formato dd/mm/yyyy
- 💾 Persistencia local con localStorage
- 🔄 Navegación con React Router DOM
- 📈 Visualización de datos con Chart.js

### Tecnologías
- React 18.3.1
- Vite 7.0.5
- Tailwind CSS 3.4.0
- React Router DOM 6.28.0
- Chart.js + react-chartjs-2
- Lucide React (iconos)
- date-fns (manejo de fechas)

### Características Técnicas
- ✅ Context API para gestión de estado global
- ✅ Componentes modulares y reutilizables
- ✅ Utilities financieras especializadas
- ✅ Responsive design mobile-first
- ✅ Configuración PostCSS optimizada
- ✅ ESLint para calidad de código
