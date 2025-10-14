// Utilidades para manejo de localStorage
const Storage = {
  // Obtener datos del localStorage
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error al obtener datos del localStorage:', error);
      return null;
    }
  },

  // Guardar datos en localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error al guardar datos en localStorage:', error);
      return false;
    }
  },

  // Eliminar datos del localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error al eliminar datos del localStorage:', error);
      return false;
    }
  },

  // Limpiar todo el localStorage
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
      return false;
    }
  },

  // Verificar si una clave existe
  exists: (key) => {
    return localStorage.getItem(key) !== null;
  },

  // Obtener todas las claves
  getAllKeys: () => {
    return Object.keys(localStorage);
  },

  // Obtener el tamaño usado en localStorage
  getSize: () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage.getItem(key).length + key.length;
      }
    }
    return total;
  }
};

// Utilidades específicas para VetData
const VetDataStorage = {
  // Claves de almacenamiento
  KEYS: {
    USERS: 'vetdata_users',
    CURRENT_USER: 'vetdata_current_user',
    CLIENTS: 'vetdata_clients',
    PETS: 'vetdata_pets',
    APPOINTMENTS: 'vetdata_appointments',
    CLINICAL_RECORDS: 'vetdata_clinical_records',
    INVOICES: 'vetdata_invoices',
    SETTINGS: 'vetdata_settings',
    INITIALIZED: 'vetdata_initialized'
  },

  // Inicializar datos de muestra si no existen
  initializeData: () => {
    if (!Storage.exists(VetDataStorage.KEYS.INITIALIZED)) {
      // Cargar datos de muestra
      if (typeof SampleData !== 'undefined') {
        Storage.set(VetDataStorage.KEYS.USERS, SampleData.users);
        Storage.set(VetDataStorage.KEYS.CLIENTS, SampleData.clients);
        Storage.set(VetDataStorage.KEYS.PETS, SampleData.pets);
        Storage.set(VetDataStorage.KEYS.APPOINTMENTS, SampleData.appointments);
        Storage.set(VetDataStorage.KEYS.CLINICAL_RECORDS, SampleData.clinicalRecords);
        Storage.set(VetDataStorage.KEYS.INVOICES, SampleData.invoices);
        Storage.set(VetDataStorage.KEYS.SETTINGS, SampleData.settings || {});
        Storage.set(VetDataStorage.KEYS.INITIALIZED, true);
        console.log('Datos de muestra inicializados');
      }
    }
  },

  // Obtener usuarios
  getUsers: () => {
    return Storage.get(VetDataStorage.KEYS.USERS) || [];
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    return Storage.get(VetDataStorage.KEYS.CURRENT_USER);
  },

  // Establecer usuario actual
  setCurrentUser: (user) => {
    return Storage.set(VetDataStorage.KEYS.CURRENT_USER, user);
  },

  // Cerrar sesión
  logout: () => {
    return Storage.remove(VetDataStorage.KEYS.CURRENT_USER);
  },

  // Obtener clientes
  getClients: () => {
    return Storage.get(VetDataStorage.KEYS.CLIENTS) || [];
  },

  // Guardar clientes
  setClients: (clients) => {
    return Storage.set(VetDataStorage.KEYS.CLIENTS, clients);
  },

  // Agregar cliente
  addClient: (client) => {
    const clients = VetDataStorage.getClients();
    client.id = generateId();
    client.createdAt = new Date().toISOString();
    client.updatedAt = new Date().toISOString();
    clients.push(client);
    return VetDataStorage.setClients(clients);
  },

  // Actualizar cliente
  updateClient: (id, updatedClient) => {
    const clients = VetDataStorage.getClients();
    const index = clients.findIndex(client => client.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updatedClient, updatedAt: new Date().toISOString() };
      return VetDataStorage.setClients(clients);
    }
    return false;
  },

  // Eliminar cliente
  deleteClient: (id) => {
    const clients = VetDataStorage.getClients();
    const filteredClients = clients.filter(client => client.id !== id);
    return VetDataStorage.setClients(filteredClients);
  },

  // Obtener mascotas
  getPets: () => {
    return Storage.get(VetDataStorage.KEYS.PETS) || [];
  },

  // Guardar mascotas
  setPets: (pets) => {
    return Storage.set(VetDataStorage.KEYS.PETS, pets);
  },

  // Agregar mascota
  addPet: (pet) => {
    const pets = VetDataStorage.getPets();
    pet.id = generateId();
    pet.createdAt = new Date().toISOString();
    pet.updatedAt = new Date().toISOString();
    pets.push(pet);
    return VetDataStorage.setPets(pets);
  },

  // Actualizar mascota
  updatePet: (id, updatedPet) => {
    const pets = VetDataStorage.getPets();
    const index = pets.findIndex(pet => pet.id === id);
    if (index !== -1) {
      pets[index] = { ...pets[index], ...updatedPet, updatedAt: new Date().toISOString() };
      return VetDataStorage.setPets(pets);
    }
    return false;
  },

  // Eliminar mascota
  deletePet: (id) => {
    const pets = VetDataStorage.getPets();
    const filteredPets = pets.filter(pet => pet.id !== id);
    return VetDataStorage.setPets(filteredPets);
  },

  // Obtener citas
  getAppointments: () => {
    return Storage.get(VetDataStorage.KEYS.APPOINTMENTS) || [];
  },

  // Guardar citas
  setAppointments: (appointments) => {
    return Storage.set(VetDataStorage.KEYS.APPOINTMENTS, appointments);
  },

  // Agregar cita
  addAppointment: (appointment) => {
    const appointments = VetDataStorage.getAppointments();
    appointment.id = generateId();
    appointment.createdAt = new Date().toISOString();
    appointments.push(appointment);
    return VetDataStorage.setAppointments(appointments);
  },

  // Actualizar cita
  updateAppointment: (id, updatedAppointment) => {
    const appointments = VetDataStorage.getAppointments();
    const index = appointments.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updatedAppointment };
      return VetDataStorage.setAppointments(appointments);
    }
    return false;
  },

  // Eliminar cita
  deleteAppointment: (id) => {
    const appointments = VetDataStorage.getAppointments();
    const filteredAppointments = appointments.filter(appointment => appointment.id !== id);
    return VetDataStorage.setAppointments(filteredAppointments);
  },

  // Obtener historiales clínicos
  getClinicalRecords: () => {
    return Storage.get(VetDataStorage.KEYS.CLINICAL_RECORDS) || [];
  },

  // Guardar historiales clínicos
  setClinicalRecords: (records) => {
    return Storage.set(VetDataStorage.KEYS.CLINICAL_RECORDS, records);
  },

  // Agregar historial clínico
  addClinicalRecord: (record) => {
    const records = VetDataStorage.getClinicalRecords();
    record.id = generateId();
    record.createdAt = new Date().toISOString();
    records.push(record);
    return VetDataStorage.setClinicalRecords(records);
  },

  // Obtener facturas
  getInvoices: () => {
    return Storage.get(VetDataStorage.KEYS.INVOICES) || [];
  },

  // Guardar facturas
  setInvoices: (invoices) => {
    return Storage.set(VetDataStorage.KEYS.INVOICES, invoices);
  },

  // Agregar factura
  addInvoice: (invoice) => {
    const invoices = VetDataStorage.getInvoices();
    invoice.id = generateId();
    invoice.number = generateInvoiceNumber();
    invoice.createdAt = new Date().toISOString();
    invoices.push(invoice);
    return VetDataStorage.setInvoices(invoices);
  },

  // Actualizar factura
  updateInvoice: (id, updatedInvoice) => {
    const invoices = VetDataStorage.getInvoices();
    const index = invoices.findIndex(invoice => invoice.id === id);
    if (index !== -1) {
      invoices[index] = { ...invoices[index], ...updatedInvoice };
      return VetDataStorage.setInvoices(invoices);
    }
    return false;
  },

  // Obtener configuración
  getSettings: () => {
    return Storage.get(VetDataStorage.KEYS.SETTINGS) || {};
  },

  // Guardar configuración
  setSettings: (settings) => {
    return Storage.set(VetDataStorage.KEYS.SETTINGS, settings);
  }
};

// Función auxiliar para generar IDs únicos
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función auxiliar para generar números de factura
function generateInvoiceNumber() {
  const invoices = VetDataStorage.getInvoices();
  const currentYear = new Date().getFullYear();
  const yearInvoices = invoices.filter(inv => inv.number?.startsWith(currentYear.toString()));
  const nextNumber = yearInvoices.length + 1;
  return `${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
}