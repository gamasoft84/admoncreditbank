# Guía de Contribución - PréstamoBnk

¡Gracias por tu interés en contribuir al proyecto PréstamoBnk! 🎉

## 🚀 Configuración del Entorno de Desarrollo

### Prerequisitos
- Node.js 18+ y npm
- Git

### Instalación
```bash
git clone <repository-url>
cd admonCreditosBnk
npm install
npm run dev
```

## 📝 Estándares de Código

### Estructura de Commits
Utilizamos [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/):

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[pie(s) de página opcional(es)]
```

#### Tipos de Commit
- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan funcionalidad)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

#### Ejemplos
```bash
feat(calculator): add VAT calculation for interests
fix(dashboard): correct loan status display
docs(readme): update installation instructions
```

### Estilo de Código
- **React**: Functional components con hooks
- **JavaScript**: ES6+ con módulos ES
- **CSS**: Tailwind CSS classes únicamente
- **Naming**: camelCase para variables, PascalCase para componentes

## 🏦 Reglas de Negocio

### Cálculos Financieros
- Comisión de apertura: 1.8% + IVA 16%
- IVA sobre intereses: 16% mensual
- Moneda: Pesos mexicanos (MXN)
- Fechas: Formato dd/mm/yyyy

### Validaciones
- Monto mínimo: $1,000 MXN
- Monto máximo: $10,000,000 MXN
- Plazo mínimo: 1 mes
- Plazo máximo: 360 meses (30 años)
- Tasa de interés: 0.1% - 50% anual

## 🔄 Proceso de Desarrollo

### Branching Strategy
- `master`: Código de producción
- `develop`: Rama de desarrollo principal
- `feature/*`: Nuevas funcionalidades
- `hotfix/*`: Correcciones urgentes

### Workflow
1. Crear rama desde `develop`
2. Desarrollar funcionalidad
3. Hacer commits siguiendo convenciones
4. Push y crear Pull Request
5. Code review
6. Merge a `develop`

## 🧪 Testing

### Ejecutar Tests
```bash
npm run test
npm run test:coverage
```

### Escribir Tests
- Unit tests para utilities
- Integration tests para componentes
- E2E tests para flujos críticos

## 📋 Checklist para Pull Requests

- [ ] Código sigue estándares de estilo
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Commits siguen convenciones
- [ ] Sin errores de ESLint
- [ ] Build funciona correctamente

## 🏷️ Versionado

Seguimos [Semantic Versioning](https://semver.org/lang/es/):

- **MAJOR**: Cambios incompatibles en API
- **MINOR**: Nueva funcionalidad compatible
- **PATCH**: Correcciones de errores

### Comandos de Versión
```bash
npm run version:patch  # 1.0.0 → 1.0.1
npm run version:minor  # 1.0.0 → 1.1.0
npm run version:major  # 1.0.0 → 2.0.0
```

## 📞 Contacto

Para preguntas sobre contribuciones:
- Abrir un issue en GitHub
- Email: developer@prestamobnk.com

¡Gracias por contribuir! 🚀
