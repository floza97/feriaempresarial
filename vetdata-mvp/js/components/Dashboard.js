// Componente Dashboard
const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    monthlyRevenue: 0,
    totalClients: 0,
    totalPets: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 800));

      const appointments = VetDataStorage.getAppointments();
      const clients = VetDataStorage.getClients();
      const pets = VetDataStorage.getPets();
      const invoices = VetDataStorage.getInvoices();

      // Calcular estadísticas
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(apt => 
        apt.date === today && apt.status === 'programada'
      ).length;

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = invoices
        .filter(inv => {
          const invDate = new Date(inv.date);
          return invDate.getMonth() === currentMonth && 
                 invDate.getFullYear() === currentYear &&
                 inv.status === 'pagada';
        })
        .reduce((sum, inv) => sum + inv.total, 0);

      setStats({
        todayAppointments,
        monthlyRevenue,
        totalClients: clients.length,
        totalPets: pets.length
      });

      // Próximas citas
      const upcoming = Helpers.getUpcomingAppointments(appointments, 7);
      setUpcomingAppointments(upcoming.slice(0, 5));

      // Actividad reciente
      const recent = [
        ...appointments.slice(-3).map(apt => ({
          type: 'appointment',
          description: `Cita programada para ${getPetName(apt.petId)}`,
          time: apt.createdAt,
          icon: 'calendar-alt'
        })),
        ...clients.slice(-2).map(client => ({
          type: 'client',
          description: `Nuevo cliente registrado: ${client.name}`,
          time: client.createdAt,
          icon: 'user-plus'
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

      setRecentActivity(recent);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPetName = (petId) => {
    const pets = VetDataStorage.getPets();
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : 'Mascota no encontrada';
  };

  const getClientName = (clientId) => {
    const clients = VetDataStorage.getClients();
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente no encontrado';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Saludo personalizado */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>
          ¡Buen día, {user.name}!
        </h2>
        <p className="text-muted">
          Aquí tienes un resumen de las actividades de tu clínica
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Citas Hoy</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--azul-verdoso)' }}>
              <i className="fas fa-calendar-day"></i>
            </div>
          </div>
          <div className="stat-value">{stats.todayAppointments}</div>
        </div>

        <div className="stat-card appointments">
          <div className="stat-header">
            <span className="stat-title">Ingresos del Mes</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--success)' }}>
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="stat-value">{Helpers.formatCurrency(stats.monthlyRevenue)}</div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-header">
            <span className="stat-title">Total Clientes</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--info)' }}>
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div className="stat-value">{stats.totalClients}</div>
        </div>

        <div className="stat-card clients">
          <div className="stat-header">
            <span className="stat-title">Total Mascotas</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--verde-menta)' }}>
              <i className="fas fa-paw"></i>
            </div>
          </div>
          <div className="stat-value">{stats.totalPets}</div>
        </div>
      </div>

      {/* Secciones principales */}
      <div className="dashboard-grid">
        {/* Próximas citas */}
        <div className="dashboard-section">
          <div className="section-header">
            <i className="fas fa-calendar-check"></i>
            Próximas Citas (7 días)
          </div>
          <div className="section-content">
            {upcomingAppointments.length > 0 ? (
              <div className="timeline">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="timeline-item">
                    <div className="timeline-content">
                      <div className="timeline-date">
                        {Helpers.formatDate(appointment.date)} - {appointment.time}
                      </div>
                      <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                        {getPetName(appointment.petId)}
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                        {getClientName(appointment.ownerId)} • {appointment.reason}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gris-medio)' }}>
                <i className="fas fa-calendar" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                <p>No hay citas programadas</p>
              </div>
            )}
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="dashboard-section">
          <div className="section-header">
            <i className="fas fa-history"></i>
            Actividad Reciente
          </div>
          <div className="section-content">
            {recentActivity.length > 0 ? (
              <div className="timeline">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-content">
                      <div className="timeline-date">
                        {Helpers.formatDate(activity.time, 'DD/MM/YYYY HH:mm')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className={`fas fa-${activity.icon}`} style={{ color: 'var(--azul-verdoso)' }}></i>
                        <span>{activity.description}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gris-medio)' }}>
                <i className="fas fa-history" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                <p>No hay actividad reciente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <i className="fas fa-rocket"></i>
          Acciones Rápidas
        </div>
        <div className="card-body">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            <button className="btn btn-primary">
              <i className="fas fa-calendar-plus"></i>
              Nueva Cita
            </button>
            <button className="btn btn-secondary">
              <i className="fas fa-user-plus"></i>
              Nuevo Cliente
            </button>
            <button className="btn btn-secondary">
              <i className="fas fa-paw"></i>
              Nueva Mascota
            </button>
            <button className="btn btn-secondary">
              <i className="fas fa-file-medical"></i>
              Ver Historiales
            </button>
          </div>
        </div>
      </div>

      {/* Consejos del día */}
      <div className="alert alert-info" style={{ marginTop: '2rem' }}>
        <h4 style={{ marginBottom: '0.5rem' }}>
          <i className="fas fa-lightbulb"></i> Consejo del día
        </h4>
        <p style={{ marginBottom: 0 }}>
          Recuerda revisar las citas del día y preparar los materiales necesarios para cada consulta. 
          Una buena organización mejora la experiencia tanto para los clientes como para las mascotas.
        </p>
      </div>
    </div>
  );
};