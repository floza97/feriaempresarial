// Sistema de Gestión de Parqueadero - Historial
// ParkManager v2.0

// ============================================
// VERIFICACIÓN DE AUTENTICACIÓN
// ============================================
function checkAuth() {
    const token = localStorage.getItem('parkmanager_token');
    const user = localStorage.getItem('parkmanager_user');

    if (!token || !user) {
        window.location.href = 'login.html';
        return false;
    }

    const userElement = document.getElementById('currentUser');
    if (userElement) {
        userElement.textContent = user;
    }
    return true;
}

function logout() {
    if (confirm('¿Está seguro de cerrar sesión?')) {
        localStorage.removeItem('parkmanager_token');
        localStorage.removeItem('parkmanager_user');
        localStorage.removeItem('parkmanager_login_time');
        window.location.href = 'login.html';
    }
}

// ============================================
// BASE DE DATOS
// ============================================
function getHistory() {
    const stored = localStorage.getItem('parkingHistory');
    return stored ? JSON.parse(stored) : [];
}

// ============================================
// FUNCIONES DE FORMATO
// ============================================
function formatTime(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

function formatDate(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-CO', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(isoString) {
    if (!isoString) return '-';
    return `${formatDate(isoString)} ${formatTime(isoString)}`;
}

function calculateDuration(entryTime, exitTime) {
    if (!entryTime || !exitTime) return '-';

    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const diffMs = exit - entry;
    const diffMins = Math.floor(diffMs / 60000);

    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    return `${hours}h ${minutes}m`;
}

// ============================================
// RENDERIZADO DE TABLA
// ============================================
let currentFilters = {};

function renderHistoryTable(data = null) {
    const tbody = document.getElementById('historyTableBody');
    const history = data || getHistory();

    if (history.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11">
                    <div class="empty-state">
                        <h3>📭 No hay registros</h3>
                        <p>Aún no se han procesado salidas de vehículos</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    // Ordenar por fecha de salida (más reciente primero)
    const sortedHistory = [...history].sort((a, b) => {
        return new Date(b.exitTime) - new Date(a.exitTime);
    });

    tbody.innerHTML = sortedHistory.map(vehicle => `
        <tr>
            <td><strong style="color: #667eea;">${vehicle.verificationCode || '-'}</strong></td>
            <td><strong>${vehicle.plate}</strong></td>
            <td>${vehicle.type ? vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1) : '-'}</td>
            <td>${vehicle.owner || '-'}</td>
            <td>${vehicle.phone || '-'}</td>
            <td>${formatDateTime(vehicle.entryTime)}</td>
            <td>${formatDateTime(vehicle.exitTime)}</td>
            <td>${calculateDuration(vehicle.entryTime, vehicle.exitTime)}</td>
            <td><strong>$${(vehicle.totalAmount || 0).toLocaleString()}</strong></td>
            <td>${vehicle.registeredBy || '-'}</td>
            <td><span class="status-badge status-completed">Completado</span></td>
        </tr>
    `).join('');
}

// ============================================
// ESTADÍSTICAS
// ============================================
function updateStats(data = null) {
    const history = data || getHistory();

    // Total de registros
    document.getElementById('totalRecords').textContent = history.length;

    // Ingresos totales
    const totalIncome = history.reduce((sum, v) => sum + (v.totalAmount || 0), 0);
    document.getElementById('totalIncome').textContent = `$${totalIncome.toLocaleString()}`;

    // Promedio por vehículo
    const avgIncome = history.length > 0 ? Math.round(totalIncome / history.length) : 0;
    document.getElementById('avgIncome').textContent = `$${avgIncome.toLocaleString()}`;

    // Tiempo promedio
    if (history.length > 0) {
        const totalMinutes = history.reduce((sum, v) => {
            if (v.entryTime && v.exitTime) {
                const entry = new Date(v.entryTime);
                const exit = new Date(v.exitTime);
                const diffMs = exit - entry;
                return sum + Math.floor(diffMs / 60000);
            }
            return sum;
        }, 0);

        const avgMinutes = Math.round(totalMinutes / history.length);
        const avgHours = Math.floor(avgMinutes / 60);
        const avgMins = avgMinutes % 60;

        document.getElementById('avgTime').textContent = `${avgHours}h ${avgMins}m`;
    } else {
        document.getElementById('avgTime').textContent = '0h 0m';
    }
}

// ============================================
// FILTROS
// ============================================
function applyFilters() {
    const plate = document.getElementById('filterPlate').value.trim().toUpperCase();
    const type = document.getElementById('filterType').value;
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;

    let history = getHistory();

    // Filtrar por placa
    if (plate) {
        history = history.filter(v => v.plate.includes(plate));
    }

    // Filtrar por tipo
    if (type) {
        history = history.filter(v => v.type === type);
    }

    // Filtrar por rango de fechas
    if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        history = history.filter(v => {
            if (!v.exitTime) return false;
            const exitDate = new Date(v.exitTime);
            exitDate.setHours(0, 0, 0, 0);
            return exitDate >= fromDate;
        });
    }

    if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        history = history.filter(v => {
            if (!v.exitTime) return false;
            const exitDate = new Date(v.exitTime);
            return exitDate <= toDate;
        });
    }

    // Guardar filtros actuales
    currentFilters = { plate, type, dateFrom, dateTo };

    // Actualizar tabla y estadísticas
    renderHistoryTable(history);
    updateStats(history);
}

function clearFilters() {
    document.getElementById('filterPlate').value = '';
    document.getElementById('filterType').value = '';
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';

    currentFilters = {};

    renderHistoryTable();
    updateStats();
}

// ============================================
// EXPORTAR A CSV
// ============================================
function exportToCSV() {
    const history = getHistory();

    if (history.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    // Encabezados
    let csv = 'Código,Placa,Tipo,Propietario,Teléfono,Fecha Entrada,Hora Entrada,Fecha Salida,Hora Salida,Tiempo Total (min),Monto,Atendido por\n';

    // Datos
    history.forEach(vehicle => {
        const duration = vehicle.entryTime && vehicle.exitTime ? 
            Math.floor((new Date(vehicle.exitTime) - new Date(vehicle.entryTime)) / 60000) : 0;

        csv += `"${vehicle.verificationCode || ''}",`;
        csv += `"${vehicle.plate}",`;
        csv += `"${vehicle.type || ''}",`;
        csv += `"${vehicle.owner || ''}",`;
        csv += `"${vehicle.phone || ''}",`;
        csv += `"${formatDate(vehicle.entryTime)}",`;
        csv += `"${formatTime(vehicle.entryTime)}",`;
        csv += `"${formatDate(vehicle.exitTime)}",`;
        csv += `"${formatTime(vehicle.exitTime)}",`;
        csv += `"${duration}",`;
        csv += `"${vehicle.totalAmount || 0}",`;
        csv += `"${vehicle.registeredBy || ''}"\n`;
    });

    // Crear archivo y descargarlo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const filename = `historial_parqueadero_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ Archivo ${filename} exportado exitosamente`);
}

// ============================================
// INICIALIZACIÓN
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) {
        return;
    }

    renderHistoryTable();
    updateStats();

    // Establecer fecha de hoy como filtro por defecto
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filterDateTo').value = today;
});

// Exportar funciones globales
window.logout = logout;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.exportToCSV = exportToCSV;

console.log('Historial ParkManager v2.0 cargado');
