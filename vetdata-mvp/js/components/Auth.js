// Componente de Autenticación
const { useState, useEffect } = React;

const Auth = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      const users = VetDataStorage.getUsers();
      const user = users.find(u => u.username === username && u.password === password && u.active);

      if (user) {
        VetDataStorage.setCurrentUser(user);
        onLogin(user);
        Helpers.showToast(`Bienvenido, ${user.name}`, 'success');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const loadDemoUser = (role) => {
    const demoUsers = {
      veterinario: { username: 'vet1', password: '123456' },
      administrativo: { username: 'admin1', password: '123456' },
      recepcionista: { username: 'recep1', password: '123456' }
    };

    const demo = demoUsers[role];
    setUsername(demo.username);
    setPassword(demo.password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <i className="fas fa-paw"></i>
          </div>
          <h1 className="login-title">VetData</h1>
          <p className="login-subtitle">Sistema de Gestión Veterinaria</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Usuario</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          {error && (
            <div className="alert alert-error mb-3">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{width: '16px', height: '16px'}}></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div style={{marginTop: '2rem', borderTop: '1px solid #e9ecef', paddingTop: '1rem'}}>
          <p className="text-center text-muted mb-3" style={{fontSize: '0.875rem'}}>
            <strong>Usuarios de prueba:</strong>
          </p>
          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => loadDemoUser('veterinario')}
              style={{flex: '1', minWidth: '90px'}}
            >
              <i className="fas fa-user-md"></i> Veterinario
            </button>
            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => loadDemoUser('administrativo')}
              style={{flex: '1', minWidth: '90px'}}
            >
              <i className="fas fa-user-tie"></i> Admin
            </button>
            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => loadDemoUser('recepcionista')}
              style={{flex: '1', minWidth: '90px'}}
            >
              <i className="fas fa-user"></i> Recepción
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Layout principal
const Layout = ({ user, children, currentPage, onPageChange, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', roles: ['veterinario', 'administrativo', 'recepcionista'] },
    { id: 'appointments', label: 'Citas', icon: 'fas fa-calendar-alt', roles: ['veterinario', 'administrativo', 'recepcionista'] },
    { id: 'clients', label: 'Clientes', icon: 'fas fa-users', roles: ['veterinario', 'administrativo', 'recepcionista'] },
    { id: 'pets', label: 'Mascotas', icon: 'fas fa-paw', roles: ['veterinario', 'administrativo', 'recepcionista'] },
    { id: 'clinical', label: 'Historial Clínico', icon: 'fas fa-file-medical', roles: ['veterinario'] },
    { id: 'billing', label: 'Facturación', icon: 'fas fa-receipt', roles: ['veterinario', 'administrativo'] }
  ].filter(item => item.roles.includes(user.role));

  const getPageTitle = () => {
    const item = menuItems.find(item => item.id === currentPage);
    return item ? item.label : 'VetData';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app">
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-paw"></i>
            <span>VetData</span>
          </div>
        </div>
        <div className="sidebar-nav">
          {menuItems.map(item => (
            <a
              key={item.id}
              href="#"
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(item.id);
                setSidebarOpen(false);
              }}
            >
              <i className={item.icon}></i>
              {item.label}
            </a>
          ))}
          <a
            href="#"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
            style={{marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)'}}
          >
            <i className="fas fa-sign-out-alt"></i>
            Cerrar Sesión
          </a>
        </div>
      </nav>

      <div className={`main-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <header className="header">
          <div className="header-left">
            <button 
              className="menu-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                {Helpers.getInitials(user.name)}
              </div>
              <div>
                <div style={{fontWeight: '500'}}>{user.name}</div>
                <div style={{fontSize: '0.875rem', color: 'var(--gris-medio)'}}>
                  {Helpers.capitalize(user.role)}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="content">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setSidebarOpen(false)}
          style={{zIndex: 999}}
        />
      )}
    </div>
  );
};