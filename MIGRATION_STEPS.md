# 🎯 Migración de Datos - Instrucciones Paso a Paso

## ✅ Estado Actual
- ✅ Servidor API ejecutándose en `http://localhost:3001`
- ✅ Aplicación React ejecutándose en `http://localhost:5174`
- ✅ Base de datos SQLite configurada
- ✅ Sistema de migración implementado

## 🚀 Cómo Migrar tus Datos

### Opción 1: Usando la Interfaz Web (Recomendado)

1. **Abre la aplicación**: `http://localhost:5174`
2. **Ve a Migración**: Navegar a `/migracion` o usar el menú "Migración"
3. **Sigue las instrucciones** en pantalla

### Opción 2: Usando Scripts de Consola (Rápido)

#### A. Crear Datos de Prueba (si no tienes datos)
```javascript
// 1. Abre F12 → Console en el navegador
// 2. Copia y pega todo el contenido de: scripts/createTestData.js
// 3. Presiona Enter
```

#### B. Migrar Datos Existentes
```javascript
// 1. Abre F12 → Console en el navegador
// 2. Copia y pega todo el contenido de: scripts/migrate.js
// 3. Presiona Enter
// 4. El script se ejecutará automáticamente
```

### Opción 3: Usando el LoanContext (Programático)

```javascript
// En cualquier componente React que use useLoan()
const { migrateToAPI } = useLoan();

const handleMigration = async () => {
  const result = await migrateToAPI();
  console.log(result);
};
```

## 📋 Pasos Detallados

### 1. Preparación
- [x] Servidores ejecutándose
- [x] Datos en localStorage (opcional - se pueden crear)
- [x] API disponible en puerto 3001

### 2. Migración
```bash
# Opción A: Interfaz web
1. Ir a http://localhost:5174/migracion
2. Hacer clic en "Migrar Ahora"

# Opción B: Consola del navegador
1. F12 → Console
2. Pegar script de migrate.js
3. Seguir instrucciones en consola
```

### 3. Verificación
```javascript
// Verificar que los datos se migraron correctamente
fetch('http://localhost:3001/api/loans')
  .then(res => res.json())
  .then(loans => console.log('Préstamos en BD:', loans.length));
```

### 4. Limpieza (Opcional)
```javascript
// Solo después de verificar que la migración fue exitosa
migrationUtils.clearLocalStorage();
```

## 🛠️ Comandos Útiles

### Gestión de Servidores
```bash
# Iniciar solo el cliente
npm run dev

# Iniciar solo el servidor API
npm run server

# Iniciar ambos simultáneamente
npm run dev:full
```

### Gestión de Base de Datos
```bash
# Ver la base de datos gráficamente
npm run db:studio

# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# Resetear base de datos
npm run db:reset
```

### Verificaciones Rápidas
```bash
# Verificar API
curl http://localhost:3001/api/health

# Verificar préstamos en BD
curl http://localhost:3001/api/loans

# Ver estadísticas
curl http://localhost:3001/api/stats
```

## 🔍 Troubleshooting

### Error: "API no disponible"
```bash
# Verificar que el servidor esté ejecutándose
netstat -an | findstr :3001

# Reiniciar servidor si es necesario
npm run server
```

### Error: "No hay datos para migrar"
```javascript
// Verificar localStorage
console.log(localStorage.getItem('prestamoBnk_loans'));

// Crear datos de prueba si es necesario
// (ejecutar scripts/createTestData.js)
```

### Error: "Base de datos corrupta"
```bash
# Resetear base de datos
npm run db:reset

# Aplicar migraciones nuevamente
npm run db:migrate
```

## 📊 Lo que se Migra

- ✅ **Información de Préstamos**: Nombre, monto, tasas, plazos
- ✅ **Cálculos Financieros**: Pagos mensuales, intereses, comisiones
- ✅ **Fechas**: Inicio, fin, fechas de creación
- ✅ **Metadatos**: IDs únicos, timestamps
- ✅ **Configuraciones**: Tasas de IVA, comisiones

## 🎉 Después de la Migración

1. **Verificar Dashboard**: Los números deben coincidir
2. **Probar Funcionalidades**: Crear, editar, eliminar préstamos
3. **Verificar Tabla de Amortización**: Debe mostrar correctamente los pagos
4. **Crear Backup Regular**: Usar la función de backup del sistema

## 💡 Consejos

- **Migración es Segura**: Tus datos originales permanecen en localStorage
- **Duplicados se Saltan**: No se crearán préstamos duplicados
- **Rollback Disponible**: Puedes volver a localStorage si hay problemas
- **Backup Automático**: Se crea backup antes de limpiar localStorage

---

**¿Necesitas ayuda?** Revisa el archivo `MIGRATION_GUIDE.md` para información más detallada.
