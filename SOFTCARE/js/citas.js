// Servicio de Gestión de Citas
class CitaService {
    static getCitas() {
        return JSON.parse(localStorage.getItem('citas')) || [];
    }

    static saveCitas(citas) {
        localStorage.setItem('citas', JSON.stringify(citas));
    }

    static addCita(cita) {
        const citas = this.getCitas();
        cita.id = Date.now();
        cita.createdAt = new Date().toISOString();
        cita.estado = 'confirmada';
        citas.push(cita);
        this.saveCitas(citas);
        return cita;
    }

    static updateCita(id, citaData) {
        const citas = this.getCitas();
        const index = citas.findIndex(c => c.id === id);
        if (index !== -1) {
            citas[index] = { ...citas[index], ...citaData };
            this.saveCitas(citas);
            return citas[index];
        }
        return null;
    }

    static deleteCita(id) {
        const citas = this.getCitas();
        const filteredCitas = citas.filter(c => c.id !== id);
        this.saveCitas(filteredCitas);
        return true;
    }

    static getCitasByDate(fecha) {
        const citas = this.getCitas();
        return citas.filter(cita => cita.fecha === fecha);
    }

    static getCitasByPaciente(pacienteId) {
        const citas = this.getCitas();
        return citas.filter(cita => cita.pacienteId === pacienteId);
    }
}

// Módulo de Gestión de Citas
class CitasModule {
    constructor() {
        this.currentDate = new Date();
    }

    init() {
        this.renderCalendar();
        this.loadCitasDelDia();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Nueva cita
        document.getElementById('nueva-cita').addEventListener('click', () => {
            this.showCitaModal();
        });

        // Navegación del calendario
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Modal events
        this.setupModalEvents();
    }

    setupModalEvents() {
        const modal = document.getElementById('cita-modal');
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.cancel');
        const form = document.getElementById('form-cita');

        closeBtn.addEventListener('click', () => this.hideCitaModal());
        cancelBtn.addEventListener('click', () => this.hideCitaModal());

        form.addEventListener('submit', (e) => this.saveCita(e));

        // Cerrar modal al hacer click fuera
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideCitaModal();
            }
        });
    }

    renderCalendar() {
        const calendar = document.getElementById('calendar');
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();

        // Actualizar título del mes
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        document.getElementById('current-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Limpiar calendario
        calendar.innerHTML = '';

        // Headers de días
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        dayNames.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day header';
            header.textContent = day;
            calendar.appendChild(header);
        });

        // Calcular primer día del mes
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // Generar días
        const currentDate = new Date(startDate);
        while (currentDate <= lastDay || calendar.children.length < 49) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';

            if (currentDate.getMonth() === currentMonth) {
                dayDiv.innerHTML = `<div class="day-number">${currentDate.getDate()}</div>`;

                // Agregar citas del día
                const citasDelDia = CitaService.getCitasByDate(currentDate.toISOString().split('T')[0]);
                citasDelDia.forEach(cita => {
                    const citaDiv = document.createElement('div');
                    citaDiv.className = 'cita-indicator';
                    citaDiv.textContent = `${cita.hora} - ${cita.pacienteNombre}`;
                    citaDiv.addEventListener('click', () => this.selectDate(currentDate));
                    dayDiv.appendChild(citaDiv);
                });

                // Event listener para seleccionar fecha
                dayDiv.addEventListener('click', () => this.selectDate(currentDate));
            }

            calendar.appendChild(dayDiv);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    selectDate(date) {
        this.selectedDate = date;
        this.loadCitasDelDia();
    }

    loadCitasDelDia() {
        const fecha = this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const citas = CitaService.getCitasByDate(fecha);
        const container = document.getElementById('citas-del-dia');

        if (citas.length === 0) {
            container.innerHTML = '<p>No hay citas programadas para este día.</p>';
            return;
        }

        container.innerHTML = citas.map(cita => `
            <div class="cita-item">
                <h5>${cita.pacienteNombre}</h5>
                <p><strong>Hora:</strong> ${cita.hora}</p>
                <p><strong>Médico:</strong> ${this.getMedicoNombre(cita.medico)}</p>
                <p><strong>Motivo:</strong> ${cita.motivo}</p>
                <p><strong>Estado:</strong> ${cita.estado}</p>
            </div>
        `).join('');
    }

    getMedicoNombre(medicoId) {
        const medicos = {
            'dr_garcia': 'Dr. Juan García',
            'dra_maria': 'Dra. María López',
            'dr_carlos': 'Dr. Carlos Rodríguez'
        };
        return medicos[medicoId] || medicoId;
    }

    showCitaModal(cita = null) {
        const modal = document.getElementById('cita-modal');
        const form = document.getElementById('form-cita');

        if (cita) {
            // Editar cita existente (por ahora no implementado)
            return;
        } else {
            form.reset();
            // Cargar lista de pacientes
            this.loadPacientesOptions();
        }

        modal.style.display = 'block';
    }

    hideCitaModal() {
        document.getElementById('cita-modal').style.display = 'none';
    }

    loadPacientesOptions() {
        const pacientes = PacienteService.getPacientes();
        const select = document.getElementById('cita-paciente');
        select.innerHTML = '<option value="">Seleccionar paciente</option>';

        pacientes.forEach(paciente => {
            const option = document.createElement('option');
            option.value = paciente.id;
            option.textContent = paciente.nombre;
            select.appendChild(option);
        });
    }

    saveCita(e) {
        e.preventDefault();

        // Obtener valores directamente de los elementos del formulario
        const pacienteId = parseInt(document.getElementById('cita-paciente').value);
        const paciente = PacienteService.getPacientes().find(p => p.id === pacienteId);

        // Validar que se haya seleccionado un paciente
        if (!pacienteId || !paciente) {
            alert('Debe seleccionar un paciente');
            document.getElementById('cita-paciente').focus();
            return;
        }

        // Validar campos requeridos
        const medico = document.getElementById('cita-medico').value;
        const fecha = document.getElementById('cita-fecha').value;
        const hora = document.getElementById('cita-hora').value;
        const motivo = document.getElementById('cita-motivo').value.trim();

        if (!medico) {
            alert('Debe seleccionar un médico');
            document.getElementById('cita-medico').focus();
            return;
        }

        if (!fecha) {
            alert('Debe seleccionar una fecha');
            document.getElementById('cita-fecha').focus();
            return;
        }

        if (!hora) {
            alert('Debe seleccionar una hora');
            document.getElementById('cita-hora').focus();
            return;
        }

        if (!motivo) {
            alert('Debe ingresar el motivo de la consulta');
            document.getElementById('cita-motivo').focus();
            return;
        }

        const citaData = {
            pacienteId: pacienteId,
            pacienteNombre: paciente.nombre,
            medico: medico,
            fecha: fecha,
            hora: hora,
            motivo: motivo,
            observaciones: document.getElementById('cita-observaciones').value.trim()
        };

        try {
            CitaService.addCita(citaData);
            this.hideCitaModal();
            this.renderCalendar();
            this.loadCitasDelDia();
            alert('Cita programada exitosamente');
        } catch (error) {
            alert('Error al programar la cita: ' + error.message);
        }
    }
}