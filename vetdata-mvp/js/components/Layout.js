// js/components/Layout.js
const { useState, useEffect } = React;

const Layout = ({ user, children, currentPage, onPageChange, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', roles: ['veterinario', 'administrativo', 'recepcionista'] },
    { id: 'appointments', label: 'Citas', icon: 'fas fa-calendar-alt', roles: ['veterinario', 'administrativo', 'recepcionista'] },
    { id: 'clients', label: 'Clientes', icon: 'fas fa-users', roles: ['veterinario', 'administrativo', 'recepcionista'] },
    { id: 'pets', label: 'Mascotas', icon: 'fas fa-paw', roles: ['veterinario', 'administrativo', 'recepcionista'] },
    { id: 'clinical', label: 'Historial Clínico', icon: 'fas fa-file-medical', roles: ['veterinario'] },
    { id: 'billing', label: 'Facturación', icon: 'fas fa-receipt', roles: ['veterinario', 'administrativo'] }
  ].filter(item => item.roles.includes(user.role));

  // Detectar si es móvil y manejar estado inicial del sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Sidebar cerrado por defecto en ambas plataformas
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getPageTitle = () => {
    const item = menuItems.find(item => item.id === currentPage);
    return item ? item.label : 'VetData';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavClick = (page) => {
    onPageChange(page);
    // En móvil, cerrar sidebar después de hacer clic
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <nav key={sidebarOpen ? 'open' : 'closed'} className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : 'desktop'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-paw"></i>
            <span>VetData</span>
          </div>
          <button
            className="sidebar-toggle-close"
            onClick={toggleSidebar}
            title="Cerrar menú"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <i className={item.icon}></i>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
          
          <div className="nav-spacer"></div>
          
          <button
            className="nav-item logout-btn"
            onClick={onLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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
              <div className="user-details">
                <div className="user-name">{user.name}</div>
                <div className="user-role">
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

      {/* Overlay para móvil */}
      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};