// Base de datos de usuarios simulada
const UsersDB = {
    // Inicializar la base de datos desde localStorage si existe
    init: function() {
        // Comprobar si ya hay usuarios almacenados
        const storedUsers = localStorage.getItem('rutina_users_db');
        
        if (storedUsers) {
            this.users = JSON.parse(storedUsers);
            
            // Actualizar usuarios existentes con campos de seguridad si no los tienen
            for (const username in this.users) {
                if (!this.users[username].securityQuestion) {
                    this.users[username].securityQuestion = '';
                    this.users[username].securityAnswer = '';
                }
                
                if (!this.users[username].email) {
                    this.users[username].email = '';
                }
            }
            
            // Guardar los cambios
            this.saveUsers();
        } else {
            // Usuarios predeterminados
            this.users = {
                'chayo': {
                    username: 'chayo',
                    password: 'password123', // En una aplicación real, esto estaría hasheado
                    displayName: 'Chayo',
                    createdAt: new Date().toISOString(),
                    email: 'chayo@ejemplo.com',
                    securityQuestion: '¿Cuál es el nombre de tu mascota?',
                    securityAnswer: 'toby'
                },
                'isra': {
                    username: 'isra',
                    password: 'password123',
                    displayName: 'Isra',
                    createdAt: new Date().toISOString(),
                    email: 'isra@ejemplo.com',
                    securityQuestion: '¿Cuál es tu color favorito?',
                    securityAnswer: 'azul'
                }
            };
            
            // Guardar usuarios predeterminados
            this.saveUsers();
        }
    },
    
    // Guardar usuarios en localStorage
    saveUsers: function() {
        localStorage.setItem('rutina_users_db', JSON.stringify(this.users));
    },
    
    // Autenticar usuario
    authenticate: function(username, password) {
        const user = this.users[username];
        
        if (user && user.password === password) {
            // Generar información de sesión
            const sessionInfo = {
                username: user.username,
                displayName: user.displayName,
                loginTime: new Date().toISOString()
            };
            
            // Guardar información de sesión
            localStorage.setItem('rutina_user', user.username);
            localStorage.setItem('rutina_user_display', user.displayName);
            localStorage.setItem('rutina_logged_in', 'true');
            
            return true;
        }
        
        return false;
    },
    
    // Añadir nuevo usuario
    addUser: function(username, password, displayName, email, securityQuestion, securityAnswer) {
        // Verificar si el nombre de usuario ya existe
        if (this.users[username]) {
            return {
                success: false,
                message: 'El nombre de usuario ya existe'
            };
        }
        
        // Verificar longitud del nombre de usuario
        if (username.length < 3) {
            return {
                success: false,
                message: 'El nombre de usuario debe tener al menos 3 caracteres'
            };
        }
        
        // Verificar longitud de la contraseña
        if (password.length < 6) {
            return {
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            };
        }
        
        // Añadir nuevo usuario
        this.users[username] = {
            username: username,
            password: password, // En una aplicación real, esto estaría hasheado
            displayName: displayName || username,
            email: email || '',
            securityQuestion: securityQuestion || '',
            securityAnswer: securityAnswer || '',
            createdAt: new Date().toISOString()
        };
        
        // Guardar usuarios
        this.saveUsers();
        
        return {
            success: true,
            message: 'Usuario creado exitosamente'
        };
    },
    
    // Cerrar sesión
    logout: function() {
        localStorage.removeItem('rutina_user');
        localStorage.removeItem('rutina_user_display');
        localStorage.removeItem('rutina_logged_in');
    },
    
    // Verificar si el usuario está autenticado
    isAuthenticated: function() {
        return localStorage.getItem('rutina_logged_in') === 'true';
    },
    
    // Obtener usuario actual
    getCurrentUser: function() {
        if (this.isAuthenticated()) {
            return {
                username: localStorage.getItem('rutina_user'),
                displayName: localStorage.getItem('rutina_user_display')
            };
        }
        
        return null;
    },
    
    // Verificar si un usuario existe
    userExists: function(username) {
        return !!this.users[username];
    },
    
    // Obtener pregunta de seguridad para un usuario
    getSecurityQuestion: function(username) {
        if (this.users[username] && this.users[username].securityQuestion) {
            return this.users[username].securityQuestion;
        }
        return null;
    },
    
    // Verificar respuesta a pregunta de seguridad
    verifySecurityAnswer: function(username, answer) {
        if (this.users[username] && 
            this.users[username].securityAnswer && 
            this.users[username].securityAnswer.toLowerCase() === answer.toLowerCase()) {
            return true;
        }
        return false;
    },
    
    // Cambiar contraseña de un usuario
    resetPassword: function(username, newPassword) {
        if (!this.users[username]) {
            return {
                success: false,
                message: 'El usuario no existe'
            };
        }
        
        // Verificar longitud de la contraseña
        if (newPassword.length < 6) {
            return {
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            };
        }
        
        // Actualizar contraseña
        this.users[username].password = newPassword;
        
        // Guardar usuarios
        this.saveUsers();
        
        return {
            success: true,
            message: 'Contraseña actualizada exitosamente'
        };
    },
    
    // Actualizar información de seguridad del usuario
    updateSecurityInfo: function(username, securityQuestion, securityAnswer, email) {
        if (!this.users[username]) {
            return {
                success: false,
                message: 'El usuario no existe'
            };
        }
        
        if (securityQuestion) {
            this.users[username].securityQuestion = securityQuestion;
        }
        
        if (securityAnswer) {
            this.users[username].securityAnswer = securityAnswer;
        }
        
        if (email) {
            this.users[username].email = email;
        }
        
        // Guardar usuarios
        this.saveUsers();
        
        return {
            success: true,
            message: 'Información de seguridad actualizada'
        };
    }
};

// Inicializar base de datos
UsersDB.init();
