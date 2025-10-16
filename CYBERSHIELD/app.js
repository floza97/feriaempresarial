// Módulo principal de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la aplicación
    initApp();
});

// Objeto principal de la aplicación
const CyberShieldApp = {
    // Estado de la aplicación
    state: {
        currentUser: null,
        currentSection: 'inicio',
        services: [],
        pricingPlans: [],
        users: [],
        serviceRequests: [],
        reports: []
    },

    // Inicializar la aplicación
    init: function() {
        this.loadData();
        this.setupEventListeners();
        this.renderServices();
        this.renderPricingPlans();
        this.updateStats();
        
        // Verificar si hay un usuario logueado
        const savedUser = localStorage.getItem('cybershield_user');
        if (savedUser) {
            this.state.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        }
    },

    // Cargar datos iniciales
    loadData: function() {
        // Cargar usuarios desde localStorage
        const savedUsers = localStorage.getItem('cybershield_users');
        if (savedUsers) {
            this.state.users = JSON.parse(savedUsers);
        } else {
            // Crear usuario admin por defecto
            this.state.users = [
                {
                    id: 1,
                    name: 'Administrador',
                    email: 'admin@cybershield.com.co',
                    password: 'admin123',
                    company: 'CyberShield S.A.S.',
                    role: 'admin',
                    registrationDate: new Date().toISOString()
                }
            ];
            this.saveUsers();
        }

        // Cargar servicios
        this.state.services = [
            {
                id: 1,
                name: 'Análisis de Vulnerabilidades',
                description: 'Evaluación exhaustiva de sistemas para identificar puntos débiles y posibles vectores de ataque.',
                features: [
                    'Escaneo automatizado de vulnerabilidades',
                    'Análisis manual de configuraciones',
                    'Reporte detallado de riesgos',
                    'Recomendaciones de mitigación'
                ],
                price: 'Consultar'
            },
            {
                id: 2,
                name: 'Monitoreo de Amenazas',
                description: 'Vigilancia continua de redes y sistemas para detectar actividades maliciosas en tiempo real.',
                features: [
                    'Monitoreo 24/7 de redes',
                    'Detección de intrusiones',
                    'Análisis de tráfico sospechoso',
                    'Alertas inmediatas'
                ],
                price: 'Desde $500.000/mes'
            },
            {
                id: 3,
                name: 'Simulación de Ataques (Pentesting)',
                description: 'Ejecución controlada de ataques para evaluar la resistencia de los sistemas de seguridad.',
                features: [
                    'Pruebas de penetración externas',
                    'Pruebas de penetración internas',
                    'Simulación de ingeniería social',
                    'Reporte de hallazgos y recomendaciones'
                ],
                price: 'Consultar'
            },
            {
                id: 4,
                name: 'Capacitación en Ciberseguridad',
                description: 'Programas de formación para equipos técnicos y usuarios finales en buenas prácticas de seguridad.',
                features: [
                    'Talleres de concienciación',
                    'Entrenamiento en respuesta a incidentes',
                    'Simulaciones de phishing',
                    'Material educativo personalizado'
                ],
                price: 'Desde $300.000/persona'
            },
            {
                id: 5,
                name: 'Plan de Respuesta a Incidentes',
                description: 'Desarrollo e implementación de protocolos para manejar eficazmente incidentes de seguridad.',
                features: [
                    'Diseño de planes de respuesta',
                    'Simulaciones de incidentes',
                    'Capacitación del equipo de respuesta',
                    'Revisión y mejora continua'
                ],
                price: 'Consultar'
            },
            {
                id: 6,
                name: 'Firewalls y Sistemas de Protección',
                description: 'Implementación y configuración de barreras de seguridad para redes y sistemas.',
                features: [
                    'Instalación de firewalls',
                    'Configuración de políticas de seguridad',
                    'Monitoreo y mantenimiento',
                    'Actualizaciones periódicas'
                ],
                price: 'Desde $800.000'
            }
        ];

        // Cargar planes de precios
        this.state.pricingPlans = [
            {
                id: 1,
                name: 'Básico',
                price: '$500.000',
                period: 'mensual',
                features: [
                    'Monitoreo básico de redes',
                    'Análisis de vulnerabilidades trimestral',
                    'Soporte por email',
                    'Reportes mensuales'
                ],
                featured: false
            },
            {
                id: 2,
                name: 'Profesional',
                price: '$900.000',
                period: 'mensual',
                features: [
                    'Monitoreo avanzado 24/7',
                    'Análisis de vulnerabilidades mensual',
                    'Soporte prioritario',
                    'Simulación de ataques semestral',
                    'Reportes semanales'
                ],
                featured: true
            },
            {
                id: 3,
                name: 'Empresarial',
                price: '$1.500.000',
                period: 'mensual',
                features: [
                    'Monitoreo integral 24/7',
                    'Análisis de vulnerabilidades continuo',
                    'Soporte dedicado 24/7',
                    'Simulación de ataques trimestral',
                    'Capacitación del personal',
                    'Plan de respuesta a incidentes'
                ],
                featured: false
            }
        ];

        // Cargar solicitudes de servicio
        const savedRequests = localStorage.getItem('cybershield_service_requests');
        if (savedRequests) {
            this.state.serviceRequests = JSON.parse(savedRequests);
        }

        // Cargar reportes
        const savedReports = localStorage.getItem('cybershield_reports');
        if (savedReports) {
            this.state.reports = JSON.parse(savedReports);
        } else {
            // Crear reportes de ejemplo
            this.state.reports = [
                {
                    id: 1,
                    title: 'Auditoría de Seguridad - Sistema Principal',
                    date: '2025-09-15',
                    status: 'completed',
                    userId: 1
                },
                {
                    id: 2,
                    title: 'Análisis de Vulnerabilidades - Servidores',
                    date: '2025-10-05',
                    status: 'in-progress',
                    userId: 1
                },
                {
                    id: 3,
                    title: 'Reporte de Monitoreo - Septiembre 2025',
                    date: '2025-10-01',
                    status: 'completed',
                    userId: 1
                }
            ];
            this.saveReports();
        }
    },

    // Configurar event listeners
    setupEventListeners: function() {
        // Navegación
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href').substring(1);
                this.showSection(target);
                
                // Cerrar menú móvil si está abierto
                const nav = document.querySelector('.nav');
                nav.classList.remove('active');
            });
        });

        // Botones de autenticación
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showModal('loginModal');
        });

        document.getElementById('registerBtn').addEventListener('click', () => {
            this.showModal('registerModal');
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Formularios
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });

        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactForm(e);
        });

        document.getElementById('serviceRequestForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleServiceRequest(e);
        });

        // Botones de llamada a la acción
        document.getElementById('ctaServices').addEventListener('click', () => {
            this.showSection('servicios');
        });

        document.getElementById('ctaContact').addEventListener('click', () => {
            this.showSection('contacto');
        });

        document.getElementById('requestServiceBtn').addEventListener('click', () => {
            this.showModal('serviceRequestModal');
        });

        // Cambiar entre modales de login y registro
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('loginModal');
            this.showModal('registerModal');
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('registerModal');
            this.showModal('loginModal');
        });

        // Cerrar modales
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal.id);
            });
        });

        // Cerrar modal al hacer clic fuera
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Menú móvil
        document.getElementById('mobileMenuBtn').addEventListener('click', () => {
            const nav = document.querySelector('.nav');
            nav.classList.toggle('active');
        });
    },

    // Mostrar sección específica
    showSection: function(sectionId) {
        // Ocultar todas las secciones
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar sección seleccionada
        document.getElementById(sectionId).classList.add('active');

        // Actualizar navegación activa
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        this.state.currentSection = sectionId;
    },

    // Mostrar dashboard
    showDashboard: function() {
        this.showSection('dashboard');
        this.renderUserServices();
        this.renderSecurityStatus();
        this.renderReports();
        
        // Actualizar bienvenida
        document.getElementById('userWelcome').textContent = `Bienvenido, ${this.state.currentUser.name}`;
        
        // Ocultar botones de auth, mostrar info de usuario
        document.querySelector('.auth-buttons').style.display = 'none';
    },

    // Mostrar modal
    showModal: function(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    },

    // Ocultar modal
    hideModal: function(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    },

    // Manejar login
    handleLogin: function(e) {
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        // Validar credenciales
        const user = this.state.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.state.currentUser = user;
            localStorage.setItem('cybershield_user', JSON.stringify(user));
            this.hideModal('loginModal');
            this.showDashboard();
            this.showNotification('success', 'Inicio de sesión exitoso');
        } else {
            this.showNotification('error', 'Credenciales incorrectas');
        }
    },

    // Manejar registro
    handleRegister: function(e) {
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const company = formData.get('company');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Validaciones
        if (password !== confirmPassword) {
            this.showNotification('error', 'Las contraseñas no coinciden');
            return;
        }

        if (this.state.users.find(u => u.email === email)) {
            this.showNotification('error', 'El email ya está registrado');
            return;
        }

        // Crear nuevo usuario
        const newUser = {
            id: this.state.users.length + 1,
            name,
            email,
            company,
            password,
            role: 'client',
            registrationDate: new Date().toISOString()
        };

        this.state.users.push(newUser);
        this.saveUsers();

        this.hideModal('registerModal');
        this.showNotification('success', 'Registro exitoso. Ahora puedes iniciar sesión.');
    },

    // Cerrar sesión
    logout: function() {
        this.state.currentUser = null;
        localStorage.removeItem('cybershield_user');
        
        // Mostrar sección de inicio
        this.showSection('inicio');
        
        // Mostrar botones de auth
        document.querySelector('.auth-buttons').style.display = 'flex';
        
        this.showNotification('success', 'Sesión cerrada correctamente');
    },

    // Manejar formulario de contacto
    handleContactForm: function(e) {
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const company = formData.get('company');
        const service = formData.get('service');
        const message = formData.get('message');

        // En una aplicación real, aquí se enviaría el formulario a un servidor
        console.log('Solicitud de contacto:', {
            name,
            email,
            company,
            service,
            message
        });

        e.target.reset();
        this.showNotification('success', 'Solicitud enviada. Nos pondremos en contacto contigo pronto.');
    },

    // Manejar solicitud de servicio
    handleServiceRequest: function(e) {
        if (!this.state.currentUser) {
            this.showNotification('error', 'Debes iniciar sesión para solicitar un servicio');
            this.hideModal('serviceRequestModal');
            this.showModal('loginModal');
            return;
        }

        const formData = new FormData(e.target);
        const service = formData.get('service');
        const details = formData.get('details');
        const urgency = formData.get('urgency');

        const newRequest = {
            id: this.state.serviceRequests.length + 1,
            userId: this.state.currentUser.id,
            service,
            details,
            urgency,
            status: 'pending',
            requestDate: new Date().toISOString()
        };

        this.state.serviceRequests.push(newRequest);
        this.saveServiceRequests();

        this.hideModal('serviceRequestModal');
        this.showNotification('success', 'Solicitud de servicio enviada correctamente');
        
        // Actualizar dashboard
        this.renderUserServices();
    },

    // Renderizar servicios
    renderServices: function() {
        const servicesGrid = document.getElementById('servicesGrid');
        
        if (!servicesGrid) return;
        
        servicesGrid.innerHTML = this.state.services.map(service => `
            <div class="service-card">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <ul class="service-features">
                    ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <div class="service-actions">
                    <span class="service-price">${service.price}</span>
                    <button class="btn btn-primary" data-service="${service.id}">Solicitar</button>
                </div>
            </div>
        `).join('');

        // Agregar event listeners a los botones de solicitud
        servicesGrid.querySelectorAll('.btn-primary').forEach(button => {
            button.addEventListener('click', (e) => {
                if (!this.state.currentUser) {
                    this.showNotification('error', 'Debes iniciar sesión para solicitar un servicio');
                    this.showModal('loginModal');
                    return;
                }
                
                const serviceId = e.target.getAttribute('data-service');
                this.showModal('serviceRequestModal');
                
                // Preseleccionar el servicio en el formulario
                const serviceSelect = document.getElementById('requestService');
                const service = this.state.services.find(s => s.id == serviceId);
                if (service) {
                    serviceSelect.value = service.name.toLowerCase().replace(/\s+/g, '-');
                }
            });
        });
    },

    // Renderizar planes de precios
    renderPricingPlans: function() {
        const pricingCards = document.getElementById('pricingCards');
        
        if (!pricingCards) return;
        
        pricingCards.innerHTML = this.state.pricingPlans.map(plan => `
            <div class="pricing-card ${plan.featured ? 'featured' : ''}">
                <h3>${plan.name}</h3>
                <div class="price">${plan.price}</div>
                <div class="price-period">/${plan.period}</div>
                <ul class="pricing-features">
                    ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <button class="btn btn-primary">Contratar</button>
            </div>
        `).join('');

        // Agregar event listeners a los botones de contratación
        pricingCards.querySelectorAll('.btn-primary').forEach(button => {
            button.addEventListener('click', () => {
                if (!this.state.currentUser) {
                    this.showNotification('error', 'Debes iniciar sesión para contratar un plan');
                    this.showModal('loginModal');
                    return;
                }
                
                this.showNotification('info', 'Funcionalidad de contratación en desarrollo');
            });
        });
    },

    // Renderizar servicios del usuario
    renderUserServices: function() {
        const userServices = document.getElementById('userServices');
        
        if (!userServices || !this.state.currentUser) return;
        
        const userRequests = this.state.serviceRequests.filter(
            request => request.userId === this.state.currentUser.id
        );
        
        if (userRequests.length === 0) {
            userServices.innerHTML = '<p>No tienes servicios contratados.</p>';
            return;
        }
        
        userServices.innerHTML = userRequests.map(request => {
            const service = this.state.services.find(s => 
                s.name.toLowerCase().replace(/\s+/g, '-') === request.service
            );
            
            const serviceName = service ? service.name : request.service;
            
            return `
                <div class="service-item">
                    <div class="service-name">${serviceName}</div>
                    <div class="service-details">${request.details || 'Sin detalles adicionales'}</div>
                    <div class="service-status ${request.status === 'active' ? 'status-active' : 'status-pending'}">
                        ${request.status === 'active' ? 'Activo' : 'Pendiente'}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Renderizar estado de seguridad
    renderSecurityStatus: function() {
        if (!this.state.currentUser) return;
        
        // Datos de ejemplo para el estado de seguridad
        document.getElementById('vulnerabilitiesCount').textContent = Math.floor(Math.random() * 10);
        document.getElementById('threatsBlocked').textContent = Math.floor(Math.random() * 50) + 20;
        
        const lastAudit = this.state.reports
            .filter(report => report.userId === this.state.currentUser.id && report.status === 'completed')
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            
        document.getElementById('lastAudit').textContent = lastAudit ? 
            new Date(lastAudit.date).toLocaleDateString('es-ES') : 'Nunca';
    },

    // Renderizar reportes
    renderReports: function() {
        const reportsList = document.getElementById('reportsList');
        
        if (!reportsList || !this.state.currentUser) return;
        
        const userReports = this.state.reports.filter(
            report => report.userId === this.state.currentUser.id
        );
        
        if (userReports.length === 0) {
            reportsList.innerHTML = '<p>No hay reportes disponibles.</p>';
            return;
        }
        
        reportsList.innerHTML = userReports.map(report => `
            <div class="report-item">
                <div class="report-title">${report.title}</div>
                <div class="report-date">${new Date(report.date).toLocaleDateString('es-ES')}</div>
                <div class="report-status ${report.status === 'completed' ? 'status-completed' : 'status-in-progress'}">
                    ${report.status === 'completed' ? 'Completado' : 'En progreso'}
                </div>
            </div>
        `).join('');
    },

    // Actualizar estadísticas
    updateStats: function() {
        // Datos de ejemplo
        document.getElementById('clientsCount').textContent = this.state.users.filter(u => u.role === 'client').length;
        document.getElementById('incidentsPrevented').textContent = Math.floor(Math.random() * 100) + 50;
        document.getElementById('servicesProvided').textContent = this.state.serviceRequests.length;
        
        // Animación de conteo
        this.animateCounters();
    },

    // Animación de contadores
    animateCounters: function() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 20);
        });
    },

    // Mostrar notificación
    showNotification: function(type, message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos de notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 3000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Colores según tipo
        if (type === 'success') {
            notification.style.backgroundColor = '#27ae60';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#e74c3c';
        } else if (type === 'info') {
            notification.style.backgroundColor = '#3498db';
        }
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    },

    // Guardar usuarios en localStorage
    saveUsers: function() {
        localStorage.setItem('cybershield_users', JSON.stringify(this.state.users));
    },

    // Guardar solicitudes de servicio en localStorage
    saveServiceRequests: function() {
        localStorage.setItem('cybershield_service_requests', JSON.stringify(this.state.serviceRequests));
    },

    // Guardar reportes en localStorage
    saveReports: function() {
        localStorage.setItem('cybershield_reports', JSON.stringify(this.state.reports));
    }
};

// Inicializar la aplicación
function initApp() {
    CyberShieldApp.init();
}