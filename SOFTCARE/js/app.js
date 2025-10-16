// Módulo principal de la aplicación
class SoftCareApp {
    constructor() {
        this.currentUser = {
            name: "Administrador",
            email: "admin@softcare.com",
            clinic: "Clínica Demo SoftCare"
        };
        this.modules = {
            dashboard: new DashboardModule(),
            pacientes: new PacientesModule(),
            citas: new CitasModule(),
            facturacion: new FacturacionModule(),
            inventario: new InventarioModule(),
            reportes: new ReportesModule()
        };
        this.init();
    }

    init() {
        this.showMainSystem();
        this.setupEventListeners();
        this.setupNavigation();
        this.updateTime();
        setInterval(() => this.updateTime(), 60000); // Actualizar cada minuto
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('current-time').textContent = timeString;
    }

    setupEventListeners() {
        // Navegación entre módulos
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModule(link.getAttribute('href').substring(1));
            });
        });
    }

    setupNavigation() {
        // Navegación inicial al dashboard
        this.showModule('dashboard');
    }

    showModule(moduleName) {
        // Ocultar todos los módulos
        document.querySelectorAll('.module').forEach(module => {
            module.classList.remove('active');
        });

        // Remover clase active de todos los enlaces
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Mostrar módulo seleccionado
        const targetModule = document.getElementById(moduleName);
        const targetLink = document.querySelector(`[href="#${moduleName}"]`);

        if (targetModule && targetLink) {
            targetModule.classList.add('active');
            targetLink.classList.add('active');
            
            // Inicializar módulo si es necesario
            if (this.modules[moduleName] && typeof this.modules[moduleName].init === 'function') {
                this.modules[moduleName].init();
            }
        }
    }

    showMainSystem() {
        // El sistema principal ya está visible por defecto
        console.log('Sistema SoftCare S.A.S. inicializado');
    }
}

// Módulo del Dashboard
class DashboardModule {
    init() {
        this.loadStatistics();
    }

    loadStatistics() {
        const pacientes = PacienteService.getPacientes();
        const citas = CitaService.getCitas();
        const facturas = FacturacionService.getFacturas();
        const inventario = InventarioService.getMedicamentos();

        // Estadísticas básicas
        document.getElementById('total-pacientes').textContent = pacientes.length;
        
        const today = new Date().toISOString().split('T')[0];
        const citasHoy = citas.filter(cita => cita.fecha === today).length;
        document.getElementById('citas-hoy').textContent = citasHoy;

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const facturacionMes = facturas.reduce((total, factura) => {
            const facturaDate = new Date(factura.fecha);
            if (facturaDate.getMonth() === currentMonth && 
                facturaDate.getFullYear() === currentYear) {
                return total + factura.total;
            }
            return total;
        }, 0);
        document.getElementById('facturacion-mes').textContent = `$${facturacionMes.toLocaleString()}`;

        const inventarioBajo = inventario.filter(item => item.cantidad <= item.stockMinimo).length;
        document.getElementById('inventario-bajo').textContent = inventarioBajo;
    }
}

// Servicios de datos (simulados)
class DataService {
    static initSampleData() {
        // Datos de ejemplo para demostración
        if (!localStorage.getItem('pacientes')) {
            const samplePacientes = [
                {
                    id: 1,
                    nombre: "María González",
                    email: "maria.gonzalez@email.com",
                    telefono: "3001234567",
                    fechaNacimiento: "1985-05-15",
                    direccion: "Calle 123 #45-67",
                    alergias: "Penicilina",
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    nombre: "Carlos Rodríguez",
                    email: "carlos.rodriguez@email.com",
                    telefono: "3109876543",
                    fechaNacimiento: "1978-12-03",
                    direccion: "Av. Principal #89-10",
                    alergias: "Ninguna",
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('pacientes', JSON.stringify(samplePacientes));
        }

        if (!localStorage.getItem('citas')) {
            const today = new Date().toISOString().split('T')[0];
            const sampleCitas = [
                {
                    id: 1,
                    pacienteId: 1,
                    pacienteNombre: "María González",
                    medico: "dr_garcia",
                    fecha: today,
                    hora: "09:00",
                    motivo: "Control médico general",
                    observaciones: "Paciente con historial de alergias",
                    estado: "confirmada",
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('citas', JSON.stringify(sampleCitas));
        }

        if (!localStorage.getItem('medicamentos')) {
            const sampleMedicamentos = [
                {
                    id: 1,
                    nombre: "Paracetamol 500mg",
                    categoria: "Analgésico",
                    cantidad: 150,
                    stockMinimo: 50,
                    precio: 2500,
                    estado: "disponible"
                },
                {
                    id: 2,
                    nombre: "Amoxicilina 250mg",
                    categoria: "Antibiótico",
                    cantidad: 45,
                    stockMinimo: 30,
                    precio: 4800,
                    estado: "bajo_stock"
                }
            ];
            localStorage.setItem('medicamentos', JSON.stringify(sampleMedicamentos));
        }
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar datos de ejemplo
    DataService.initSampleData();
    
    // Inicializar aplicación
    window.softCareApp = new SoftCareApp();
});