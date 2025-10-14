// Componente de Gestión de Clientes
const Clients = ({ user }) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    document: '',
    address: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    const filtered = Helpers.filterData(clients, searchTerm, ['name', 'phone', 'email', 'document']);
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  const loadClients = () => {
    const clientData = VetDataStorage.getClients();
    setClients(clientData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { isValid, errors } = FormValidator.validateForm(formData, FormValidator.rules.client);
      
      if (!isValid) {
        Object.entries(errors).forEach(([field, fieldErrors]) => {
          Helpers.showToast(fieldErrors[0], 'error');
        });
        return;
      }

      if (editingClient) {
        VetDataStorage.updateClient(editingClient.id, formData);
        Helpers.showToast('Cliente actualizado correctamente', 'success');
      } else {
        VetDataStorage.addClient(formData);
        Helpers.showToast('Cliente registrado correctamente', 'success');
      }

      loadClients();
      resetForm();
      setShowModal(false);
    } catch (error) {
      Helpers.showToast('Error al guardar cliente', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email,
      document: client.document,
      address: client.address
    });
    setShowModal(true);
  };

  const handleDelete = (client) => {
    if (confirm(`¿Está seguro de eliminar al cliente ${client.name}?`)) {
      VetDataStorage.deleteClient(client.id);
      loadClients();
      Helpers.showToast('Cliente eliminado', 'success');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      document: '',
      address: ''
    });
    setEditingClient(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="clients-page">
      {/* Header con acciones */}
      <div className="card">
        <div className="card-header">
          <h3>Gestión de Clientes</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="search-box">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <i className="fas fa-plus"></i>
              Nuevo Cliente
            </button>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Documento</th>
                <th>Mascotas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map(client => {
                  const pets = VetDataStorage.getPets().filter(pet => pet.ownerId === client.id);
                  return (
                    <tr key={client.id}>
                      <td>
                        <div style={{ fontWeight: '500' }}>{client.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                          {client.address}
                        </div>
                      </td>
                      <td>{client.phone}</td>
                      <td>{client.email}</td>
                      <td>{client.document}</td>
                      <td>
                        <span className="badge badge-info">
                          {pets.length} mascota{pets.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEdit(client)}
                            title="Editar"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleDelete(client)}
                            title="Eliminar"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    <i className="fas fa-users" style={{ fontSize: '2rem', color: 'var(--gris-medio)', marginBottom: '0.5rem' }}></i>
                    <p>No se encontraron clientes</p>
                    {searchTerm && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => setSearchTerm('')}
                      >
                        Mostrar todos
                      </button>
                    )}
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
          <div className="modal">
            <div className="modal-header">
              <h4 className="modal-title">
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                <div className="form-group">
                  <label className="form-label">Nombre Completo *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ingrese el nombre completo"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Teléfono *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="3001234567"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Documento *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.document}
                      onChange={(e) => setFormData({...formData, document: e.target.value})}
                      placeholder="12345678"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="cliente@email.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dirección *</label>
                  <textarea
                    className="form-control form-textarea"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Ingrese la dirección completa"
                    required
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
                    editingClient ? 'Actualizar' : 'Guardar'
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