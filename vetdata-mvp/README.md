# VetData MVP - Sistema de Gestión Veterinaria

## 🐾 Descripción

VetData MVP es un **Producto Mínimo Viable** (MVP) de un sistema de gestión integral para clínicas veterinarias. Desarrollado como demostración del modelo de negocio VetData S.A.S., implementa las funcionalidades core necesarias para la administración completa de una clínica veterinaria.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- Login con roles diferenciados (Veterinario, Administrativo, Recepcionista)
- Sesión persistente en localStorage
- Usuarios de prueba predefinidos

### 📊 Dashboard Interactivo
- Estadísticas en tiempo real (citas del día, ingresos mensuales)
- Próximas citas en los siguientes 7 días
- Actividad reciente del sistema
- Acciones rápidas para funciones principales

### 👥 Gestión de Clientes y Mascotas
- Registro completo de propietarios con validación colombiana
- Registro de mascotas vinculadas a propietarios
- Búsqueda y filtrado avanzado
- Perfiles completos con información médica

### 📅 Agenda Digital de Citas
- Calendario interactivo con diferentes vistas
- Programación de citas con estados
- Asignación de veterinarios y control de disponibilidad
- Recordatorios y seguimiento

### 🏥 Historial Clínico
- Registro completo de consultas médicas
- Diagnósticos, tratamientos y medicamentos
- Historial completo por mascota
- Seguimiento de tratamientos y evolución

### 💰 Sistema de Facturación
- Generación automática de facturas
- Cálculo de totales con servicios personalizables
- Estados de pago y métodos de pago
- Reportes básicos de facturación

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+, React 18
- **Estilos**: CSS3 con sistema de design tokens
- **Almacenamiento**: LocalStorage (sin servidor requerido)
- **Validación**: Sistema completo de validación en tiempo real
- **Responsive**: Completamente adaptable a dispositivos móviles

## 🎨 Diseño

