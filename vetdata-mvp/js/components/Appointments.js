// Componente de Gestión de Citas
const Appointments = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    ownerId: '',
    veterinarian: '',
    date: '',
    time: '',
    reason: '',
    status: 'programada',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAppointments(VetDataStorage.getAppointments());
    setPets(VetDataStorage.getPets());
    setClients(VetDataStorage.getClients());
  };

  const getPetName = (petId) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : 'Mascota no encontrada';
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente no encontrado';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { isValid, errors } = FormValidator.validateForm(formData, FormValidator.rules.appointment);
      
      if (!isValid) {
        Object.entries(errors).forEach(([field, fieldErrors]) => {
          Helpers.showToast(fieldErrors[0], 'error');
        });
        return;
      }

      // Verificar conflictos de horario
      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
      const conflicts = appointments.filter(apt =>
        apt.id !== (editingAppointment?.id) &&
        apt.date === formData.date &&
        apt.time === formData.time &&
        apt.status === 'programada'
      );

      if (conflicts.length > 0) {
        Helpers.showToast('Ya existe una cita programada en este horario', 'error');
        return;
      }

      if (editingAppointment) {
        VetDataStorage.updateAppointment(editingAppointment.id, formData);
        Helpers.showToast('Cita actualizada correctamente', 'success');
      } else {
        VetDataStorage.addAppointment(formData);
        Helpers.showToast('Cita programada correctamente', 'success');
      }

      loadData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      Helpers.showToast('Error al guardar cita', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      petId: appointment.petId,
      ownerId: appointment.ownerId,
      veterinarian: appointment.veterinarian,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      status: appointment.status,
      notes: appointment.notes || ''
    });
    setShowModal(true);
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    VetDataStorage.updateAppointment(appointmentId, { status: newStatus });
    loadData();
    Helpers.showToast(`Cita marcada como ${newStatus}`, 'success');
  };

  const handleDelete = (appointment) => {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
      VetDataStorage.deleteAppointment(appointment.id);
      loadData();
      Helpers.showToast('Cita eliminada', 'success');
    }
  };

  const resetForm = () => {
    setFormData({
      petId: '',
      ownerId: '',
      veterinarian: user.role === 'veterinario' ? user.name : '',
      date: '',
      time: '',
      reason: '',
      status: 'programada',
      notes: ''
    });
    setEditingAppointment(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handlePetSelect = (petId) => {
    const pet = pets.find(p => p.id === petId);
    if (pet) {
      setFormData({
        ...formData,
        petId: petId,
        ownerId: pet.ownerId
      });
    }
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = Helpers.formatDate(date, 'YYYY-MM-DD');
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getStatusColor = (status) => {
    const colors = {
      'programada': 'var(--info)',
      'en-curso': 'var(--warning)',
      'completada': 'var(--success)',
      'cancelada': 'var(--error)'
    };
    return colors[status] || 'var(--gris-medio)';
  };

  // Generar horarios disponibles
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const filteredAppointments = appointments.filter(apt => {
    if (viewMode === 'calendar') {
      return apt.date === Helpers.formatDate(selectedDate, 'YYYY-MM-DD');
    }
    return true;
  });

  return (
    <div className="appointments-page">
      {/* Header con controles */}
      <div className="card">
        <div className="card-header">
          <h3>Gestión de Citas</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="tabs-nav" style={{ border: 'none' }}>
              <button 
                className={`tab-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i> Lista
              </button>
              <button 
                className={`tab-button ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                <i className="fas fa-calendar"></i> Calendario
              </button>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <i className="fas fa-plus"></i>
              Nueva Cita
            </button>
          </div>
        </div>
      </div>

      {/* Vista de lista */}
      {viewMode === 'list' && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Mascota</th>
                  <th>Propietario</th>
                  <th>Veterinario</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments
                    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
                    .map(appointment => (
                      <tr key={appointment.id}>
                        <td>
                          <div style={{ fontWeight: '500' }}>
                            {Helpers.formatDate(appointment.date)}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                            {appointment.time}
                          </div>
                        </td>
                        <td>{getPetName(appointment.petId)}</td>
                        <td>{getClientName(appointment.ownerId)}</td>
                        <td>{appointment.veterinarian}</td>
                        <td>
                          <div title={appointment.reason}>
                            {appointment.reason.length > 30 ? 
                              appointment.reason.substring(0, 30) + '...' : 
                              appointment.reason
                            }
                          </div>
                        </td>
                        <td>
                          <span 
                            className="badge"
                            style={{ 
                              backgroundColor: `${getStatusColor(appointment.status)}20`,
                              color: getStatusColor(appointment.status),
                              border: `1px solid ${getStatusColor(appointment.status)}`
                            }}
                          >
                            {Helpers.capitalize(appointment.status)}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            {appointment.status === 'programada' && (
                              <>
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() => handleStatusChange(appointment.id, 'en-curso')}
                                  title="Marcar en curso"
                                >
                                  <i className="fas fa-play"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleStatusChange(appointment.id, 'completada')}
                                  title="Marcar completada"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                              </>
                            )}
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleEdit(appointment)}
                              title="Editar"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-error"
                              onClick={() => handleDelete(appointment)}
                              title="Eliminar"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                      <i className="fas fa-calendar" style={{ fontSize: '2rem', color: 'var(--gris-medio)', marginBottom: '0.5rem' }}></i>
                      <p>No hay citas programadas</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista de calendario */}
      {viewMode === 'calendar' && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-header">
            <h4>
              {Helpers.formatDate(selectedDate, 'DD/MM/YYYY')}
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() - 1);
                  setSelectedDate(newDate);
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => setSelectedDate(new Date())}
              >
                Hoy
              </button>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() + 1);
                  setSelectedDate(newDate);
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            {getAppointmentsForDate(selectedDate).length > 0 ? (
              <div className="timeline">
                {getAppointmentsForDate(selectedDate)
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(appointment => (
                    <div key={appointment.id} className="timeline-item">
                      <div className="timeline-content">
                        <div className="timeline-date">
                          {appointment.time} - {appointment.veterinarian}
                        </div>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                          {getPetName(appointment.petId)} ({getClientName(appointment.ownerId)})
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                          {appointment.reason}
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                          <span 
                            className="badge"
                            style={{ 
                              backgroundColor: `${getStatusColor(appointment.status)}20`,
                              color: getStatusColor(appointment.status),
                              border: `1px solid ${getStatusColor(appointment.status)}`
                            }}
                          >
                            {Helpers.capitalize(appointment.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gris-medio)' }}>
                <i className="fas fa-calendar-day" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                <p>No hay citas para esta fecha</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h4 className="modal-title">
                {editingAppointment ? 'Editar Cita' : 'Nueva Cita'}
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
                  <label className="form-label">Mascota *</label>
                  <select
                    className="form-control form-select"
                    value={formData.petId}
                    onChange={(e) => handlePetSelect(e.target.value)}
                    required
                  >
                    <option value="">Seleccione mascota</option>
                    {pets.map(pet => {
                      const owner = clients.find(c => c.id === pet.ownerId);
                      return (
                        <option key={pet.id} value={pet.id}>
                          {pet.name} - {owner?.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Veterinario *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.veterinarian}
                    onChange={(e) => setFormData({...formData, veterinarian: e.target.value})}
                    placeholder="Nombre del veterinario"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Fecha *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hora *</label>
                    <select
                      className="form-control form-select"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    >
                      <option value="">Seleccione hora</option>
                      {generateTimeSlots().map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Motivo de la Consulta *</label>
                  <textarea
                    className="form-control form-textarea"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Describa el motivo de la consulta"
                    required
                    style={{ minHeight: '100px' }}
                  />
                </div>

                {editingAppointment && (
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-control form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="programada">Programada</option>
                      <option value="en-curso">En Curso</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Notas Adicionales</label>
                  <textarea
                    className="form-control form-textarea"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Notas adicionales (opcional)"
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
                    editingAppointment ? 'Actualizar' : 'Programar Cita'
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