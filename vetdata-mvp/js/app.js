// Aplicación principal VetData MVP - VERSIÓN CORREGIDA
const { useState, useEffect } = React;

const VetDataApp = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Inicializar aplicación
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Inicializar datos de muestra si es la primera vez
      if (typeof VetDataStorage !== 'undefined') {
        VetDataStorage.initializeData();

        // Verificar si hay sesión activa
        const currentUser = VetDataStorage.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      }
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    if (typeof VetDataStorage !== 'undefined') {
      VetDataStorage.logout();
    }
    setUser(null);
    setCurrentPage('dashboard');
    if (typeof Helpers !== 'undefined') {
      Helpers.showToast('Sesión cerrada correctamente', 'info');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Renderizar página actual
  const renderCurrentPage = () => {
    if (!user) return null;

    switch (currentPage) {
      case 'dashboard':
        return typeof Dashboard !== 'undefined' ? <Dashboard user={user} /> : <div>Error: Dashboard no cargado</div>;
      case 'appointments':
        return typeof Appointments !== 'undefined' ? <Appointments user={user} /> : <div>Error: Appointments no cargado</div>;
      case 'clients':
        return typeof Clients !== 'undefined' ? <Clients user={user} /> : <div>Error: Clients no cargado</div>;
      case 'pets':
        return typeof Pets !== 'undefined' ? <Pets user={user} /> : <div>Error: Pets no cargado</div>;
      case 'clinical':
        return typeof Clinical !== 'undefined' ? <Clinical user={user} /> : <div>Error: Clinical no cargado</div>;
      case 'billing':
        return typeof Billing !== 'undefined' ? <Billing user={user} /> : <div>Error: Billing no cargado</div>;
      default:
        return typeof Dashboard !== 'undefined' ? <Dashboard user={user} /> : <div>Error: Dashboard no cargado</div>;
    }
  };

  // Mostrar loading inicial
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner" style={{ width: '50px', height: '50px' }}></div>
        <h3 style={{ color: 'var(--azul-verdoso)' }}>Cargando VetData...</h3>
        <p style={{ color: 'var(--gris-medio)' }}>Inicializando sistema de gestión veterinaria</p>
      </div>
    );
  }

  // Si no hay usuario logueado, mostrar login
  if (!user) {
    return typeof Auth !== 'undefined' ? <Auth onLogin={handleLogin} /> : <div>Error: Auth no cargado</div>;
  }

  // Aplicación principal
  return typeof Layout !== 'undefined' ? (
    <Layout
      user={user}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onLogout={handleLogout}
    >
      {renderCurrentPage()}
    </Layout>
  ) : (
    <div>Error: Layout no cargado. Verifica que Layout.js esté incluido.</div>
  );
};

// Iniciar la aplicación cuando el DOM esté listo
if (typeof ReactDOM !== 'undefined') {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<VetDataApp />);
} else {
  console.error('ReactDOM no está disponible');
  document.getElementById('root').innerHTML = '<div style="padding: 20px; text-align: center;"><h2>Error: React no se cargó correctamente</h2><p>Verifica tu conexión a internet.</p></div>';
}