El sistema implementa los colores corporativos de VetData:
- **Verde menta (#40E0D0)**: Salud, frescura y naturaleza
- **Azul verdoso (#20B2AA)**: Tecnología, estabilidad y seguridad
- **Beige claro (#F5F5DC)**: Calidez, cercanía y confianza
- **Blanco (#FFFFFF)**: Limpieza, transparencia y profesionalismo

## 📂 Estructura del Proyecto

```
vetdata-mvp/
├── index.html                  # Página principal
├── css/
│   ├── styles.css             # Estilos base y variables
│   ├── components.css         # Componentes UI
│   └── responsive.css         # Estilos responsive
├── js/
│   ├── app.js                 # Aplicación React principal
│   ├── components/
│   │   ├── Auth.js           # Componente de autenticación
│   │   ├── Dashboard.js      # Dashboard principal
│   │   ├── Clients.js        # Gestión de clientes
│   │   ├── Pets.js           # Gestión de mascotas
│   │   ├── Appointments.js   # Sistema de citas
│   │   ├── Clinical.js       # Historial clínico
│   │   └── Billing.js        # Sistema de facturación
│   ├── utils/
│   │   ├── storage.js        # Manejo de localStorage
│   │   ├── validators.js     # Validadores de formularios
│   │   └── helpers.js        # Funciones auxiliares
│   └── data/
│       └── sample-data.js    # Datos de muestra
└── README.md                  # Este archivo
```

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- **No requiere servidor**
- **No requiere base de datos**
- **No requiere instalación adicional**

### Pasos de Instalación

1. **Descargar el proyecto**
   - Descarga todos los archivos del proyecto
   - Mantén la estructura de carpetas tal como se muestra arriba

2. **Abrir la aplicación**
   - Abre el archivo `index.html` en tu navegador
   - La aplicación se carga automáticamente
   - Los datos de muestra se cargan la primera vez

3. **Acceso al sistema**
   - Usa las credenciales de prueba proporcionadas
   - El sistema está listo para usar inmediatamente

## 👤 Credenciales de Acceso

### Usuarios de Prueba Disponibles:

- **Veterinario**
  - Usuario: `vet1`
  - Contraseña: `123456`
  - Acceso: Todas las funcionalidades

- **Administrativo**
  - Usuario: `admin1`
  - Contraseña: `123456`
  - Acceso: Dashboard, Citas, Clientes, Mascotas, Facturación

- **Recepcionista**
  - Usuario: `recep1`
  - Contraseña: `123456`
  - Acceso: Dashboard, Citas, Clientes, Mascotas

## 📱 Características del MVP

### Datos de Muestra Incluidos
- 3 usuarios con diferentes roles
- 5 clientes registrados
- 6 mascotas con información completa
- 6 citas (pasadas y futuras)
- 2 historiales clínicos con tratamientos
- 3 facturas con diferentes estados

### Funcionalidades Implementadas
- ✅ Autenticación y roles de usuario
- ✅ Dashboard con estadísticas en tiempo real
- ✅ CRUD completo de clientes y mascotas
- ✅ Sistema de citas con calendario
- ✅ Historial clínico detallado
- ✅ Facturación con cálculos automáticos
- ✅ Búsqueda y filtrado en todas las secciones
- ✅ Validación de formularios en tiempo real
- ✅ Responsive design para móviles
- ✅ Notificaciones toast
- ✅ Estados de sesión persistentes

## 🔧 Funciones Avanzadas

### Exportar/Importar Datos
```javascript
// Exportar todos los datos
VetDataUtils.exportData();

// Importar datos desde JSON
VetDataUtils.importData(jsonString);

// Limpiar todos los datos
VetDataUtils.clearAllData();
```

### Formateo de Datos
```javascript
// Formatear moneda colombiana
Helpers.formatCurrency(150000); // "$150.000"

// Formatear fechas
Helpers.formatDate('2024-12-25'); // "25/12/2024"

// Calcular edad de mascotas
Helpers.getAgeString('2020-03-15'); // "4 años, 9 meses"
```

## 📊 Reportes y Estadísticas

El sistema calcula automáticamente:
- Citas programadas para el día
- Ingresos mensuales totales
- Total de clientes y mascotas registradas
- Próximas citas en los siguientes 7 días
- Actividad reciente del sistema

## 🛡️ Validaciones Implementadas

- **Teléfonos**: Formato colombiano (3001234567)
- **Documentos**: Cédulas de 8-10 dígitos
- **Emails**: Validación RFC completa
- **Fechas**: Validación de rangos y formatos
- **Formularios**: Validación en tiempo real con feedback visual

## 📱 Responsive Design

- **Móvil**: < 768px - Navegación colapsable, tablas adaptativas
- **Tablet**: 768px - 1024px - Layout optimizado
- **Desktop**: > 1024px - Experiencia completa

## 🎯 Propósito del MVP

Este MVP demuestra la **propuesta de valor de VetData S.A.S.**:
> *"Tu clínica en orden, tus pacientes en buenas patas"*

Diseñado específicamente para clínicas veterinarias pequeñas y medianas en Colombia, el sistema aborda los principales pain points identificados en el modelo de negocio:

1. **Gestión ineficiente de citas** → Agenda digital inteligente
2. **Historiales clínicos en papel** → Digitalizacion completa
3. **Facturación manual propensa a errores** → Automatización total
4. **Falta de seguimiento de tratamientos** → Historial centralizado
5. **Dificultad para generar reportes** → Dashboard con estadísticas

## 🔮 Próximas Fases de Desarrollo

El MVP está diseñado para evolucionar hacia:

### Fase 2: Integración Backend
- Base de datos PostgreSQL/MySQL
- API REST con Node.js/Express
- Autenticación JWT
- Sincronización multi-dispositivo

### Fase 3: Funcionalidades Avanzadas
- Módulo de inventario farmacéutico
- Sistema de recordatorios automáticos
- Integración con WhatsApp Business
- Reportes avanzados y analytics

### Fase 4: Integraciones
- Pasarelas de pago (PSE, tarjetas)
- Integración con laboratorios
- Sistema de teleconsulta
- App móvil nativa

### Fase 5: Escalabilidad
- Arquitectura microservicios
- Sistema de respaldo automático
- Multi-tenancy para franquicias
- Integración con dispositivos IoT

## 📞 Soporte y Contacto

Este es un MVP de demostración desarrollado para presentar el modelo de negocio VetData S.A.S. 

Para consultas sobre el desarrollo completo del sistema:
- **Email**: desarrollo@vetdata.com (ejemplo)
- **Teléfono**: +57 300 123 4567 (ejemplo)

## 📄 Licencia

Este MVP es una demostración del modelo de negocio. Todos los derechos reservados VetData S.A.S. 2024.

---

**¡Gracias por probar VetData MVP!** 🐾

*Sistema desarrollado con ❤️ para el cuidado de nuestras mascotas*