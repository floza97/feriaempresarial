# 🚗 ParkManager v2.0 - Sistema Seguro de Gestión de Parqueadero

Sistema web completo con autenticación, control de vehículos y historial detallado para la administración profesional de parqueaderos.

## 🆕 Características v2.0

### 🔐 Sistema de Autenticación
- Login seguro con cifrado SHA-256
- Sesiones persistentes con tokens
- Protección de acceso a todas las páginas
- Cierre de sesión seguro

### 🎫 Gestión de Vehículos
- **Registro de Entrada**: Con código único de verificación y ticket imprimible
- **Registro de Salida**: Proceso simplificado solo con placa del vehículo
- **Códigos de Verificación**: Visibles en tabla para referencia interna
- **Tickets Automáticos**: Entrada y salida con todos los detalles
- **Cálculo Automático**: Tarifas por fracción de 15 minutos

### 📊 Historial Completo
- **Página dedicada**: Vista completa de todas las operaciones
- **Filtros avanzados**: Por placa, tipo de vehículo y rango de fechas
- **Estadísticas**: Totales, promedios y métricas clave
- **Exportación**: Descarga de datos en formato CSV
- **Ordenamiento**: Registros más recientes primero

## 📋 Funcionalidades Completas

### Panel Principal (index.html)
✅ Dashboard con estadísticas en tiempo real  
✅ Registro de entrada con datos completos  
✅ Registro de salida simplificado (solo placa)  
✅ Tabla de vehículos activos con código visible  
✅ Generación automática de tickets  
✅ Botón de acceso al historial  

### Página de Historial (historial.html)
✅ Visualización de todos los registros históricos  
✅ Filtros por placa, tipo y fechas  
✅ Estadísticas completas (ingresos, promedios, tiempos)  
✅ Exportación a CSV con un click  
✅ Diseño responsive y profesional  

### Sistema de Tickets
✅ **Ticket de Entrada**: Código QR, código de verificación, datos del vehículo  
✅ **Ticket de Salida**: Cálculo detallado, tiempo total, monto a pagar  
✅ Función de impresión integrada  
✅ Formato profesional listo para cliente  

## 🚀 Tipos de Vehículos y Tarifas

| Tipo | Tarifa/Hora | Fracción Mínima |
|------|-------------|-----------------|
| 🏍️ Moto | $2,000 COP | 15 minutos |
| 🚗 Carro | $3,500 COP | 15 minutos |
| 🚙 Camioneta | $4,000 COP | 15 minutos |

## 🔑 Credenciales de Acceso

**Por Defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

⚠️ **IMPORTANTE**: Cambie estas credenciales en producción

## 💻 Flujo de Uso

### 1. Inicio de Sesión
1. Acceder a `login.html`
2. Ingresar usuario y contraseña
3. Sistema valida y crea sesión
4. Redirección al panel principal

### 2. Registro de Entrada
1. Completar formulario:
   - Placa (obligatorio)
   - Tipo de vehículo (obligatorio)
   - Nombre del propietario (obligatorio)
   - Teléfono (obligatorio)
2. Click en "Registrar Entrada"
3. Sistema genera:
   - Código único (ej: ABC-1234)
   - Ticket con QR code
   - Registro en tabla de activos
4. Imprimir y entregar ticket al cliente

### 3. Registro de Salida (SIMPLIFICADO)
1. Cliente presenta vehículo
2. Ingresar **solo la PLACA** en el formulario
3. Click en "Procesar Salida"
4. Sistema genera ticket con:
   - Tiempo total transcurrido
   - Cálculo automático del monto
   - Detalles completos
5. Cliente paga y retira vehículo
6. Confirmar y cerrar ticket

### 4. Consultar Historial
1. Click en botón "📊 Ver Historial"
2. Visualizar todos los registros
3. Aplicar filtros según necesidad
4. Exportar datos a CSV si es necesario
5. Volver al panel principal

## 📁 Estructura del Proyecto

```
parkmanager/
├── login.html          # Página de autenticación
├── index.html          # Panel principal del sistema
├── historial.html      # Página de historial (NUEVO)
├── app.js              # Lógica del panel principal
├── historial.js        # Lógica del historial (NUEVO)
├── vercel.json         # Configuración de Vercel
└── README.md           # Documentación
```

## 🚀 Despliegue en Vercel

### Opción 1: GitHub (Recomendado)

```bash
git init
git add .
git commit -m "ParkManager v2.0 - Sistema completo con historial"
git remote add origin https://github.com/TU-USUARIO/parkmanager.git
git branch -M main
git push -u origin main
```

