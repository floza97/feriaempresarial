// Funciones auxiliares útiles para VetData
const Helpers = {
  // Formatear fechas
  formatDate: (date, format = 'DD/MM/YYYY') => {
    if (!date) return '';
    const d = new Date(date);
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD/MM/YYYY HH:mm':
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      case 'HH:mm':
        return `${hours}:${minutes}`;
      default:
        return d.toLocaleDateString('es-CO');
    }
  },

  // Formatear moneda colombiana
  formatCurrency: (amount) => {
    if (!amount && amount !== 0) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Formatear números
  formatNumber: (number) => {
    if (!number && number !== 0) return '0';
    return new Intl.NumberFormat('es-CO').format(number);
  },

  // Capitalizar primera letra
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Capitalizar cada palabra
  capitalizeWords: (str) => {
    if (!str) return '';
    return str.split(' ').map(word => Helpers.capitalize(word)).join(' ');
  },

  // Calcular edad a partir de fecha de nacimiento
  calculateAge: (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  },

  // Obtener edad en formato legible (años, meses, días)
  getAgeString: (birthDate) => {
    if (!birthDate) return 'No especificado';
    
    const today = new Date();
    const birth = new Date(birthDate);
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    
    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    const parts = [];
    if (years > 0) parts.push(`${years} año${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mes${months > 1 ? 'es' : ''}`);
    if (years === 0 && days > 0) parts.push(`${days} día${days > 1 ? 's' : ''}`);
    
    return parts.join(', ') || 'Recién nacido';
  },

  // Generar colores para avatares
  getAvatarColor: (str) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  },

  // Obtener iniciales de un nombre
  getInitials: (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  // Filtrar y buscar en arrays
  filterData: (data, searchTerm, fields = []) => {
    if (!searchTerm) return data;
    
    const term = searchTerm.toLowerCase();
    
    return data.filter(item => {
      // Si no se especifican campos, buscar en todos los campos string
      if (fields.length === 0) {
        return Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(term)
        );
      }
      
      // Buscar solo en los campos especificados
      return fields.some(field => {
        const value = Helpers.getNestedValue(item, field);
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  },

  // Obtener valor anidado de un objeto (ej: 'user.profile.name')
  getNestedValue: (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  },

  // Ordenar array por campo
  sortData: (data, field, direction = 'asc') => {
    return [...data].sort((a, b) => {
      const aVal = Helpers.getNestedValue(a, field);
      const bVal = Helpers.getNestedValue(b, field);
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  // Paginar datos
  paginateData: (data, page = 1, itemsPerPage = 10) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      data: data.slice(startIndex, endIndex),
      totalItems: data.length,
      totalPages: Math.ceil(data.length / itemsPerPage),
      currentPage: page,
      itemsPerPage
    };
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Copiar texto al portapapeles
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback para navegadores más antiguos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        return true;
      } catch (fallbackErr) {
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
    }
  },

  // Detectar dispositivo móvil
  isMobile: () => {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Generar colores para estados
  getStatusColor: (status) => {
    const statusColors = {
      'programada': 'var(--info)',
      'en-curso': 'var(--warning)',
      'completada': 'var(--success)',
      'cancelada': 'var(--error)',
      'pendiente': 'var(--warning)',
      'pagada': 'var(--success)',
      'vencida': 'var(--error)',
      'activo': 'var(--success)',
      'inactivo': 'var(--gris-medio)'
    };
    
    return statusColors[status?.toLowerCase()] || 'var(--gris-medio)';
  },

  // Generar badge HTML para estados
  getStatusBadge: (status) => {
    const statusClasses = {
      'programada': 'badge-info',
      'en-curso': 'badge-warning',
      'completada': 'badge-success',
      'cancelada': 'badge-error',
      'pendiente': 'badge-warning',
      'pagada': 'badge-success',
      'vencida': 'badge-error',
      'activo': 'badge-success',
      'inactivo': 'badge-secondary'
    };
    
    const badgeClass = statusClasses[status?.toLowerCase()] || 'badge-secondary';
    return `<span class="badge ${badgeClass}">${Helpers.capitalize(status)}</span>`;
  },

  // Validar si una fecha está en el rango
  isDateInRange: (date, startDate, endDate) => {
    const checkDate = new Date(date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && checkDate < start) return false;
    if (end && checkDate > end) return false;
    
    return true;
  },

  // Obtener próximas citas
  getUpcomingAppointments: (appointments, days = 7) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= now && appointmentDate <= futureDate && 
             appointment.status === 'programada';
    });
  },

  // Calcular estadísticas básicas
  calculateStats: (data, field) => {
    if (!data || data.length === 0) return { total: 0, average: 0, min: 0, max: 0 };
    
    const values = data.map(item => parseFloat(Helpers.getNestedValue(item, field)) || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    
    return {
      total,
      average: total / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    };
  },

  // Generar reporte simple
  generateSimpleReport: (title, data, fields) => {
    let report = `=== ${title} ===\n\n`;
    
    data.forEach((item, index) => {
      report += `${index + 1}. `;
      fields.forEach(field => {
        const value = Helpers.getNestedValue(item, field.key);
        report += `${field.label}: ${value || 'N/A'} | `;
      });
      report = report.slice(0, -3) + '\n';
    });
    
    return report;
  },

  // Exportar datos a CSV
  exportToCSV: (data, filename = 'export.csv') => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        // Escapar comas y comillas en los valores
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Mostrar notificaciones toast
  showToast: (message, type = 'info', duration = 3000) => {
    // Crear elemento toast si no existe
    let toastContainer = document.querySelector('#toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
      `;
      document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.style.cssText = `
      margin-bottom: 10px;
      min-width: 300px;
      animation: slideInRight 0.3s ease;
    `;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove después del tiempo especificado
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
};

// Añadir animaciones CSS para toast
if (!document.querySelector('#toast-animations')) {
  const style = document.createElement('style');
  style.id = 'toast-animations';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}