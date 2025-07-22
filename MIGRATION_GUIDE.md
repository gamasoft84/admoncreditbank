# 🔄 Migración de Datos - PréstamoBnk

## Guía Completa de Migración de localStorage a SQLite

### 📋 Resumen

Esta aplicación ahora soporta almacenamiento en base de datos SQLite usando Prisma ORM, proporcionando mayor seguridad, rendimiento y capacidades avanzadas de consulta. Si tienes datos almacenados en localStorage, puedes migrarlos fácilmente.

### 🚀 Pasos para Migrar

#### 1. **Verificar Datos Existentes**
- Abre la aplicación en tu navegador: `http://localhost:5174`
- Si tienes datos en localStorage, verás un banner azul en el Dashboard
- Haz clic en "Migrar Datos" para acceder al panel de migración

#### 2. **Acceder al Panel de Migración**
- **Opción A**: Desde el banner del Dashboard → "Migrar Datos"
- **Opción B**: Navegar directamente a `/migracion`
- **Opción C**: Usar el menú de navegación → "Migración"

#### 3. **Proceso de Migración**
1. **Verificar Estado**: El panel mostrará automáticamente:
   - Cantidad de préstamos en localStorage
   - Estado de conexión a la base de datos
   - Préstamos existentes en la BD

2. **Crear Backup (Recomendado)**:
   ```
   Clic en "Crear Backup" → Descarga archivo JSON
   ```

3. **Simular Migración (Opcional)**:
   ```
   Clic en "Simular Migración" → Ver qué se migrará
   ```

4. **Ejecutar Migración**:
   ```
   Clic en "Migrar Ahora" → Transferir datos a SQLite
   ```

5. **Limpiar localStorage (Opcional)**:
   ```
   Clic en "Limpiar localStorage" → Remover datos locales
   ```

### 🧪 Crear Datos de Prueba

Si no tienes datos para migrar pero quieres probar la funcionalidad:

1. **Abrir Consola del Navegador** (F12 → Console)
2. **Ejecutar Script de Prueba**:
   ```javascript
   // Copiar y pegar el contenido de scripts/createTestData.js
   ```
3. **Ver Banner de Migración** en el Dashboard

### 🔧 Configuración del Servidor

#### Requisitos Previos
```bash
# Dependencias instaladas
npm install prisma @prisma/client
npm install express cors
npm install concurrently
```

#### Scripts Disponibles
```bash
# Iniciar solo el cliente React
npm run dev

# Iniciar solo el servidor API
npm run server

# Iniciar cliente y servidor simultáneamente
npm run dev:full

# Gestión de base de datos
npm run db:generate    # Generar cliente Prisma
npm run db:migrate     # Aplicar migraciones
npm run db:studio      # Abrir Prisma Studio
npm run db:reset       # Resetear base de datos
```

### 📊 Arquitectura de Datos

#### Base de Datos SQLite
```
📁 prisma/
├── 📄 schema.prisma    # Esquema de base de datos
├── 📁 migrations/      # Migraciones aplicadas
└── 📄 dev.db          # Base de datos SQLite
```

#### API Endpoints
```
GET    /api/health      # Estado del servidor
GET    /api/loans       # Obtener todos los préstamos
POST   /api/loans       # Crear nuevo préstamo
PUT    /api/loans/:id   # Actualizar préstamo
DELETE /api/loans/:id   # Eliminar préstamo
GET    /api/stats       # Estadísticas generales
```

### 🔀 Sistema Híbrido

La aplicación detecta automáticamente si la API está disponible:

- **✅ API Disponible**: Usa base de datos SQLite
- **❌ API No Disponible**: Fallback a localStorage
- **🔄 Migración Automática**: Detecta y ofrece migrar datos

### 🛡️ Seguridad y Backup

#### Backups Automáticos
- Se crea backup antes de migración
- Archivo JSON descargable
- Copia en localStorage con timestamp

#### Datos Preservados
- ✅ Toda la información de préstamos
- ✅ Historiales de pagos
- ✅ Metadatos y fechas
- ✅ Configuraciones personalizadas

### 🚨 Troubleshooting

#### Error: "API no disponible"
```bash
# Verificar que el servidor esté ejecutándose
npm run server

# Verificar conexión
curl http://localhost:3001/api/health
```

#### Error: "No hay datos para migrar"
```javascript
// Verificar localStorage en consola del navegador
console.log(localStorage.getItem('prestamoBnk_loans'));
```

#### Error: "Base de datos no encontrada"
```bash
# Ejecutar migraciones
npx prisma migrate dev
npx prisma generate
```

### 📈 Beneficios de la Migración

| localStorage | SQLite + Prisma |
|-------------|-----------------|
| ⚠️ Solo en navegador | ✅ Persistente en servidor |
| ⚠️ Límite de 5-10MB | ✅ Sin límites prácticos |
| ⚠️ No relacionales | ✅ Consultas relacionales |
| ⚠️ Sin backups auto | ✅ Backups y migraciones |
| ⚠️ Un dispositivo | ✅ Multi-dispositivo |

### 🎯 Próximos Pasos

Después de migrar exitosamente:

1. **Verificar Datos**: Confirma que todos los préstamos aparezcan
2. **Probar Funcionalidades**: Crear, editar, eliminar préstamos
3. **Crear Backup**: Usar "Crear Backup" regularmente
4. **Explorar Nuevas Características**: Dashboard mejorado, filtros avanzados

---

**💡 Consejo**: La migración es completamente segura y reversible. Tus datos originales permanecen en localStorage hasta que decidas limpiarlos manualmente.
