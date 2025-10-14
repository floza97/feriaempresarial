// Componente de Facturación
const Billing = ({ user }) => {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    services: [{ description: '', price: '', quantity: 1 }],
    paymentMethod: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setInvoices(VetDataStorage.getInvoices());
    setClients(VetDataStorage.getClients());
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente no encontrado';
  };

  const calculateTotals = (services) => {
    const subtotal = services.reduce((sum, service) => {
      const price = parseFloat(service.price) || 0;
      const quantity = parseInt(service.quantity) || 1;
      return sum + (price * quantity);
    }, 0);
    
    const tax = 0; // Sin IVA por ahora
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar servicios
      const validServices = formData.services.filter(service => 
        service.description.trim() && service.price && service.quantity
      );

      if (validServices.length === 0) {
        Helpers.showToast('Debe agregar al menos un servicio', 'error');
        return;
      }

      const { subtotal, tax, total } = calculateTotals(validServices);
      
      const invoiceData = {
        ...formData,
        services: validServices,
        subtotal,
        tax,
        total,
        status: 'pendiente'
      };

      if (editingInvoice) {
        VetDataStorage.updateInvoice(editingInvoice.id, invoiceData);
        Helpers.showToast('Factura actualizada correctamente', 'success');
      } else {
        VetDataStorage.addInvoice(invoiceData);
        Helpers.showToast('Factura creada correctamente', 'success');
      }

      loadData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      Helpers.showToast('Error al guardar factura', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      clientId: invoice.clientId,
      date: invoice.date,
      services: invoice.services,
      paymentMethod: invoice.paymentMethod || '',
      notes: invoice.notes || ''
    });
    setShowModal(true);
  };

  const handleStatusChange = (invoiceId, newStatus) => {
    VetDataStorage.updateInvoice(invoiceId, { 
      status: newStatus,
      paymentDate: newStatus === 'pagada' ? new Date().toISOString().split('T')[0] : null
    });
    loadData();
    Helpers.showToast(`Factura marcada como ${newStatus}`, 'success');
  };

  const handleDelete = (invoice) => {
    if (confirm(`¿Está seguro de eliminar la factura ${invoice.number}?`)) {
      // En lugar de eliminar, marcar como cancelada
      VetDataStorage.updateInvoice(invoice.id, { status: 'cancelada' });
      loadData();
      Helpers.showToast('Factura cancelada', 'success');
    }
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { description: '', price: '', quantity: 1 }]
    });
  };

  const removeService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: newServices });
  };

  const updateService = (index, field, value) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData({ ...formData, services: newServices });
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      date: new Date().toISOString().split('T')[0],
      services: [{ description: '', price: '', quantity: 1 }],
      paymentMethod: '',
      notes: ''
    });
    setEditingInvoice(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const filteredInvoices = invoices.filter(invoice => {
    const clientName = getClientName(invoice.clientId).toLowerCase();
    const invoiceNumber = invoice.number.toLowerCase();
    const term = searchTerm.toLowerCase();
    
    const matchesSearch = clientName.includes(term) || invoiceNumber.includes(term);
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const currentTotals = calculateTotals(formData.services);

  return (
    <div className="billing-page">
      {/* Header con filtros */}
      <div className="card">
        <div className="card-header">
          <h3>Sistema de Facturación</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="search-box">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Buscar facturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            <select
              className="form-control form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="pagada">Pagadas</option>
              <option value="vencida">Vencidas</option>
              <option value="cancelada">Canceladas</option>
            </select>
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <i className="fas fa-plus"></i>
              Nueva Factura
            </button>
          </div>
        </div>
      </div>

      {/* Resumen financiero */}
      <div className="dashboard-stats" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Facturado</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--success)' }}>
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="stat-value">
            {Helpers.formatCurrency(
              invoices.filter(inv => inv.status === 'pagada')
                     .reduce((sum, inv) => sum + inv.total, 0)
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Pendientes</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--warning)' }}>
              <i className="fas fa-clock"></i>
            </div>
          </div>
          <div className="stat-value">
            {Helpers.formatCurrency(
              invoices.filter(inv => inv.status === 'pendiente')
                     .reduce((sum, inv) => sum + inv.total, 0)
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Facturas del Mes</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--info)' }}>
              <i className="fas fa-file-invoice"></i>
            </div>
          </div>
          <div className="stat-value">
            {invoices.filter(inv => {
              const invDate = new Date(inv.date);
              const now = new Date();
              return invDate.getMonth() === now.getMonth() && 
                     invDate.getFullYear() === now.getFullYear();
            }).length}
          </div>
        </div>
      </div>

      {/* Lista de facturas */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Método de Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(invoice => (
                    <tr key={invoice.id}>
                      <td>
                        <span style={{ fontWeight: '500' }}>{invoice.number}</span>
                      </td>
                      <td>{Helpers.formatDate(invoice.date)}</td>
                      <td>{getClientName(invoice.clientId)}</td>
                      <td>
                        <span style={{ fontWeight: '500' }}>
                          {Helpers.formatCurrency(invoice.total)}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="badge"
                          style={{ 
                            backgroundColor: `${Helpers.getStatusColor(invoice.status)}20`,
                            color: Helpers.getStatusColor(invoice.status),
                            border: `1px solid ${Helpers.getStatusColor(invoice.status)}`
                          }}
                        >
                          {Helpers.capitalize(invoice.status)}
                        </span>
                      </td>
                      <td>{invoice.paymentMethod || '-'}</td>
                      <td>
                        <div className="table-actions">
                          {invoice.status === 'pendiente' && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleStatusChange(invoice.id, 'pagada')}
                              title="Marcar como pagada"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEdit(invoice)}
                            title="Editar"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => {
                              const printContent = `
                                <h2>Factura ${invoice.number}</h2>
                                <p><strong>Cliente:</strong> ${getClientName(invoice.clientId)}</p>
                                <p><strong>Fecha:</strong> ${Helpers.formatDate(invoice.date)}</p>
                                <table style="width:100%; border-collapse: collapse;">
                                  <thead>
                                    <tr style="border-bottom: 1px solid #ccc;">
                                      <th style="text-align:left; padding:8px;">Descripción</th>
                                      <th style="text-align:right; padding:8px;">Precio</th>
                                      <th style="text-align:right; padding:8px;">Cantidad</th>
                                      <th style="text-align:right; padding:8px;">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    ${invoice.services.map(service => `
                                      <tr>
                                        <td style="padding:8px;">${service.description}</td>
                                        <td style="text-align:right; padding:8px;">${Helpers.formatCurrency(service.price)}</td>
                                        <td style="text-align:right; padding:8px;">${service.quantity}</td>
                                        <td style="text-align:right; padding:8px;">${Helpers.formatCurrency(service.price * service.quantity)}</td>
                                      </tr>
                                    `).join('')}
                                  </tbody>
                                </table>
                                <div style="margin-top: 20px; text-align: right;">
                                  <p><strong>Total: ${Helpers.formatCurrency(invoice.total)}</strong></p>
                                </div>
                              `;
                              const printWindow = window.open('', '_blank');
                              printWindow.document.write(`
                                <html>
                                  <head><title>Factura ${invoice.number}</title></head>
                                  <body style="font-family: Arial, sans-serif; padding: 20px;">
                                    ${printContent}
                                  </body>
                                </html>
                              `);
                              printWindow.document.close();
                              printWindow.print();
                            }}
                            title="Imprimir"
                          >
                            <i className="fas fa-print"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleDelete(invoice)}
                            title="Cancelar"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    <i className="fas fa-receipt" style={{ fontSize: '2rem', color: 'var(--gris-medio)', marginBottom: '0.5rem' }}></i>
                    <p>No se encontraron facturas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de formulario */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '900px' }}>
            <div className="modal-header">
              <h4 className="modal-title">
                {editingInvoice ? 'Editar Factura' : 'Nueva Factura'}
              </h4>
              <button 
                className="modal-close"
                onClick={handleCloseModal}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Cliente *</label>
                    <select
                      className="form-control form-select"
                      value={formData.clientId}
                      onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                      required
                    >
                      <option value="">Seleccione cliente</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fecha *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Servicios */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Servicios *</label>
                    <button 
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={addService}
                    >
                      <i className="fas fa-plus"></i>
                      Agregar Servicio
                    </button>
                  </div>
                  
                  {formData.services.map((service, index) => (
                    <div key={index} className="card" style={{ marginBottom: '1rem' }}>
                      <div className="card-body" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
                          <div style={{ flex: 2 }}>
                            <label className="form-label">Descripción</label>
                            <input
                              type="text"
                              className="form-control"
                              value={service.description}
                              onChange={(e) => updateService(index, 'description', e.target.value)}
                              placeholder="Descripción del servicio"
                              required
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label className="form-label">Precio</label>
                            <input
                              type="number"
                              className="form-control"
                              value={service.price}
                              onChange={(e) => updateService(index, 'price', e.target.value)}
                              placeholder="0"
                              min="0"
                              step="100"
                              required
                            />
                          </div>
                          <div style={{ width: '80px' }}>
                            <label className="form-label">Cant.</label>
                            <input
                              type="number"
                              className="form-control"
                              value={service.quantity}
                              onChange={(e) => updateService(index, 'quantity', e.target.value)}
                              min="1"
                              required
                            />
                          </div>
                          <div style={{ width: '120px', textAlign: 'right' }}>
                            <label className="form-label">Total</label>
                            <div style={{ fontWeight: '500', padding: '0.5rem 0' }}>
                              {Helpers.formatCurrency((service.price || 0) * (service.quantity || 1))}
                            </div>
                          </div>
                          {formData.services.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-error"
                              onClick={() => removeService(index)}
                              style={{ marginBottom: '0.5rem' }}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="card" style={{ backgroundColor: 'var(--gris-claro)' }}>
                  <div className="card-body" style={{ padding: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Subtotal: {Helpers.formatCurrency(currentTotals.subtotal)}</strong>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        IVA: {Helpers.formatCurrency(currentTotals.tax)}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--azul-verdoso)' }}>
                        Total: {Helpers.formatCurrency(currentTotals.total)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Método de Pago</label>
                  <select
                    className="form-control form-select"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  >
                    <option value="">Seleccione método</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta débito">Tarjeta débito</option>
                    <option value="Tarjeta crédito">Tarjeta crédito</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notas</label>
                  <textarea
                    className="form-control form-textarea"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Notas adicionales"
                    style={{ minHeight: '80px' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner" style={{width: '16px', height: '16px'}}></div>
                      Guardando...
                    </>
                  ) : (
                    editingInvoice ? 'Actualizar Factura' : 'Crear Factura'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};