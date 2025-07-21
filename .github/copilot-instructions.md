<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# PréstamoBnk - Sistema de Administración de Créditos

## Contexto del Proyecto
Este es un sistema moderno de gestión de préstamos y amortizaciones desarrollado con React + Vite, diseñado específicamente para el mercado mexicano.

## Características Clave
- **Moneda**: Pesos mexicanos (MXN) con formato local
- **Estructura bancaria mexicana**: Comisión de apertura 1.8% + IVA 16%
- **IVA sobre intereses**: 16% aplicado mensualmente
- **Mes 0**: Pago inicial solo con comisiones
- **Fechas**: Formato mexicano (dd/mm/yyyy)

## Arquitectura
- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **State**: Context API + localStorage
- **Utils**: date-fns para manejo de fechas

## Páginas
1. **Dashboard** (`/`) - Resumen general de créditos
2. **Nuevo Préstamo** (`/nuevo`) - Calculadora y formulario
3. **Mis Préstamos** (`/prestamos`) - Lista y gestión
4. **Detalles** (`/prestamo/:id`) - Vista individual
5. **Configuración** (`/configuracion`) - Ajustes

## Componentes Principales
- `LoanCalculator` - Motor de cálculos de amortización
- `AmortizationTable` - Tabla detallada de pagos
- `ProgressChart` - Gráficos de progreso
- `LoanCard` - Tarjeta de préstamo
- `Navigation` - Barra de navegación

## Reglas de Desarrollo
1. **Formato de moneda**: Siempre usar `formatCurrency()` para MXN
2. **Fechas**: Usar `formatDate()` para formato mexicano
3. **Componentes**: Crear componentes reutilizables y modulares
4. **Estado**: Usar Context API para estado global
5. **Persistencia**: localStorage para datos de préstamos
6. **Responsive**: Mobile-first con Tailwind
7. **Accesibilidad**: Seguir mejores prácticas WCAG

## Fórmulas Financieras
- **Cuota mensual**: Fórmula de anualidad
- **Comisión apertura**: Principal × 1.8%
- **IVA comisión**: Comisión × 16%
- **IVA intereses**: Interés mensual × 16%
- **Saldo pendiente**: Calculado automáticamente por tiempo transcurrido

## Convenciones de Código
- **Nombres**: camelCase para variables, PascalCase para componentes
- **Archivos**: kebab-case para archivos, PascalCase para componentes
- **CSS**: Tailwind classes, evitar CSS personalizado
- **Funciones**: Arrow functions preferidas
- **Imports**: Orden: React, librerías, componentes locales, utilidades
