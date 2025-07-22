# Changelog

Todos los cambios importantes en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

## [1.2.0] - 2025-07-22

### 🆕 Agregado
- **Sistema completo de migración localStorage → Base de datos**
  - API REST con Prisma ORM y SQLite
  - Endpoint `/api/migrate` para migración segura
  - Scripts de migración ejecutables desde navegador
  - Panel de migración en la interfaz de usuario

- **Base de datos robusta**
  - Schema Prisma con tablas `loans` y `payment_schedule`
  - Soporte para BigInt IDs (timestamps)
  - Relaciones entre préstamos y cronogramas de pago
  - Migraciones automáticas de base de datos

- **Servicios backend**
  - `loanService.js` con operaciones CRUD completas
  - Funciones especializadas para migración (`migrateLoan`)
  - Manejo inteligente de duplicados
  - Serialización automática de BigInt para JSON

- **Scripts y utilidades**
  - `migrate.js` - Script de migración desde consola del navegador
  - Funciones de backup y limpieza de localStorage
  - Logs detallados del proceso de migración
  - Utilidades de verificación de API y datos

### 🔧 Mejorado
- **Compatibilidad de datos**
  - Mapeo automático entre campos de localStorage y base de datos
  - Validación de datos antes de insertar
  - Manejo de campos opcionales y valores por defecto

- **Experiencia del usuario**
  - Panel de migración integrado en la UI
  - Feedback en tiempo real del proceso
  - Opciones de backup antes de migrar

### 🐛 Corregido
- **Error "Unique constraint failed on the fields: (`id`)"**
  - Implementación de detección inteligente de duplicados
  - Función `migrateLoan` que verifica existencia antes de crear
  - Respuestas diferenciadas para creación vs. omisión

- **Error "Cannot read properties of undefined (reading 'map')"**
  - Manejo seguro de schedule undefined con `(schedule || [])`
  - Validación de estructura de datos antes del procesamiento

- **Problemas de serialización BigInt**
  - Función `serializeBigInt` para conversión automática
  - Manejo consistente de IDs BigInt en toda la API

### 🏗️ Infraestructura
- **Configuración de desarrollo**
  - Scripts npm para ejecutar frontend y backend simultáneamente
  - Configuración de Prisma para SQLite
  - Variables de entorno para configuración

- **Control de versiones**
  - `.gitignore` mejorado para archivos de base de datos
  - Exclusión de archivos temporales y de desarrollo
  - Documentación de migración en archivos MD

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
