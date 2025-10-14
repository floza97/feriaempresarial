// Validadores de formularios
const Validators = {
  // Validar email
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validar teléfono colombiano
  phone: (phone) => {
    // Acepta formatos: 3001234567, +573001234567, 300-123-4567, (300) 123-4567
    const phoneRegex = /^(\+57|57)?[\s\-\(\)]?[3][0-9]{2}[\s\-\(\)]?[0-9]{3}[\s\-\(\)]?[0-9]{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Validar documento de identidad
  document: (doc) => {
    // Acepta cédulas colombianas (8-10 dígitos)
    const docRegex = /^[0-9]{8,10}$/;
    return docRegex.test(doc);
  },

  // Validar que un campo no esté vacío
  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },

  // Validar longitud mínima
  minLength: (value, minLen) => {
    return value && value.toString().length >= minLen;
  },

  // Validar longitud máxima
  maxLength: (value, maxLen) => {
    return !value || value.toString().length <= maxLen;
  },

  // Validar números
  number: (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },

  // Validar números positivos
  positiveNumber: (value) => {
    return Validators.number(value) && parseFloat(value) > 0;
  },

  // Validar fecha
  date: (date) => {
    return date && !isNaN(new Date(date));
  },

  // Validar fecha futura
  futureDate: (date) => {
    return Validators.date(date) && new Date(date) > new Date();
  },

  // Validar fecha pasada
  pastDate: (date) => {
    return Validators.date(date) && new Date(date) < new Date();
  },

  // Validar edad de mascota (0-30 años)
  petAge: (age) => {
    return Validators.positiveNumber(age) && age >= 0 && age <= 30;
  },

  // Validar peso de mascota (0.1kg - 200kg)
  petWeight: (weight) => {
    return Validators.positiveNumber(weight) && weight >= 0.1 && weight <= 200;
  },

  // Validar nombre (solo letras, espacios y algunos caracteres especiales)
  name: (name) => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-'\.]+$/;
    return nameRegex.test(name);
  },

  // Validar contraseña (mínimo 6 caracteres)
  password: (password) => {
    return password && password.length >= 6;
  },

  // Validar microchip (15 dígitos)
  microchip: (chip) => {
    return !chip || /^[0-9]{15}$/.test(chip);
  }
};

// Mensajes de error personalizados
const ValidationMessages = {
  required: 'Este campo es obligatorio',
  email: 'Ingrese un email válido',
  phone: 'Ingrese un teléfono válido (ej: 3001234567)',
  document: 'Ingrese un documento válido (8-10 dígitos)',
  minLength: (min) => `Mínimo ${min} caracteres`,
  maxLength: (max) => `Máximo ${max} caracteres`,
  number: 'Debe ser un número válido',
  positiveNumber: 'Debe ser un número mayor a 0',
  date: 'Ingrese una fecha válida',
  futureDate: 'La fecha debe ser futura',
  pastDate: 'La fecha debe ser pasada',
  petAge: 'La edad debe estar entre 0 y 30 años',
  petWeight: 'El peso debe estar entre 0.1kg y 200kg',
  name: 'Solo se permiten letras, espacios y guiones',
  password: 'La contraseña debe tener al menos 6 caracteres',
  microchip: 'El microchip debe tener exactamente 15 dígitos'
};

