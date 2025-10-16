// Servicio de Gestión de Facturación
class FacturacionService {
    static getFacturas() {
        return JSON.parse(localStorage.getItem('facturas')) || [];
    }

    static saveFacturas(facturas) {
        localStorage.setItem('facturas', JSON.stringify(facturas));
    }

    static addFactura(factura) {
        const facturas = this.getFacturas();
        factura.id = Date.now();
        factura.createdAt = new Date().toISOString();
        factura.estado = 'pendiente';
        facturas.push(factura);
        this.saveFacturas(facturas);
        return factura;
    }

    static updateFactura(id, facturaData) {
        const facturas = this.getFacturas();
        const index = facturas.findIndex(f => f.id === id);
        if (index !== -1) {
            facturas[index] = { ...facturas[index], ...facturaData };
            this.saveFacturas(facturas);
            return facturas[index];
        }
        return null;
    }

    static deleteFactura(id) {
        const facturas = this.getFacturas();
        const filteredFacturas = facturas.filter(f => f.id !== id);
        this.saveFacturas(filteredFacturas);
        return true;
    }

    static getFacturasByPaciente(pacienteId) {
        const facturas = this.getFacturas();
        return facturas.filter(factura => factura.pacienteId === pacienteId);
    }
}

// Módulo de Gestión de Facturación
class FacturacionModule {
    init() {
        this.loadFacturas();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Nueva factura
        document.getElementById('nueva-factura').addEventListener('click', () => {
            this.showFacturaModal();
        });
    }

    loadFacturas() {
        const facturas = FacturacionService.getFacturas();
        const tbody = document.getElementById('facturas-body');

        tbody.innerHTML = facturas.map(factura => `
            <tr>
                <td>${factura.id}</td>
                <td>${factura.pacienteNombre}</td>
                <td>${new Date(factura.fecha).toLocaleDateString()}</td>
                <td>$${factura.total.toLocaleString()}</td>
                <td><span class="estado-${factura.estado}">${factura.estado}</span></td>
                <td>
                    <button class="btn-secondary edit-factura" data-id="${factura.id}">Editar</button>
                    <button class="btn-secondary delete-factura" data-id="${factura.id}">Eliminar</button>
                </td>
            </tr>
        `).join('');

        // Agregar event listeners a los botones
        tbody.querySelectorAll('.edit-factura').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                this.editFactura(id);
            });
        });

        tbody.querySelectorAll('.delete-factura').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                this.deleteFactura(id);
            });
        });
    }

    showFacturaModal(factura = null) {
        // Por ahora, mostrar un mensaje simple
        alert('Funcionalidad de nueva factura próximamente disponible');
    }

    editFactura(id) {
        const facturas = FacturacionService.getFacturas();
        const factura = facturas.find(f => f.id === id);
        if (factura) {
            alert(`Editar factura ${id} - Funcionalidad próximamente disponible`);
        }
    }

    deleteFactura(id) {
        if (confirm('¿Está seguro de eliminar esta factura?')) {
            FacturacionService.deleteFactura(id);
            this.loadFacturas();
        }
    }
}