Luego en [vercel.com](https://vercel.com):
1. New Project → Import repository
2. Deploy

### Opción 2: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### Opción 3: Drag & Drop
Arrastra la carpeta completa a [vercel.com/new](https://vercel.com/new)

## 🔧 Personalización

### Modificar Tarifas
Edita en `app.js`:
```javascript
const TARIFAS = {
    moto: 2000,
    carro: 3500,
    camioneta: 4000
};
```

### Cambiar Capacidad
```javascript
const CAPACIDAD_TOTAL = 50;
```

### Ajustar Fracción Mínima
```javascript
const FRACCION_MINIMA = 15; // minutos
```

### Agregar Usuarios
En `login.html`, generar hash SHA-256 y agregar:
```javascript
const USERS = {
    'admin': 'hash_actual',
    'operador1': 'nuevo_hash',
    'supervisor': 'otro_hash'
};
```

## 📊 Estadísticas Disponibles

### Panel Principal
- Vehículos activos en tiempo real
- Espacios disponibles
- Ingresos del día actual
- Total de vehículos atendidos hoy

### Página de Historial
- Total de registros históricos
- Ingresos totales acumulados
- Promedio de ingreso por vehículo
- Tiempo promedio de estadía

## 🔍 Filtros del Historial

**Filtros disponibles:**
- 🔤 Por placa: Búsqueda parcial
- 🚗 Por tipo: Moto, Carro, Camioneta
- 📅 Por rango de fechas: Desde/Hasta

**Opciones:**
- 🔍 Aplicar filtros
- 🔄 Limpiar filtros
- 📥 Exportar CSV

## 📥 Exportación de Datos

El sistema permite exportar el historial completo a CSV con:
- Todos los campos del registro
- Formato compatible con Excel
- Nombre de archivo con fecha automática
- Encoding UTF-8 para caracteres especiales

## 🔒 Seguridad

### Implementada
✅ Autenticación con SHA-256  
✅ Tokens de sesión únicos  
✅ Validación en cada página  
✅ Códigos de verificación únicos  
✅ Registro de operadores  
✅ Datos cifrados en LocalStorage  

### Recomendaciones para Producción
⚠️ Implementar backend con API REST  
⚠️ Base de datos externa (PostgreSQL/MySQL)  
⚠️ HTTPS obligatorio  
⚠️ Autenticación OAuth 2.0  
⚠️ Backup automático de datos  
⚠️ Logs de auditoría  

## 🐛 Solución de Problemas

### El registro de salida no funciona
✅ **SOLUCIONADO**: Sistema simplificado, solo requiere placa

### No aparece el ticket
✅ **SOLUCIONADO**: Validaciones mejoradas y display corregido

### Pasos de verificación:
1. Abrir consola del navegador (F12)
2. Verificar que hay vehículos registrados
3. Comprobar que la placa es correcta
4. Revisar mensajes en consola

### Los datos se pierden
- LocalStorage se limpia al borrar datos del navegador
- Exportar historial periódicamente a CSV
- Considerar implementar backend para persistencia

## 📱 Compatibilidad

✅ Chrome, Edge, Firefox, Safari (últimas versiones)  
✅ Dispositivos móviles iOS/Android  
✅ Tablets y escritorio  
✅ Impresoras térmicas y estándar  

## 🎯 Mejoras Futuras Sugeridas

- [ ] Backend con Node.js/Express
- [ ] Base de datos PostgreSQL
- [ ] Autenticación JWT
- [ ] Roles de usuario (Admin, Operador, Supervisor)
- [ ] Reportes PDF
- [ ] Notificaciones por email/SMS
- [ ] Integración con pasarelas de pago
- [ ] App móvil nativa
- [ ] Dashboard con gráficos
- [ ] API REST pública

## 📄 Licencia

Proyecto de código abierto para fines educativos y comerciales.

## 👨‍💻 Desarrollo

**Versión**: 2.0  
**Última actualización**: Octubre 2025  
**Enfoque**: MVP mejorado con seguridad y trazabilidad completa

## 🎉 Novedades v2.0

✨ **Autenticación obligatoria**  
✨ **Proceso de salida simplificado**  
✨ **Página de historial dedicada**  
✨ **Filtros y exportación avanzada**  
✨ **Estadísticas completas**  
✨ **Diseño responsive mejorado**  

---

## 📞 Soporte

Para problemas, mejoras o consultas, crear un issue en el repositorio.

**¡Sistema profesional listo para producción en Vercel! 🚀**
