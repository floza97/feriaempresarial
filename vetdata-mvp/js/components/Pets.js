// Componente de Gestión de Mascotas
const Pets = ({ user }) => {
  const [pets, setPets] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    color: '',
    ownerId: '',
    microchip: '',
    birthDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = Helpers.filterData(pets, searchTerm, ['name', 'species', 'breed', 'color']);
    setFilteredPets(filtered);
  }, [pets, searchTerm]);

  const loadData = () => {
    const petData = VetDataStorage.getPets();
    const clientData = VetDataStorage.getClients();
    setPets(petData);
    setClients(clientData);
  };

  const getOwnerName = (ownerId) => {
    const owner = clients.find(client => client.id === ownerId);
    return owner ? owner.name : 'Propietario no encontrado';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { isValid, errors } = FormValidator.validateForm(formData, FormValidator.rules.pet);
      
      if (!isValid) {
        Object.entries(errors).forEach(([field, fieldErrors]) => {
          Helpers.showToast(fieldErrors[0], 'error');
        });
        return;
      }

      const petData = {
        ...formData,
        age: parseFloat(formData.age),
        weight: parseFloat(formData.weight)
      };

      if (editingPet) {
        VetDataStorage.updatePet(editingPet.id, petData);
        Helpers.showToast('Mascota actualizada correctamente', 'success');
      } else {
        VetDataStorage.addPet(petData);
        Helpers.showToast('Mascota registrada correctamente', 'success');
      }

      loadData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      Helpers.showToast('Error al guardar mascota', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age.toString(),
      weight: pet.weight.toString(),
      color: pet.color,
      ownerId: pet.ownerId,
      microchip: pet.microchip || '',
      birthDate: pet.birthDate || ''
    });
    setShowModal(true);
  };

  const handleDelete = (pet) => {
    if (confirm(`¿Está seguro de eliminar a ${pet.name}?`)) {
      VetDataStorage.deletePet(pet.id);
      loadData();
      Helpers.showToast('Mascota eliminada', 'success');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: '',
      weight: '',
      color: '',
      ownerId: '',
      microchip: '',
      birthDate: ''
    });
    setEditingPet(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="pets-page">
      {/* Header con acciones */}
      <div className="card">
        <div className="card-header">
          <h3>Gestión de Mascotas</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="search-box">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Buscar mascotas..."
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
              Nueva Mascota
            </button>
          </div>
        </div>
      </div>

      {/* Lista de mascotas */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mascota</th>
                <th>Propietario</th>
                <th>Especie/Raza</th>
                <th>Edad</th>
                <th>Peso</th>
                <th>Microchip</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPets.length > 0 ? (
                filteredPets.map(pet => (
                  <tr key={pet.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div 
                          className="user-avatar"
                          style={{ 
                            backgroundColor: Helpers.getAvatarColor(pet.name),
                            width: '40px',
                            height: '40px'
                          }}
                        >
                          <i className="fas fa-paw"></i>
                        </div>
                        <div>
                          <div style={{ fontWeight: '500' }}>{pet.name}</div>
                          <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                            {pet.color}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{getOwnerName(pet.ownerId)}</td>
                    <td>
                      <div>{pet.species}</div>
                      <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                        {pet.breed}
                      </div>
                    </td>
                    <td>
                      {pet.birthDate ? (
                        <div>
                          <div>{Helpers.getAgeString(pet.birthDate)}</div>
                          <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                            {Helpers.formatDate(pet.birthDate)}
                          </div>
                        </div>
                      ) : (
                        <span>{pet.age} años</span>
                      )}
                    </td>
                    <td>{pet.weight} kg</td>
                    <td>
                      {pet.microchip ? (
                        <span className="badge badge-success">Sí</span>
                      ) : (
                        <span className="badge badge-warning">No</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(pet)}
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleDelete(pet)}
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
                    <i className="fas fa-paw" style={{ fontSize: '2rem', color: 'var(--gris-medio)', marginBottom: '0.5rem' }}></i>
                    <p>No se encontraron mascotas</p>
                    {searchTerm && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => setSearchTerm('')}
                      >
                        Mostrar todas
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
                {editingPet ? 'Editar Mascota' : 'Nueva Mascota'}
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
                    <label className="form-label">Nombre de la Mascota *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Nombre de la mascota"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Propietario *</label>
                    <select
                      className="form-control form-select"
                      value={formData.ownerId}
                      onChange={(e) => setFormData({...formData, ownerId: e.target.value})}
                      required
                    >
                      <option value="">Seleccione propietario</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Especie *</label>
                    <select
                      className="form-control form-select"
                      value={formData.species}
                      onChange={(e) => setFormData({...formData, species: e.target.value})}
                      required
                    >
                      <option value="">Seleccione especie</option>
                      <option value="Perro">Perro</option>
                      <option value="Gato">Gato</option>
                      <option value="Conejo">Conejo</option>
                      <option value="Hamster">Hamster</option>
                      <option value="Ave">Ave</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Raza *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.breed}
                      onChange={(e) => setFormData({...formData, breed: e.target.value})}
                      placeholder="Raza de la mascota"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Edad (años) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      placeholder="0.5"
                      min="0"
                      max="30"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Peso (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      placeholder="5.2"
                      min="0.1"
                      max="200"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Color *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    placeholder="Descripción del color"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Microchip</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.microchip}
                      onChange={(e) => setFormData({...formData, microchip: e.target.value})}
                      placeholder="15 dígitos (opcional)"
                      maxLength="15"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    />
                  </div>
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
                    editingPet ? 'Actualizar' : 'Guardar'
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