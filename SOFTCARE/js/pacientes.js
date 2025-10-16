// Servicio de Gestión de Pacientes
class PacienteService {
    static getPacientes() {
        return JSON.parse(localStorage.getItem('pacientes')) || [];
    }

    static savePacientes(pacientes) {
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
    }

    static addPaciente(paciente) {
        const pacientes = this.getPacientes();
        // Evitar duplicados verificando si ya existe un paciente con el mismo nombre y teléfono
        const existe = pacientes.find(p =>
            p.nombre === paciente.nombre &&
            p.telefono === paciente.telefono
        );

        if (existe) {
            throw new Error('Ya existe un paciente con el mismo nombre y teléfono');
        }

        paciente.id = Date.now();
        paciente.createdAt = new Date().toISOString();
        pacientes.push(paciente);
        this.savePacientes(pacientes);
        return paciente;
    }

    static updatePaciente(id, pacienteData) {
        const pacientes = this.getPacientes();
        const index = pacientes.findIndex(p => p.id === id);
        if (index !== -1) {
            pacientes[index] = { ...pacientes[index], ...pacienteData };
            this.savePacientes(pacientes);
            return pacientes[index];
        }
        return null;
    }

    static deletePaciente(id) {
        const pacientes = this.getPacientes();
        const filteredPacientes = pacientes.filter(p => p.id !== id);
        this.savePacientes(filteredPacientes);
        return true;
    }

    static searchPacientes(query) {
        const pacientes = this.getPacientes();
        if (!query) return pacientes;
        
        return pacientes.filter(paciente => 
            paciente.nombre.toLowerCase().includes(query.toLowerCase()) ||
            paciente.email.toLowerCase().includes(query.toLowerCase()) ||
            paciente.telefono.includes(query)
        );
    }
}

// Módulo de Gestión de Pacientes
class PacientesModule {
    init() {
        this.loadPacientes();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Nuevo paciente
        document.getElementById('nuevo-paciente').addEventListener('click', () => {
            this.showPacienteModal();
        });

        // Buscar paciente
        document.getElementById('search-paciente').addEventListener('input', (e) => {
            this.loadPacientes(e.target.value);
        });

        // Modal events
        this.setupModalEvents();
    }

    setupModalEvents() {
        const modal = document.getElementById('paciente-modal');
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.cancel');
        const form = document.getElementById('form-paciente');

        closeBtn.addEventListener('click', () => this.hidePacienteModal());
        cancelBtn.addEventListener('click', () => this.hidePacienteModal());
        
        form.addEventListener('submit', (e) => this.savePaciente(e));

        // Cerrar modal al hacer click fuera
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hidePacienteModal();
            }
        });
    }

    loadPacientes(searchQuery = '') {
        const pacientes = PacienteService.searchPacientes(searchQuery);
        const tbody = document.getElementById('pacientes-body');
        
        tbody.innerHTML = pacientes.map(paciente => `
            <tr>
                <td>${paciente.id}</td>
                <td>${paciente.nombre || 'Sin nombre'}</td>
                <td>${paciente.email || '-'}</td>
                <td>${paciente.telefono || '-'}</td>
                <td>${paciente.fechaNacimiento ? new Date(paciente.fechaNacimiento).toLocaleDateString() : '-'}</td>
                <td>
                    <button class="btn-secondary edit-paciente" data-id="${paciente.id}">Editar</button>
                    <button class="btn-secondary delete-paciente" data-id="${paciente.id}">Eliminar</button>
                </td>
            </tr>
        `).join('');

        // Agregar event listeners a los botones
        tbody.querySelectorAll('.edit-paciente').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                this.editPaciente(id);
            });
        });

        tbody.querySelectorAll('.delete-paciente').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                this.deletePaciente(id);
            });
        });
    }

    showPacienteModal(paciente = null) {
        const modal = document.getElementById('paciente-modal');
        const title = document.getElementById('modal-paciente-title');
        const form = document.getElementById('form-paciente');

        if (paciente) {
            title.textContent = 'Editar Paciente';
            document.getElementById('paciente-id').value = paciente.id;
            document.getElementById('paciente-nombre').value = paciente.nombre;
            document.getElementById('paciente-email').value = paciente.email || '';
            document.getElementById('paciente-telefono').value = paciente.telefono || '';
            document.getElementById('paciente-direccion').value = paciente.direccion || '';
            document.getElementById('paciente-fecha-nacimiento').value = paciente.fechaNacimiento || '';
            document.getElementById('paciente-alergias').value = paciente.alergias || '';
        } else {
            title.textContent = 'Nuevo Paciente';
            form.reset();
            document.getElementById('paciente-id').value = '';
        }

        modal.style.display = 'block';
    }

    hidePacienteModal() {
        document.getElementById('paciente-modal').style.display = 'none';
    }

    editPaciente(id) {
        const pacientes = PacienteService.getPacientes();
        const paciente = pacientes.find(p => p.id === id);
        if (paciente) {
            this.showPacienteModal(paciente);
        }
    }

    deletePaciente(id) {
        if (confirm('¿Está seguro de eliminar este paciente?')) {
            PacienteService.deletePaciente(id);
            this.loadPacientes();
        }
    }

    savePaciente(e) {
        e.preventDefault();

        // Obtener valores directamente de los elementos del formulario
        const pacienteData = {
            nombre: document.getElementById('paciente-nombre').value.trim(),
            email: document.getElementById('paciente-email').value.trim(),
            telefono: document.getElementById('paciente-telefono').value.trim(),
            direccion: document.getElementById('paciente-direccion').value.trim(),
            fechaNacimiento: document.getElementById('paciente-fecha-nacimiento').value,
            alergias: document.getElementById('paciente-alergias').value.trim()
        };

        // Validar que el nombre no esté vacío
        if (!pacienteData.nombre || pacienteData.nombre === '') {
            alert('El nombre del paciente es obligatorio');
            document.getElementById('paciente-nombre').focus();
            return;
        }

        const id = document.getElementById('paciente-id').value;

        try {
            if (id) {
                // Editar paciente existente
                PacienteService.updatePaciente(parseInt(id), pacienteData);
            } else {
                // Nuevo paciente
                PacienteService.addPaciente(pacienteData);
            }

            this.hidePacienteModal();
            this.loadPacientes();
        } catch (error) {
            alert(error.message);
        }
    }
}