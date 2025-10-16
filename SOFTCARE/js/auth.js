// Servicio de Autenticación
class AuthService {
    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    static setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    static logout() {
        localStorage.removeItem('currentUser');
    }

    static login(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.setCurrentUser(user);
            return { success: true, user };
        }
        
        return { success: false, message: 'Credenciales incorrectas' };
    }

    static register(userData) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Verificar si el usuario ya existe
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'El usuario ya existe' };
        }

        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        this.setCurrentUser(newUser);

        return { success: true, user: newUser };
    }
}

// Manejo del formulario de autenticación
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form-element');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const authForms = document.querySelectorAll('.auth-form');

    // Alternar entre login y registro
    showRegisterLink?.addEventListener('click', function(e) {
        e.preventDefault();
        authForms[0].style.display = 'none';
        authForms[1].style.display = 'block';
    });

    showLoginLink?.addEventListener('click', function(e) {
        e.preventDefault();
        authForms[1].style.display = 'none';
        authForms[0].style.display = 'block';
    });

    // Manejar login
    loginForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const result = AuthService.login(email, password);
        
        if (result.success) {
            window.location.reload();
        } else {
            alert(result.message);
        }
    });

    // Manejar registro
    registerForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userData = {
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            clinic: document.getElementById('reg-clinic').value
        };

        const result = AuthService.register(userData);
        
        if (result.success) {
            window.location.reload();
        } else {
            alert(result.message);
        }
    });
});