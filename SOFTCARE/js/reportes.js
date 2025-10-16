// Servicio de Gestión de Reportes
class ReportesService {
    static getEstadisticas() {
        const pacientes = PacienteService.getPacientes();
        const citas = CitaService.getCitas();
        const facturas = FacturacionService.getFacturas();
        const medicamentos = InventarioService.getMedicamentos();

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        return {
            totalPacientes: pacientes.length,
            citasMes: citas.filter(c => {
                const citaDate = new Date(c.fecha);
                return citaDate.getMonth() === currentMonth && citaDate.getFullYear() === currentYear;
            }).length,
            facturacionMes: facturas.reduce((total, f) => {
                const facturaDate = new Date(f.fecha);
                if (facturaDate.getMonth() === currentMonth && facturaDate.getFullYear() === currentYear) {
                    return total + f.total;
                }
                return total;
            }, 0),
            medicamentosBajoStock: medicamentos.filter(m => m.cantidad <= m.stockMinimo).length
        };
    }

    static getPacientesPorMes() {
        const pacientes = PacienteService.getPacientes();
        const pacientesPorMes = {};

        pacientes.forEach(paciente => {
            const fecha = new Date(paciente.createdAt);
            const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            pacientesPorMes[mes] = (pacientesPorMes[mes] || 0) + 1;
        });

        return pacientesPorMes;
    }

    static getCitasPorEstado() {
        const citas = CitaService.getCitas();
        const citasPorEstado = {};

        citas.forEach(cita => {
            citasPorEstado[cita.estado] = (citasPorEstado[cita.estado] || 0) + 1;
        });

        return citasPorEstado;
    }

    static getIngresosMensuales() {
        const facturas = FacturacionService.getFacturas();
        const ingresosPorMes = {};

        facturas.forEach(factura => {
            const fecha = new Date(factura.fecha);
            const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            ingresosPorMes[mes] = (ingresosPorMes[mes] || 0) + factura.total;
        });

        return ingresosPorMes;
    }

    static getMedicamentosMasUsados() {
        // Esta funcionalidad requeriría un registro de uso de medicamentos
        // Por ahora, devolver los medicamentos con menor stock (asumiendo mayor uso)
        const medicamentos = InventarioService.getMedicamentos();
        return medicamentos.sort((a, b) => a.cantidad - b.cantidad).slice(0, 5);
    }
}

// Módulo de Gestión de Reportes
class ReportesModule {
    init() {
        this.loadReportes();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Los reportes son principalmente visuales, no requieren muchos eventos
    }

    loadReportes() {
        // Los reportes se muestran como placeholders en el HTML
        // Aquí podríamos implementar gráficos reales con Chart.js o similar
        console.log('Reportes cargados - Funcionalidad de gráficos próximamente disponible');
    }

    // Métodos para generar gráficos (futuras implementaciones)
    generarGraficoPacientes() {
        const data = ReportesService.getPacientesPorMes();
        // Implementar con Chart.js
        console.log('Datos de pacientes por mes:', data);
    }

    generarGraficoCitas() {
        const data = ReportesService.getCitasPorEstado();
        // Implementar con Chart.js
        console.log('Datos de citas por estado:', data);
    }

    generarGraficoIngresos() {
        const data = ReportesService.getIngresosMensuales();
        // Implementar con Chart.js
        console.log('Datos de ingresos mensuales:', data);
    }

    generarGraficoMedicamentos() {
        const data = ReportesService.getMedicamentosMasUsados();
        // Implementar con Chart.js
        console.log('Datos de medicamentos más usados:', data);
    }
}