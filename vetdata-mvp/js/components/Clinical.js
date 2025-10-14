// Componente de Historial Clínico
const Clinical = ({ user }) => {
  const [records, setRecords] = useState([]);
  const [pets, setPets] = useState([]);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    petId: '',
    appointmentId: '',
    date: new Date().toISOString().split('T')[0],
    veterinarian: user.name,
    reason: '',
    examination: '',
    diagnosis: '',
    treatment: '',
    medications: [],
    nextAppointment: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRecords(VetDataStorage.getClinicalRecords());
    setPets(VetDataStorage.getPets());
    setClients(VetDataStorage.getClients());
    setAppointments(VetDataStorage.getAppointments());
  };

  const getPetName = (petId) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : 'Mascota no encontrada';
  };

  const getClientName = (petId) => {
    const pet = pets.find(p => p.id === petId);
    if (!pet) return 'Cliente no encontrado';
    const client = clients.find(c => c.id === pet.ownerId);
    return client ? client.name : 'Cliente no encontrado';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { isValid, errors } = FormValidator.validateForm(formData, FormValidator.rules.clinicalRecord);
      
      if (!isValid) {
        Object.entries(errors).forEach(([field, fieldErrors]) => {
          Helpers.showToast(fieldErrors[0], 'error');
        });
        return;
      }

      VetDataStorage.addClinicalRecord(formData);
      Helpers.showToast('Historial clínico guardado correctamente', 'success');
      
      loadData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      Helpers.showToast('Error al guardar historial clínico', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      petId: '',
      appointmentId: '',
      date: new Date().toISOString().split('T')[0],
      veterinarian: user.name,
      reason: '',
      examination: '',
      diagnosis: '',
      treatment: '',
      medications: [],
      nextAppointment: '',
      notes: ''
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const viewPetHistory = (petId) => {
    setSelectedPet(petId);
  };

  const getRecordsForPet = (petId) => {
    return records.filter(record => record.petId === petId)
                  .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredRecords = records.filter(record => {
    const petName = getPetName(record.petId).toLowerCase();
    const clientName = getClientName(record.petId).toLowerCase();
    const term = searchTerm.toLowerCase();
    
    return petName.includes(term) || 
           clientName.includes(term) || 
           record.diagnosis.toLowerCase().includes(term) ||
           record.treatment.toLowerCase().includes(term);
  });

  return (
    <div className="clinical-page">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h3>Historial Clínico</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="search-box">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Buscar por mascota, cliente o diagnóstico..."
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
              Nuevo Registro
            </button>
          </div>
        </div>
      </div>

      {/* Vista principal o detalle de mascota */}
      {!selectedPet ? (
        /* Lista de registros recientes */
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-header">
            <h4>Registros Recientes</h4>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Mascota</th>
                  <th>Propietario</th>
                  <th>Veterinario</th>
                  <th>Diagnóstico</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 20) // Mostrar los 20 más recientes
                    .map(record => (
                      <tr key={record.id}>
                        <td>{Helpers.formatDate(record.date)}</td>
                        <td>
                          <button
                            className="btn btn-link"
                            style={{ padding: 0, textAlign: 'left' }}
                            onClick={() => viewPetHistory(record.petId)}
                          >
                            {getPetName(record.petId)}
                          </button>
                        </td>
                        <td>{getClientName(record.petId)}</td>
                        <td>{record.veterinarian}</td>
                        <td>
                          <div title={record.diagnosis}>
                            {record.diagnosis.length > 50 ? 
                              record.diagnosis.substring(0, 50) + '...' : 
                              record.diagnosis
                            }
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => viewPetHistory(record.petId)}
                            title="Ver historial completo"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                      <i className="fas fa-file-medical" style={{ fontSize: '2rem', color: 'var(--gris-medio)', marginBottom: '0.5rem' }}></i>
                      <p>No se encontraron registros clínicos</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Historial detallado de una mascota */
        <div>
          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="card-header">
              <div>
                <h4>Historial Clínico - {getPetName(selectedPet)}</h4>
                <p className="text-muted" style={{ margin: 0 }}>
                  Propietario: {getClientName(selectedPet)}
                </p>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedPet(null)}
              >
                <i className="fas fa-arrow-left"></i>
                Volver
              </button>
            </div>
          </div>

          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="card-body">
              {getRecordsForPet(selectedPet).length > 0 ? (
                <div className="timeline">
                  {getRecordsForPet(selectedPet).map(record => (
                    <div key={record.id} className="timeline-item">
                      <div className="timeline-content">
                        <div className="timeline-date">
                          {Helpers.formatDate(record.date)} - {record.veterinarian}
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                          <h5 style={{ marginBottom: '0.5rem', color: 'var(--azul-verdoso)' }}>
                            {record.reason}
                          </h5>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                          <div>
                            <h6 style={{ marginBottom: '0.5rem' }}>Examen Físico:</h6>
                            <p style={{ margin: 0, fontSize: '0.875rem' }}>{record.examination}</p>
                          </div>
                          <div>
                            <h6 style={{ marginBottom: '0.5rem' }}>Diagnóstico:</h6>
                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>{record.diagnosis}</p>
                          </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                          <h6 style={{ marginBottom: '0.5rem' }}>Tratamiento:</h6>
                          <p style={{ margin: 0, fontSize: '0.875rem' }}>{record.treatment}</p>
                        </div>

                        {record.medications && record.medications.length > 0 && (
                          <div style={{ marginBottom: '1rem' }}>
                            <h6 style={{ marginBottom: '0.5rem' }}>Medicamentos:</h6>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {record.medications.map((med, index) => (
                                <span key={index} className="badge badge-info">
                                  {med.name} - {med.dose} ({med.frequency})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {record.nextAppointment && (
                          <div>
                            <h6 style={{ marginBottom: '0.5rem' }}>Próxima Cita:</h6>
                            <span className="badge badge-warning">
                              {Helpers.formatDate(record.nextAppointment)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gris-medio)' }}>
                  <i className="fas fa-file-medical" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                  <p>Esta mascota no tiene registros clínicos</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de nuevo registro */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h4 className="modal-title">Nuevo Registro Clínico</h4>
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
                    <label className="form-label">Mascota *</label>
                    <select
                      className="form-control form-select"
                      value={formData.petId}
                      onChange={(e) => setFormData({...formData, petId: e.target.value})}
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

                <div className="form-group">
                  <label className="form-label">Motivo de la Consulta *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Motivo de la visita"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Examen Físico *</label>
                  <textarea
                    className="form-control form-textarea"
                    value={formData.examination}
                    onChange={(e) => setFormData({...formData, examination: e.target.value})}
                    placeholder="Descripción del examen físico (temperatura, peso, signos vitales, etc.)"
                    required
                    style={{ minHeight: '100px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Diagnóstico *</label>
                  <textarea
                    className="form-control form-textarea"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                    placeholder="Diagnóstico del veterinario"
                    required
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tratamiento *</label>
                  <textarea
                    className="form-control form-textarea"
                    value={formData.treatment}
                    onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                    placeholder="Plan de tratamiento recomendado"
                    required
                    style={{ minHeight: '100px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Próxima Cita</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.nextAppointment}
                    onChange={(e) => setFormData({...formData, nextAppointment: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notas Adicionales</label>
                  <textarea
                    className="form-control form-textarea"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Observaciones adicionales"
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
                    'Guardar Registro'
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