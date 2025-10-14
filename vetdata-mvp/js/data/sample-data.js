// Datos de muestra para VetData MVP
const SampleData = {
  // Usuarios del sistema
  users: [
    {
      id: 'user-1',
      username: 'vet1',
      password: '123456',
      role: 'veterinario',
      name: 'Dr. Carlos Mendoza',
      email: 'carlos.mendoza@vetdata.com',
      active: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'user-2',
      username: 'admin1',
      password: '123456',
      role: 'administrativo',
      name: 'María Elena García',
      email: 'maria.garcia@vetdata.com',
      active: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'user-3',
      username: 'recep1',
      password: '123456',
      role: 'recepcionista',
      name: 'Ana Patricia López',
      email: 'ana.lopez@vetdata.com',
      active: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ],

  // Clientes (propietarios de mascotas)
  clients: [
    {
      id: 'client-1',
      name: 'Juan Carlos Pérez',
      phone: '3001234567',
      email: 'juan.perez@email.com',
      document: '12345678',
      address: 'Calle 45 #23-67, Sincelejo, Sucre',
      createdAt: '2024-08-15T10:30:00Z',
      updatedAt: '2024-08-15T10:30:00Z'
    },
    {
      id: 'client-2',
      name: 'Sandra Milena Torres',
      phone: '3109876543',
      email: 'sandra.torres@email.com',
      document: '87654321',
      address: 'Carrera 20 #15-89, Corozal, Sucre',
      createdAt: '2024-08-16T14:20:00Z',
      updatedAt: '2024-08-16T14:20:00Z'
    },
    {
      id: 'client-3',
      name: 'Roberto Javier Martínez',
      phone: '3201357924',
      email: 'roberto.martinez@email.com',
      document: '11223344',
      address: 'Avenida Principal #78-12, Sincelejo, Sucre',
      createdAt: '2024-08-17T09:15:00Z',
      updatedAt: '2024-08-17T09:15:00Z'
    },
    {
      id: 'client-4',
      name: 'Liliana Paola Herrera',
      phone: '3158642097',
      email: 'liliana.herrera@email.com',
      document: '99887766',
      address: 'Calle 12 #34-56, Corozal, Sucre',
      createdAt: '2024-09-01T11:45:00Z',
      updatedAt: '2024-09-01T11:45:00Z'
    },
    {
      id: 'client-5',
      name: 'Diego Alejandro Ruiz',
      phone: '3007531468',
      email: 'diego.ruiz@email.com',
      document: '55443322',
      address: 'Barrio La Esperanza, Manzana 5, Casa 23, Sincelejo',
      createdAt: '2024-09-05T16:30:00Z',
      updatedAt: '2024-09-05T16:30:00Z'
    }
  ],

  // Mascotas
  pets: [
    {
      id: 'pet-1',
      name: 'Max',
      species: 'Perro',
      breed: 'Golden Retriever',
      age: 3,
      weight: 28.5,
      color: 'Dorado',
      ownerId: 'client-1',
      microchip: '123456789012345',
      birthDate: '2021-03-15',
      createdAt: '2024-08-15T10:35:00Z',
      updatedAt: '2024-08-15T10:35:00Z'
    },
    {
      id: 'pet-2',
      name: 'Luna',
      species: 'Gato',
      breed: 'Siamés',
      age: 2,
      weight: 4.2,
      color: 'Crema y marrón',
      ownerId: 'client-2',
      microchip: '987654321098765',
      birthDate: '2022-07-08',
      createdAt: '2024-08-16T14:25:00Z',
      updatedAt: '2024-08-16T14:25:00Z'
    },
    {
      id: 'pet-3',
      name: 'Rocky',
      species: 'Perro',
      breed: 'Pitbull',
      age: 5,
      weight: 32.0,
      color: 'Blanco con manchas negras',
      ownerId: 'client-3',
      microchip: '',
      birthDate: '2019-11-20',
      createdAt: '2024-08-17T09:20:00Z',
      updatedAt: '2024-08-17T09:20:00Z'
    },
    {
      id: 'pet-4',
      name: 'Mimi',
      species: 'Gato',
      breed: 'Persa',
      age: 1,
      weight: 3.8,
      color: 'Gris',
      ownerId: 'client-4',
      microchip: '456789123456789',
      birthDate: '2023-05-12',
      createdAt: '2024-09-01T11:50:00Z',
      updatedAt: '2024-09-01T11:50:00Z'
    },
    {
      id: 'pet-5',
      name: 'Bruno',
      species: 'Perro',
      breed: 'Pastor Alemán',
      age: 4,
      weight: 35.7,
      color: 'Negro y marrón',
      ownerId: 'client-5',
      microchip: '789123456789012',
      birthDate: '2020-09-03',
      createdAt: '2024-09-05T16:35:00Z',
      updatedAt: '2024-09-05T16:35:00Z'
    },
    {
      id: 'pet-6',
      name: 'Coco',
      species: 'Perro',
      breed: 'Cocker Spaniel',
      age: 6,
      weight: 15.3,
      color: 'Café claro',
      ownerId: 'client-1',
      microchip: '321654987321654',
      birthDate: '2018-12-10',
      createdAt: '2024-09-10T08:15:00Z',
      updatedAt: '2024-09-10T08:15:00Z'
    }
  ],

  // Citas
  appointments: [
    {
      id: 'apt-1',
      petId: 'pet-1',
      ownerId: 'client-1',
      veterinarian: 'Dr. Carlos Mendoza',
      date: '2024-10-15',
      time: '09:00',
      reason: 'Chequeo general y vacunas',
      status: 'programada',
      notes: 'Revisar estado general, aplicar vacuna anual',
      createdAt: '2024-10-10T14:30:00Z'
    },
    {
      id: 'apt-2',
      petId: 'pet-2',
      ownerId: 'client-2',
      veterinarian: 'Dr. Carlos Mendoza',
      date: '2024-10-15',
      time: '10:30',
      reason: 'Control post-operatorio',
      status: 'programada',
      notes: 'Revisar cicatrización de esterilización',
      createdAt: '2024-10-12T09:15:00Z'
    },
    {
      id: 'apt-3',
      petId: 'pet-3',
      ownerId: 'client-3',
      date: '2024-10-14',
      time: '11:00',
      reason: 'Consulta por cojera',
      status: 'completada',
      veterinarian: 'Dr. Carlos Mendoza',
      notes: 'Examen de extremidad posterior derecha',
      createdAt: '2024-10-08T16:45:00Z'
    },
    {
      id: 'apt-4',
      petId: 'pet-4',
      ownerId: 'client-4',
      date: '2024-10-16',
      time: '14:00',
      reason: 'Primera consulta y desparasitación',
      status: 'programada',
      veterinarian: 'Dr. Carlos Mendoza',
      notes: 'Examen completo gatito nuevo',
      createdAt: '2024-10-11T12:20:00Z'
    },
    {
      id: 'apt-5',
      petId: 'pet-5',
      ownerId: 'client-5',
      date: '2024-10-17',
      time: '15:30',
      reason: 'Vacunación anual',
      status: 'programada',
      veterinarian: 'Dr. Carlos Mendoza',
      notes: 'Aplicar vacuna múltiple y antirrábica',
      createdAt: '2024-10-13T10:00:00Z'
    },
    {
      id: 'apt-6',
      petId: 'pet-1',
      ownerId: 'client-1',
      date: '2024-10-12',
      time: '16:00',
      reason: 'Consulta por vómito',
      status: 'completada',
      veterinarian: 'Dr. Carlos Mendoza',
      notes: 'Gastroenteritis leve, tratamiento sintomático',
      createdAt: '2024-10-09T11:30:00Z'
    }
  ],

  // Historiales clínicos
  clinicalRecords: [
    {
      id: 'record-1',
      petId: 'pet-3',
      appointmentId: 'apt-3',
      date: '2024-10-14',
      veterinarian: 'Dr. Carlos Mendoza',
      reason: 'Consulta por cojera',
      examination: 'Examen físico: T: 38.5°C, FC: 120 lpm, FR: 24 rpm. Cojera grado 2/4 en extremidad posterior derecha. Dolor a la palpación en articulación coxofemoral.',
      diagnosis: 'Displasia de cadera leve',
      treatment: 'Antiinflamatorio (Meloxicam 0.1mg/kg cada 24h por 7 días). Restricción de ejercicio. Control en 15 días.',
      medications: [
        { name: 'Meloxicam', dose: '3.2mg', frequency: 'Cada 24 horas', duration: '7 días' }
      ],
      nextAppointment: '2024-10-29',
      createdAt: '2024-10-14T11:45:00Z'
    },
    {
      id: 'record-2',
      petId: 'pet-1',
      appointmentId: 'apt-6',
      date: '2024-10-12',
      veterinarian: 'Dr. Carlos Mendoza',
      reason: 'Consulta por vómito',
      examination: 'Examen físico: T: 39.1°C, FC: 140 lpm, FR: 28 rpm. Deshidratación leve (5%). Abdomen ligeramente sensible a la palpación.',
      diagnosis: 'Gastroenteritis aguda',
      treatment: 'Fluidoterapia subcutánea. Dieta blanda. Protector gástrico y probióticos.',
      medications: [
        { name: 'Omeprazol', dose: '20mg', frequency: 'Cada 12 horas', duration: '5 días' },
        { name: 'Probióticos', dose: '1 sobre', frequency: 'Cada 24 horas', duration: '10 días' }
      ],
      nextAppointment: '2024-10-15',
      createdAt: '2024-10-12T16:30:00Z'
    }
  ],

  // Facturas
  invoices: [
    {
      id: 'invoice-1',
      number: '2024-0001',
      clientId: 'client-3',
      date: '2024-10-14',
      services: [
        { description: 'Consulta veterinaria', price: 45000, quantity: 1 },
        { description: 'Meloxicam 32mg (7 comp.)', price: 18000, quantity: 1 }
      ],
      subtotal: 63000,
      tax: 0,
      total: 63000,
      status: 'pagada',
      paymentMethod: 'Efectivo',
      createdAt: '2024-10-14T12:00:00Z'
    },
    {
      id: 'invoice-2',
      number: '2024-0002',
      clientId: 'client-1',
      date: '2024-10-12',
      services: [
        { description: 'Consulta veterinaria', price: 45000, quantity: 1 },
        { description: 'Omeprazol 20mg', price: 12000, quantity: 1 },
        { description: 'Probióticos', price: 25000, quantity: 1 }
      ],
      subtotal: 82000,
      tax: 0,
      total: 82000,
      status: 'pagada',
      paymentMethod: 'Transferencia',
      createdAt: '2024-10-12T17:00:00Z'
    },
    {
      id: 'invoice-3',
      number: '2024-0003',
      clientId: 'client-2',
      date: '2024-09-28',
      services: [
        { description: 'Esterilización felina', price: 180000, quantity: 1 },
        { description: 'Antibiótico post-quirúrgico', price: 35000, quantity: 1 }
      ],
      subtotal: 215000,
      tax: 0,
      total: 215000,
      status: 'pagada',
      paymentMethod: 'Tarjeta débito',
      createdAt: '2024-09-28T14:30:00Z'
    }
  ],

  // Configuración del sistema
  settings: {
    clinicName: 'Clínica Veterinaria VetData Demo',
    address: 'Carrera 25 #18-45, Sincelejo, Sucre',
    phone: '(5) 282-4567',
    email: 'info@vetdatademo.com',
    taxId: '900123456-1',
    workingHours: {
      monday: { start: '08:00', end: '18:00' },
      tuesday: { start: '08:00', end: '18:00' },
      wednesday: { start: '08:00', end: '18:00' },
      thursday: { start: '08:00', end: '18:00' },
      friday: { start: '08:00', end: '18:00' },
      saturday: { start: '08:00', end: '14:00' },
      sunday: { closed: true }
    },
    appointmentDuration: 30, // minutos
    currency: 'COP',
    language: 'es'
  }
};

// Función para obtener más datos de muestra si se necesita
const generateMoreSampleData = () => {
  const species = ['Perro', 'Gato', 'Conejo', 'Hamster'];
  const dogBreeds = ['Labrador', 'Golden Retriever', 'Pitbull', 'Cocker Spaniel', 'Pastor Alemán', 'Bulldog'];
  const catBreeds = ['Siamés', 'Persa', 'Angora', 'Maine Coon', 'Criollo'];
  const colors = ['Negro', 'Blanco', 'Marrón', 'Gris', 'Dorado', 'Multicolor'];
  
  const moreClients = [];
  const morePets = [];
  
  for (let i = 6; i <= 15; i++) {
    // Generar más clientes
    const client = {
      id: `client-${i}`,
      name: `Cliente Ejemplo ${i}`,
      phone: `30${Math.floor(Math.random() * 90000000) + 10000000}`,
      email: `cliente${i}@email.com`,
      document: `${Math.floor(Math.random() * 90000000) + 10000000}`,
      address: `Dirección de ejemplo ${i}, Sincelejo`,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };
    moreClients.push(client);
    
    // Generar mascotas para cada cliente
    const numPets = Math.floor(Math.random() * 3) + 1; // 1-3 mascotas por cliente
    for (let j = 1; j <= numPets; j++) {
      const selectedSpecies = species[Math.floor(Math.random() * species.length)];
      const breeds = selectedSpecies === 'Perro' ? dogBreeds : catBreeds;
      
      const pet = {
        id: `pet-${i}-${j}`,
        name: `Mascota${i}${j}`,
        species: selectedSpecies,
        breed: breeds[Math.floor(Math.random() * breeds.length)],
        age: Math.floor(Math.random() * 15) + 1,
        weight: selectedSpecies === 'Perro' ? Math.random() * 40 + 5 : Math.random() * 8 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        ownerId: client.id,
        microchip: Math.random() > 0.5 ? `${Math.floor(Math.random() * 1000000000000000)}` : '',
        birthDate: new Date(Date.now() - Math.random() * 15 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: client.createdAt,
        updatedAt: client.updatedAt
      };
      morePets.push(pet);
    }
  }
  
  return { clients: moreClients, pets: morePets };
};