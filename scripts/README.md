# Scripts de Gestión de Clientes

Este directorio contiene scripts para gestionar los clientes de prueba en el sistema PréstamoBnk.

## Scripts Disponibles

### 📝 `createTestClients.js`
**Propósito**: Crear clientes de prueba (sin eliminar existentes)
**Uso**: `node scripts/createTestClients.js`
**Descripción**: Crea los clientes de prueba definidos en el script. Si ya existen clientes con los mismos datos, pueden aparecer duplicados.

### 🔄 `resetClients.js` ⭐ **RECOMENDADO**
**Propósito**: Eliminar todos los clientes existentes y crear nuevos clientes de prueba
**Uso**: `node scripts/resetClients.js`
**Descripción**: 
1. Elimina todos los clientes existentes en la base de datos
2. Crea los nuevos clientes de prueba definidos
3. Proceso completo y limpio para restablecer los datos de prueba

### 🗑️ `deleteAllClients.js`
**Propósito**: Eliminar todos los clientes existentes
**Uso**: `node scripts/deleteAllClients.js`
**Descripción**: Elimina todos los clientes de la base de datos sin crear nuevos. Útil para limpiar completamente los datos.

## Clientes de Prueba Incluidos

Los scripts crean los siguientes clientes de prueba:

1. **Ricardo Gama**
   - Email: richardgama@yahoo.com.mx
   - Teléfono: 55 1537 7335
   - RFC: GAGR840523KL3
   - CURP: GAGR840523HMCMRC00
   - Dirección: Calle Juarez 5210

2. **Dafne Avila**
   - Email: dafnefam@gmail.com
   - Teléfono: 555-345-6789
   - RFC: AIMD850917F14
   - CURP: AIMD850917MGRVRF13
   - Dirección: Av. Universidad 789, Col. Del Valle, CDMX, CP 03100

3. **BIENES RAICES S.A.**
   - Email: bienes.raices@hotmail.com
   - Teléfono: 555-456-7890
   - RFC: (vacío - empresa)
   - CURP: (vacío - empresa)
   - Dirección: Blvd. Díaz Ordaz 321, Col. San Pedro, Monterrey, NL, CP 64650

## Prerequisitos

- El servidor API debe estar corriendo en `http://localhost:3001`
- Node.js 18+ (para compatibilidad con fetch nativo)

## Flujo de Trabajo Recomendado

Para trabajar con datos de prueba limpios:

1. **Reset completo**: `node scripts/resetClients.js`
2. **Solo agregar clientes**: `node scripts/createTestClients.js`
3. **Solo limpiar**: `node scripts/deleteAllClients.js`

## Notas

- Los scripts son seguros y manejan errores apropiadamente
- Todos los scripts proporcionan feedback detallado en la consola
- Los clientes se eliminan de forma individual para evitar conflictos de foreign keys
- El script `resetClients.js` incluye una pausa de 1 segundo entre eliminación y creación para asegurar consistencia
