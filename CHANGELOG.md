# Changelog

Todos los cambios importantes en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

## [1.1.0] - 2025-07-20

### Agregado
- 📊 **Tabla de Amortización Completa**: Nuevo componente `AmortizationTable` con desglose detallado
- 🔍 **Página de Detalles de Préstamo**: Vista completa con información financiera y progreso
- 📈 **Visualización de Progreso**: Barras de progreso para capital, intereses e IVA
- 🎯 **Navegación Mejorada**: Enlaces directos a detalles desde lista de préstamos
- 💱 **Cálculos Mexicanos**: IVA sobre intereses y comisiones mostrado por separado
- 📱 **Diseño Responsive**: Tabla adaptativa para dispositivos móviles

### Mejorado
- ✨ **Calculadora de Préstamos**: Botón para mostrar/ocultar tabla de amortización
- 🎨 **Interfaz de Usuario**: Colores diferenciados para tipos de pagos
- 📋 **Resumen Financiero**: Totales destacados con indicadores visuales
- 🔗 **Flujo de Usuario**: Navegación intuitiva entre páginas

### Componentes Nuevos
- `AmortizationTable.jsx`: Tabla completa de amortización
- `LoanDetails.jsx`: Vista detallada de préstamos individuales

### Rutas Nuevas
- `/prestamo/:id`: Detalles completos del préstamo

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
