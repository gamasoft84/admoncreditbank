# 🏦 PréstamoBnk - Sistema de Administración de Créditos

Un sistema moderno y completo para calcular, gestionar y monitorear préstamos y tablas de amortización, diseñado específicamente para el mercado mexicano.

## ✨ Características Principales

### 💰 Cálculos Financieros Precisos
- **Fórmula de anualidad** para cálculo de cuotas mensuales
- **Comisión de apertura** del 1.8% con IVA del 16%
- **IVA sobre intereses** aplicado mensualmente (16%)
- **Mes 0** con pago inicial de comisiones únicamente
- **Formato de moneda mexicana** (MXN) en toda la aplicación

### 📊 Interfaz Moderna y Responsive
- **React 18 + Vite** para desarrollo rápido y moderno
- **Tailwind CSS** para diseño profesional y responsive
- **Navegación intuitiva** con React Router
- **Mobile-first** - optimizado para dispositivos móviles
- **Modo oscuro** y temas personalizables

### 🎯 Páginas y Funcionalidades

#### 🏠 Dashboard
- Resumen general de todos los créditos
- Estadísticas consolidadas (total prestado, pagado, pendiente)
- Gráficos de progreso visual
- Préstamos recientes con estados

#### ➕ Nuevo Préstamo
- Calculadora interactiva en tiempo real
- Validación de datos de entrada
- Previsualización de resultados
- Guardado automático en localStorage

#### 📋 Mis Préstamos
- Lista completa con filtros avanzados
- Estados visuales (LIQUIDADO, EN PROCESO, PENDIENTE)
- Búsqueda por nombre
- Ordenamiento por múltiples criterios
- Acciones rápidas (ver, exportar, eliminar)

#### 🔍 Detalles del Préstamo
- Tabla de amortización completa
- Gráficos de progreso detallados
- Exportación a CSV
- Seguimiento de pagos realizados

#### ⚙️ Configuración
- Ajustes del sistema
- Importar/exportar datos
- Backup y restauración

### 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, Vite, JavaScript ES6+
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS, Autoprefixer
- **Icons**: Lucide React
- **Charts**: Chart.js, react-chartjs-2
- **State**: Context API + useReducer
- **Storage**: localStorage con persistencia automática
- **Utils**: date-fns para manejo de fechas

### 🚀 Instalación y Desarrollo

#### Prerrequisitos
- Node.js 18+ y npm
- Git

#### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd admonCreditosBnk

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

#### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Previsualizar build
npm run lint         # Ejecutar ESLint
```

### 📱 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.jsx      # Layout principal con navegación
│   └── Navigation.jsx  # Barra de navegación
├── pages/              # Páginas principales
│   ├── Dashboard.jsx   # Dashboard principal
│   ├── NewLoan.jsx     # Calculadora de nuevos préstamos
│   ├── LoanList.jsx    # Lista de préstamos
│   ├── LoanDetails.jsx # Detalles individuales
│   └── Settings.jsx    # Configuración
├── context/            # Context API
│   └── LoanContext.jsx # Estado global de préstamos
├── utils/              # Utilidades y funciones
│   └── financial.js    # Cálculos financieros
├── hooks/              # Hooks personalizados
└── assets/             # Recursos estáticos
```

### 💼 Funcionalidades del Sistema Financiero

#### Cálculos Automáticos
- **Cuota mensual base** usando fórmula de anualidad
- **Comisión de apertura** (1.8% del monto principal)
- **IVA de comisión** (16% sobre la comisión)
- **IVA de intereses** (16% sobre intereses mensuales)
- **Saldo pendiente** calculado por tiempo transcurrido

#### Estructura de Pagos Mexicana
- **Mes 0**: Solo comisiones (apertura + IVA)
- **Mes 1-N**: Cuota base + IVA de intereses
- **Formato de fecha**: dd/mm/yyyy (estándar mexicano)
- **Moneda**: Pesos mexicanos (MXN) con formato local

### 📊 Ejemplos de Uso

#### Préstamo de $100,000 MXN a 12% anual por 36 meses:
- **Comisión apertura**: $1,800.00 (1.8%)
- **IVA comisión**: $288.00 (16%)
- **Pago inicial (Mes 0)**: $2,088.00
- **Cuota mensual base**: ~$3,320.00
- **IVA intereses promedio**: ~$160.00
- **Cuota real promedio**: ~$3,480.00
- **Total a pagar**: ~$127,368.00

### 🔧 Configuración y Personalización

#### Variables del Sistema
```javascript
// src/utils/financial.js
export const CONSTANTS = {
  COMMISSION_RATE: 1.8,    // 1.8% comisión
  TAX_RATE: 0.16,          // 16% IVA
  CURRENCY: 'MXN',         // Peso mexicano
  LOCALE: 'es-MX'          // Localización mexicana
};
```

#### Personalización de Temas
El sistema utiliza Tailwind CSS con variables CSS personalizadas para facilitar la personalización de colores y temas.

### 📈 Próximas Funcionalidades

- [ ] Gráficos interactivos con Chart.js
- [ ] Notificaciones de vencimientos
- [ ] Exportación múltiple (PDF, Excel)
- [ ] Modo offline con service workers
- [ ] Integración con APIs bancarias
- [ ] Calculadora de refinanciamiento
- [ ] Historial de pagos realizados
- [ ] Reportes financieros avanzados

### 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

### 🔗 Links Útiles

- [Documentación de React](https://reactjs.org/)
- [Documentación de Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React Icons](https://lucide.dev/)

---

**PréstamoBnk** - Desarrollado con ❤️ para el mercado financiero mexicano+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