// Validador de formularios completo
const FormValidator = {
  // Validar un campo individual
  validateField: (value, rules) => {
    const errors = [];

    for (const rule of rules) {
      if (typeof rule === 'string') {
        // Regla simple
        if (!Validators[rule](value)) {
          errors.push(ValidationMessages[rule]);
        }
      } else if (typeof rule === 'object') {
        // Regla con parámetros
        const { type, params } = rule;
        if (!Validators[type](value, ...params)) {
          errors.push(
            typeof ValidationMessages[type] === 'function'
              ? ValidationMessages[type](...params)
              : ValidationMessages[type]
          );
        }
      }
    }

    return errors;
  },

  // Validar todo un formulario
  validateForm: (formData, validationRules) => {
    const errors = {};
    let isValid = true;

    for (const [fieldName, rules] of Object.entries(validationRules)) {
      const fieldErrors = FormValidator.validateField(formData[fieldName], rules);
      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
        isValid = false;
      }
    }

    return { isValid, errors };
  },

  // Reglas de validación predefinidas para entidades
  rules: {
    client: {
      name: ['required', 'name', { type: 'minLength', params: [2] }],
      phone: ['required', 'phone'],
      email: ['email'],
      document: ['required', 'document'],
      address: ['required', { type: 'minLength', params: [5] }]
    },

    pet: {
      name: ['required', 'name', { type: 'minLength', params: [2] }],
      species: ['required'],
      breed: ['required'],
      age: ['required', 'petAge'],
      weight: ['required', 'petWeight'],
      color: ['required'],
      ownerId: ['required'],
      microchip: ['microchip']
    },

    appointment: {
      petId: ['required'],
      ownerId: ['required'],
      veterinarian: ['required'],
      date: ['required', 'date', 'futureDate'],
      time: ['required'],
      reason: ['required', { type: 'minLength', params: [5] }]
    },

    clinicalRecord: {
      petId: ['required'],
      veterinarian: ['required'],
      date: ['required', 'date'],
      reason: ['required'],
      examination: ['required'],
      diagnosis: ['required'],
      treatment: ['required']
    },

    invoice: {
      clientId: ['required'],
      date: ['required', 'date'],
      services: ['required'],
      total: ['required', 'positiveNumber']
    },

    user: {
      username: ['required', { type: 'minLength', params: [3] }],
      password: ['required', 'password'],
      name: ['required', 'name'],
      email: ['required', 'email'],
      role: ['required']
    }
  }
};

// Utilidades de validación en tiempo real
const RealTimeValidator = {
  // Aplicar validación en tiempo real a un input
  attachToInput: (inputElement, rules, errorContainer) => {
    const validateInput = () => {
      const errors = FormValidator.validateField(inputElement.value, rules);
      
      // Limpiar clases de error
      inputElement.classList.remove('is-invalid', 'is-valid');
      
      if (errors.length > 0) {
        inputElement.classList.add('is-invalid');
        if (errorContainer) {
          errorContainer.innerHTML = errors[0];
          errorContainer.style.display = 'block';
        }
      } else if (inputElement.value.trim() !== '') {
        inputElement.classList.add('is-valid');
        if (errorContainer) {
          errorContainer.style.display = 'none';
        }
      }
      
      return errors.length === 0;
    };

    // Eventos para validación en tiempo real
    inputElement.addEventListener('blur', validateInput);
    inputElement.addEventListener('input', () => {
      // Debounce para evitar validaciones excesivas
      clearTimeout(inputElement.validationTimeout);
      inputElement.validationTimeout = setTimeout(validateInput, 500);
    });

    return validateInput;
  },

  // Aplicar validación a todo un formulario
  attachToForm: (formElement, validationRules) => {
    const validators = {};
    
    for (const [fieldName, rules] of Object.entries(validationRules)) {
      const input = formElement.querySelector(`[name="${fieldName}"]`);
      const errorContainer = formElement.querySelector(`[data-error="${fieldName}"]`);
      
      if (input) {
        validators[fieldName] = RealTimeValidator.attachToInput(input, rules, errorContainer);
      }
    }

    return validators;
  }
};

// CSS classes para estados de validación
const ValidationStyles =  `
  .form-control.is-invalid {
    border-color: var(--error);
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
  }
  // ... resto del código
`;

// Insertar estilos de validación
if (!document.querySelector('#validation-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'validation-styles';
  styleSheet.textContent = ValidationStyles;
  document.head.appendChild(styleSheet);
}

document.head.appendChild(styleSheet);