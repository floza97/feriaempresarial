// Servicio de Gestión de Inventario
class InventarioService {
    static getMedicamentos() {
        return JSON.parse(localStorage.getItem('medicamentos')) || [];
    }

    static saveMedicamentos(medicamentos) {
        localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
    }

    static addMedicamento(medicamento) {
        const medicamentos = this.getMedicamentos();
        medicamento.id = Date.now();
        medicamento.createdAt = new Date().toISOString();
        medicamentos.push(medicamento);
        this.saveMedicamentos(medicamentos);
        return medicamento;
    }

    static updateMedicamento(id, medicamentoData) {
        const medicamentos = this.getMedicamentos();
        const index = medicamentos.findIndex(m => m.id === id);
        if (index !== -1) {
            medicamentos[index] = { ...medicamentos[index], ...medicamentoData };
            this.saveMedicamentos(medicamentos);
            return medicamentos[index];
        }
        return null;
    }

    static deleteMedicamento(id) {
        const medicamentos = this.getMedicamentos();
        const filteredMedicamentos = medicamentos.filter(m => m.id !== id);
        this.saveMedicamentos(filteredMedicamentos);
        return true;
    }

    static getMedicamentosBajoStock() {
        const medicamentos = this.getMedicamentos();
        return medicamentos.filter(m => m.cantidad <= m.stockMinimo);
    }
}

// Módulo de Gestión de Inventario
class InventarioModule {
    init() {
        this.loadMedicamentos();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Nuevo medicamento
        document.getElementById('nuevo-medicamento').addEventListener('click', () => {
            this.showMedicamentoModal();
        });
    }

    loadMedicamentos() {
        const medicamentos = InventarioService.getMedicamentos();
        const tbody = document.getElementById('inventario-body');

        tbody.innerHTML = medicamentos.map(medicamento => `
            <tr>
                <td>${medicamento.nombre}</td>
                <td>${medicamento.categoria}</td>
                <td>${medicamento.cantidad}</td>
                <td>${medicamento.stockMinimo}</td>
                <td>$${medicamento.precio.toLocaleString()}</td>
                <td><span class="estado-${medicamento.estado}">${medicamento.estado}</span></td>
                <td>
                    <button class="btn-secondary edit-medicamento" data-id="${medicamento.id}">Editar</button>
                    <button class="btn-secondary delete-medicamento" data-id="${medicamento.id}">Eliminar</button>
                </td>
            </tr>
        `).join('');

        // Agregar event listeners a los botones
        tbody.querySelectorAll('.edit-medicamento').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                this.editMedicamento(id);
            });
        });

        tbody.querySelectorAll('.delete-medicamento').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                this.deleteMedicamento(id);
            });
        });
    }

    showMedicamentoModal(medicamento = null) {
        // Por ahora, mostrar un mensaje simple
        alert('Funcionalidad de nuevo medicamento próximamente disponible');
    }

    editMedicamento(id) {
        const medicamentos = InventarioService.getMedicamentos();
        const medicamento = medicamentos.find(m => m.id === id);
        if (medicamento) {
            alert(`Editar medicamento ${medicamento.nombre} - Funcionalidad próximamente disponible`);
        }
    }

    deleteMedicamento(id) {
        if (confirm('¿Está seguro de eliminar este medicamento?')) {
            InventarioService.deleteMedicamento(id);
            this.loadMedicamentos();
        }
    }
}